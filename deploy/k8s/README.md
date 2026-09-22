# 前端 k3s 部署说明

与后端完全一致的部署模式：GitHub Actions 构建镜像推 GHCR，
runner 通过 kubeconfig 直连 k3s API 部署。前后端同在 `volunteer-system` 命名空间。

## 流程（与后端 CI/CD 同构）

```
push / PR ──▶ CI:  lint / test / build / 清单校验（PR 另做镜像构建检查，不推送）
push main ──▶ CD:  构建镜像 → 推 GHCR（<sha> + latest 标签）
                  → kubectl apply → set image → rollout status

集群内:
浏览器 → Traefik Ingress (80/443, 按路径分流)
  ├── /api /uploads ──▶ 后端 Service
  └── /            ──▶ 前端 Service → nginx Pod(纯静态, SPA 自回退)
```

## 文件

```
deploy/k8s/
├── deployment.yaml   # Deployment：引用后端已建的 ghcr-creds 拉取镜像
├── service.yaml      # ClusterIP Service
└── ingress.yaml      # Traefik Ingress（/api /uploads 转后端，/ 走前端）
```

## 上线前需要做的

1. **前端仓库添加 `KUBE_CONFIG` secret**（secrets 按仓库隔离，后端仓库的那个前端用不了）

   在服务器上导出 kubeconfig，把 `127.0.0.1:6443` 替换为服务器公网 IP 后整个贴进
   Settings → Secrets and variables → Actions → 新建 `KUBE_CONFIG`：

   ```bash
   sudo cat /etc/rancher/k3s/k3s.yaml | sed 's/127.0.0.1:6443/<服务器公网IP>:6443/'
   ```

   （后端仓库如果已有同样的值，直接复制过来即可）

   旧的 `SERVER_HOST` / `SERVER_USER` / `SERVER_SSH_KEY` / `SERVER_PORT` /
   `SERVER_PATH` 五个 secret 已无用，可全部删除。

2. **修改清单中的两处 TODO**（[ingress.yaml](./ingress.yaml)）
   - 后端路由的 Service 名称和端口（`volunteer-system-backend` / `8080`）
     改为后端实际值，`k3s kubectl get svc -n volunteer-system` 可查（同命名空间用短名）
   - host：前端实际域名，并确保 DNS 解析到服务器 IP

3. **push 到 main** —— CD 自动 apply 全部清单并滚动发布，无需手动操作。
   命名空间、ghcr-creds pull secret 后端都已建好，服务器上无需任何新配置。

## 日常更新

push 到 `main` 全自动；也可在 Actions 页面手动 workflow_dispatch 触发。
镜像标签为 commit sha，`latest` 仅为便利标签。

## 回滚

```bash
# 方式一：回滚到上一个版本
kubectl -n volunteer-system rollout undo deployment/volunteer-system-frontend

# 方式二：精确回滚到某次提交
kubectl -n volunteer-system set image deployment/volunteer-system-frontend \
  volunteer-system-frontend=ghcr.io/loveelysia000/volunteer-system-frontend:<旧commit的sha>

kubectl -n volunteer-system rollout status deployment/volunteer-system-frontend
```

## 验证

```bash
kubectl -n volunteer-system get pods,svc,ingress -l app=volunteer-system-frontend
curl -H 'Host: eco.volunteer.com' http://<服务器IP>/
```

## 安全提示

`KUBE_CONFIG` 是集群管理员级别的凭证，等同于集群完全控制权，
只放在受保护的仓库 secrets 里；仓库协作者权限要收敛。
后续可在 k3s 里为 CI 创建受限的 ServiceAccount（只授权 volunteer-system
命名空间的部署权限），用它的 kubeconfig 代替 admin 配置。

## 后续演进

- **GitOps（Argo CD / Flux）**：集群内控制器监听 git 自动同步，进一步收敛凭证
- **受限 CI ServiceAccount**：见上方安全提示
- **staging 环境**：复制清单改命名空间/域名
- **Trivy 镜像扫描 / cosign 签名 / HPA**：按需增加

# ---- 构建阶段：编译前端静态文件 ----
FROM node:22-alpine AS build
WORKDIR /app

# 先复制依赖清单，利用 Docker 层缓存加速重复构建
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- 运行阶段：nginx 只托管静态文件 ----
# API 流量由 Ingress 按路径直接转发给后端 Service（见 deploy/k8s/base/ingress.yaml），
# nginx 无需任何代理配置
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

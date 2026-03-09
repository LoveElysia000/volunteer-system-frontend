# 环保志愿者服务平台（前端）

一个基于 Vue 3 + TypeScript 的环保志愿服务平台前端项目，支持志愿者与组织管理员双角色协作，覆盖活动浏览、报名、管理、统计等核心流程。

## 功能概览

### 公共模块
- 首页与平台介绍
- 用户登录 / 注册
- 活动列表与活动详情
- 个人中心

### 志愿者端（`/volunteer`）
- 数据总览
- 活动浏览、我的报名、历史活动
- 服务记录、时长统计、评价记录
- 成就徽章、等级进度、排行榜
- 个人信息与通知设置

### 组织端（`/organization`）
- 数据总览
- 组织信息维护
- 活动管理（创建、审核）
- 志愿者管理（统计、评价）
- 数据统计（活动、志愿者、财务）
- 通知与公告管理
- 系统设置与权限管理

## 技术栈

- 框架：Vue 3、TypeScript、Vite 5
- 路由与状态：Vue Router 4、Pinia
- 网络请求：Axios（含请求/响应拦截）
- 样式：Tailwind CSS
- 图标：Lucide Vue Next

## 环境要求

- Node.js `>= 18`（建议使用 LTS）
- npm `>= 9`

## 快速开始

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:3000`

## 环境变量

项目通过 `VITE_API_BASE_URL` 指定后端 API 地址。

- `.env.development`
- `.env.production`

示例：

```env
VITE_API_BASE_URL=http://localhost:1109
```

## 可用脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产包（输出到 dist/）
npm run preview  # 本地预览构建结果
npm run lint     # ESLint 检查并自动修复
```

说明：`lint` 脚本包含 `--fix`，会直接修改代码文件。

## 项目结构

```text
src/
├── api/                  # 请求封装、鉴权与拦截器
├── assets/               # 静态资源与全局样式
├── components/
│   ├── background/       # 背景动效组件
│   ├── layout/           # 通用布局组件
│   ├── ui/               # 基础 UI 组件
│   ├── volunteer/        # 志愿者端业务组件
│   └── organization/     # 组织端业务组件
├── composables/          # 组合式逻辑复用
├── directives/           # 自定义指令
├── router/               # 路由与权限守卫
├── store/                # Pinia 状态管理
├── types/                # TypeScript 类型定义
├── utils/                # 工具函数（含 token 管理）
└── views/                # 页面级组件
```

## 路由与权限

- 公开路由：`/`、`/about`、`/activities`、`/activities/:id`、`/login`、`/register`
- 登录保护：如 `/profile`
- 角色保护：
  - 志愿者：`/volunteer/**`
  - 组织管理员：`/organization/**`

在路由守卫中会进行：
- 登录态校验
- Token 过期检测与刷新尝试
- 角色不匹配时自动重定向到对应主页

## 认证与请求机制

- 访问令牌和刷新令牌由 `tokenManager` 统一管理
- Axios 请求拦截器自动注入 `Authorization: Bearer <token>`
- 遇到 `401` 时自动尝试刷新 token 后重试请求
- 刷新失败时清理本地认证信息并跳转登录页

## 开发说明

- 代码基于 Composition API + TypeScript
- 已配置路径别名 `@ -> src`
- 全局注册了 `v-scroll-fade` 指令
- 当前仓库未提供单元测试脚本，如需补充建议新增 `npm run test`

## 许可证

当前仓库未包含 `LICENSE` 文件。如需开源发布，建议补充许可证声明。

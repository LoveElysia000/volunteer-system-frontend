# 环保志愿者服务平台 (前端)

一个现代化的环保志愿者服务平台前端应用，连接环保志愿者与环保组织，促进环保志愿服务的社会化、规范化管理。支持志愿者和组织管理员双角色系统，提供完整的活动管理、志愿者管理、数据统计等功能。

## 项目特点

- 🍃 **环保主题** - 绿色环保设计风格，体现环保理念
- ⚡ **现代化技术栈** - Vue 3.4 + TypeScript 5.3 + Vite 5.0 + Tailwind CSS 3.3
- 📱 **响应式设计** - 完美适配桌面端和移动端，支持4K屏幕
- 🔒 **类型安全** - TypeScript 提供完整的类型检查和智能提示
- 🎯 **组件化开发** - 模块化UI组件库，支持背景动画和专用组件
- 🔐 **权限控制** - 基于角色的路由守卫和访问控制，支持双角色系统（志愿者/组织管理员）
- 🚀 **开发优化** - 开发环境认证绕过，提升开发效率
- 📊 **数据管理** - 完整的活动管理、志愿者管理、统计分析功能

## 技术栈

### 核心框架
- **Vue 3.4.0** - 渐进式JavaScript框架，使用组合式API
- **TypeScript 5.3.0** - 提供完整的类型安全检查
- **Vite 5.0.0** - 现代化前端构建工具，支持快速热重载

### 核心技术
- **Vue Router 4.2.5** - 官方路由管理器，支持路由守卫和延迟加载
- **Pinia 2.1.7** - Vue.js轻量级状态管理，提供TypeScript支持
- **Tailwind CSS 3.3.6** - 实用优先的CSS框架，支持自定义主题
- **Lucide Vue Next 0.303.0** - 矢量图标库，提供丰富的环保主题图标

### 开发工具
- **Node.js 16.0+** - JavaScript运行时环境
- **npm 7.0+** - 包管理器
- **ESLint 8.55.0** - 代码质量检查工具
- **Vue ESLint Plugin 9.19.0** - Vue.js代码规范检查
- **vue-tsc 1.8.16** - Vue单文件组件的TypeScript类型检查
- **PostCSS** - CSS后处理器

## 快速开始

### 环境要求
- Node.js 16.0+
- npm 7.0+

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```
项目将在 http://localhost:3000 启动

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 项目结构

```
src/
├── components/          # 可复用UI组件
│   ├── background/      # 背景动画组件 (EcoParticles等)
│   ├── layout/         # 布局组件 (Header, NavigationMenu等)
│   ├── ui/             # 基础UI组件 (Button, Input, Steps, Carousel等)
│   ├── volunteer/      # 志愿者专用组件
│   └── organization/   # 组织管理专用组件
├── views/              # 页面组件
│   ├── Activities/     # 活动相关页面
│   ├── Auth/           # 认证相关页面
│   ├── Home/           # 首页
│   ├── Profile/        # 个人中心
│   ├── Volunteer/      # 志愿者中心 (12个功能页面)
│   └── Organization/   # 组织管理中心 (7个功能页面)
├── router/             # 路由配置 (角色权限控制)
├── store/              # 状态管理 (Pinia stores)
├── types/              # TypeScript类型定义
└── assets/             # 静态资源
```

## 页面功能

### 主要页面
- ✅ **首页** (`/`) - 平台入口和概述
- ✅ **登录页** (`/login`) - 用户登录界面
- ✅ **注册页** (`/register`) - 用户注册界面
- ✅ **活动列表** (`/activities`) - 环保活动展示
- ✅ **活动详情** (`/activities/:id`) - 活动详细信息
- ✅ **个人中心** (`/profile`) - 用户信息管理
- ✅ **志愿者中心** (`/volunteer`) - 志愿者专属功能中心
- ✅ **组织管理中心** (`/organization`) - 组织管理员专属功能中心

### 功能特点
- 现代化的表单设计和用户体验
- 完整的响应式布局适配
- 环保主题色彩系统和视觉设计
- 组件化开发架构和模块化组织
- 双角色权限控制系统（志愿者/组织管理员）
- 完整的活动生命周期管理
- 志愿者管理和数据统计分析
- 成就系统和排行榜功能

### 志愿者中心功能模块
- **数据总览** (`/volunteer`) - 志愿者工作台，显示统计数据和待办事项
- **活动管理** (`/volunteer/activities`) - 浏览和报名环保活动
- **我的报名** (`/volunteer/activities/my-registrations`) - 查看已报名的活动
- **历史活动** (`/volunteer/activities/history`) - 查看参与过的活动记录
- **个人记录** (`/volunteer/records`) - 志愿服务记录管理
- **时长统计** (`/volunteer/records/statistics`) - 志愿服务时长统计
- **评价记录** (`/volunteer/records/reviews`) - 活动评价和反馈记录
- **成就徽章** (`/volunteer/achievements`) - 成就徽章系统
- **等级进度** (`/volunteer/achievements/levels`) - 志愿者等级和成长进度
- **排行榜** (`/volunteer/achievements/leaderboard`) - 志愿者排行榜
- **个人信息** (`/volunteer/profile`) - 志愿者个人信息管理
- **账户设置** (`/volunteer/settings`) - 账户和通知偏好设置

### 组织管理中心功能模块
- **数据总览** (`/organization`) - 组织管理数据总览，显示关键指标
- **组织信息管理** (`/organization/organization-info`) - 组织基本信息管理
- **活动管理** (`/organization/activities`) - 创建和管理环保活动
- **志愿者管理** (`/organization/volunteers`) - 管理组织内的志愿者
- **数据统计** (`/organization/statistics`) - 组织运营数据统计分析
- **通知管理** (`/organization/notifications`) - 向志愿者发送通知
- **设置** (`/organization/settings`) - 组织账户设置

## 开发规范

### 组件规范
- 所有组件使用 TypeScript 编写，确保类型安全
- 采用 Vue 3 组合式 API (Composition API)
- 统一的命名规范和文件结构
- 组件按功能模块化组织，提高可维护性

## 样式系统

项目使用 Tailwind CSS 构建现代化的响应式界面，支持完整的环保主题色彩系统和响应式布局。

### 色彩主题系统
Tailwind配置扩展了环保主题色彩，包含完整色阶：

```javascript
// 自定义环保主题色彩
primary: {
  50: '#f0f9f4',
  100: '#dcf2e3',
  200: '#bce5c9',
  300: '#8ed2a5',
  400: '#5ab87e',
  500: '#38a169', // 主绿色
  600: '#2a8550',
  700: '#236a41',
  800: '#1e5535',
  900: '#1a452c'
}
secondary: {
  50: '#f6f8f9',
  100: '#e9edf0',
  200: '#d0d9e0',
  300: '#a8bac7',
  400: '#7995a8',
  500: '#5d798e',
  600: '#4e6376',
  700: '#435261',
  800: '#3b4652',
  900: '#343c46'
}
```

### 响应式断点系统
支持标准断点及扩展的大屏适配：
- `sm` - 640px (移动端)
- `md` - 768px (平板端)
- `lg` - 1024px (桌面端)
- `xl` - 1280px (大桌面)
- `3xl` - 1920px (超大屏幕)
- `4xl` - 2560px (4K屏幕)

### 字体家族
使用现代字体栈，提升可读性：
- 主字体：`Inter`
- 备用字体：`system-ui`, `sans-serif`

## 路由系统

项目采用 Vue Router 4 构建单页面应用路由系统，支持完整的权限控制和开发环境优化。

### 路由特性
- **双角色权限控制** - 基于用户角色的路由守卫，支持志愿者和组织管理员双角色系统
- **开发环境优化** - 开发模式下自动跳过认证检查
- **延迟加载** - 页面组件按需加载，优化性能
- **嵌套路由** - 志愿者中心和组织管理中心采用嵌套路由结构

### 路由结构
项目包含 30+ 个路由，主要分为：
- **公开路由**：首页、登录、注册、活动列表、活动详情
- **认证路由**：个人中心（需要登录）
- **角色路由**：
  - 志愿者中心（需要志愿者角色）- 12个功能页面
  - 组织管理中心（需要组织管理员角色）- 7个功能页面

## 状态管理

使用 Pinia 进行状态管理，提供类型安全的全局状态管理方案。

### Store 结构
- **auth store** - 用户认证状态管理，包含登录状态、用户信息、角色权限
- **activities store** - 活动数据管理，支持活动列表、详情、报名状态、组织管理

### 开发特性
- **TypeScript 支持** - 完整的类型定义和类型推断
- **组合式 API** - 与 Vue 3 组合式 API 完美集成
- **开发工具集成** - 支持 Vue DevTools 调试
- **模块化设计** - 按功能模块划分，便于维护和扩展

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目仓库: [Volunteer System Frontend]
- 邮箱: support@volunteer-platform.com
- 问题反馈: 请在项目仓库中提交 Issue

## 更新日志

### v1.0.0 (2026-01-18)
- ✨ 初始版本发布
- ✨ 支持志愿者和组织管理员双角色系统
- ✨ 完整的活动管理和志愿者管理功能
- ✨ 响应式设计和环保主题界面
- ✨ TypeScript 类型安全和现代化开发工具链

---

## 致谢

感谢所有为环保事业贡献力量的志愿者们！🌍💚
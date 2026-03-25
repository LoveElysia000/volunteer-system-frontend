# UI Form Components

项目里目前推荐优先复用这 3 个表单组件：

- `FilterSelect`
- `DatePicker`
- `Textarea`

它们已经在组织端和志愿者端页面落地，适合作为后续替换原生 `select`、`datetime-local`、`textarea` 的统一方案。

## FilterSelect

文件：
- `src/components/ui/FilterSelect.vue`

适用场景：
- 筛选条件选择
- 枚举类表单项
- 需要比原生 `select` 更好的展开面板和选中态

基础示例：

```vue
<FilterSelect
  v-model="status"
  title="状态"
  :icon="SlidersHorizontalIcon"
  :options="[
    { value: 'all', label: '全部状态' },
    { value: 'open', label: '进行中' },
    { value: 'closed', label: '已结束' }
  ]"
/>
```

常用参数：
- `modelValue`: 当前值，支持 `string | number | boolean | undefined | null`
- `options`: 选项数组，格式 `{ value, label, description?, key? }`
- `title`: 按钮上方的小标题
- `placeholder`: 未选中时占位文案
- `icon`: 左侧图标组件
- `compact`: 紧凑模式，适合卡片 header 或工具条小尺寸区域
- `theme`: `orange | emerald`

使用建议：
- 组织端页面优先用 `theme="orange"`
- 志愿者端、注册页优先用 `theme="emerald"`
- 如果选项值里包含 `undefined`，建议给每个 option 补 `key`

## DatePicker

文件：
- `src/components/ui/DatePicker.vue`

适用场景：
- 日期选择
- 日期时间选择
- 替换原生 `input[type=\"date\"]` / `input[type=\"datetime-local\"]`

基础示例：

```vue
<DatePicker
  v-model="startTime"
  format="yyyy-MM-dd HH:mm"
  placeholder="请选择开始时间"
  enable-time-picker
  :minutes-increment="1"
/>
```

仅日期示例：

```vue
<DatePicker
  v-model="birthday"
  format="yyyy-MM-dd"
  placeholder="请选择生日"
  theme="emerald"
/>
```

常用参数：
- `modelValue`: `Date | Date[] | [Date, Date] | null`
- `format`: 展示格式
- `enableTimePicker`: 是否启用时间选择
- `enableSeconds`: 是否启用秒
- `minutesIncrement`: 分钟步进
- `theme`: `orange | emerald`
- 其他能力沿用 `@vuepic/vue-datepicker`

使用建议：
- 活动、审核、管理后台时间字段统一传到分钟，最终提交接口时转成 `YYYY-MM-DD HH:mm:ss`
- 纯日期字段不要直接 `new Date('YYYY-MM-DD')` 来回转，优先手动拆分年月日，避免时区偏移
- 当前组件默认 `teleport=true`，适合抽屉、弹窗、复杂滚动容器

## Textarea

文件：
- `src/components/ui/Textarea.vue`

适用场景：
- 备注、说明、原因、简介
- 需要自动高度、清空按钮、字数统计

基础示例：

```vue
<Textarea
  v-model="reason"
  placeholder="请输入原因"
  :min-rows="2"
  :max-rows="5"
  allow-clear
  show-word-limit
  :max-length="{ length: 120, errorOnly: true }"
/>
```

常用参数：
- `modelValue`: 字符串值
- `minRows`: 最小高度行数
- `maxRows`: 最大高度行数
- `allowClear`: 是否显示清空按钮
- `showWordLimit`: 是否显示字数统计
- `maxLength`: 支持 `number` 或 `{ length, errorOnly }`
- `theme`: `orange | emerald`
- `error`: 错误文案

`maxLength` 规则：
- `:max-length="120"`: 超过后直接截断输入
- `:max-length="{ length: 120, errorOnly: true }"`: 不截断，超限时只把计数变红

使用建议：
- 原因类文案优先用 `errorOnly: true`
- 简介、描述类长文本可以直接限制长度
- 如果页面自己已经有错误提示逻辑，直接传 `error` 即可

## 当前落地页面

已经接入这套组件的页面包括：

- `src/views/Organization/ActivityManagement.vue`
- `src/views/Organization/ActivityCreate.vue`
- `src/views/Organization/ActivityReview.vue`
- `src/views/Organization/Members.vue`
- `src/views/Organization/Dashboard.vue`
- `src/views/Organization/OrganizationInfo.vue`
- `src/views/Organization/WorkHours.vue`
- `src/views/Volunteer/Profile.vue`
- `src/views/Auth/Register.vue`

## 替换建议

后续遇到原生控件时，优先按下面规则处理：

1. 原生 `select`:
   用 `FilterSelect`

2. 原生 `date` / `datetime-local`:
   用 `DatePicker`

3. 原生 `textarea`:
   用 `Textarea`

如果页面已经有非常强的独立视觉语言，先只复用行为能力，再通过 `theme` 或外层布局做适配，不要把某个业务模块的品牌色直接写进页面外的公共层。

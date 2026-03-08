<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        组织信息管理
      </h1>
      <button class="btn btn-primary">
        保存更改
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-4">
        基本信息
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">组织名称</label>
          <input
            type="text"
            class="input"
            placeholder="请输入组织名称"
            value="环保志愿者协会"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">组织类型</label>
          <select class="select">
            <option>公益组织</option>
            <option>学校组织</option>
            <option>企业组织</option>
            <option>社区组织</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">组织描述</label>
          <textarea
            class="textarea"
            rows="3"
            placeholder="请描述您的组织"
          >致力于环保公益活动，倡导绿色生活方式</textarea>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-4">
        联系信息
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
          <input
            type="tel"
            class="input"
            placeholder="请输入联系电话"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">联系邮箱</label>
          <input
            type="email"
            class="input"
            placeholder="请输入联系邮箱"
          >
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">组织地址</label>
          <input
            type="text"
            class="input"
            placeholder="请输入详细地址"
          >
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-4">
        资质认证
      </h2>
      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-600 mb-2">
            组织证件照片
          </p>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <CameraIcon class="h-12 w-12 text-gray-400 mx-auto" />
            <p class="mt-2 text-sm text-gray-500">
              点击上传组织资质证明
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CameraIcon } from 'lucide-vue-next'
</script>
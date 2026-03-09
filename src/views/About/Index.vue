<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <main class="flex-1">
      <!-- Hero Section - 深色渐变背景 + 统计数据 -->
      <section class="relative">
        <div
          ref="heroSection"
          class="relative min-h-[560px] flex flex-col justify-center px-6 py-16 md:px-12 lg:px-20 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900"
          :class="{ 'animate-in': heroInView }"
        >
          <!-- 动态背景装饰 -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/5 rounded-full blur-3xl"></div>
          </div>

          <!-- 网格装饰 -->
          <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

          <div class="relative z-10 max-w-6xl mx-auto w-full">
            <!-- 顶部标签 -->
            <div class="flex justify-center mb-8">
              <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-emerald-300 text-sm font-medium border border-white/10">
                <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                环保志愿者服务平台
              </span>
            </div>

            <!-- 主标题 -->
            <div class="text-center mb-12">
              <h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                关于我们的<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">使命</span>
              </h1>
              <p class="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                通过技术创新连接环保组织和志愿者，简化活动管理流程，促进更多人参与到环境保护活动中来。
              </p>
            </div>

            <!-- CTA 按钮组 -->
            <div class="flex flex-wrap justify-center gap-4 mb-16">
              <button
                class="group bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                @click="scrollToSection('features')"
              >
                了解平台功能
                <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                class="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 backdrop-blur-sm border border-white/20"
                @click="scrollToSection('guide')"
              >
                开始使用
              </button>
            </div>

            <!-- 统计数据展示 -->
            <div
              ref="statsSection"
              class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              :class="{ 'animate-in': statsInView }"
            >
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group hover:bg-white/10 transition-colors">
                <div class="text-3xl md:text-4xl font-bold text-white mb-1">10K+</div>
                <div class="text-slate-400 text-sm">注册志愿者</div>
              </div>
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group hover:bg-white/10 transition-colors">
                <div class="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">500+</div>
                <div class="text-slate-400 text-sm">环保组织</div>
              </div>
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group hover:bg-white/10 transition-colors">
                <div class="text-3xl md:text-4xl font-bold text-teal-400 mb-1">2K+</div>
                <div class="text-slate-400 text-sm">活动场次</div>
              </div>
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group hover:bg-white/10 transition-colors">
                <div class="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">50K+</div>
                <div class="text-slate-400 text-sm">服务时长</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 使命/愿景/价值观 - 纯白色背景 -->
      <section class="bg-white -mt-8 relative z-10">
        <div class="px-6 py-16 md:px-12 lg:px-20 max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-3 gap-6">
            <!-- 使命 -->
            <div
              ref="missionCard"
              class="group bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/40 border border-gray-100 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2"
              :class="[inViewCards.mission ? 'animate-in' : '']"
            >
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
                <div class="h-8 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">平台使命</h2>
              <p class="text-gray-600 leading-relaxed">
                通过技术创新连接环保组织和志愿者，简化活动管理流程，促进更多人参与到环境保护活动中来。
              </p>
              <div class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <span>了解更多</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 愿景 -->
            <div
              ref="visionCard"
              class="group bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/40 border border-gray-100 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2"
              :class="[inViewCards.vision ? 'animate-in' : '']"
            >
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  🌟
                </div>
                <div class="h-8 w-px bg-gradient-to-b from-transparent via-emerald-200 to-transparent"></div>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">平台愿景</h2>
              <p class="text-gray-600 leading-relaxed">
                打造国内领先的环保志愿者服务平台，成为连接环保行动者与环保需求的重要桥梁。
              </p>
              <div class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <span>查看愿景</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 价值观 -->
            <div
              ref="valuesCard"
              class="group bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/40 border border-gray-100 hover:border-purple-300 transition-all duration-500 hover:-translate-y-2"
              :class="[inViewCards.values ? 'animate-in' : '']"
            >
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  ❤️
                </div>
                <div class="h-8 w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent"></div>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">核心价值观</h2>
              <p class="text-gray-600 leading-relaxed">
                环保优先、用户体验、技术驱动、社会责任、开放合作，构建可持续发展的公益生态。
              </p>
              <div class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex items-center gap-2 text-sm text-purple-600 font-medium">
                  <span>探索价值</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特色功能 - 淡绿色背景 -->
      <section
        id="features"
        ref="featuresSection"
        class="bg-emerald-50/70"
      >
        <div class="px-6 py-16 md:px-12 lg:px-20 max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">核心能力</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">平台特色功能</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">全方位的志愿者服务管理系统，为组织和志愿者提供专业的服务支持</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 功能卡片 1 - 左侧彩色边框 -->
            <div
              v-for="(feature, index) in features.slice(0, 3)"
              :key="feature.title"
              class="group relative bg-gray-50 rounded-2xl p-6 border-l-4 hover:bg-white hover:shadow-xl transition-all duration-300 overflow-hidden"
              :class="[feature.borderColor, featuresInView ? 'animate-in' : '']"
              :style="{ animationDelay: featuresInView ? `${(index + 1) * 100}ms` : '0ms' }"
            >
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" :class="feature.gradient"></div>
              <div class="relative z-10">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform group-hover:scale-110"
                  :class="feature.iconBg"
                >
                  {{ feature.icon }}
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
                <p class="text-sm text-gray-600 leading-relaxed">{{ feature.description }}</p>
              </div>
            </div>

            <!-- 功能卡片 2 - 顶部渐变色 -->
            <div
              v-for="(feature, index) in features.slice(3)"
              :key="feature.title"
              class="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              :class="[featuresInView ? 'animate-in' : '']"
              :style="{ animationDelay: featuresInView ? `${(index + 4) * 100}ms` : '0ms' }"
            >
              <div class="h-1 w-full bg-gradient-to-r" :class="feature.gradient"></div>
              <div class="p-6">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110"
                  :class="feature.iconBg"
                >
                  {{ feature.icon }}
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
                <p class="text-sm text-gray-600 leading-relaxed">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心优势 - 淡蓝色背景 -->
      <section class="bg-sky-50 overflow-hidden">
        <div class="px-6 py-16 md:px-12 lg:px-20 max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- 左侧内容 -->
            <div class="space-y-8">
              <div>
                <span class="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">为什么选择我们</span>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">核心优势与策略</h2>
                <p class="text-gray-600 leading-relaxed">
                  信任建立在透明度和技术严谨性之上。我们的平台结构设计将数据安全和用户隐私放在首位，与环保领域专家合作，确保每次志愿服务产生实际效益。
                </p>
              </div>

              <!-- 优势列表 - 带图标和描述的复杂列表 -->
              <div class="space-y-4">
                <div class="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">数据驱动的管理方式</h4>
                    <p class="text-sm text-gray-500 mt-1">实时数据分析，科学决策支持</p>
                  </div>
                </div>

                <div class="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">完善的数据安全保障</h4>
                    <p class="text-sm text-gray-500 mt-1">企业级加密，隐私保护优先</p>
                  </div>
                </div>

                <div class="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">社区驱动的成长模式</h4>
                    <p class="text-sm text-gray-500 mt-1">共建共享，可持续生态发展</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧视觉展示 -->
            <div class="relative">
              <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 aspect-square max-w-lg mx-auto">
                <!-- 装饰元素 -->
                <div class="absolute top-10 left-10 w-20 h-20 bg-emerald-400/30 rounded-full blur-2xl"></div>
                <div class="absolute bottom-10 right-10 w-32 h-32 bg-teal-400/30 rounded-full blur-2xl"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>

                <!-- 内容卡片 -->
                <div class="absolute inset-0 flex items-center justify-center p-8">
                  <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-xs text-center">
                    <div class="text-6xl mb-4">🌍</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">携手共建绿色未来</h3>
                    <p class="text-gray-600 text-sm">每一份努力都在为地球带来积极的改变</p>
                    <div class="mt-6 flex justify-center gap-2">
                      <span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span class="w-3 h-3 bg-teal-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></span>
                      <span class="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 浮动卡片 -->
              <div class="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">实时同步</div>
                    <div class="text-xs text-gray-500">数据即时更新</div>
                  </div>
                </div>
              </div>

              <div class="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">数据分析</div>
                    <div class="text-xs text-gray-500">智能可视化</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 使用指南 - 水平时间线设计 -->
      <section
        id="guide"
        ref="guideSection"
        class="bg-slate-50"
      >
        <div class="px-6 py-16 md:px-12 lg:px-20 max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">快速入门</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">使用指南</h2>
            <p class="text-gray-600">简单几步，开启您的环保志愿之旅</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-12">
            <!-- 志愿者流程 -->
            <div class="relative">
              <div class="flex items-center gap-3 mb-8">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  👤
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">志愿者使用流程</h3>
                  <p class="text-sm text-gray-500">以个人身份参与志愿活动</p>
                </div>
              </div>

              <div class="relative pl-8 space-y-6">
                <!-- 连接线 -->
                <div class="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-400 to-teal-300"></div>

                <div
                  v-for="(step, index) in volunteerSteps"
                  :key="index"
                  class="relative group"
                  :class="[guideInView ? 'animate-in' : '']"
                  :style="{ animationDelay: guideInView ? `${(index + 1) * 150}ms` : '0ms' }"
                >
                  <!-- 节点 -->
                  <div class="absolute -left-[19px] w-10 h-10 bg-white border-4 border-emerald-400 rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                    <span class="text-sm font-bold text-emerald-600">{{ index + 1 }}</span>
                  </div>
                  <!-- 内容卡片 -->
                  <div class="ml-6 p-5 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-white group-hover:shadow-lg group-hover:border-emerald-200 transition-all duration-300">
                    <p class="text-gray-700 font-medium">{{ step }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 组织流程 -->
            <div class="relative">
              <div class="flex items-center gap-3 mb-8">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  🏢
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">组织使用流程</h3>
                  <p class="text-sm text-gray-500">以组织身份发布管理活动</p>
                </div>
              </div>

              <div class="relative pl-8 space-y-6">
                <!-- 连接线 -->
                <div class="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-400 to-indigo-300"></div>

                <div
                  v-for="(step, index) in organizationSteps"
                  :key="index"
                  class="relative group"
                  :class="[guideInView ? 'animate-in' : '']"
                  :style="{ animationDelay: guideInView ? `${(index + 1) * 150}ms` : '0ms' }"
                >
                  <!-- 节点 -->
                  <div class="absolute -left-[19px] w-10 h-10 bg-white border-4 border-blue-400 rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                    <span class="text-sm font-bold text-blue-600">{{ index + 1 }}</span>
                  </div>
                  <!-- 内容卡片 -->
                  <div class="ml-6 p-5 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-white group-hover:shadow-lg group-hover:border-blue-200 transition-all duration-300">
                    <p class="text-gray-700 font-medium">{{ step }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 环保领域标签云 - 淡紫色背景 -->
      <section class="bg-violet-50">
        <div class="px-6 py-12 md:px-12 lg:px-20 max-w-4xl mx-auto text-center">
          <h3 class="text-xl font-bold text-gray-900 mb-6">支持的环保领域</h3>
          <div class="flex flex-wrap justify-center gap-3">
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-emerald-700 shadow-sm border border-emerald-100 hover:shadow-md hover:scale-105 transition-all cursor-default">🌳 植树造林</span>
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-blue-700 shadow-sm border border-blue-100 hover:shadow-md hover:scale-105 transition-all cursor-default">🌊 河流保护</span>
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-amber-700 shadow-sm border border-amber-100 hover:shadow-md hover:scale-105 transition-all cursor-default">♻️ 垃圾分类</span>
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-purple-700 shadow-sm border border-purple-100 hover:shadow-md hover:scale-105 transition-all cursor-default">🦅 野生动物保护</span>
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-cyan-700 shadow-sm border border-cyan-100 hover:shadow-md hover:scale-105 transition-all cursor-default">💨 空气净化</span>
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-rose-700 shadow-sm border border-rose-100 hover:shadow-md hover:scale-105 transition-all cursor-default">🏖️ 海滩清理</span>
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-teal-700 shadow-sm border border-teal-100 hover:shadow-md hover:scale-105 transition-all cursor-default">🌱 有机农业</span>
            <span class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-indigo-700 shadow-sm border border-indigo-100 hover:shadow-md hover:scale-105 transition-all cursor-default">⚡ 节能减排</span>
          </div>
        </div>
      </section>

      <!-- FAQ Section - 淡黄色背景 -->
      <section
        ref="faqSection"
        class="bg-amber-50/60"
      >
        <div class="px-6 py-16 md:px-12 lg:px-20 max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">帮助中心</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">常见问题</h2>
            <p class="text-gray-600">关于平台使用的一些常见疑问</p>
          </div>

          <div class="space-y-4">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="faq-card rounded-2xl border-2 overflow-hidden transition-all duration-300"
              :class="[
                activeFaq === index ? 'bg-emerald-50/50 border-emerald-300 shadow-lg shadow-emerald-100' : 'bg-white border-gray-100 hover:border-gray-300',
                faqInView ? 'animate-in' : ''
              ]"
              :style="{ animationDelay: faqInView ? `${(index + 1) * 100}ms` : '0ms' }"
            >
              <!-- 问题标题 -->
              <button
                class="w-full flex items-center justify-between gap-4 p-5 text-left"
                @click="toggleFaq(index)"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300"
                    :class="activeFaq === index ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'"
                  >
                    <span v-if="activeFaq !== index">?</span>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 class="text-base font-semibold text-gray-900">{{ faq.question.replace('Q: ', '') }}</h3>
                </div>
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  :class="activeFaq === index ? 'bg-emerald-500 text-white rotate-180' : 'bg-gray-100 text-gray-500'"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <!-- 答案内容 -->
              <div
                class="overflow-hidden transition-all duration-300"
                :class="activeFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
              >
                <div class="px-5 pb-5 pt-0">
                  <div class="pl-14 border-l-2 border-emerald-300">
                    <p class="text-gray-600 leading-relaxed">{{ faq.answer.replace('A: ', '') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系我们 - 深色卡片组 -->
      <section
        ref="contactSection"
        class="bg-slate-900"
      >
        <div class="px-6 py-16 md:px-12 lg:px-20 max-w-5xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">联系我们</h2>
            <p class="text-slate-400">随时为您提供帮助和支持</p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- 客服支持 -->
            <div
              class="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300"
              :class="[contactInView ? 'animate-in' : '']"
            >
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🎧
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-4">客服支持</h3>
                  <ul class="space-y-3 text-slate-300">
                    <li class="flex items-center gap-3">
                      <span class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm">✉</span>
                      <span>support@volunteer-platform.com</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <span class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm">☎</span>
                      <span>400-123-4567</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <span class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm">🕐</span>
                      <span>工作日 9:00-18:00</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 技术反馈 -->
            <div
              class="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
              :class="[contactInView ? 'animate-in' : '']"
              :style="{ animationDelay: '150ms' }"
            >
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  💻
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-4">技术反馈</h3>
                  <ul class="space-y-3 text-slate-300">
                    <li class="flex items-center gap-3">
                      <span class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm">🐛</span>
                      <span>GitHub Issues 问题反馈</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <span class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm">💡</span>
                      <span>意见反馈页面提交建议</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <span class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm">📚</span>
                      <span>查看帮助文档获取指南</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 社交链接 -->
          <div class="mt-12 flex justify-center gap-4">
            <a href="#" class="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" class="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>

          <div class="mt-8 text-center text-slate-500 text-sm">
            © 2024 环保志愿者服务平台. 保留所有权利.
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// 页面元素引用
const heroSection = ref<HTMLElement>()
const statsSection = ref<HTMLElement>()
const missionCard = ref<HTMLElement>()
const visionCard = ref<HTMLElement>()
const valuesCard = ref<HTMLElement>()
const featuresSection = ref<HTMLElement>()
const guideSection = ref<HTMLElement>()
const faqSection = ref<HTMLElement>()
const contactSection = ref<HTMLElement>()

// 视口可见状态
const heroInView = ref(false)
const statsInView = ref(false)
const inViewCards = reactive({
  mission: false,
  vision: false,
  values: false
})
const featuresInView = ref(false)
const guideInView = ref(false)
const faqInView = ref(false)
const contactInView = ref(false)

// FAQ状态
const activeFaq = ref<number | null>(null)
const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

// 数据
const features = [
  {
    icon: '📱',
    title: '智能活动管理',
    description: '便捷的活动创建、发布和管理功能，支持在线报名和审核，让活动组织更轻松。',
    borderColor: 'border-l-teal-500',
    gradient: 'from-teal-400 to-emerald-400',
    iconBg: 'bg-teal-100 text-teal-600'
  },
  {
    icon: '👥',
    title: '志愿者管理',
    description: '完善的志愿者信息管理和服务记录，建立完整的志愿者档案，了解每位志愿者的贡献。',
    borderColor: 'border-l-orange-500',
    gradient: 'from-orange-400 to-amber-400',
    iconBg: 'bg-orange-100 text-orange-600'
  },
  {
    icon: '📊',
    title: '数据分析',
    description: '多维度数据统计和可视化分析，实时了解活动效果，助力科学决策和优化。',
    borderColor: 'border-l-rose-500',
    gradient: 'from-rose-400 to-pink-400',
    iconBg: 'bg-rose-100 text-rose-600'
  },
  {
    icon: '🏆',
    title: '成就系统',
    description: '激励机制和荣誉徽章奖励体系，鼓励持续参与，让志愿更有成就感。',
    gradient: 'from-blue-400 to-indigo-400',
    iconBg: 'bg-blue-100 text-blue-600'
  },
  {
    icon: '🔔',
    title: '智能通知',
    description: '个性化消息推送和提醒服务，通过多渠道确保不错过任何重要信息。',
    gradient: 'from-purple-400 to-violet-400',
    iconBg: 'bg-purple-100 text-purple-600'
  },
  {
    icon: '🛡️',
    title: '安全保障',
    description: '企业级数据加密和隐私保护机制，确保组织和志愿者的信息安全。',
    gradient: 'from-emerald-400 to-teal-400',
    iconBg: 'bg-emerald-100 text-emerald-600'
  }
]

const volunteerSteps = [
  '注册账号并完善个人信息，选择感兴趣的环保领域',
  '浏览热门活动并报名参与，查看活动详情',
  '参加活动并获取服务时长，记录您的贡献',
  '查看个人成就和统计数据，下载志愿服务证明'
]

const organizationSteps = [
  '注册组织账号并提交认证，完善组织信息',
  '创建和发布环保活动，设置报名条件和人数',
  '管理活动报名和志愿者，审核报名申请',
  '查看组织数据统计报告，导出活动记录'
]

const faqs = [
  {
    question: 'Q: 如何注册成为志愿者？',
    answer: 'A: 点击首页的注册按钮，填写基本信息并验证邮箱即可完成注册。注册后可以完善个人资料，选择感兴趣的环保领域，开始您的志愿之旅。'
  },
  {
    question: 'Q: 如何发布活动？',
    answer: 'A: 需要先注册组织账号并通过认证，然后在组织管理中心创建活动。填写活动详情后提交审核，审核通过后即可发布，志愿者可以开始报名。'
  },
  {
    question: 'Q: 如何获取服务时长证明？',
    answer: 'A: 活动结束后，组织方会为参与者确认服务时长，系统自动记录并生成证明。您可以在个人中心的"我的记录"页面下载带有平台认证的志愿服务证明。'
  }
]

// 滚动到指定区域
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 滚动观察器
let observer: IntersectionObserver | null = null

onMounted(() => {
  // Hero动画
  setTimeout(() => { heroInView.value = true }, 100)
  setTimeout(() => { statsInView.value = true }, 400)

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement
      const isInView = entry.isIntersecting || entry.intersectionRatio > 0

      if (target === missionCard.value) inViewCards.mission = isInView
      if (target === visionCard.value) inViewCards.vision = isInView
      if (target === valuesCard.value) inViewCards.values = isInView
      if (target === featuresSection.value) featuresInView.value = isInView
      if (target === guideSection.value) guideInView.value = isInView
      if (target === faqSection.value) faqInView.value = isInView
      if (target === contactSection.value) contactInView.value = isInView
    })
  }, {
    threshold: 0.1,
    rootMargin: '-50px 0px'
  })

  const elements = [missionCard, visionCard, valuesCard, featuresSection, guideSection, faqSection, contactSection]
  elements.forEach(el => {
    if (el.value && observer) observer.observe(el.value)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* 动画定义 */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 通用动画类 */
.animate-in {
  animation: fadeUp 0.6s ease-out forwards;
}

/* 响应式动画支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-in {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}

/* FAQ卡片悬停效果 */
.faq-card {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 平滑过渡 */
section {
  transition: background-color 0.3s ease;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

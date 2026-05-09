<template>
  <div ref="chartRef" class="chart-panel" :style="{ height }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

type EChartsInstance = ReturnType<typeof echarts.init>

const props = withDefaults(defineProps<{
  option: Record<string, any>
  height?: string
}>(), {
  height: '320px'
})

const chartRef = ref<HTMLDivElement | null>(null)
let chart: EChartsInstance | null = null
let observer: ResizeObserver | null = null

function initChart() {
  const el = chartRef.value
  if (!el) return

  if (chart) {
    chart.dispose()
    chart = null
  }

  chart = echarts.init(el)
  chart.setOption(props.option, true)
}

onMounted(() => {
  nextTick(() => initChart())

  if (chartRef.value) {
    observer = new ResizeObserver(() => chart?.resize())
    observer.observe(chartRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  chart?.dispose()
  chart = null
})

watch(() => props.option, () => {
  if (!chart) {
    nextTick(() => initChart())
    return
  }
  chart.setOption(props.option, true)
}, { deep: true })
</script>

<style scoped>
.chart-panel {
  width: 100%;
}
</style>

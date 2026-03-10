import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isSupportedLocale,
  type SupportedLocale
} from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<SupportedLocale>(DEFAULT_LOCALE)

  const resolveBrowserLocale = (): SupportedLocale => {
    const browserLocale = window.navigator.language?.toLowerCase() ?? ''
    if (browserLocale.startsWith('en')) {
      return 'en-US'
    }
    return DEFAULT_LOCALE
  }

  const saveLocale = () => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale.value)
    } catch (error) {
      console.error('保存语言设置失败:', error)
    }
  }

  const setLocale = (nextLocale: SupportedLocale) => {
    locale.value = nextLocale
    saveLocale()
  }

  const toggleLocale = () => {
    setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  const restoreLocale = () => {
    try {
      const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
      if (isSupportedLocale(storedLocale)) {
        locale.value = storedLocale
        return
      }

      locale.value = resolveBrowserLocale()
    } catch (error) {
      console.error('恢复语言设置失败:', error)
      locale.value = DEFAULT_LOCALE
    }
  }

  return {
    locale,
    setLocale,
    toggleLocale,
    restoreLocale
  }
})

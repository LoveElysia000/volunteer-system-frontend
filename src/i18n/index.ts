import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

export type SupportedLocale = 'zh-CN' | 'en-US'

export const LOCALE_STORAGE_KEY = 'app_locale'
export const DEFAULT_LOCALE: SupportedLocale = 'zh-CN'

export const isSupportedLocale = (value: unknown): value is SupportedLocale => {
  return value === 'zh-CN' || value === 'en-US'
}

const resolveBrowserLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const browserLocale = window.navigator.language?.toLowerCase() ?? ''
  if (browserLocale.startsWith('en')) {
    return 'en-US'
  }

  return DEFAULT_LOCALE
}

const resolveInitialLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (isSupportedLocale(storedLocale)) {
    return storedLocale
  }

  return resolveBrowserLocale()
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

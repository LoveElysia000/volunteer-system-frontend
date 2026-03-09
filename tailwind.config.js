/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 环保主题色彩
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
          900: '#1a452c',
        },
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
          900: '#343c46',
        }
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      screens: {
        '3xl': '1920px',  // 超大屏适配
        '4xl': '2560px'   // 4K屏幕适配
      },
      maxWidth: {
        'screen-3xl': '1920px',
        'screen-4xl': '2560px'
      },
      spacing: {
        // 语义化间距系统
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '88': '22rem',    // 352px
        '92': '23rem',    // 368px
        '128': '32rem',   // 512px
      }
    },
  },
  plugins: [],
}
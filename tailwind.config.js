/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px' },
    },
    extend: {
      colors: {
        /**
         * هوية المكتب الحالية — المصدر الوحيد لألوان الواجهة العامة.
         * استخدمها بدل كتابة القيم يدويًا: bg-brand-navy, text-brand-gold, border-brand-line …
         */
        brand: {
          navy: '#0B132B',
          'navy-deep': '#060B19',
          'navy-soft': '#16203F',
          gold: '#C5A880',
          'gold-light': '#D6B57E',
          'gold-dark': '#9A7B3E',
          cream: '#FAF9F5',
          'cream-warm': '#FAF5EB',
          line: '#EADFCF',
          'line-soft': '#F1E8DA',
          ink: '#0F172A',
          muted: '#64748B',
        },

        // High-end Palette requested:
        // Midnight Blue: #1C2B48
        // Cool Cerulean: #8EB1D1
        // Baby Blue Eyes: #A7C7E7
        // Light Blue Grey: #C4D8E5
        // Platinum: #E8ECEF
        palette: {
          midnight: '#1C2B48',
          cerulean: '#8EB1D1',
          baby: '#A7C7E7',
          ice: '#C4D8E5',
          platinum: '#E8ECEF',
        },
        background: '#f6f8fa',
        surface: '#E8ECEF',
        'surface-card': '#ffffff',
        'surface-subtle': '#f0f4f7',
        border: '#C4D8E5',
        'border-subtle': '#E8ECEF',
        'border-strong': '#8EB1D1',
        ink: {
          DEFAULT: '#1C2B48',
          soft: '#2a3e5c',
          muted: '#527094',
          faint: '#8eb1d1',
        },
        navy: {
          DEFAULT: '#1C2B48',
          50: '#f0f4f8',
          100: '#e8ecef',
          200: '#c4d8e5',
          300: '#a7c7e7',
          400: '#8eb1d1',
          500: '#5a82a6',
          600: '#345577',
          700: '#253d5a',
          800: '#1C2B48',
          900: '#131e33',
          950: '#0a101d',
        },
        accent: {
          DEFAULT: '#8EB1D1',
          light: '#A7C7E7',
          soft: '#C4D8E5',
          deep: '#1C2B48',
        },
        bronze: {
          DEFAULT: '#8EB1D1',
          50: '#f0f4f8',
          100: '#e8ecef',
          200: '#c4d8e5',
          300: '#a7c7e7',
          400: '#8eb1d1',
          500: '#8EB1D1',
          600: '#345577',
          700: '#253d5a',
        },
        success: { DEFAULT: '#2e7d56', soft: '#e8f5ee' },
        warning: { DEFAULT: '#b57b18', soft: '#fcf5e8' },
        danger: { DEFAULT: '#c0392b', soft: '#fae9e8' },
        info: { DEFAULT: '#345577', soft: '#eef4f9' },
      },
      fontFamily: {
        // High Precision Arabic Typography Hierarchy (Amiri, Reem Kufi, Tajawal):
        sans: ['"Tajawal"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Amiri"', '"Tajawal"', 'serif'],
        serif: ['"Amiri"', 'serif'],
        kufi: ['"Reem Kufi"', '"Tajawal"', 'sans-serif'],
        latin: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '14px',
        lg: '18px',
        xl: '24px',
        '2xl': '32px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(28 43 72 / 0.04)',
        sm: '0 2px 4px 0 rgb(28 43 72 / 0.06), 0 1px 2px -1px rgb(28 43 72 / 0.06)',
        md: '0 6px 16px -2px rgb(28 43 72 / 0.08), 0 2px 6px -2px rgb(28 43 72 / 0.05)',
        lg: '0 16px 36px -8px rgb(28 43 72 / 0.14), 0 4px 12px -4px rgb(28 43 72 / 0.06)',
        xl: '0 28px 60px -12px rgb(28 43 72 / 0.22)',
        glow: '0 0 30px rgba(142, 177, 209, 0.35)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'pulse-subtle': 'pulse-subtle 3s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}

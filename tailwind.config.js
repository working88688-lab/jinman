const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['src/**/*.pug'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--dx-primary-color)',
        'dx-blue': 'var(--dx-blue-color)',
        'dx-red': 'var(--dx-red-color)',
        font1: 'var(--dx-font1-color)',
        font2: 'var(--dx-font2-color)',

        subtitle: 'var(--dx-subtitle-color)',
        opacity: 'var(--dx-app-opacity)',
        base1: 'var(--dx-base1-color)',
        base2: 'var(--dx-base2-color)',
        base3: 'var(--dx-base3-color)',
        base4: 'var(--dx-base4-color)',
        base5: 'var(--dx-base5-color)',
        base6: 'var(--dx-base6-color)',
        base7: 'var(--dx-base7-color)',
        base8: 'var(--dx-base8-color)',
        base9: 'var(--dx-base9-color)',
        base10: 'var(--dx-base10-color)',
        base11: 'var(--dx-base11-color)',
        border: 'var(--dx-border-color)'
      },
      spacing: {
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        4.5: '18px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px'
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
        large: '50px'
      }
    },
    fontSize: {
      mini: '10px',
      sm: '12px',
      default: '14px',
      xl: '16px',
      '2xl': '18px',
      '3xl': '20px',
      '4xl': '22px',
      '5xl': '24px'
    },
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      14: '14',
      15: '15',
      16: '16'
    }
  },
  plugins: [
    plugin(function ({ addComponents, addUtilities, addBase }) {
      addComponents({
        '.flex-center': {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '.flex-col-center': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '.translate-50': {
          transform: ' translate(-50%, -50%)'
        },
        '.hide': {
          display: 'none'
        },
        '.scrollbar-none': {
          'scrollbar-width': 'none'
        },
        '.dx-shadow': {
          'box-shadow': 'var(--dx-box-shadow)'
        }
      })
    }),
    require('@tailwindcss/aspect-ratio')
  ]
}

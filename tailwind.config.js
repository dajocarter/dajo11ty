module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.njk']
  },
  theme: {
    extend: {
      colors: {
        theme: 'var(--theme--color__text)',
        link: 'var(--theme--color__link)',
        background: 'var(--theme--color__background)',
        border: 'var(--theme--color__border)'
      },
      textColor: {
        theme: 'var(--theme--color__text)',
        link: 'var(--theme--color__link)'
      },
      backgroundColor: {
        theme: 'var(--theme--color__background)',
        link: 'var(--theme--color__link)'
      },
      borderColor: {
        default: 'var(--theme--color__border)',
        theme: 'var(--theme--color__border)',
        link: 'var(--theme--color__link)'
      }
    },
    typography: {
      default: {
        css: {
          color: 'var(--theme--color__text)',
          a: {
            color: 'var(--theme--color__link)'
          },
          button: {
            color: 'var(--theme--color__link)'
          },
          strong: {
            color: 'var(--theme--color__link)'
          },
          hr: {
            borderColor: 'var(--theme--color__border)'
          },
          h1: {
            color: 'var(--theme--color__text)'
          },
          h2: {
            color: 'var(--theme--color__text)'
          },
          h3: {
            color: 'var(--theme--color__text)'
          },
          h4: {
            color: 'var(--theme--color__text)'
          },
          h5: {
            color: 'var(--theme--color__text)'
          },
          h6: {
            color: 'var(--theme--color__text)'
          },
          'ol li:before': {
            color: 'var(--theme--color__border)'
          },
          'ul li:before': {
            backgroundColor: 'var(--theme--color__border)'
          },
          blockquote: {
            borderLeftColor: 'var(--theme--color__border)',
            color: 'var(--theme--color__text)'
          },
          pre: {
            color: 'var(--theme--color__background)',
            backgroundColor: 'var(--theme--color__text)'
          },
          code: {
            color: 'var(--theme--color__link)'
          },
          thead: {
            color: 'var(--theme--color__link)'
          }
        }
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ]
}

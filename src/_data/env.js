const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID
const environment = process.env.ELEVENTY_ENV
const isProd = environment === 'production'
const baseURL = isProd ? 'https://dajo11ty.netlify.com' : 'http://localhost:8080'

module.exports = {
  site: {
    title: 'dajocarter',
    description: 'i build websites',
    author: '@dajocarter'
  },
  var: {
    GOOGLE_ANALYTICS_ID
  },
  environment,
  isProd,
  baseURL
}

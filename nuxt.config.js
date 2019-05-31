import pkg from './package'
import nodeExternals from 'webpack-node-externals'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'MyFIFA Manager',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' },
      { rel: 'stylesheet', href: 'https://cdn.materialdesignicons.com/2.8.94/css/materialdesignicons.min.css' }
    ]
  },

  /*
  ** Global CSS
  */
  css: [],

  /*
  ** Customize the progress bar color
  */
  loading: '~/components/App/AppLoadingOverlay.vue', // { color: '#3B8070' },

  devModules: [
    '@nuxtjs/vuetify'
  ],

  vuetify: {
    assets: false
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '@/plugins/vuetify.js',
    '@/plugins/lodash.js',
    '@/plugins/custom.js',
    '@/plugins/date-fns.js',
    '@/plugins/chartist.client.js'
  ],

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,

    transpile: [/^vuetify/],

    postcss: {},

    extractCSS: true,

    extend (config, { isDev, isClient }) {
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (process.server) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}

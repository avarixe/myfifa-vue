import pkg from './package'
import nodeExternals from 'webpack-node-externals'

export default {
  mode: 'universal',

  server: {
    host: '0.0.0.0',
    port: process.env.NODE_ENV === 'production' ? '8080' : '4000'
  },

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
  css: [
    '@/styles/index.scss'
  ],

  /*
  ** Customize the progress bar color
  */
  // loading: '~/components/App/LoadingOverlay.vue', // { color: '#3B8070' },

  buildModules: [
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/moment',
    '@nuxtjs/dotenv'
  ],

  vuetify: {
    assets: false
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/custom.js',
    '@/plugins/date-fns.js',
    '@/plugins/fitty.js',
    '@/plugins/chartkick.client.js',
    '@/plugins/vue-flag-icon.client.js'
  ],

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,

    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },

    transpile: [/^vuetify/],

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

import pkg from './package'
import nodeExternals from 'webpack-node-externals'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'JoonDEV | MyFIFA Manager',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' }
    ],
    script: [
      { src: 'https://www.gstatic.com/charts/loader.js' }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    'vuetify/src/stylus/main.styl',
    '@mdi/font/css/materialdesignicons.css',
    '@/css/main.css'
  ],

  /*
  ** Customize the progress bar color
  */
  loading: '~/components/AppLoadingOverlay.vue', // { color: '#3B8070' },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify.js',
    '@/plugins/lodash.js',
    '@/plugins/custom.js',
    '@/plugins/date-fns.js',
    '@/plugins/chartkick.js'
  ],

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,
    babel: {
      plugins: [
        ["transform-imports", {
          "vuetify": {
            "transform": "vuetify/es5/components/${member}",
            "preventFullImport": true
          }
        }]
      ]
    },
    extractCSS: true,
    transpile: [/^vuetify/],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isServer }) {
      // Run ESLint on save
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

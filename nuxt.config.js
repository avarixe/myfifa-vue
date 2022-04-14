import pkg from './package'
import nodeExternals from 'webpack-node-externals'

export default {
  target: 'static',

  server: {
    host: '0.0.0.0',
    port: '4000'
  },

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL,
    cableURL: process.env.CABLE_URL,
    graphql: {
      clients: {
        default: {
          endpoint: `${process.env.BASE_URL}/graphql`
        }
      }
    }
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
    '@nuxtjs/vuetify',
    'nuxt-graphql-request'
  ],

  modules: [
    'cookie-universal-nuxt'
  ],

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  // vuetify: {},

  graphql: {
    clients: {
      default: {
        endpoint: `${process.env.BASE_URL}/graphql`
      }
    },
    includeNodeModules: true
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/filters.js',
    { src: '@/plugins/nuxt-client-init.js', ssr: false },
    '@/plugins/vue-chartist.js'
  ],

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,

    transpile: [/^vuetify/, /^flagpack/],

    extractCSS: {
      ignoreOrder: true
    },

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

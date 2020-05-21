require('dotenv').config();

module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Naruto Quiz',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/global.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'https://naruto-quiz-api.herokuapp.com'
  },

  server: {
    port: process.env.PORT || 3000,
    host: process.env.APP_ENV === 'local' ? '0.0.0.0' : 'localhost'
  },
  manifest: {
    name: 'Naruto Quiz',
    short_name: 'Naruto Quiz',
    theme_color: '#2196f3',
    background_color: '#2196f3',
    display: 'standalone',
    Scope: '/',
    start_url: '/',
    icons: [
      {
        src: '../icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png'
      },
      {
        src: '../icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      },
      {
        src: '../icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png'
      },
      {
        src: '../icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png'
      },
      {
        src: '../icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png'
      },
      {
        src: '../icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '../icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png'
      },
      {
        src: '../icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};

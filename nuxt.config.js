// import colors from 'vuetify/es5/util/colors'

module.exports = {
  ssr: false,
  debug: true,
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "fast food",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ["~plugins/filters.js", "~plugins/ckeditor.js", "~plugins/axios.js"],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: process.env.API_KEY,
          authDomain: process.env.AUTH_DOMAIN,
          databaseURL: process.env.DATABASE_URL,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGING_SENDER_ID,
          appId: process.env.APP_ID
        },
        services: {
          auth: {
            ssr: false,
            initialize: {
              onAuthStateChangedAction: "onAuthStateChangedAction"
            }
          },
          firestore: true,
          functions: true,
          storage: true,
          onFirebaseHosting: true
        }
      }
    ],
    ["@nuxtjs/axios"]
  ],
  env: {
    BASE_URL: process.env.BASE_URL,
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID
  },
  // Router
  router: {
    middleware: ["authentication"]
  },

  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3
      //   }
      // }
    }
  }

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  // build: {
  //   extractCss: true,
  //   babel: {
  //     presets: ({ isServer }) => [
  //       [
  //         {
  //           targets: isServer
  //             ? { node: '10.21.0' }
  //             : { browsers: ['defaults'] },
  //         },
  //       ],
  //     ],
  //   },
  // },
};

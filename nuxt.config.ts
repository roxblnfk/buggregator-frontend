import {defineNuxtConfig} from "nuxt/config";
import pkg from './package.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  router: {
    options: {
      hashMode: true
    }
  },
  app: {
    head: {
      title: "Buggregator",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {charset: "utf-8"},
        {name: "viewport", content: "width=device-width, initial-scale=1"},
        {hid: "description", name: "description", content: ""},
        {name: "format-detection", content: "telephone=no"},
      ],
      link: [
        {rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico"},
      ],
    },
  },
  dir: {
    static: 'static',
  },
  imports: {
    dirs: [
      'composables/**'
    ]
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/index.css"],
  plugins: [
    {src: '~/plugins/api.client.ts'},
    {src: '~/plugins/events.client.ts'},
    {src: '~/plugins/vendors.client.ts'},
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  typescript: {
    strict: true,
  },
  devServer: {
    host: '127.0.0.1',
    url: 'http://127.0.0.1:3000',
  },
  runtimeConfig: {
    public: {
      version: pkg.version,
    }
  }
});

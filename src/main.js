import './assets/_main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // **IMPORTA QUI LE ICONE**

//Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

/// Importing Highlight.js for syntax highlighting
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/a11y-dark.css' // puoi cambiare stile
import 'highlight.js/lib/common' // importa i linguaggi base

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',  // <-- qui imposti il tema dark di default
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#BB86FC',
          secondary: '#03DAC6',
          error: '#CF6679',
          // altri colori a piacere
        },
      },
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#1976D2',
          secondary: '#424242',
          error: '#FF5252',
          // altri colori
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(VueHighlightJS)
   
app.mount('#app')

<script setup>
  import Sidebar from './components/Sidebar.vue'
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // per uno scroll animato
    });
  }
</script>

<template>
  <v-app>
    <Sidebar />
    <v-main>
      <router-view />
      <v-btn
        icon
        @click="scrollToTop"
        style="position: fixed; bottom: 24px; right: 24px;"
        aria-label="Torna su"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-main>
  </v-app>
</template>


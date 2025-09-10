<script setup>

  import { ref, watch } from 'vue'

  const items = [
    {
      avatar: '',
      title: 'Home',
      subtitle: ``,
      route: '/'
    },
    {
      avatar: '',
      title: 'Risultati',
      subtitle: ``,
      route: '/results'
    },
    {
      avatar: '',
      title: 'Admin',
      subtitle: ``,
      route: '/admin'
    },

  ]

  const drawer = ref(false)
  const group = ref(null)

  watch(group, () => {
    drawer.value = false
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // per uno scroll animato
    });
  }
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar class="title" style="background-image: url('/src/assets/images/everdell_menu.png'); background-size: cover; background-position: center;">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Everdell GoodFellas</v-toolbar-title>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>

          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <!-- <v-btn icon="mdi-dots-vertical" variant="text"></v-btn> -->
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.route"
          ripple
          :active-class="'v-list-item--active'"
        >
          <v-list-item-avatar v-if="item.avatar">
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>

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
    </v-layout>
  </v-card>
</template>


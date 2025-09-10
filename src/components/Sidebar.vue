<template>
  <v-navigation-drawer app permanent>
     <v-list lines="two">
      <template v-for="(item, index) in items">
        <v-list-subheader
          v-if="item.header"
          :key="item.header"
          inset
        >
          {{ item.header }}
        </v-list-subheader>

        <v-divider class="m-0"
          v-else-if="item.divider"
          :key="index"
          inset
        ></v-divider>

        <v-list-item
          v-else
          :key="item.title"
          :prepend-avatar="item.avatar"
          ripple
          :active-class="'v-list-item--active'"
          :to="item.route"
        >
          <template v-slot:title>
            <div v-html="item.title"></div>
          </template>

          <template v-slot:subtitle>
            <div v-html="item.subtitle"></div>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>

 const items = [
    {
      header: 'Get started',
    },
    { divider: true },
    {
      avatar: '',
      title: 'How to - new project',
      subtitle: ``,
      route: '/how-to'
    },

    {
      header: 'LARAVEL',
    },
    { divider: true },
    {
      avatar: '',
      title: 'Best Practise',
      subtitle: `
        <div class="my-2">- Scaffholding laravel</div>
        <div class="my-2">- Modelli, metodi, relations</div>
      `,
      route: '/best-practise'
    },

  ]
</script>
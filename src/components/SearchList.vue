<!-- components/SearchList.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps({
  items: Array, // [{ label: string, el: HTMLElement }]
})
const emit = defineEmits(['select'])

const search = ref('')

const filteredItems = computed(() => {
  if (!search.value) return []
  return props.items.filter(el =>
    el.label.toLowerCase().includes(search.value.toLowerCase())
  )
})

function selectItem(label) {
  emit('select', label)
}
</script>

<template>
  <div>
    <v-text-field
      v-model="search"
      hide-details="auto"
      label="Cerca.."
      class="search-input"
    />

    <v-card class="mx-auto">
      <v-list>
        <template v-if="search !== '' && filteredItems.length > 0">
          <v-list-item
            v-for="item in filteredItems"
            :key="item.label"
            @click="selectItem(item.label)"
            class="cursor-pointer"
          >
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </template>

        <template v-else-if="search !== '' && filteredItems.length < 1">
          <v-list-item>
            <v-list-item-title>Nessun risultato trovato</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

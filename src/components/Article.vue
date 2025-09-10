<template>
  <li class="article" :data-label="label" ref="el">
    <h2 class="pb-2">{{label}}</h2>
    <v-card variant="tonal">

      <template #subtitle>
        <slot name="subtitle">Sottotitolo di default</slot>
      </template>

      <template #text>
        <slot name="text">Testo di default</slot>
      </template>
    </v-card>

    <!-- Slot generico (se vuoi sotto la card, o altrove) -->
    <slot />
  </li>
</template>

<script setup>
import { defineProps, defineExpose, ref } from 'vue'

const props = defineProps({
  label: String
})

const el = ref(null)
defineExpose({ el, label: props.label })
</script>

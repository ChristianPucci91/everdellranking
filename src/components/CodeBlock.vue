<!-- components/CodeBlock.vue -->
<template>
  <pre><code :class="`language-${language}`" ref="codeElement"></code></pre>
</template>

<script setup>
import { ref, onMounted, onUpdated, watch } from 'vue'
import hljs from 'highlight.js'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'php'
  }
})

const codeElement = ref(null)

const highlight = () => {
  if (codeElement.value) {
    codeElement.value.textContent = props.code
    hljs.highlightElement(codeElement.value)
  }
}

onMounted(highlight)
onUpdated(highlight)
watch(() => props.code, highlight)
</script>

<style scoped>

</style>

<script setup>
import { ref } from 'vue'
import SearchList from './SearchList.vue'

const articleRefs = ref([])

const setArticleRefs = (el) => {
  if (!el) return
  if (!articleRefs.value.find(a => a.label === el.label)) {
    articleRefs.value.push(el)
  }
}

function scrollToItem(label) {
  const target = articleRefs.value.find(el => el.label === label)
  if (target?.el) {
    target.el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="searchable-list-wrapper">
    <SearchList :items="articleRefs" @select="scrollToItem" />

    <!-- Passa setArticleRefs come funzione da usare nello slot -->
     <div class="content-wrapper">
        <slot :setArticleRefs="setArticleRefs"></slot>
     </div>
  </div>
</template>

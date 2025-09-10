<script setup>
    import SearchableListWrapper from '../components/SearchableListWrapper.vue'
    // import Struttura from '../views/Articles/BestPractise/Struttura.vue'
</script>

<template>
    <SearchableListWrapper v-slot="{ setArticleRefs }">
        <ol class="p-0 main-list">
        </ol>
    </SearchableListWrapper>
</template>

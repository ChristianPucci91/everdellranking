<script setup>
import DocumentationIcon from '../components/icons/IconDocumentation.vue'
import ToolingIcon from '../components/icons/IconTooling.vue'
import EcosystemIcon from '../components/icons/IconEcosystem.vue'
import CommunityIcon from '../components/icons/IconCommunity.vue'
import SupportIcon from '../components/icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="container  vh-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 text-center">
        <h1>Benvenuto su DEV Bible!</h1>
      </div>
    </div>
  </div>
</template>

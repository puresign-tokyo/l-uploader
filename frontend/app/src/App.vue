<template>
  <v-app id="inspire">
    <HeaderComponent />
    <routerView />
    <v-footer class="d-flex align-center justify-center" color="surface-light" app>
      <div>
        {{ 'Copyright Wefmaika All Rights Reserved.' }}
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>


  import HeaderComponent from './components/HeaderComponent.vue'


</script>

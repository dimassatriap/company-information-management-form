<template>
  <v-app>
    <v-app-bar fixed app dense>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>

    <v-footer id="footer" fixed app>
      <span>dimassatriap &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      miniVariant: false,
      right: true,
      title: 'Management'
    }
  }
}
</script>

<style>
.shadow-none {
  box-shadow: none !important;
}
.shadow-nav {
  box-shadow: 0px 0px 8px rgba(113, 115, 115, 0.16) !important;
}
.shadow-card-sm {
  box-shadow: 0px 0px 8px rgba(113, 115, 115, 0.16) !important;
}
.shadow-card-md {
  box-shadow: 2px 4px 16px rgba(132, 127, 130, 0.16) !important;
}

.rounded-8 {
  border-radius: 8px !important;
}
.rounded-4 {
  border-radius: 4px !important;
}
.rounded-0 {
  border-radius: 0 !important;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}
::-webkit-scrollbar {
  width: 7px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
  background-color: #847f82;
  border-radius: 20px;
}
</style>

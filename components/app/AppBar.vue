<template>
  <v-app-bar :clipped-left="true" fixed app>
    <v-app-bar-nav-icon @click="change()" />
    <v-toolbar-title>
      test
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    visibleBar: {
      type: Boolean,
      require: true
    }
  },
  methods: {
    change() {
      this.$emit("changeVisible");
    }
  }
};
</script>

<style scoped></style>

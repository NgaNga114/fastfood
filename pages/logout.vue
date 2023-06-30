<template>
  <div></div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  created() {
    this.logout();
  },
  methods: {
    ...mapActions("user", ["logout"])
  }
};
</script>

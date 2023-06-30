<template>
  <v-app dark>
    <div class="" v-if="error.statusCode === 404">
      <v-img
        max-height="500"
        :lazy-src="require('../assets/images/white_full.png')"
        :src="require('../assets/images/404.jpg')"
        contain
      ></v-img>
      <div class="but-go-home">
        <v-btn @click="$router.push('/')" class="ma-2" color="#fe3b36" outlined>
          <v-icon>mdi-arrow-left-thick</v-icon>
          Home page
        </v-btn>
      </div>
    </div>
    <div class="" v-else>
      <v-img
        max-height="500"
        :lazy-src="require('../assets/images/white_full.png')"
        :src="require('../assets/images/404.jpg')"
        contain
      ></v-img>
      <div class="but-go-home">
        <v-btn @click="$router.push('/')" class="ma-2" color="#fe3b36" outlined>
          <v-icon>mdi-arrow-left-thick</v-icon>
          Home page
        </v-btn>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred"
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
.but-go-home {
  display: flex;
  justify-content: center;
}
</style>

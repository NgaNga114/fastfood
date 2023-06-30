<template>
  <v-app>
    <v-snackbar
      v-if="snackBar.color === 'error'"
      color="red"
      top
      v-model="snackBar.show"
    >
      <p class="mb-0" style="color: #eeebdd !important">
        {{ snackBar.text }}
      </p>

      <template v-slot:action="{ attrs }">
        <v-btn
          style="color: #eeebdd !important"
          text
          v-bind="attrs"
          @click="closeSnackBar()"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-if="snackBar.color === 'success'"
      color="blue"
      top
      v-model="snackBar.show"
    >
      <p class="mb-0" style="color: #eff3c6 !important">
        {{ snackBar.text }}
      </p>

      <template v-slot:action="{ attrs }">
        <v-btn
          style="color: #eff3c6 !important"
          text
          v-bind="attrs"
          @click="closeSnackBar()"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
    <!-- <p>error: eeebdd</p>
    <p>success: eff3c6</p> -->
    <v-main class="default">
      <Bar />
      <v-container class="pt-0">
        <nuxt />
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script>
import Bar from "../components/Bar";
import Footer from "../components/Footer";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    Bar,
    Footer
  },
  // middleware(context) {
  //   console.log("middleware");
  //   context.store.dispatch("user/getUser");
  // },
  created() {
    if (this.products.length <= 0) {
      console.log(this.products.length);
      this.$store.dispatch("products/listProducts");
    }
  },
  data() {
    return {
      snackbar: true,
      text: "My timeout is set to 2000.",
      timeout: 1500,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/"
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js"
    };
  },
  computed: {
    ...mapState(["snackBar"]),
    ...mapState("products", ["products"])
  },
  methods: {
    closeSnackBar() {
      this.$store.commit("SET_SNACKBAR", {
        show: false,
        color: "",
        text: ""
      });
    }
  },
  watch: {
    snackBar() {
      if (this.snackBar.show === true) {
        setTimeout(() => {
          this.closeSnackBar();
        }, 2000);
      }
    }
  }
};
</script>

<style>
.v-toolbar__content {
  height: 100% !important;
}
.v-input__append-outer {
  margin: 0 !important;
}
.default {
  background-color: #f5f5f5;
}
.v-stepper__step {
  align-items: baseline !important;
}
.v-stepper {
  box-shadow: none !important;
}
.textarea-rating .v-input__append-inner {
  bottom: 5px;
  position: absolute !important;
  right: 5px;
}
</style>

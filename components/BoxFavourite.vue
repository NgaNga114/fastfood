<template>
  <div>
    <v-card class="d-flex align-center" height="auto">
      <v-row>
        <v-col cols="3" md="2">
          <v-img
            class="img-product-favourite ml-2"
            width="80"
            height="80"
            :src="listData.image"
            @click="onProduct(data)"
          ></v-img>
        </v-col>
        <v-col cols="6" md="4">
          <p
            class="mb-0 font-weight-bold name-product"
            @click="onProduct(data)"
          >
            {{ listData.name }}
          </p>
          <v-divider class="grey mt-3 mb-1"></v-divider>
          <v-icon color="red">
            mdi-heart
          </v-icon>
        </v-col>
        <v-col
          class="pl-0 pl-sm-3 d-flex justify-center align-center"
          cols="3"
          md="2"
        >
          <div>
            <p class=" mb-0 font-weight-bold red--text subtitle-1">
              {{ listData.price | formatCurrency }}
            </p>
            <p
              class="mb-0 d-inline-block grey--text subtitle-2 text-decoration-line-through"
            >
              {{ listData.oldPrice | formatCurrency }}
            </p>
          </div>
        </v-col>
        <v-col
          class="pt-0 pt-md-3 justify-center d-flex align-center"
          cols="12"
          md="4"
        >
          <v-btn
            height="32"
            color="red darken-2"
            class="px-6 white--text"
            @click="onBuyNow()"
          >
            MUA NGAY
          </v-btn>
          <v-btn
            height="32"
            color="red darken-2"
            class="mx-5"
            icon
            @click="
              favouriteProductAPI(
                { idProduct: data, type: 'minus', uid: userProfile.id },
                $emit('loadList')
              )
            "
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  props: ["data"],
  data() {
    return {
      listData: ""
    };
  },
  computed: {
    ...mapGetters("user", ["isCheckUser"]),
    ...mapState("user", ["userProfile"])
  },
  methods: {
    ...mapActions("products", [
      "getOnceFavouriteProduct",
      "buyNow",
      "favouriteProductAPI"
    ]),
    onProduct(id) {
      this.$router.push({ path: `/productDetail/${id}` });
    },
    onBuyNow() {
      if (this.isCheckUser) {
        this.buyNow({
          id: this.data,
          quantity: 1,
          pick: true
        });
        this.$router.push("/checkout-page");
      } else {
        this.$store.commit("SET_SNACKBAR", {
          show: true,
          text: "Вам необходимо войти",
          color: "error"
        });
        this.$router.push("/signin");
      }
    }
  },
  async created() {
    this.listData = await this.getOnceFavouriteProduct(this.data);
  }
};
</script>

<style scoped>
.img-product-favourite {
  border-radius: 7px;
  border: 1px solid red;
  cursor: pointer;
}
.name-product:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>

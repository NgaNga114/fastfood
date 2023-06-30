<template>
  <div>
    <v-card
      @click="onProduct()"
      flat
      :loading="loading"
      class="box-product"
      max-width="100%"
    >
      <div class="box-small">
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <div class="mx-auto pt-3 col-12 px-2 px-sm-3">
          <v-img class="img-box-product" :src="item.image" height="150">
            <div class="disscount">
              <p class="text-subtitle-2 red--text mb-0 pt-1">
                20%
              </p>
            </div>
          </v-img>
        </div>
        <v-card-title class="px-2 px-sm-3 pb-0 pt-0 justify-space-between">
          <p class="mb-0 text-caption text-sm-body-1">{{ item.name }}</p>
          <v-icon :class=" !!listFavourite? listFavourite.includes(item.id) ? 'red--text text-subtitle-1 text-sm-h5' : 'gray--text text-subtitle-1 text-sm-h5' : 'gray--text text-subtitle-1 text-sm-h5'"
            >mdi-heart</v-icon
          >
        </v-card-title>

        <v-card-text class="pb-0  px-2 px-sm-3">
          <div class="d-flex">
            <div class="d-inline-block red--text text-caption text-sm-body-1">
              {{ item.price | formatCurrency }}
            </div>
            <div class="d-inline-block ml-3">
              <p
                class="mb-0 grey--text text-caption text-sm-body-1 text-decoration-line-through"
              >
                {{ item.oldPrice | formatCurrency }}
              </p>
            </div>
            <!-- <div class="d-inline-block red--text subtitle-1">
              <v-icon>mdi-car</v-icon>
            </div> -->
          </div>
          <v-row align="center" class="pb-3 mx-0">
            <v-rating
              :value="item.rate"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="text-caption text-sm-body-2 grey--text ml-1 ml-sm-4">
              <!-- {{ item.rate }} (413) -->
              (413)
            </div>
          </v-row>

          <!-- <div>
          Small plates, salads & sandwiches - an intimate setting with 12 indoor
          seats plus patio seating.
        </div> -->
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  data: () => ({
    loading: false,
    selection: 1
  }),

  methods: {
    ...mapActions("products", ["favouriteProductAPI"]),
    onProduct() {
      // console.log(this.item.id);
      const id = this.item.id;
      this.$router.push({ path: `/productDetail/${id}` });
      // this.$router.push("/signin");
    }
  },
  computed: {
    ...mapState("products", ["listFavourite"]),
    ...mapState("user", ["userProfile"]),
  },
  created() {
    if(!!this.userProfile){
      this.favouriteProductAPI({
        uid:this.userProfile.id,
        idProduct: this.item.id
      })
    }
  }
};
</script>

<style scoped>
.img-box-product {
  position: relative;
  border-radius: 8px;
}
@media screen and (max-width: 600px) {
  .img-box-product {
    height: 100px !important;
  }
}
.box-product {
  cursor: pointer;
  border-radius: 10px !important;
}
.disscount {
  height: 27px;
  width: 45px;
  background-color: #f2e92a;
  text-align: center;
  display: flex;
  justify-content: center;
  position: absolute;
  border-radius: 5px;
  right: 10px;
  top: 5px;
  /* border-bottom: 10px solid #f0f0f0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent; */
}
</style>

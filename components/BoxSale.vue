<template>
  <v-card class="card-box-sale" height="100%" max-width="100%">
    <!-- <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template> -->
    <div class="pa-2">
      <v-img
        class="img-boxsale"
        height="250"
        :src="require('../assets/images/garan.jpg')"
      ></v-img>
    </div>

    <v-card-title class="py-0 text-h6 text-sm-body-1 text-md-h6 font-weight-medium">[ КОМБО ] Группа А</v-card-title>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <div class="d-block">
          <div class="d-flex">
            <div class="d-inline-block red--text subtitle-1">
              {{ price | formatCurrency }}
            </div>
            <div class="d-inline-block ml-3">
              <p
                class="mb-0 grey--text subtitle-1 text-decoration-line-through"
              >
                {{ oldPrice | formatCurrency }}
              </p>
            </div>
          </div>
          <div class="d-flex">
            <v-rating
              :value="rate"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <div class="grey--text ml-4">
              4.5 (413)
            </div>
          </div>
        </div>
      </v-row>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>
    <div>
      <p class="mx-3 mt-3 mb-0">
        Применять:
      </p>
      <p class="mx-3 grey--text text--darken-2">
        С 1/5 по 30/6
      </p>
    </div>
    <v-card-actions class="mt-10 btn-boxsale justify-center">
      <v-btn @click="onBuyNow()" color="col-6 red lighten-1 white--text">
        КУПИ СЕЙЧАС
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    selection: 1,
    price: 690,
    oldPrice: 750,
    rate: 4.5
  }),

  methods: {
    onBuyNow() {
      this.$emit('buyNow')
    }
  }
};
</script>

<style scoped>
.img-boxsale {
  border-radius: 7px;
}
.card-box-sale {
  border-radius: 7px;
  background-color: #f9ecc2;
}
</style>

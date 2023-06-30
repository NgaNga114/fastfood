<template>
  <div>
    <v-card class="d-flex align-center" height="auto">
      <v-row>
        <v-col cols="3" md="2">
          <v-img
            class="img-product-favourite ml-2"
            width="80"
            height="80"
            :src="data.products.products[0].image"
            @click="onProduct(data.products.products[0].id)"
          ></v-img>
        </v-col>
        <v-col cols="6" md="4">
          <p
            class="mb-0 font-weight-bold name-product"
            @click="onProduct(data.products.products[0].id)"
          >
            {{ data.products.products[0].name }}
          </p>
          <v-divider class="grey mt-3 mb-1"></v-divider>
          <div class="d-flex">
            <v-icon color="red">
              mdi-map-marker
            </v-icon>
            <p class="mb-0 text-caption grey--text text--darken-2">
              {{ data.pickUpInfo.location.detailAddress }},
              {{ data.pickUpInfo.location.ward.title }},
              {{ data.pickUpInfo.location.district.title }},
              {{ data.pickUpInfo.location.city.title }},
            </p>
          </div>
        </v-col>
        <v-col
          class="pl-0 pl-md-3 d-flex justify-center align-center"
          cols="3"
          md="2"
        >
          <div>
            <div class="text-center">
              <p class="mb-0 text-caption text-md-body-1">
                {{ timeFormat(data.timestamp).day }}
              </p>
              <p class="mb-0 text-caption text-md-body-1">
                {{ timeFormat(data.timestamp).hour }}
              </p>
            </div>
            <div class="d-block d-md-none">
              <p class="mb-0 red--text text-body-2">
                {{ data.products.products[0].price | formatCurrency }}
              </p>
              <p
                class="bg-yellow text-caption mb-0 text-sm-body-2"
                @click="checkOrdered(data.id)"
                v-if="data.status === 3"
              >
                Chi tiết <span class="font-weight-bold">>></span>
              </p>
            </div>
          </div>
        </v-col>
        <v-col
          class="pt-0 pt-md-3 d-none justify-md-center d-md-flex align-md-center"
          cols="12"
          md="4"
        >
          <div>
            <p class="mb-0 red--text text-h6">
              {{ data.products.products[0].price | formatCurrency}}
            </p>
            <p
              class="bg-yellow text-caption mb-0 text-detail"
              style="cursor: pointer;"
              @click="checkOrdered(data.id)"
              v-if="data.status === 3"
            >
              Xem chi tiết <span class="font-weight-bold">>></span>
            </p>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["data"],
  methods: {
    timeFormat(time) {
      let arrTime = time.substr(0, 18).split(" ");
      let timeDay = arrTime[0].substr(0, 10).split("-");
      let timeHour = arrTime[1].substr(0, 8).split(":");
      timeDay =
        timeDay[2].trim() + "-" + timeDay[1].trim() + "-" + timeDay[0].trim();
      timeHour =
        timeHour[0].trim() +
        ":" +
        timeHour[1].trim() +
        ":" +
        timeHour[2].trim();
      return { day: timeDay, hour: timeHour };
    },
    onProduct(id) {
      this.$router.push({ path: `/productDetail/${id}` });
    },
    checkOrdered(id) {
      this.$router.push("/checkordered/" + id);
    }
  }
};
</script>

<style scoped>
.img-product-favourite {
  border-radius: 7px;
  border: 1px solid red;
  cursor: pointer;
}
.bg-yellow {
  color: #c79f30 !important;
}
.name-product:hover {
  cursor: pointer;
  text-decoration: underline;
}
.text-detail:hover {
  text-decoration: underline;
}
</style>

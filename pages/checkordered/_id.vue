<template>
  <div style="max-width: 1200px; margin: 0 auto;">
    <div class="my-3">
      <Breadcrumbs :items="item_breadcrumbs" />
    </div>
    <!-- {{ listOrdered }} -->
    <v-row>
      <v-col cols="12" md="10">
        <v-card
          :loading="isOrderLoading"
          class="card-status-order"
          :class="{ 'pt-md-10 px-md-10 pb-md-2 ': !isOrderLoading }"
        >
          <template slot="progress">
            <v-progress-linear
              indeterminate
              color="#F44336"
            ></v-progress-linear>
          </template>
          <v-sheet class="pa-3" v-if="isOrderLoading">
            <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
          </v-sheet>

          <v-row
            v-if="!listOrdered.length && !isOrderLoading"
            style="height: 100%; display: flex; align-items: center;"
          >
            <v-col>
              <p class="text-center">
                Нет данных о заказе....
              </p>
            </v-col>
          </v-row>
          <div v-for="(ordered, index) in listOrdered" :key="ordered.id">
            <v-row v-if="ordered">
              <v-col cols="12" md="6">
                <v-stepper
                  class="ff-steps pb-0"
                  non-linear
                  v-model="ordered.status"
                  vertical
                >
                  <v-stepper-step
                    class="pr-0"
                    color="red"
                    :complete="ordered.status > 1"
                    step="1"
                  >
                    <span class="red--text text--darken-1 font-weight-bold">
                      ПОДТВЕРЖДЕНИЕ ЗАКАЗА
                    </span>
                    <span class="grey--text text-body-2 text--darken-2"
                      >(Giờ: {{ timeFormat(ordered.timestamp).hour }}, Ngày
                      {{ timeFormat(ordered.timestamp).day }}
                      )</span
                    >
                    <v-card class="mt-3" flat height="auto">
                      <v-card-subtitle class="py-0">
                        <div
                          v-for="(product, index) in ordered.products.products"
                          :key="product.index"
                        >
                          <a
                            v-if="product"
                            class="mb-0"
                            @click="productDetail(product.id)"
                            >{{ index + 1 }}, {{ product.name }}</a
                          >
                          <span> (SL: {{ product.quantity }}) </span>
                        </div>
                      </v-card-subtitle>
                    </v-card>
                  </v-stepper-step>

                  <v-stepper-step
                    class="pb-0 pr-0"
                    color="red"
                    :complete="ordered.status > 2"
                    step="2"
                  >
                    <span
                      class="red--text font-weight-bold"
                      :class="{ 'grey--text': ordered.status < 2 }"
                    >
                      ПРОДУКТ НА СВОЕМ ПУТИ К ВАМ
                    </span>
                    <div v-if="ordered.status >= 2">
                      <v-card
                        v-if="ordered.shipper"
                        class="mt-3"
                        flat
                        height="auto"
                      >
                        <v-card-subtitle class="py-0">
                          <p
                            v-if="ordered.shipper"
                            class="mb-0 grey--text text--darken-1"
                          >
                            <span class="font-weight-bold"
                              >Грузоотправитель</span
                            >: {{ ordered.shipper.name }}
                          </p>
                          <p class="mb-0 grey--text text--darken-1">
                            <span class="font-weight-bold">Phone</span>:
                            {{ ordered.shipper.phoneNumber }}
                          </p>
                        </v-card-subtitle></v-card
                      >
                    </div>
                  </v-stepper-step>

                  <v-stepper-step
                    class="pb-0 pr-0"
                    color="red"
                    :complete="ordered.status === 3"
                    step="3"
                  >
                    <span
                      class="red--text font-weight-bold"
                      :class="{ 'grey--text': ordered.status < 3 }"
                    >
                      УСПЕШНАЯ ДОСТАВКА
                    </span>
                    <div v-if="ordered.status === 3">
                      <v-card class="mt-3" flat height="auto">
                        <v-card-subtitle class="py-0">
                          <p class="grey--text text-body-2">
                            Адрес:
                            <span
                              class="text-subtitle grey--text text--darken-2"
                            >
                              {{ ordered.pickUpInfo.location.detailAddress }},
                              {{ ordered.pickUpInfo.location.ward.title }},
                              {{ ordered.pickUpInfo.location.district.title }},
                              {{ ordered.pickUpInfo.location.city.title }}</span
                            >
                            <!-- {{ ordered.location }} -->
                          </p>
                        </v-card-subtitle></v-card
                      >
                    </div>
                  </v-stepper-step>

                  <!-- <v-stepper-step
                  class="pb-0 pr-0"
                  color="red"
                  :complete="ordered.status > 4"
                  step="4"
                >
                  <div>
                    <span
                      class="red--text font-weight-bold"
                      :class="{ 'grey--text': ordered.status < 4 }"
                    >
                      GIAO HÀNG THÀNH CÔNG
                    </span>
                  </div>
                </v-stepper-step> -->
                </v-stepper>
              </v-col>
              <v-col class="px-4 px-sm-10 px-md-0" cols="12" md="6">
                <v-card flat class="py-5 card-rating-checkorder">
                  <v-card-title
                    class="pt-0 red--text text--darken-1 font-weight-bold"
                  >
                    Информация о доставке:
                  </v-card-title>
                  <div class="pl-4 d-flex">
                    <p class="grey--text text-body-2">
                      Фамилия и имя:
                      <span
                        v-if="ordered.pickUpInfo"
                        class="text-subtitle grey--text text--darken-2"
                      >
                        {{ ordered.pickUpInfo.name }}
                      </span>
                    </p>
                  </div>
                  <div class="pl-4 d-flex">
                    <p class="grey--text text-body-2">
                      Номер телефона:
                      <span class="text-subtitle grey--text text--darken-2">
                        {{ ordered.pickUpInfo.phoneNumber }}
                      </span>
                    </p>
                  </div>
                  <div class="pl-4 d-flex">
                    <p class="grey--text text-body-2">
                      Địa chỉ:
                      <span class="text-subtitle grey--text text--darken-2">
                        {{ ordered.pickUpInfo.location.detailAddress }},
                        {{ ordered.pickUpInfo.location.ward.title }},
                        {{ ordered.pickUpInfo.location.district.title }},
                        {{ ordered.pickUpInfo.location.city.title }}</span
                      >
                      <!-- {{ ordered.location }} -->
                    </p>
                  </div>
                  <div class="pl-4 d-flex">
                    <p class="grey--text text-body-2">
                      Ghi chú:
                      <span class="text-subtitle grey--text text--darken-2">
                        {{ ordered.note }}
                      </span>
                      <!-- {{ ordered.location }} -->
                    </p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <hr v-if="index !== listOrdered.length - 1" class="my-3" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="2" class="d-none d-md-inline">
        <v-img :src="require('../../assets/images/Special_Banner.png')">
        </v-img>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Breadcrumbs from "../../components/Breadcrumbs.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data: () => {
    return {
      listOrdered: []
    };
  },
  methods: {
    ...mapActions("order", ["getListOrder"]),
    timeFormat(time) {
      if (time) {
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
      }
    },
    getDataInfo() {
      this.getListOrder({
        role: this.getUser.role,
        id: this.getUser.id
      });
    }
  },
  watch: {
    listOrder(newVal) {
      if (newVal.length > 0) {
        this.listOrdered = this.listOrder.filter(item => {
          return item.id == this.$route.params.id;
        });
      }
    }
  },
  computed: {
    ...mapState("order", ["listOrder", "isOrderLoading"]),
    ...mapGetters("user", ["getUser"]),
    item_breadcrumbs() {
      return [
        {
          text: "Главная страница",
          disabled: false,
          href: "/"
        },
        {
          text: "Kiểm tra đơn hàng đã giao",
          disabled: false,
          href: ""
        }
      ];
    }
  },
  async created() {
    this.getDataInfo();
  }
};
</script>

<style lang="scss" scoped></style>

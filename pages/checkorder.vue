<template>
  <div style="max-width: 1200px; margin: 0 auto;">
    <div class="my-3">
      <Breadcrumbs :items="item_breadcrumbs" />
    </div>
    <!-- {{ orderPendingList }} -->
    <v-row>
      <v-col cols="12" md="10">
        <v-card class="pt-md-10 pb-md-2 px-md-10 card-status-order">
          <v-row
            v-if="!orderPendingList.length"
            style="height: 100%; display: flex; align-items: center;"
          >
            <v-col>
              <p class="text-center">
                Нет данных о заказе....
              </p>
            </v-col>
          </v-row>
          <div
            v-for="(order_pending, index) in orderPendingList"
            :key="order_pending.id"
          >
            <v-row v-if="order_pending">
              <v-col cols="12" md="6">
                <v-stepper
                  class="ff-steps pb-0"
                  non-linear
                  v-model="order_pending.status"
                  vertical
                >
                  <v-stepper-step
                    class="pr-0"
                    color="red"
                    :complete="order_pending.status > 1"
                    step="1"
                  >
                    <span class="red--text text--darken-1 font-weight-bold">
                      ПОДТВЕРЖДЕНИЕ ЗАКАЗА
                    </span>
                    <!-- <span class="grey--text text-body-2 text--darken-2"
                      >(Giờ:
                      {{ reverseTimestamp(order_pending.timestamp).timeOrder }},
                      Ngày
                      {{
                        reverseTimestamp(order_pending.timestamp).orderDate
                      }})</span
                    > -->
                    <v-card class="mt-3" flat height="auto">
                      <v-card-subtitle class="py-0">
                        <div
                          v-for="(product, index) in order_pending.products
                            .products"
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
                    :complete="order_pending.status > 2"
                    step="2"
                  >
                    <span
                      class="red--text font-weight-bold"
                      :class="{ 'grey--text': order_pending.status < 2 }"
                    >
                      ПРОДУКТ НА СВОЕМ ПУТИ К ВАМ
                    </span>
                    <div v-if="order_pending.status >= 2">
                      <v-card
                        v-if="order_pending.shipper"
                        class="mt-3"
                        flat
                        height="auto"
                      >
                        <v-card-subtitle class="py-0">
                          <p
                            v-if="order_pending.shipper"
                            class="mb-0 grey--text text--darken-1"
                          >
                            <span class="font-weight-bold"
                              >Грузоотправитель</span
                            >: {{ order_pending.shipper.name }}
                          </p>
                          <p class="mb-0 grey--text text--darken-1">
                            <span class="font-weight-bold">Phone</span>:
                            {{ order_pending.shipper.phoneNumber }}
                          </p>
                        </v-card-subtitle></v-card
                      >
                    </div>
                  </v-stepper-step>

                  <v-stepper-step
                    class="pb-0 pr-0"
                    color="red"
                    :complete="order_pending.status === 3"
                    step="3"
                  >
                    <span
                      class="red--text font-weight-bold"
                      :class="{ 'grey--text': order_pending.status < 3 }"
                    >
                      УСПЕШНАЯ ДОСТАВКА
                    </span>
                    <div v-if="order_pending.status === 3">
                      <v-card class="mt-3" flat height="auto">
                        <v-card-subtitle class="py-0">
                          <p class="grey--text text-body-2">
                            Адрес:
                            <span
                              class="text-subtitle grey--text text--darken-2"
                            >
                              {{
                                order_pending.pickUpInfo.location.detailAddress
                              }},
                              {{
                                order_pending.pickUpInfo.location.ward.title
                              }},
                              {{
                                order_pending.pickUpInfo.location.district
                                  .title
                              }},
                              {{
                                order_pending.pickUpInfo.location.city.title
                              }}</span
                            >
                            <!-- {{ order_pending.location }} -->
                          </p>
                        </v-card-subtitle></v-card
                      >
                    </div>
                  </v-stepper-step>

                  <!-- <v-stepper-step
                  class="pb-0 pr-0"
                  color="red"
                  :complete="order_pending.status > 4"
                  step="4"
                >
                  <div>
                    <span
                      class="red--text font-weight-bold"
                      :class="{ 'grey--text': order_pending.status < 4 }"
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
                        v-if="order_pending.pickUpInfo"
                        class="text-subtitle grey--text text--darken-2"
                      >
                        {{ order_pending.pickUpInfo.name }}
                      </span>
                    </p>
                  </div>
                  <div class="pl-4 d-flex">
                    <p class="grey--text text-body-2">
                      Номер телефона:
                      <span class="text-subtitle grey--text text--darken-2">
                        {{ order_pending.pickUpInfo.phoneNumber }}
                      </span>
                    </p>
                  </div>
                  <div class="pl-4 d-flex">
                    <p class="grey--text text-body-2">
                      Адрес:
                      <span class="text-subtitle grey--text text--darken-2">
                        {{ order_pending.pickUpInfo.location.detailAddress }},
                        {{ order_pending.pickUpInfo.location.ward.title }},
                        {{ order_pending.pickUpInfo.location.district.title }},
                        {{ order_pending.pickUpInfo.location.city.title }}</span
                      >
                      <!-- {{ order_pending.location }} -->
                    </p>
                  </div>
                  <div class="pl-4 d-flex">
                    <p class="grey--text text-body-2">
                      Сообщение:
                      <span class="text-subtitle grey--text text--darken-2">
                        {{ order_pending.note }}
                      </span>
                      <!-- {{ order_pending.location }} -->
                    </p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-card-actions
              v-if="order_pending"
              class="d-flex justify-center mt-10"
            >
              <v-btn
                :disabled="order_pending.status > 1"
                @click="openCancelOrderDialog(order_pending)"
                color="red darken-1"
                class="white--text"
              >
                <p class="mb-0 px-10">
                  Отмена
                </p>
              </v-btn>
            </v-card-actions>
            <hr v-if="index !== orderPendingList.length - 1" class="my-3" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="2" class="d-none d-md-inline">
        <v-img :src="require('../assets/images/Special_Banner.png')">
        </v-img>
      </v-col>
    </v-row>
    <DeleteDialog
      :dialog="cancelOrderDialog"
      :title="titleCancelOrderDialog"
      :idDelete="orderDelete"
      @onClose="onCloseDialogCancelOrder"
      @onDialog="onCancelOrder"
    />
  </div>
</template>

<script>
import Breadcrumbs from "../components/Breadcrumbs";
import DeleteDialog from "../components/dialog/DeleteDialog";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  components: {
    Breadcrumbs,
    DeleteDialog
  },
  data() {
    return {
      cancelOrderDialog: false,
      titleCancelOrderDialog: {
        title: "Подтверждение отмены заказа",
        subTitle: "Вы уверены, что хотите отменить этот заказ ?"
      },
      orderDelete: null
    };
  },
  async created() {
    // console.log(this.userProfile);
    this.getOrderPendingByUserId({
      user: this.userProfile
    });
    // console.log(this.getOrderPendingByUserId);
  },
  methods: {
    ...mapActions("order", ["getOrderPendingByUserId", "cancelOrder"]),
    reverseTimestamp(time) {
      if (time && time.timestamp) {
        const timestampOrder = time.timestamp.split(" ");
        const timeOrder = timestampOrder[1];
        const orderDate = timestampOrder[0]
          .split("-")
          .reverse()
          .join("-");
        return {
          timeOrder,
          orderDate
        };
      }
    },
    productDetail(productId) {
      // console.log(productId);
      this.$router.push({ path: `/productDetail/${productId}` });
    },
    openCancelOrderDialog(order) {
      this.orderDelete = order;
      this.cancelOrderDialog = true;
    },
    onCancelOrder(orderDelete) {
      this.cancelOrder(orderDelete);
      this.cancelOrderDialog = false;
    },
    onCloseDialogCancelOrder() {
      this.cancelOrderDialog = false;
    }
  },
  computed: {
    ...mapState("user", ["userProfile"]),
    ...mapState("order", ["isOrderById", "orderPendingList"]),
    item_breadcrumbs() {
      return [
        {
          text: "Главная страница",
          disabled: false,
          href: "/"
        },
        {
          text: "Проверьте свой заказ",
          disabled: false,
          href: "/checkorder"
        }
      ];
    }
  }
};
</script>

<style>
.ff-steps {
  height: 100% !important;
}
.btn-rating-checkorder {
  background-color: #c79f2c !important;
}
/* .card-rating-checkorder {
  border-radius: 5px;
  border: 2px solid #909090 !important;
} */
.theme--light.v-stepper .v-stepper__step--active .v-stepper__label {
  text-shadow: none;
}
.card-status-order {
  height: 100%;
}
</style>

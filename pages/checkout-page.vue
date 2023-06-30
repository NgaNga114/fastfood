<template>
  <div v-if="getUser" style="max-width: 1200px; margin: 0 auto;">
    <v-row>
      <v-col cols="12" md="7">
        <v-card class="mb-2">
          <v-row class="container py-0">
            <v-col cols="7" class="py-2 d-flex align-center">
              <v-icon
                class="black--text ac-back"
                @click="$router.push('/cart')"
              >
                mdi-keyboard-backspace
              </v-icon>
              <p class="ml-3 mb-0 grey--text text--darken-3">
                Продукт ( {{ totalPick.length }} )
              </p>
            </v-col>
          </v-row>
        </v-card>
        <v-card>
          <div v-for="item in totalPick" :key="item.index">
            <ProductConfirm :product="item" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card>
          <div class="pa-4 red--text font-weight-bold" v-if="!address">
            Вам нужен дополнительный адрес для покупки
          </div>
          <div v-if="address">
            <div class="d-flex justify-space-between">
              <v-card-title class="red--text">
                Адрес доставки:
              </v-card-title>
              <div class="pa-4">
                <a
                  class="text-body-2 text-decoration-none"
                  @click="openSelectAddress()"
                  >Исправить</a
                >
              </div>
            </div>
            <v-card-subtitle class="d-flex pb-0">
              <div class="col-1 pl-0 py-0">
                <v-icon class="red--text">mdi-map-marker</v-icon>
              </div>
              <div class="col-11 pl-2 py-0">
                <v-row>
                  <v-col cols="12" class="pt-0 pr-0 py-0">
                    <p class="mb-0 font-weight-medium text-body-1">
                      {{ address.name }}
                    </p>
                    <p>
                      <span>{{ address.location.detailAddress }}</span
                      >, <span>{{ address.location.ward.title }}</span
                      >, <span>{{ address.location.district.title }}</span
                      >, <span>{{ address.location.city.title }}</span>
                    </p>
                  </v-col>
                </v-row>
              </div>
            </v-card-subtitle>
          </div>
          <v-card-subtitle v-if="address" class="d-flex pb-0">
            <div class="col-1 pl-0 py-0">
              <v-icon class="red--text">mdi-phone</v-icon>
            </div>
            <div class="col-11 pl-2 py-0">
              <v-row>
                <v-col cols="12" class="pt-0 pr-0 py-0">
                  <p class="mb-0 font-weight-medium text-body-1">
                    {{ address.phoneNumber }}
                  </p>
                </v-col>
              </v-row>
            </div>
          </v-card-subtitle>
          <v-card-title class="red--text">
            Информация о заказе::
          </v-card-title>
          <v-card-subtitle>
            <div class="my-1">
              <span class="text-body-1"
                >Временный ( {{ totalPick.length }} продукт )</span
              >
              <span class="text-body-1 red--text float-right">
                {{ price | formatCurrency }}
              </span>
            </div>
            <div class="my-1">
              <span class="text-body-1">Плата за доставку</span>
              <span class="text-body-1 red--text float-right">
                {{ deliveryCharges | formatCurrency }}
              </span>
            </div>
            <div class="my-1">
              <span class="text-body-1">Способы оплаты</span>
              <a class="text-body-1 text-decoration-underline float-right">
                    2.     Наличные
              </a>
              <a class="text-body-1 text-decoration-underline" >
                    1.     Банковская карта 
              </a>
            </div>
          </v-card-subtitle>
          <v-divider class="mx-5"></v-divider>
          <div>
            <v-card-title class="red--text">
              Сообщение:
            </v-card-title>
            <div class="px-4">
              <v-textarea
                v-model="note"
                hide-details="auto"
                dense
                outlined
                label="Сообщение"
              >
              </v-textarea>
            </div>
          </div>
          <v-divider class="mx-5"></v-divider>
          <v-card-title>
            <div class="total-price">
              <span class="grey--text text--darken-2">
                ИТОГО
              </span>
              <span class="red--text float-right">
                {{ totalPrice | formatCurrency }}
              </span>
              <v-btn
                :disabled="loader || !address"
                @click="buyProduct()"
                width="100%"
                color="red"
                class="darken-3 d-block white--text mt-4"
              >
                ПОДТВЕРЖДЕНИЕ ЗАКАЗА
                <v-progress-circular
                  v-if="loader"
                  class="ml-2"
                  size="20"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-btn>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- <Dialog :dialog="dialogSuccess" /> -->
    <SelectAddress
      v-if="address"
      :dialog="dialogSelectAddress"
      :diliveryAddress="getUser.diliveryAddress"
      @onClose="onCloseSelectAddress"
      @onSubmitAddressSelect="onSubmitAddressSelect"
    />
  </div>
</template>

<script>
import ProductInCart from "../components/cart/product";
import ProductConfirm from "../components/cart/ProductConfirm";
import { mapGetters, mapActions, mapState } from "vuex";
import productVue from "~/components/cart/product.vue";
import Dialog from "~/components/dialog/Dialog";
import SelectAddress from "~/components/dialog/user/cart/SelectAddress";

export default {
  components: {
    ProductInCart,
    ProductConfirm,
    Dialog,
    SelectAddress
  },
  data() {
    return {
      checkAll: null,
      deliveryCharges: 150,
      purchased: false,
      dialogSuccess: {},
      note: "",
      dialogSelectAddress: false,
      address: null
    };
  },
  async middleware({ redirect, store }) {
    let productInCart = await store.getters["products/getProductInCart"];
    const array = productInCart.filter(product => {
      return product.pick === true;
    });
    if (array.length <= 0) {
      redirect("/cart");
    }
  },
  created() {
    if (this.cart.length === 0) {
      this.$router.push("/cart");
    }
    if (
      this.getUser.diliveryAddress &&
      this.getUser.diliveryAddress.length > 0
    ) {
      this.address = this.getUser.diliveryAddress[0];
    }
  },
  computed: {
    ...mapGetters("products", ["getProductInCart"]),
    ...mapGetters("user", ["getUser"]),
    ...mapState("products", ["loader", "cart"]),
    totalPick() {
      const array = this.getProductInCart.filter(product => {
        return product.pick === true;
      });
      return array;
    },
    anyRemaining() {
      const remaining = this.getProductInCart.filter(x => {
        return !x.pick;
      }).length;
      return remaining === 0;
    },
    price() {
      const pickProduct = this.getProductInCart.filter(x => {
        return x.pick === true;
      });
      // console.log(pickProduct);
      const totalPrice = pickProduct.map(x => {
        return x.price * x.quantity;
      });
      // console.log(totalPrice);
      return totalPrice.reduce((x, y) => {
        return x + y;
      }, 0);
    },
    totalPrice() {
      return this.price + this.deliveryCharges;
    }
  },
  watch: {},
  methods: {
    ...mapActions("products", ["changeAllPick", "remove", "buyProducts"]),
    editAllPick() {
      this.changeAllPick({
        allPick: !this.anyRemaining
      });
    },
    onRemove() {
      this.remove();
    },
    openSelectAddress() {
      this.dialogSelectAddress = true;
    },
    onCloseSelectAddress() {
      this.dialogSelectAddress = false;
    },
    onSubmitAddressSelect(payload) {
      console.log(payload);
      this.address = payload;
      this.dialogSelectAddress = false;
    },
    buyProduct() {
      const products = this.totalPick.map(x => {
        return {
          id: x.id,
          quantity: x.quantity
        };
      });
      this.buyProducts({
        products: {
          totalPrice: this.totalPrice,
          products
        },
        note: this.note,
        pickUpInfo: {
          ...this.address
        }
      });
      // this.dialogSuccess = {
      //   visible: true,
      //   header: "ĐẶT HÀNG THÀNH CÔNG",
      //   text: "Chúc mừng bạn đã đặt hàng thành công !",
      //   actionText: "TIẾP TỤC MUA HÀNG",
      //   link: "/"
      // };
    }
  }
};
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
.total-price {
  width: 100%;
}
a {
  color: #c79f30 !important;
}
.ac-back {
  cursor: pointer;
}
</style>

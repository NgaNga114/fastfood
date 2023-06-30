<template>
  <div style="max-width: 1200px; margin: 0 auto;">
    <v-row v-if="!checkEmptyCart">
      <v-col cols="12" md="7">
        <v-card class="mb-2">
          <div class="d-flex justify-space-between">
            <div class="d-flex pa-2">
              <v-checkbox
                class="pt-0 mt-0"
                color="red"
                hide-details="auto"
                :value="anyRemaining"
                @click="editAllPick()"
              >
              </v-checkbox>
              <div class="text-subtitle-2 grey--text text--darken-3">
                ВЫБРАТЬ ВСЕ ( {{ totalPick }} ПРОДУКТ )
              </div>
            </div>
            <div class="mr-3 d-flex justify-center align-center">
              <div>
                <v-icon class="cursor" @click="onRemove()"
                  >mdi-trash-can-outline</v-icon
                >
                <span
                  class="cursor text-subtitle-2 grey--text text--darken-3"
                  @click="onRemove()"
                >
                  Удалить
                </span>
              </div>
            </div>
          </div>
        </v-card>
        <v-card>
          <div v-for="item in getProductInCart" :key="item.index">
            <ProductInCart :product="item" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card>
          <!-- <v-card-title class="red--text">
            Địa chỉ nhận hàng:
          </v-card-title>
          <v-card-subtitle class="d-flex">
            <v-icon>mdi-location-enter</v-icon>
            <div class="ml-4">
              <div>
                <span v-if="getUser" class="font-weight-bold text-body-1">{{
                  getUser.name
                }}</span>
                <a href="" class="float-right text-decoration-none"
                  >Chỉnh sửa</a
                >
              </div>
              <div>
                126 Vĩnh Hưng, Phường Hoàng Mai, Quận Hai Bà Trưng, Hà Nội
              </div>
            </div>
          </v-card-subtitle>
          <v-divider class="mx-5"></v-divider> -->
          <v-card-title class="red--text">
            Информация о заказе:
          </v-card-title>
          <v-card-subtitle>
            <div class="my-1">
              <span class="text-body-1"
                >временный ( {{ totalPick }} продукт )</span
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
          </v-card-subtitle>
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
                width="100%"
                color="red"
                class="darken-3 d-block white--text mt-4"
                @click="$router.push('/checkout-page')"
              >
                Покупка
              </v-btn>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <p class="mt-5 text-body-1 font-weight-medium">
          Корзина
        <span class="text-body-2"
          >( {{ getProductInCart.length }} продукт )</span
        >
      </p>
      <v-col cols="12" class="white py-10 mb-8">
        <div>
          <v-img
            class="mx-auto"
            height="160"
            width="190"
            :src="require('~/assets/images/emptycart.png')"
          >
          </v-img>
        </div>
        <div class="d-flex justify-center mt-10">
          <v-btn
            class="btn-continue-buy text-decoration-none"
            @click="$router.push('/')"
          >
            Продолжить покупки
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
``
<script>
import ProductInCart from "../components/cart/product";
import { mapGetters, mapActions } from "vuex";
import productVue from "~/components/cart/product.vue";

export default {
  components: {
    ProductInCart
  },
  data() {
    return {
      checkAll: null,
      deliveryCharges: 150
    };
  },
  computed: {
    ...mapGetters("products", ["getProductInCart"]),
    ...mapGetters("user", ["getUser"]),
    checkEmptyCart() {
      if (this.getProductInCart.length === 0) return true;
    },
    totalPick() {
      const array = this.getProductInCart.filter(product => {
        return product.pick === true;
      });
      return array.length;
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
  methods: {
    ...mapActions("products", ["changeAllPick", "remove"]),
    editAllPick() {
      this.changeAllPick({
        allPick: !this.anyRemaining
      });
    },
    onRemove() {
      this.remove();
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
.btn-continue-buy {
  background-color: rgb(253, 216, 53) !important;
  color: rgb(74, 74, 74);
  font-weight: 500;
  padding: 10px 55px;
  display: inline-block;
  border-radius: 4px;
}
</style>

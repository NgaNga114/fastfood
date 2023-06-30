<template>
  <div>
    <v-card flat>
      <div>
        <v-row>
          <v-col class="col-produce d-inline-flex pl-6" cols="12" sm="7">
            <v-img
              class="img-product"
              height="50"
              width="70"
              :src="product.image"
            >
            </v-img>
            <p class="name-product ml-4 font-weight-bold red--text">
              {{ product.name }}
            </p>
          </v-col>
          <v-col cols="6" sm="2" class="text-center d-sm-block">
            <p class="mb-0 red--text font-weight-bold">
              {{ price | formatCurrency }}
            </p>
            <p class="mb-0 grey--text text-decoration-line-through">
              {{ oldPrice | formatCurrency }}
            </p>
          </v-col>
          <v-col cols="6" sm="3" class="d-flex align-center justify-center">
            <span>0{{ product.quantity }}</span>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    product: {
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    price() {
      return this.product.price * this.product.quantity;
    },
    oldPrice() {
      return this.product.oldPrice * this.product.quantity;
    }
  },
  methods: {
    ...mapActions("products", ["changePick", "abate", "augment"]),
    editPick() {
      // console.log(this.product.pick);
      this.changePick({
        id: this.product.id,
        pick: this.product.pick
      });
    },
    onAbate() {
      this.abate({
        id: this.product.id,
        quantity: this.product.quantity
      });
    },
    onAugment() {
      this.augment({
        id: this.product.id,
        quantity: this.product.quantity
      });
    }
  }
};
</script>

<style scoped>
.col-produce {
  display: -webkit-box !important;
}
.img-product {
  border: 1px solid red;
}
.name-product {
  border-bottom: 1px solid grey;
}
.icon {
  padding: 0 15px;
  height: 27px !important;
}
</style>

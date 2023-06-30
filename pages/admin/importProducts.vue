<template>
  <div>
    <v-card width="500" class="my-4 mx-auto px-5">
      <v-card-title>
        Import Products
      </v-card-title>
      <v-text-field v-model="name" outlined dense label="Name"></v-text-field>
      <v-text-field
        type="number"
        v-model="price"
        outlined
        dense
        label="price"
      ></v-text-field>
      <v-text-field
        type="number"
        v-model="oldPrice"
        outlined
        dense
        label="old price"
      ></v-text-field>
      <v-autocomplete
        v-model="type"
        :items="itemsType"
        dense
        label="type"
        outlined
      ></v-autocomplete>
      <v-autocomplete
        type="number"
        v-model="rate"
        :items="itemsRate"
        dense
        label="rate"
        outlined
      ></v-autocomplete>
      <v-file-input
        v-model="image"
        prepend-icon=""
        outlined
        dense
        label="Product image"
      >
        <template slot="prepend-inner">
          <v-icon> mdi-file </v-icon>
        </template>
      </v-file-input>
      <v-card-actions class="justify-center d-flex pb-7">
        <v-btn color="red darken-1 white--text px-15" @click="createProducts()">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      itemsRate: [1, 2, 3, 4, 5],
      itemsType: ["garan", "com", "burger", "sale", "especially", "random"],
      name: "",
      type: "",
      price: null,
      oldPrice: null,
      rate: null,
      image: null
    };
  },
  methods: {
    ...mapActions("products", ["addProducts"]),
    createProducts() {
      if (
        this.name &&
        this.type &&
        this.price &&
        this.oldPrice &&
        this.rate &&
        this.image
      ) {
        this.addProducts({
          name: this.name,
          type: this.type,
          price: this.price,
          oldPrice: this.oldPrice,
          rate: this.rate,
          image: this.image
        });
      }
    }
  }
};
</script>

<style scoped></style>

<template>
  <v-card>
    <v-card-title class="pb-3 box-title d-flex justify-space-between">
      <p class="title-list-order red--text pr-3">
        СПИСОК ПРОДУКТОВ
      </p>
      <v-btn class="chip-price" dense @click="addProduct()"
        >ДОБАВИТЬ НОВЫЕ ПРОДУКТЫ</v-btn
      >
    </v-card-title>
    <div class="pa-5">
      <v-row>
        <v-col cols="12" sm="10" md="6">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                class="grey lighten-3"
                dense
                hide-details="auto"
                outlined
                v-model="search"
                label="Поиск продукта"
                append-icon="mdi-magnify"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                class="grey lighten-3"
                dense
                hide-details="auto"
                outlined
                label="Категория"
                prepend-inner-icon="mdi-filter-outline"
                append-icon="mdi-chevron-down"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-data-table
      :search="search"
      :loading="products.length === 0 || loader ? true : false"
      loading-text="Loading... Please wait"
      v-if="products"
      :headers="headers"
      :items="desserts"
      class="elevation-1 rmr-table-custom-sort"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          @click="openEditProduct(item)"
          color="yellow darken-3"
          small
          class="text-h5 mr-2"
        >
          mdi-pencil
        </v-icon>
        <v-icon @click="openDeleteProduct(item)" class="text-h5" small>
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <v-img class="image-product" height="50" width="65" :src="item.image">
        </v-img>
      </template>
      <template v-slot:[`item.prices`]="{ item }">
        <div class="d-flex">
          <p class="mb-0 red--text">
            {{ item.price | formatCurrency }}
          </p>
          <p class="mb-0 pl-2 grey--text text-decoration-line-through">
            {{ item.oldPrice | formatCurrency }}
          </p>
        </div>
      </template>
      <template v-slot:[`item.detail`]>
        <a class="text-decoration-underline detail">
          Подробности
        </a>
      </template>
    </v-data-table>
    <ProductDialog
      :title="titleDialog"
      :product="productInfo"
      :dialog="dialog"
      @onClose="onClose"
      @onCreateProduct="onCreateProduct"
      @onEditProduct="onEditProduct"
    />
    <DeleteDialog
      @onClose="closeDelete"
      @onDialog="onDelete"
      :dialog="dialogDelete"
      :title="titleDialogDelete"
      :idDelete="productDelete"
    />
  </v-card>
</template>

<script>
// store
import { mapState, mapActions } from "vuex";
// components
import ProductDialog from "../../components/dialog/ProductDialog";
import DeleteDialog from "../../components/dialog/DeleteDialog";

export default {
  layout: "adminDefault",
  components: {
    ProductDialog,
    DeleteDialog
  },
  data() {
    return {
      search: "",
      titleDialogDelete: {
        title: "",
        subTitle: ""
      },
      dialogDelete: false,
      titleDialog: "",
      dialog: false,
      productInfo: {},
      headers: [
        { text: "Образ ", value: "image" },
        { text: "Название продукта", value: "productName" },
        { text: "Цена", value: "prices" },
        { text: "Категория", value: "type" },
        { text: "Подробнее", value: "detail" },
        { text: "Действия", value: "actions" }
      ],
      productDelete: null,
      isLoadWaitProductsUpdate: false
    };
  },
  computed: {
    ...mapState("products", ["product", "products", "loader"]),
    desserts() {
      return this.products.map(product => {
        const { name, price, oldPrice, type, image, id } = product;
        return {
          id,
          productName: name,
          price,
          oldPrice,
          type: type.text,
          image
        };
      });
    }
  },
  methods: {
    ...mapActions("products", [
      "createProduct",
      "editProduct",
      "deleteProduct"
    ]),
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "green";
    },
    onClose() {
      this.dialog = false;
    },
    openEditProduct(item) {
      this.titleDialog = "ИЗМЕНИТЬ ИНФОРМАЦИЮ О ПРОДУКТЕ";
      console.log(item);
      this.productInfo = {
        ...item,
        tempImage: []
      };
      this.dialog = true;
    },
    onEditProduct(payload) {
      this.editProduct({
        ...payload
      });
      this.dialog = false;
    },
    addProduct() {
      this.productInfo = {};
      this.titleDialog = "БОЛЬШЕ ПРОДУКТОВ";
      this.dialog = true;
    },
    openDeleteProduct(item) {
      this.titleDialogDelete = {
        title: "УДАЛИТЬ ПРОДУКТЫ ",
        subTitle: "Вы уверены, что хотите удалить этот продукт?"
      };
      this.productDelete = item.id;
      this.dialogDelete = true;
    },
    onDelete(id) {
      this.deleteProduct(id);
      this.dialogDelete = false;
    },
    closeDelete() {
      this.productDelete = null;
      this.dialogDelete = false;
    },
    onCreateProduct(payload) {
      console.log(payload);
      this.createProduct(payload);
      this.dialog = false;
    }
  }
};
</script>

<style>
@media screen and (max-width: 700px) {
  .rmr-table-custom-sort .v-data-table__wrapper {
    padding: 20px;
  }
  .rmr-table-custom-sort
    .v-application--is-ltr
    .v-data-table
    > .v-data-table__wrapper
    > table
    > tbody
    > tr
    > th,
  .v-application--is-ltr
    .v-data-table
    > .v-data-table__wrapper
    > table
    > thead
    > tr
    > th,
  .v-application--is-ltr
    .v-data-table
    > .v-data-table__wrapper
    > table
    > tfoot
    > tr
    > th {
    padding: 0 !important;
    border-bottom: 1px solid #d6d6d6 !important;
  }
  .rmr-table-custom-sort .v-data-table__mobile-row {
    height: 50px !important;
    border-bottom: 1px solid #d6d6d6 !important;
    padding: 0 !important;
  }
  .rmr-table-custom-sort .theme--light.v-label {
    color: black !important;
  }
  .rmr-table-custom-sort .v-data-table__mobile-row__header {
    width: 40% !important;
  }
  .rmr-table-custom-sort .v-data-table__mobile-row__cell {
    width: 55% !important;
    text-align: left;
  }
  .rmr-table-custom-sort
    .v-data-table__mobile-row__cell
    .v-btn--icon.v-size--default {
    margin-left: -13px !important;
  }
  .rmr-table-custom-sort .v-data-table-header-mobile__wrapper .v-select {
    margin-bottom: 30px;
  }
  .rmr-table-custom-sort .v-text-field .v-input__control {
    background-color: #f5f5f5 !important;
  }
  .rmr-table-custom-sort
    .v-data-table-header-mobile__wrapper
    .v-input__append-inner {
    display: none;
  }
  .rmr-table-custom-sort
    .v-data-table-header-mobile__wrapper
    .v-input--hide-details
    > .v-input__control
    > .v-input__slot {
    padding: 0 18px !important;
  }
  .rmr-table-custom-sort .v-data-footer__select .v-input__slot {
    height: 36px !important;
    width: 63px !important;
    padding: 6px;
  }
}
</style>

<style scoped>
.quantity {
  background-color: #fce08d;
  border-radius: 7px;
}
.box-title {
  border-bottom: 3px solid #bfbfbf;
  padding-bottom: 0;
}
.title-list-order {
  border-right: 3px solid #bfb7b7;
}
.detail {
  color: #b7a47a;
}
.chip-price {
  background-color: #fae6a1 !important;
}
.personcreate {
  border: 2px solid grey;
  background-color: #ffffff !important;
}
.image-product {
  border-radius: 5px;
  border: 1px solid grey;
}
</style>

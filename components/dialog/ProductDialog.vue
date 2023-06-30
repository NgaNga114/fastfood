<template>
  <div>
    <v-dialog persistent width="800" v-model="dialog">
      <v-card class="dialog-info pa-6">
        <v-card-title class="pt-0 px-0 pb-0 d-flex justify-center align-center">
          <p
            class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
          >
            {{ title }}
          </p>
        </v-card-title>
        <v-card class="pa-6 mx-auto" width="100%">
          <v-row>
            <v-col cols="12" sm="6" class="pb-0">
              <div class="my-3">
                <div class="d-flex justify-space-between align-center">
                  <p class="mb-2">
                    Название продукта
                  </p>
                  <v-checkbox
                    label="Приоритизировать"
                    value="true"
                    color="red"
                    class="mt-0 mb-1"
                    dense
                    hide-details="auto"
                  ></v-checkbox>
                </div>
                <v-text-field
                  :value="product.productName"
                  @change="onChange($event, 'name')"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-gift"
                  label="Название продукта"
                  outlined
                >
                </v-text-field>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Старая цена
                  <v-text-field
                    type="number"
                    :value="product.oldPrice"
                    @change="onChange($event, 'oldPrice')"
                    dense
                    hide-details="auto"
                    prepend-inner-icon="mdi-currency-usd-circle"
                    label="Старая цена"
                    outlined
                  >
                  </v-text-field>
                </p>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Цена акции
                </p>
                <v-text-field
                  type="number"
                  :value="product.price"
                  @change="onChange($event, 'price')"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-currency-usd-off"
                  label="Цена акции"
                  outlined
                >
                </v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="6" class="pb-0">
              <div class="my-3">
                <div class="d-flex justify-space-between align-center">
                  <p class="mb-2">
                    КАТЕГОРИЯ
                  </p>
                </div>
                <v-combobox
                  label="Категория"
                  hide-details="auto"
                  :items="items_type"
                  :value="product.type"
                  @change="onChange($event, 'type')"
                  prepend-inner-icon="mdi-filter-outline"
                  append-icon="mdi-chevron-down"
                  outlined
                  dense
                ></v-combobox>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Изображение продукта
                </p>
                <template>
                  <v-file-input
                    @change="onChange($event, 'image')"
                    prepend-icon=""
                    label="Изображение продукта"
                    outlined
                    :value="product.tempImage"
                    dense
                    hide-details="auto"
                    prepend-inner-icon="mdi-folder-image"
                  ></v-file-input>
                </template>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Изображение продукта
                </p>
                <div>
                  <v-radio-group
                    class="mt-2"
                    hide-details="auto"
                    dense
                    prepend-icon="mdi-car-connected"
                    column
                  >
                    <v-radio label="Бесплатная доставка" value="radio-1"></v-radio>
                    <v-radio label="Плата за доставку" value="radio-2"></v-radio>
                  </v-radio-group>
                </div>
              </div>
            </v-col>
            <v-col cols="12" class="py-0">
              <p class="mb-2">
                Внедрение продукции
              </p>
              <v-textarea
                label="Внедрение продукции"
                auto-grow
                outlined
              ></v-textarea>
            </v-col>
          </v-row>
          <v-card-actions class="pt-0 d-flex justify-end pr-0">
            <v-btn
              v-if="product.id"
              class="white--text"
              color="red darken-2"
              @click="editProduct()"
              >Исправить</v-btn
            >
            <v-btn
              v-else
              class="white--text"
              color="red darken-2"
              @click="createProduct()"
              >Добавить</v-btn
            >
            <v-btn
              @click="close()"
              class="white--text"
              outlined
              color="red darken-2"
              >Oтмена</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      require: true
    },
    product: {
      type: Object
    },
    title: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      items_type: [
        {
          value: "garan",
          text: "Жареная курочка"
        },
        {
          value: "com",
          text: "Рис"
        },
        {
          value: "burger",
          text: "Бургер"
        },
        {
          value: "promotional",
          text: "Пицца"
        },
        {
          value: "ponlan",
          text: "Кекс"
        },
        {
          value: "combo",
          text: "Комбо"
        },
        {
          value: "dessert",
          text: "Десерты"
        }
      ],
      updateProduct: {}
    };
  },
  methods: {
    close() {
      this.$emit("onClose");
    },
    onChange(value, field) {
      this.updateProduct[field] = value;
    },
    createProduct() {
      this.$emit("onCreateProduct", {
        ...this.updateProduct
      });
    },
    editProduct() {
      this.$emit("onEditProduct", {
        id: this.product.id,
        ...this.updateProduct
      });
    }
  }
};
</script>

<style scoped>
.dialog-info {
  background-color: #dfdfdf !important;
}
.btn-change-password {
  background-color: #c3a12f !important;
}
.btn-edit {
  background-color: #f0293c !important;
}
.box-actions {
  text-align: -webkit-right;
}
.icon-close {
  position: absolute;
  right: 3px;
  top: 3px;
}
</style>

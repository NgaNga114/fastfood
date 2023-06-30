<template>
  <v-card>
    <v-card-title class="box-title d-flex justify-space-between">
      <p class="title-list-order red--text pr-3">
        СПИСОК ВОЗВРАТА
      </p>
      <p class="text-h6">
        Общее количество заказов с возвратом
        <span class="text-h6 red--text text--darken-2 pa-2 quantity">
          10
        </span>
      </p>
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
                label="Поиск заказа"
                append-icon="mdi-magnify"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:[`item.personcreate`]="{ item }">
        <v-chip class="personcreate red--text text--darken-3">
          {{ item.personcreate }}
        </v-chip>
      </template>
      <template v-slot:[`item.cart`]>
        <a class="text-decoration-underline detail">
          Подробности
        </a>
      </template>
      <template v-slot:[`item.date`]>
        <div class="d-block">
          <p class="mb-0">
            10:51
          </p>
          <p class="mb-0">
            12/01/2023
          </p>
        </div>
      </template>
      <template v-slot:[`item.receiver`]>
        <div class="d-block">
          <p class="mb-0">
            Long
          </p>
          <p class="mb-0">
            035.706.6060
          </p>
        </div>
      </template>
      <!-- <template v-slot:item.file="{ item }">
        <a>
          <v-icon small class="text-h5 mr-2">
            mdi-printer
          </v-icon>
        </a>
      </template> -->
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  layout: "adminDefault",
  data() {
    return {
      headers: [
        { text: "ID заказа", value: "ordercode" },
        { text: "Создатель", value: "personcreate" },
        { text: "Доставщик", value: "shipper" },
        { text: "Дата создания", value: "date" },
        { text: "Получатель", value: "receiver" },
        { text: "Причина возврата", value: "reasonRefund" },
        { text: "Корзина", value: "cart" }
      ],
      desserts: [
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        },
        {
          ordercode: "FF00012",
          cart: "",
          personcreate: "Ad_Duong",
          date: "",
          receiver: 4.0,
          shipper: "GH_Quân",
          reasonRefund: "Gọi khách hàng không nghe máy"
        }
      ]
    };
  },
  methods: {
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "green";
    }
  }
};
</script>

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
</style>

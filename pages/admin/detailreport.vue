<template>
  <div>
    <v-card>
      <v-card-title class="box-card-title d-flex justify-space-between">
        <div class="d-block d-md-flex">
          <div class="title-detail-report pr-3">
            <p class="mb-0 red--text">
              ДЕТАЛЬНЫЙ ОТЧЕТ
              <a class="ml-2 d-inline d-sm-none">
                <v-icon class="text-h5">
                  mdi-printer
                </v-icon>
              </a>
            </p>
          </div>
          <div class="ml-0 ml-md-3 d-flex">
            <p class="text-body-2 text-sm-h6 mb-0 grey--text text--darken-2">
                С:
              <a
                class="text-caption text-sm-h6 yellow--text text--darken-3 text-decoration-underline"
                >05/4/2023</a
              >
            </p>
            <p
              class="text-body-2 text-sm-h6 mb-0 ml-3 grey--text text--darken-2"
            >
              До:
              <a
                class="text-caption text-sm-h6 yellow--text text--darken-3 text-decoration-underline"
                >01/6/2023</a
              >
            </p>
          </div>
        </div>
        <div>
          <a class="d-none d-sm-flex">
            <v-icon class="text-h4">
              mdi-printer
            </v-icon>
          </a>
        </div>
      </v-card-title>
      <v-data-table :headers="headers" :items="desserts" class="elevation-1 rmr-table-custom-sort">
      </v-data-table>
      <!-- <div class="grey lighten-2 pa-2">
        <v-row>
          <v-col class="d-flex align-center" cols="3" sm="2">
            <p class="mb-0 text-h6">
              Tổng số đơn:
            </p>
          </v-col>
          <v-col cols="9" sm="10" class="d-flex align-center">
            <p class="mb-0 text-body-1">
              1.323
            </p>
          </v-col>
        </v-row>
      </div> -->
    </v-card>
  </div>
</template>

<script>
export default {
  layout: "adminDefault",
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Имя пользователя", value: "name" },
        { text: "Всего заказов", value: "totalOrder" },
        { text: "Успешный заказ", value: "orderSuccess" },
        { text: "Заказ возвращен", value: "refund" },
        { text: "Доход", value: "totalRevenue" }
      ],
      desserts: [
        {
          id: "071",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "1.543.756"
        },
        {
          id: "01242",
          name: "caoduong",
          totalOrder: "12",
          orderSuccess: "54",
          refund: "346",
          totalRevenue: "12.543.756"
        },
        {
          id: "0129",
          name: "vuduc",
          totalOrder: "12",
          orderSuccess: "54",
          refund: "32",
          totalRevenue: "144.543.756"
        },
        {
          id: "021",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "167.543.756"
        },
        {
          id: "018",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "163.543.756"
        },
        {
          id: "012",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "14.543.756"
        },
        {
          id: "0163",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "1.543.756"
        },
        {
          id: "014",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "11.543.756"
        },
        {
          id: "011244",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "11.543.756"
        },
        {
          id: "014657",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "11.543.756"
        },
        {
          id: "0314",
          name: "quangcao",
          totalOrder: "911",
          orderSuccess: "300",
          refund: "611",
          totalRevenue: "11.543.756"
        }
      ]
    };
  }
};
</script>

<style scoped>
.title-detail-report {
  border-right: 2px solid grey;
}
.box-card-title {
  border-bottom: 2px solid grey;
}
</style>

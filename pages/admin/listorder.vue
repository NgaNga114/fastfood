<template>
  <v-card>
    <v-card-title class="box-title d-flex justify-space-between">
      <p class="title-list-order red--text pr-3">
        СПИСОК ЗАКАЗОВ
      </p>
      <p class="text-h6">
          Всего заказов
        <span class="text-h6 red--text text--darken-2 pa-2 quantity">
          {{ orders.length }}
        </span>
      </p>
    </v-card-title>
    <div class="px-5">
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
                label="Поиск заказа"
                append-icon="mdi-magnify"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="selectOrderType"
                item-text="name"
                item-value="value"
                :items="orderTypes"
                class="grey lighten-3"
                dense
                hide-details="auto"
                outlined
                label="Статус"
                prepend-inner-icon="mdi-filter-outline"
                append-icon="mdi-chevron-down"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-data-table
      :loading="isOrderLoading"
      loading-text="Order loading..."
      :search="search"
      :headers="headers"
      :items="orders"
      class="elevation-1 rmr-table-custom-sort"
      :custom-filter="customSearchOrder"
    >
      <template v-slot:[`item.stt`]="{ item }">
        {{ item.stt }}
      </template>
      <template v-slot:[`item.personCreate`]="{ item }">
        <v-chip
          @click="copyToClipBoard(item.id)"
          class="personcreate red--text text--darken-3"
        >
          <v-icon class="mr-1">mdi-account</v-icon>
          {{ item.id.slice(0, 8) }}...
        </v-chip>
      </template>
      <template v-slot:[`item.detail`]="{ item }">
        <a
          class="text-decoration-underline detail"
          @click="openDialogOrderDetail(item)"
        >
          Подробности
        </a>
      </template>
      <template v-slot:[`item.items`]="{ item }">
        <div v-for="product in item.items" :key="product.index">
          <p class="mb-0 text-caption text-sm-body-2">
            {{ product.name }}( {{ product.quantity }})
          </p>
        </div>
      </template>
      <template v-slot:[`item.note`]="{ item }">
        <p
          class="mb-0 text-caption text-sm-body-2"
          v-if="!item.note"
          style="color: #EE6F57"
        >
          Нет заметок
        </p>
        <p class="mb-0" v-else style="color: #394867">{{ item.note }}</p>
      </template>
      <template v-slot:[`item.location`]="{ item }">
        <span class="text-caption text-sm-body-2">
          {{ item.location.location.detailAddress }},
          {{ item.location.location.ward.title }},
          {{ item.location.location.district.title }},
          {{ item.location.location.city.title }}</span
        >
      </template>
      <template v-slot:[`item.date`]="{ item }">
        <div class="d-block">
          <p class="mb-0 flex-nowrap">
            {{ item.date }}
          </p>
        </div>
      </template>
      <template v-slot:[`item.totalPrice`]="{ item }">
        <v-chip
          class="font-weight-bold text--darken-2 red--text chip-price"
          dark
        >
          {{ item.totalPrice | formatCurrency }}
        </v-chip>
      </template>
      <template v-slot:[`item.shipper`]="{ item }">
        <span v-if="item.shipper" class="text-caption text-sm-body-2">
          {{ item.shipper.name }}
          {{ item.shipper.phoneNumber }}
        </span>
        <span v-else class="text-caption red--text text-sm-body-2">
          Обработка
        </span>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          class="ma-2"
          text-color="white"
          :class="{
            red: item.status === orderStatus.Cancel,
            'teal darken-1': item.status === orderStatus.Pending,
            'light-blue darken-2': item.status === orderStatus.Success,
            'amber lighten-1': item.status === orderStatus.Waiting
          }"
        >
          {{ statusOrder(item.status) }}
        </v-chip>
      </template>
    </v-data-table>
    <OrderDetailDialog
      v-if="isOrderDetail"
      @onClose="onCloseOrderDetail"
      @onChangeUpdateOrder="onChangeUpdateOrder"
      @onOrderCancel="onOrderCancel"
      :dialog="isDialogOrderDetail"
      :listAssign="isListAssign"
      :isOrderDetail="isOrderDetail"
    />
  </v-card>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import OrderDetailDialog from "~/components/dialog/OrderDetailDialog";
import { UserPermissions, StaffStatus } from "../../types/user";
import { OrderStatus, OrderTypes } from "~/enums/order";

export default {
  layout: "adminDefault",
  components: {
    OrderDetailDialog
  },
  data() {
    return {
      isOrderDetail: null,
      isDialogOrderDetail: false,
      search: "",
      headers: [
        { text: "№", value: "stt" },
        { text: "Создатель", value: "personCreate" },
        { text: "Время", value: "date" },
        { text: "Продукты", value: "items" },
        { text: "Место", value: "location" },
        { text: "Доставщик", value: "shipper" },
        { text: "Общая сумма", value: "totalPrice" },
        { text: "Примечание", value: "note" },
        { text: "Статус", value: "status" },
        { text: "Подробности", value: "detail" }
      ],
      selectOrderType: null
    };
  },
  mounted() {
    this.getListOrder({ role: this.userProfile.role, id: this.userProfile.id });
  },
  created() {
    if (this.listOrder.length <= 0) {
    }
    if (
      this.listUsers.length <= 0 ||
      (this.listUsers.length > 0 &&
        this.listUsers[0].role === UserPermissions.USER)
    ) {
      this.setListuser([]);
      const roleGet = UserPermissions.SHIPPER;
      this.getListUser(roleGet);
    }
  },
  watch: {
    "$route.query.id": {
      handler() {
        this.search = this.$route.query.id || "";
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState("user", ["listUsers", "userProfile"]),
    ...mapState("order", ["isOrderLoading"]),
    ...mapState("order", ["listOrder"]),
    ...mapGetters("products", ["getOrderFromUserId"]),
    orderTypes() {
      return OrderTypes;
    },
    orderStatus() {
      return OrderStatus;
    },
    isListAssign() {
      let list = [];
      if (this.listUsers.length > 0) {
        list = this.listUsers.filter(x => {
          return x.status === StaffStatus.FREE;
        });
      }
      if (this.isOrderDetail.shipper) {
        list = [...list, this.isOrderDetail.shipper];
      }
      return list;
    },
    orders() {
      const convertListOrder = this.listOrder.map((order, index) => {
        const {
          id,
          products,
          timestamp,
          user,
          note,
          status,
          pickUpInfo,
          shipper
        } = order;
        return {
          stt: index + 1,
          id,
          personCreate: user,
          date: timestamp,
          note,
          items: products.products,
          location: pickUpInfo,
          shipper,
          totalPrice: products.totalPrice,
          status: status
        };
      });

      return !this.selectOrderType
        ? convertListOrder
        : convertListOrder.filter(
            order => order.status === Number(this.selectOrderType)
          );
    }
  },
  methods: {
    ...mapMutations({
      setListuser: "user/SET_LIST_USERS"
    }),
    ...mapActions("user", ["getListUser", "setUserToStaff"]),
    ...mapActions(["setSnackBar"]),
    ...mapActions("order", ["getListOrder", "updateOrderById", "cancelOrder"]),
    copyToClipBoard(textToCopy) {
      try {
        navigator.clipboard.writeText(textToCopy);
        this.setSnackBar({
          show: true,
          text: "Copied",
          color: "success"
        });
      } catch (error) {
        this.setSnackBar({
          show: true,
          text: "Copy thất bại, thử lại sau",
          color: "error"
        });
      }
    },
    customSearchOrder(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        item.id.toString().indexOf(search) !== -1
      );
    },
    onOrderCancel(order) {
      this.cancelOrder(order);
      this.isDialogOrderDetail = false;
    },
    onChangeUpdateOrder(value) {
      this.updateOrderById(value);
      this.isDialogOrderDetail = false;
    },
    openDialogOrderDetail(item) {
      this.isOrderDetail = item;
      this.isDialogOrderDetail = true;
    },
    onCloseOrderDetail() {
      this.isOrderDetail = null;
      this.isDialogOrderDetail = false;
    },
    statusOrder(statusKey) {
      const listStatus = {
        0: "Заказ отменен",
        1: "Обработка",
        2: "Заказ доставляется вам",
        3: "Успешно доставлено"
      };
      return listStatus[statusKey];
    },
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "green";
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
</style>

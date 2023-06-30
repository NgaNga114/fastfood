<template>
  <div>
    <v-card>
      <v-card-title class="pb-3 box-title d-flex justify-space-between">
        <p class="title-list-order red--text pr-3">
          СПИСОК ПОЛЬЗОВАТЕЛЕЙ
        </p>
        <p class="text-h6">
          Всего пользователей
          <span class="text-h6 red--text text--darken-2 pa-2 quantity">
            {{ desserts.length }}
          </span>
        </p>
      </v-card-title>
      <div class="pa-5">
        <v-row>
          <v-col cols="12" sm="10" md="6">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="search"
                  class="grey lighten-3"
                  dense
                  hide-details="auto"
                  outlined
                  label="Поиск сотрудников"
                  append-icon="mdi-magnify"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="desserts"
        class="elevation-1 rmr-table-custom-sort"
      >
        <template v-slot:[`item.avatarUrl`]="{ item }">
          <v-img
            v-if="item.avatarUrl"
            class="image-product"
            height="50"
            width="65"
            :src="item.avatarUrl"
          >
          </v-img>
          <v-img v-else class="image-product" height="50" width="65"> </v-img>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            @click="updateRoleToStaff(item)"
            small
            class="text-h5 mr-2 actions-table"
          >
            mdi-arrow-up-bold
          </v-icon>
          <v-icon
            @click="deleteStaff(item)"
            small
            class="text-h5 mr-2 actions-table"
          >
            mdi-lock-outline
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <DeleteDialog
      @onDialog="onDialog"
      @onClose="closeDelete"
      :dialog="dialogDelete"
      :title="titleDialogDelete"
      :color="colorDialog"
      :idDelete="userId"
    />
  </div>
</template>

<script>
import DeleteDialog from "../../components/dialog/DeleteDialog";
import { mapActions, mapState, mapMutations } from "vuex";
import { UserPermissions, StaffStatus } from "../../types/user";
export default {
  layout: "adminDefault",
  data() {
    return {
      actionDialog: "",
      colorDialog: "",
      search: "",
      titleDialogDelete: {
        title: "",
        subTitle: ""
      },
      dialogDelete: false,
      headers: [
        { text: "Аватар", value: "avatarUrl" },
        { text: "Пользователь", value: "name" },
        { text: "Номер телефона", value: "phoneNumber" },
        { text: "Эл.адрес", value: "email" },
        { text: "Пол", value: "sex" },
        { text: "Роль", value: "role" },
        { text: "Действия", value: "actions" }
      ],
      userId: null,
    };
  },
  computed: {
    ...mapState("user", ["listUsers"]),
    desserts() {
      return this.listUsers ? this.listUsers : [];
    }
  },
  created() {
    if (
      this.listUsers.length <= 0 ||
      (this.listUsers.length > 0 &&
        this.listUsers[0].role === UserPermissions.SHIPPER)
    ) {
      this.setListuser([]);
      const roleGet = UserPermissions.USER;
      this.getListUser(roleGet);
    }
  },
  methods: {
    ...mapActions("user", ["getListUser", "setUserToStaff"]),
    ...mapMutations({
      setListuser: "user/SET_LIST_USERS"
    }),
    updateRoleToStaff(item) {
      this.actionDialog = "update";
      this.titleDialogDelete = {
        title: "Trở thành nhân viên",
        subTitle: `${item.name} sẽ lên làm nhân viên ?`,
        id: item.id
      };
      this.userId = item.id
      this.colorDialog = "success";
      this.dialogDelete = true;
    },
    deleteStaff(item) {
      this.actionDialog = "delete";
      this.colorDialog = "";
      this.titleDialogDelete = {
        title: "VÔ HIỆU HÓA TÀI KHOẢN",
        subTitle: "Bạn có chắc muốn vô hiệu hóa tài khoản ?",
        id: item.id
      };
      this.dialogDelete = true;
    },
    onDialog(id) {
      if (this.actionDialog === "update") {
        this.setUserToStaff({
          role: UserPermissions.SHIPPER,
          status: StaffStatus.FREE,
          id
        });
      }
      this.dialogDelete = false;
    },
    closeDelete() {
      this.dialogDelete = false;
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
.actions-table {
  cursor: pointer;
}
.quantity {
  background-color: #fce08d;
  border-radius: 7px;
}
</style>

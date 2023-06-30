<template>
  <v-card>
    <v-card-title class="pb-3 box-title d-flex justify-space-between">
      <p class="title-list-order red--text pr-3">
        СПИСОК СОТРУДНИКОВ
      </p>
      <!-- <v-btn class="chip-price" dense @click="addStaff()"
        >thêm nhân viên mới</v-btn
      > -->
      <p class="text-h6">
        Oбщая численность сотрудников
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
      :headers="headers"
      :items="desserts"
      class="elevation-1 rmr-table-custom-sort"
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          style="background-color: #25C107 !important"
          v-if="item.status === isStaffStatus.FREE"
        >
          <p class="mb-0 font-weight-medium">
            Свободно
          </p>
        </v-chip>
        <v-chip color="red" v-else>
          <p class="mb-0 font-weight-medium">
            Занято
          </p>
        </v-chip>
      </template>
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
      <template v-slot:[`item.role`]="{ item }">
        <span v-if="item.role === isUserPermissions.SHIPPER">
          Персонал
        </span>
        <span v-else>
          Пользователь
        </span>
      </template>
      <template v-slot:[`item.sex`]="{ item }">
        <span v-if="item.sex === 'male'">
          Мужской
        </span>
        <span v-else>
          Женский
        </span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          @click="editStaff(item)"
          color="yellow darken-3"
          small
          class="text-h5 mr-2 actions-table"
        >
          mdi-pencil
        </v-icon>
        <v-icon @click="deleteStaff(item)" class="text-h5 actions-table" small>
          mdi-lock-outline
        </v-icon>
      </template>
    </v-data-table>
    <StaffDialog
      @onClose="onClose"
      @onSubmitInfo="onSubmitInfo"
      :dialog="dialog"
      :staffInfo="staffInfo"
      :type="type"
    />
    <DeleteDialog
      @onClose="closeDelete"
      :dialog="dialogDelete"
      :title="titleDialogDelete"
    />
  </v-card>
</template>

<script>
import StaffDialog from "../../components/dialog/StaffDialog2";
import DeleteDialog from "../../components/dialog/DeleteDialog";
import { UserPermissions, StaffStatus } from "../../types/user";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  layout: "adminDefault",
  components: {
    StaffDialog,
    DeleteDialog
  },
  data() {
    return {
      titleDialogDelete: {
        title: "",
        subTitle: ""
      },
      dialogDelete: false,
      dialog: false,
      headers: [
        { text: "Аватар", value: "avatarUrl" },
        { text: "Пользователь", value: "name" },
        { text: "Номер телефона", value: "phoneNumber" },
        { text: "Эл.адрес", value: "email" },
        { text: "Пол", value: "sex" },
        { text: "Роль", value: "role" },
        { text: "Статус", value: "status" },
        { text: "Действия", value: "actions" }
      ],
      staffInfo: {},
      type: ""
    };
  },
  created() {
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
  computed: {
    ...mapState("user", ["listUsers"]),
    isUserPermissions() {
      return UserPermissions;
    },
    isStaffStatus() {
      return StaffStatus;
    },
    desserts() {
      return this.listUsers ? this.listUsers : [];
    }
  },
  methods: {
    ...mapActions("user", ["getListUser", "setUserToStaff"]),
    ...mapMutations({
      setListuser: "user/SET_LIST_USERS"
    }),
    onSubmitInfo(payload) {
      console.log("desserts", this.desserts);
      this.dialog = false;
      this.setUserToStaff(payload);
    },
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "green";
    },
    editStaff(item) {
      this.type = "ИЗМЕНИТЬ ИНФОРМАЦИЮ О ПЕРСОНАЛЕ";
      this.staffInfo = { ...item };
      this.dialog = true;
      console.log(item);
    },
    addStaff() {
      this.staffInfo = {};
      this.type = "ДОБАВИТЬ НОВЫХ РАБОТНИКОВ";
      this.dialog = true;
    },
    onClose() {
      this.dialog = false;
    },
    deleteStaff(item) {
      this.titleDialogDelete = {
        title: "ОТКЛЮЧИТЬ УЧЕТНУЮ ЗАПИСЬ",
        subTitle: "Вы уверены, что хотите отключить свою учетную запись?",
        id: item.id
      };
      this.dialogDelete = true;
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
</style>

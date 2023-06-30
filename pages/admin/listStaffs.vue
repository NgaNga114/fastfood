<template>
  <v-card>
    <v-card-title class="pb-3 box-title d-flex justify-space-between">
      <p class="title-list-order red--text pr-3">
        СПИСОК СОТРУДНИКОВ
      </p>
      <v-btn class="chip-price" dense @click="addStaff()"
        >добавить новый персонал</v-btn
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
                label="Поиск сотрудников"
                append-icon="mdi-magnify"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:[`item.status`]="{ item }">
        <v-chip style="background-color: #25C107 !important" v-if="item.status">
          <p class="mb-0 font-weight-medium">
            Активный
          </p>
        </v-chip>
        <v-chip color="red" v-else>
          <p class="mb-0 font-weight-medium">
            Неактивный
          </p>
        </v-chip>
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
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <StaffDialog
      :dialog="dialog"
      @onClose="onClose"
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
import StaffDialog from "../../components/dialog/StaffDialog";
import DeleteDialog from "../../components/dialog/DeleteDialog";

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
        { text: "Статус", value: "status" },
        { text: "Имя", value: "name" },
        { text: "Имя Доступа", value: "accessName" },
        { text: "Номер телефона", value: "phoneNumber" },
        { text: "Должность", value: "position" },
        { text: "Эл.адрес", value: "Email" },
        { text: "Действия", value: "actions" }
      ],
      desserts: [
        {
          status: true,
          name: "Cao Quang",
          accessName: "Ad_Quang",
          phoneNumber: "0357066060",
          position: "NV_Giao Hàng",
          Email: "quangcd@icts.vn"
        },
        {
          status: false,
          name: "Cao Duong",
          accessName: "Ad_Duong",
          phoneNumber: "0357066060",
          position: "NV_Giao Hàng",
          Email: "caoducduong.98.hd@gmail.com"
        },
        {
          status: true,
          name: "Vu Duc",
          accessName: "Ad_Duc",
          phoneNumber: "0357066060",
          position: "NV_Giao Hàng",
          Email: "vuhongduc@gmail.com"
        },
        {
          status: false,
          name: "Cao Quang",
          accessName: "Ad_Quang",
          phoneNumber: "0357066060",
          position: "NV_Giao Hàng",
          Email: "quangcd@icts.vn"
        },
        {
          status: true,
          name: "Cao Quang",
          accessName: "Ad_Quang",
          phoneNumber: "0357066060",
          position: "NV_Giao Hàng",
          Email: "quangcd@icts.vn"
        }
      ],
      staffInfo: {},
      type: ""
    };
  },
  methods: {
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "green";
    },
    editStaff(item) {
      this.type = "ИЗМЕНИТЬ ИНФОРМАЦИЮ О СОТРУДНИКЕ";
      this.staffInfo = item;
      this.dialog = true;
      console.log(item);
    },
    addStaff() {
      this.staffInfo = {};
      this.type = "ДОБАВИТЬ НОВЫХ СОТРУДНИКОВ";
      this.dialog = true;
    },
    onClose() {
      this.dialog = false;
    },
    deleteStaff(item) {
      this.titleDialogDelete = {
        title: "УДАЛИТЬ СОТРУДНИКОВ",
        subTitle: "Вы уверены, что хотите удалить сотрудника?"
      };
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
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
.actions-table {
  cursor: pointer;
}
</style>

<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="800">
      <v-card class="dialog-info pa-6">
        <v-card-title class="px-0 pb-0 d-flex justify-center align-center">
          <p
            class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
          >
            {{type}}
          </p>
        </v-card-title>
        <v-card class="pa-6 mx-auto" width="100%">
          <v-card-title class="pa-0 red--text text--darken-1">
            Регистрационная информация
          </v-card-title>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="my-3">
                <p class="mb-2">
                  Имя персонала
                </p>
                <v-text-field
                  :value="staffInfo.name"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-account"
                  label="Имя персонала"
                  outlined
                >
                </v-text-field>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Имя пользователя
                </p>
                <v-text-field
                  :value="staffInfo.accessName"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-account-circle"
                  label="Имя пользователя"
                  outlined
                >
                </v-text-field>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Номер телефона
                </p>
                <v-text-field
                  :value="staffInfo.phoneNumber"
                  type="number"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-phone"
                  label="Номер телефона"
                  outlined
                >
                </v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="my-3">
                <p class="mb-2">
                  Mật khẩu
                </p>
                <v-text-field
                  :disabled="true"
                  outlined
                  prepend-inner-icon="mdi-lock"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  name="input-10-1"
                  hide-details="auto"
                  dense
                  label="Mật khẩu"
                  @click:append="show = !show"
                ></v-text-field>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Эл.адрес
                </p>
                <v-text-field
                  :value="staffInfo.Email"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-email"
                  label="Эл.адрес"
                  outlined
                >
                </v-text-field>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Chức vụ
                </p>
                <v-text-field
                  :value="staffInfo.position"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-account-cowboy-hat"
                  label="Chức vụ"
                  outlined
                  append-icon="mdi-chevron-down"
                >
                </v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="6"></v-col>
          </v-row>
          <v-card-actions class="justify-end d-flex">
            <v-btn color="red darken-2" class="white--text">Lưu</v-btn>
            <v-btn @click="close()" outlined color="grey darken-4">Отмена</v-btn>
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
      require: false
    },
    staffInfo: {
      type: Object
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    close() {
      this.$emit("onClose");
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

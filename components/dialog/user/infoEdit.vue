<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="600">
      <v-card class="dialog-info pa-6">
        <v-card-title class="px-0 pb-0 d-flex justify-center align-center">
          <p
            class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
          >
            thông tin người dùng
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
                  Tên người dùng
                </p>
                <v-text-field
                  v-model="userUpdateInfo.name"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-account"
                  :rules="nameRules"
                  :counter="20"
                  label="Tên người dùng"
                  outlined
                >
                </v-text-field>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Пол
                </p>
                <v-select
                  label="Пол"
                  v-model="userUpdateInfo.sex"
                  :items="sex_type"
                  :menu-props="{ bottom: true, offsetY: true }"
                  prepend-inner-icon="mdi-filter-outline"
                  append-icon="mdi-chevron-down"
                  outlined
                  dense
                ></v-select>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="my-3">
                <p class="mb-2">
                  Номер телефона
                </p>
                <v-text-field
                  v-model="userUpdateInfo.phoneNumber"
                  dense
                  :rules="phoneRule"
                  prepend-inner-icon="mdi-email"
                  label="Номер телефона"
                  type="number"
                  outlined
                  readonly
                >
                </v-text-field>
              </div>
              <div class="my-3">
                <p class="mb-2">
                  Эл.адрес
                </p>
                <v-text-field
                  v-model="userUpdateInfo.email"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-email"
                  label="Эл.адрес"
                  outlined
                  readonly
                >
                </v-text-field>
              </div>
            </v-col>
            <v-col cols="12" sm="6"></v-col>
          </v-row>
          <v-card-actions class="justify-end d-flex">
            <v-btn
              color="red darken-2"
              class="white--text"
              :disabled="!validateUserUpdateInfo"
              @click="submit()"
              >Lưu</v-btn
            >
            <v-btn @click="close()" outlined color="grey darken-4">Отмена</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const initialUserInfoData = {
  name: "",
  email: "",
  sex: "",
  phoneNumber: ""
};

export default {
  props: {
    dialog: {
      type: Boolean,
      require: false
    },
    userInfo: {
      type: Object
    }
  },
  data() {
    const { name, email, sex, phoneNumber } = initialUserInfoData;
    const userUpdateInfo = {
      name: this.userInfo.name || name,
      email: this.userInfo.email || email,
      sex: this.userInfo.sex || sex,
      phoneNumber: this.userInfo.phoneNumber || phoneNumber
    };
    return {
      validateUserUpdateInfo: true,
      userUpdateInfo,
      sex_type: [
        {
          value: "male",
          text: "Женский"
        },
        {
          value: "female",
          text: "Мужской"
        }
      ],
      nameRules: [
        v =>
          (v.length <= 20 && v.length >= 1) ||
          "Name must be less than 20 characters"
      ],
      phoneRule: [
        v => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v) || "wrong format"
      ]
    };
  },
  computed: {},
  methods: {
    close() {
      this.$emit("onClose");
    },
    submit() {
      this.$emit("onSubmit", {
        ...this.userUpdateInfo
      });
    }
  },
  watch: {
    "userUpdateInfo.phoneNumber"() {
      const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      const checkPhoneNumber = re.test(this.userUpdateInfo.phoneNumber);
      if (checkPhoneNumber) this.validateUserUpdateInfo = true;
      else this.validateUserUpdateInfo = false;
      //   console.log(checkPhoneNumber);
    },
    "userUpdateInfo.name"() {
      const userName = this.userUpdateInfo.name;
      if (userName.length <= 20 && userName.length >= 1)
        this.validateUserUpdateInfo = true;
      else this.validateUserUpdateInfo = false;
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

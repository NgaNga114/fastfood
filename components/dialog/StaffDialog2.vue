<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="800">
      <v-card class="dialog-info pa-6">
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-card-title class="px-0 pb-0 d-flex justify-center align-center">
            <p
              class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
            >
              {{ type }}
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
                  <!-- :value="staffInfo.name"
                    @change="onChange($event, 'name')" -->
                  <v-text-field
                    v-model="userEdit.name"
                    :rules="nameRules"
                    dense
                    hide-details="auto"
                    prepend-inner-icon="mdi-account"
                    outlined
                  >
                  </v-text-field>
                </div>
                <div class="my-3">
                  <p class="mb-2">
                    Эл.адрес
                  </p>
                  <!-- :value="staffInfo.email" -->
                  <v-text-field
                    v-model="userEdit.email"
                    readonly
                    dense
                    hide-details="auto"
                    prepend-inner-icon="mdi-account-circle"
                    outlined
                  >
                  </v-text-field>
                </div>
                <div class="my-3">
                  <p class="mb-2">
                    Номер телефона
                  </p>
                  <!-- :value="staffInfo.phoneNumber"
                    @change="onChange($event, 'phoneNumber')" -->
                  <v-text-field
                    v-model="userEdit.phoneNumber"
                    :rules="[checkValidatePhoneNumber]"
                    type="number"
                    dense
                    hide-details="auto"
                    prepend-inner-icon="mdi-phone"
                    outlined
                  >
                  </v-text-field>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="my-3">
                  <p class="mb-2">
                    Пол
                  </p>
                  <!-- :value="staffInfo.sex" @change="onChange($event, 'sex')" -->
                  <v-select
                    v-model="userEdit.sex"
                    :items="itemsSex"
                    outlined
                    name="input-10-1"
                    hide-details="auto"
                    dense
                  ></v-select>
                </div>
                <div class="my-3">
                  <p class="mb-2">
                    Статус
                  </p>
                  <!-- :value="staffInfo.status"
                    @change="onChange($event, 'status')" -->
                  <v-select
                    v-model="userEdit.status"
                    :items="itemStatus"
                    outlined
                    name="input-10-1"
                    hide-details="auto"
                    dense
                  ></v-select>
                </div>
                <div class="my-3">
                  <p class="mb-2">
                    Должность
                  </p>
                  <!-- :value="staffInfo.role" -->
                  <v-select
                    v-model="userEdit.role"
                    :items="itemsRole"
                    :readonly="staffInfo.status === listStatusUser.BUSY"
                    dense
                    hide-details="auto"
                    prepend-inner-icon="mdi-account-cowboy-hat"
                    outlined
                    @change="onChange($event, 'role')"
                  >
                  </v-select>
                </div>
              </v-col>
              <v-col cols="12" sm="6"></v-col>
            </v-row>
            <v-card-actions class="justify-end d-flex">
              <v-btn
                color="red darken-2"
                class="white--text"
                :disabled="!valid"
                @click="onSubmit()"
                >Сохранить</v-btn
              >
              <v-btn @click="close()" outlined color="grey darken-4">Отмена</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { UserPermissions, StaffStatus } from "../../types/user";
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
      valid: true,
      nameRules: [
        v => !!v || "Обязательное имя",
        v => v.length <= 15 || "Имя должно быть меньше 15 символов"
      ],
      dataOnChange: {},
      itemStatus: [
        {
          text: "свободно",
          value: "free"
        },
        {
          text: "занято",
          value: "busy"
        }
      ],
      itemsRole: [
        {
          text: "Персонал",
          value: "shipper"
        },
        {
          text: "Пользователь",
          value: "user"
        }
      ],
      itemsSex: [
        {
          text: "Женский",
          value: "female"
        },
        {
          text: "Мужской",
          value: "male"
        }
      ],
      show: false,
      userEdit: {}
    };
  },
  computed: {
    // statusUser() {
    //   return this.staffInfo.status === StaffStatus.FREE ? "Tự do" : "Bận";
    // },
    listStatusUser() {
      return StaffStatus;
    }
  },
  watch: {
    staffInfo() {
      if (this.staffInfo?.id) {
        this.userEdit = { ...this.staffInfo };
      }
    }
  },
  methods: {
    checkValidatePhoneNumber(value) {
      const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      const checkFormatPhoneNumber = re.test(String(value).toLowerCase());
      if (!checkFormatPhoneNumber) {
        return "Неверный формат";
      } else return true;
    },
    onChange(value, key) {
      this.dataOnChange[key] = value;
      console.log(this.dataOnChange);
    },
    onSubmit() {
      this.$refs.form.validate();
      setTimeout(() => {
        console.log('ok');
        this.$emit("onSubmitInfo", this.userEdit);
      });
    },
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

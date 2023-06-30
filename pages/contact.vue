<template>
  <div style="max-width: 1200px; margin: 0 auto;">
    <div class="my-5">
      <v-img :src="require('../assets/images/contact.png')"> </v-img>
    </div>
    <div>
      <v-row>
        <v-col cols="12" sm="5" md="3" class="pt-0">
          <v-card class="white--text container card-address py-8">
            <div class="mb-3">
              <div class="d-flex">
                <v-icon class="text-h5 white--text">mdi-map-marker</v-icon>
                <p class="mb-0 ml-2 font-weight-bold">
                  Адрес :
                </p>
              </div>
              <p class="mb-0 ml-1">
                № 90 Нгуен Туан, район Тхань Суан, город. Ханой
              </p>
            </div>
            <div class="mb-3">
              <div class="d-flex mb-1">
                <v-icon class="text-h5 white--text">mdi-phone</v-icon>
                <p class="mb-0 ml-2 font-weight-bold">
                  Телефон : :
                </p>
              </div>
              <p class="ml-1">(+84-28) 357066060</p>
              <p class="ml-1">(+84-28) 357066060</p>
            </div>
            <div class="mb-3">
              <div class="d-flex">
                <v-icon class="text-h5 white--text">mdi-email</v-icon>
                <p class="mb-0 ml-2 font-weight-bold">
                  Эл.адрес :
                </p>
              </div>
              <p class="mb-0 ml-1">infofastfood@gmail.com</p>
            </div>
          </v-card>
        </v-col>
        <v-col class="pt-0" cols="12" sm="7" md="9">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card class="container px-7 card-contact">
              <v-row>
                <v-col
                  class="d-flex align-center font-weight-bold"
                  cols="12"
                  sm="3"
                  md="2"
                >
                  <p class="mb-0">
                    Фамилия и имя
                  </p>
                </v-col>
                <v-col cols="12" sm="9" md="10">
                  <v-text-field
                    :readonly="userProfile ? true : false"
                    hide-details="auto"
                    dense
                    outlined
                    label="Фамилия и имя"
                    :rules="nameRules"
                    v-model="dataFeedback.name"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="d-flex align-center font-weight-bold"
                  cols="12"
                  sm="3"
                  md="2"
                >
                  <p class="mb-0">
                    Номер телефона
                  </p>
                </v-col>
                <v-col cols="12" sm="9" md="10">
                  <v-text-field
                    :readonly="userProfile ? true : false"
                    type="number"
                    hide-details="auto"
                    dense
                    outlined
                    label="Номер телефона"
                    :rules="[v => !!v || 'Требуется номер телефона']"
                    required
                    v-model="dataFeedback.phoneNumber"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="d-flex align-center font-weight-bold"
                  cols="12"
                  sm="3"
                  md="2"
                >
                  <p class="mb-0">
                    Эл.адрес
                  </p>
                </v-col>
                <v-col cols="12" sm="9" md="10">
                  <v-text-field
                    :readonly="userProfile ? true : false"
                    type="email"
                    hide-details="auto"
                    dense
                    outlined
                    label="Эл.адрес"
                    :rules="
                      dataFeedback.email
                        ? [
                            v =>
                              /.+@.+\..+/.test(v) || 'Введите правильный формат электронной почты'
                          ]
                        : ''
                    "
                    v-model="dataFeedback.email"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="d-flex align-center font-weight-bold"
                  cols="12"
                  sm="3"
                  md="2"
                >
                  <p class="mb-0">
                    Адрес
                  </p>
                </v-col>
                <v-col cols="12" sm="9" md="10">
                  <v-text-field
                    hide-details="auto"
                    dense
                    outlined
                    label="Адрес"
                    v-model="dataFeedback.address"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex font-weight-bold" cols="12" sm="3" md="2">
                  <p class="mb-0">
                    Сообщение
                  </p>
                </v-col>
                <v-col cols="12" sm="9" md="10">
                  <v-textarea
                    hide-details="auto"
                    dense
                    outlined
                    label="Сообщение"
                    v-model="dataFeedback.message"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
              <div class="d-flex justify-center align-center my-4">
                <v-btn
                  height="35"
                  class="white--text px-10 btn-submit"
                  @click="validate()"
                  :disabled="!dataFeedback.message"
                >
                  ОТПРАВИТЬ СЕЙЧАС
                </v-btn>
              </div>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </div>
    <dialog-contact
      :dialog="cancelContactDialog"
      :title="titleCancelContactDialog"
      @onClose="onCloseDialogCancelContact"
      @onDialog="sendFeedBack"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DialogContact from "../components/dialog/DeleteDialog";
import moment from "moment";

export default {
  components: {
    DialogContact
  },
  data() {
    return {
      cancelContactDialog: false,
      titleCancelContactDialog: {
        title: "Подтвердите свои комментарии",
        subTitle: "Вы уверены, что хотите отправить это пожертвование?"
      },
      dataFeedback: {
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        typeUser: "",
        create_at: moment().format("MMMM Do YYYY, h:mm:ss a"),
        message: ""
      },
      valid: true,
      nameRules: [
        v => !!v || "Обязательное имя",
        v => (v && v.length <= 20) || "Имя до 20 символов"
      ]
    };
  },
  methods: {
    ...mapActions("user", ["setFeedBack", "getUserProfile"]),
    ...mapActions(["setSnackBar"]),
    validate() {
      if (this.dataFeedback.message.length < 10) {
        this.setSnackBar({
          show: true,
          text: "Пожалуйста, добавьте еще несколько комментариев!!!",
          color: "error"
        });
      } else if (this.$refs.form.validate()) {
        this.cancelContactDialog = true;
      }
    },
    async sendFeedBack() {
      this.cancelContactDialog = false;
      const result = await this.setFeedBack(this.dataFeedback);
      if (result) {
        this.setSnackBar({
          show: true,
          text: "Спасибо за ваши комментарии!!!",
          color: "success"
        });
        if (!this.userProfile) {
          this.dataFeedback = {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
            message: ""
          };
        } else {
          this.dataFeedback.address = "";
          this.dataFeedback.message = "";
        }
      } else {
        this.setSnackBar({
          show: true,
          text: "Вклад не выполнен! Произошла ошибка. Повторите попытку позже!!!",
          color: "error"
        });
      }
    },
    onCloseDialogCancelContact() {
      this.cancelContactDialog = false;
    }
  },
  computed: {
    ...mapState("user", ["userProfile"])
  },
  created() {
    this.getUserProfile();
    if (this.userProfile) {
      this.dataFeedback.name = this.userProfile.name;
      this.dataFeedback.email = this.userProfile.email;
      this.dataFeedback.phoneNumber = this.userProfile.phoneNumber;
      this.dataFeedback.typeUser = "user";
    } else {
      this.dataFeedback.typeUser = "anonymous";
    }
  }
};
</script>

<style scoped>
.card-address {
  background-color: #f0293c !important;
  border-radius: 8px;
}
.card-contact {
  border-radius: 8px;
}
.btn-submit {
  background-color: #f0293c !important;
}
</style>

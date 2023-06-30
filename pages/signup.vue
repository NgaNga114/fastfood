<template>
  <div>
    <v-card width="500" class="my-4 mx-auto">
      <div class="text-center">
        <v-card-text class="mt-8">
          <h1 class="text-center headline red--text">
            Добро пожаловать в FAST FOOD
          </h1>
          <h1 class="font-weight-bold text-center headline red--text">
            СОЗДАЙТЕ АККАУНТ
          </h1>
          <v-form class="my-8 px-7" v-model="valid" ref="form" lazy-validation>
            <v-card-subtitle class="pb-2 pt-0 pl-0 d-flex subtitle-1">
              Электронная почта <span class="red--text ml-1">*</span>
            </v-card-subtitle>
            <v-text-field
              @keyup.enter="signUp()"
              required
              outlined
              prepend-inner-icon="mdi-email"
              v-model="userProfile.email"
              :rules="emailRules"
              label="Эл.адрес"
            ></v-text-field>
            <v-card-subtitle class="pb-2 pt-0 pl-0 d-flex subtitle-1">
              Пароль <span class="red--text ml-1">*</span>
            </v-card-subtitle>
            <v-text-field
              @keyup.enter="signUp()"
              outlined
              prepend-inner-icon="mdi-lock"
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[passwordRules.required, passwordRules.min]"
              :type="show ? 'text' : 'password'"
              name="input-10-1"
              label="Пароль"
              hint="Минимум 6 символов"
              counter
              @click:append="show = !show"
            ></v-text-field>
            <v-card-subtitle class="pb-2 pt-0 pl-0 d-flex subtitle-1">
              ФИО <span class="red--text ml-1">*</span>
            </v-card-subtitle>
            <v-text-field
              @keyup.enter="signUp()"
              outlined
              prepend-inner-icon="mdi-email"
              v-model="userProfile.name"
              label="Имя"
              :rules="nameRules"
              :counter="15"
              required
            ></v-text-field>
            <v-card-subtitle class="pb-2 pt-0 pl-0 d-flex subtitle-1">
              Номер телефона <span class="red--text ml-1">*</span>
            </v-card-subtitle>
            <!-- <p>
              0357 065 432
            </p> -->
            <div :class="{ 'd-none': showBoxOtp }">
              <v-text-field
                v-model="userProfile.phoneNumber"
                :rules="[checkValidatePhoneNumber]"
                prepend-inner-icon="mdi-email"
                label="Номер телефона"
                type="number"
                outlined
              ></v-text-field>
              <v-btn
                :class="{ 'd-none': !validatePhoneBtn || validatedPhoneNumber }"
                style="background-color: #bcad72 !important; color: white;"
                @click="verifyPhoneNumber()"
                >Подтвердить номер телефона</v-btn
              >
              <div
                id="recaptcha-container"
                class="mt-7"
                :class="{ 'd-none': validatedPhoneNumber }"
              ></div>
            </div>
            <div :class="{ 'd-none': !showBoxOtp }">
              <v-form v-model="validPhone" ref="formValidPhone" lazy-validation>
                <v-text-field
                  v-model="otp"
                  prepend-inner-icon="mdi-email"
                  label="Введите OTP"
                  type="number"
                  outlined
                  :rules="otpRule"
                ></v-text-field>
              </v-form>
              <v-btn
                color="red darken-2 white--text"
                @click="closeVerifyCode()"
              >
                Отмена</v-btn
              >
              <v-btn
                :disabled="!validPhone"
                style="background-color: #bcad72 !important; color: white;"
                @click="verifyCode()"
              >
                Подтверждение проверочного кода</v-btn
              >
            </div>

            <div class="mt-7">
              <v-radio-group
                hide-details="auto"
                v-model="userProfile.sex"
                row
                class="mt-0"
              >
                <template v-slot:label>
                  <div>Пол:</div>
                </template>
                <v-radio label="Мужской" value="male"></v-radio>
                <v-radio label="Женский" value="female"></v-radio>
              </v-radio-group>
            </div>
          </v-form>
          <v-card-actions class="pt-0 justify-center">
            <v-btn
              :disabled="!valid"
              @click="onSignUp()"
              color="red darken-2 white--text"
              class="px-15"
            >
              РЕГИСТР
              <v-progress-circular
                v-if="isLoggedIn"
                class="ml-2"
                size="20"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-btn>
          </v-card-actions>
          <div>
            <v-card-subtitle class="pt-0"
              >Вы уже зарегистрированы? <a @click="signIn()">Войти</a>
            </v-card-subtitle>
          </div>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import firebase from "firebase";

export default {
  data() {
    return {
      validatePhoneBtn: false,
      responseCaptcha: "",
      validatedPhoneNumber: false,
      showBoxOtp: false,
      show: false,
      valid: true,
      validPhone: true,
      password: "",
      otp: "",
      userProfile: {
        name: "",
        email: "",
        sex: "",
        phoneNumber: ""
      },
      appVerifier: "",
      passwordRules: {
        required: value => !!value || "Необходим пароль",
        min: v => v.length >= 6 || "Пароль должен быть длиннее 6 символов",
        emailMatch: () => `Электронная почта и пароль, которые вы ввели, не совпадают`
      },
      emailRules: [
        v => !!v || "Требуется адрес электронной почты",
        v => /.+@.+\..+/.test(v) || "Email имеет неверный формат"
      ],
      nameRules: [
        v => !!v || "Обязательное имя",
        v => v.length <= 15 || "Имя должно быть меньше 15 символов"
      ],
      phoneRule: [
        v => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v) || "Неверный формат"
      ],
      otpRule: [v => v.length === 6 || "OTP-код состоит из 6 цифр."]
    };
  },
  methods: {
    ...mapActions("user", ["signUp"]),
    checkValidatePhoneNumber(value) {
      const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      const checkFormatPhoneNumber = re.test(String(value).toLowerCase());
      if (!checkFormatPhoneNumber) {
        return "Неверный формат";
      } else return true;
    },
    signIn() {
      this.$router.push("/signin");
    },
    onSignUp() {
      // console.log("signUp");
      this.$refs.form.validate();
      setTimeout(() => {
        if (this.valid === true && this.validatedPhoneNumber === true) {
          this.signUp({
            userProfile: this.userProfile,
            password: this.password
          });
          // console.log(this.userProfile, this.password);
        }
        if (this.valid === true && this.validatedPhoneNumber === false) {
          alert("Пожалуйста, подтвердите свой номер телефона");
        }
      });
    },
    verifyCode() {
      this.$refs.formValidPhone.validate();
      setTimeout(() => {
        if (this.validPhone === true) {
          const code = this.otp;
          //
          window.confirmationResult
            .confirm(code)
            .then(result => {
              firebase
                .auth()
                .signOut()
                .then(() => {
                  // console.log("dang xuat thanh cong");
                  result.user
                    .delete()
                    .then(() => {
                      // console.log("success");
                      // User signed in successfully.
                      //route to set password !
                      this.showBoxOtp = false;
                      this.validatedPhoneNumber = true;
                      this.$store.commit("SET_SNACKBAR", {
                        show: true,
                        text: "Аутентификация прошла успешно",
                        color: "success"
                      });
                    })
                    .catch(error => {
                      console.log(error);
                    });
                });
            })
            .catch(error => {
              this.$store.commit("SET_SNACKBAR", {
                show: true,
                text: "Неверный код подтверждения, попробуйте еще раз",
                color: "error"
              });
              // User couldn't sign in (bad verification code?)
              // ...
            });
        }
      });
    },
    closeVerifyCode() {
      this.showBoxOtp = false;
      this.userProfile.phoneNumber = "";
    },
    verifyPhoneNumber() {
      console.log("verifyPhoneNumber");
      let countryCode = "+84"; //india
      let phoneNumber = countryCode + this.userProfile.phoneNumber;
      //
      let appVerifier = this.appVerifier;
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(confirmationResult => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          console.log("confirmationResult");
          if (this.responseCaptcha) {
            this.onSignInSubmit(true);
            this.$store.commit("SET_SNACKBAR", {
              show: true,
              text: "Код подтверждения отправлен, пожалуйста, проверьте свой телефон",
              color: "success"
            });
            this.responseCaptcha = "";
          }
        })
        .catch(error => {
          console.log("error");
          // Error; SMS not sent
          // ...
          if (this.responseCaptcha) {
            this.onSignInSubmit(false);
            this.$store.commit("SET_SNACKBAR", {
              show: true,
              text: "Пробовали слишком много раз, повторите попытку через 24.ч",
              color: "error"
            });
            this.responseCaptcha = "";
          }
          console.log("error, sms not sent");
          // alert("Error ! SMS not sent");
        });
    },
    onSignInSubmit(value) {
      this.showBoxOtp = value;
    },
    initReCaptcha() {
      console.log("initRecaptcha");
      let vm = this;
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: response => {
            console.log(response);
            this.responseCaptcha = response;
          },
          "expired-callback": function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          }
        }
      );
      //
      this.appVerifier = window.recaptchaVerifier;
    }
  },
  watch: {
    "userProfile.phoneNumber"() {
      const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      const checkFormatPhoneNumber = re.test(
        String(this.userProfile.phoneNumber).toLowerCase()
      );
      if (checkFormatPhoneNumber) {
        this.validatePhoneBtn = true;
      } else {
        this.validatePhoneBtn = false;
      }
      this.validatedPhoneNumber = false;
    }
  },
  computed: {
    ...mapGetters("user", ["isLoggedIn"])
  },
  mounted() {
    this.initReCaptcha();
  }
};
</script>

<style scoped>
a {
  color: #bcad72 !important;
}
</style>

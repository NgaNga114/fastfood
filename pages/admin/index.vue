<template>
  <div class="box-admin-login d-flex justify-center align-center">
    <v-card width="500">
      <v-card-title class="d-none d-sm-flex justify-center align-center">
        <p class="mb-0">Добро пожаловать в AdminFastFood</p>
      </v-card-title>
      <v-card-title class="d-flex d-sm-none d-flex justify-center align-center">
        <p class="mb-0 text-h5 font-weight-bold">AdminFastFood</p>
      </v-card-title>
      <v-card-subtitle
        class="text-h6 red--text text--darken-1 d-flex justify-center align-center"
      >
        <p class="mb-0">Войти сейчас !</p>
      </v-card-subtitle>
      <v-form class="my-8 px-7" v-model="valid">
        <v-card-subtitle class="pb-2 pt-0 pl-0 d-flex subtitle-1">
          Номер телефона или электронная почта *
        </v-card-subtitle>
        <v-text-field
          @keyup.enter="onSignIn()"
          class="mb-3"
          outlined
          hide-details="auto"
          prepend-inner-icon="mdi-email"
          :rules="emailRules"
          required
          v-model="email"
          label="Email"
        ></v-text-field>
        <v-card-subtitle class="pb-2 pt-0 pl-0 d-flex subtitle-1">
          Пароль *
        </v-card-subtitle>
        <v-text-field
          @keyup.enter="onSignIn()"
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
        <v-card-subtitle class="pb-2 pt-0 pl-0 subtitle-1 float-right">
          <a @click="dialog_reset = !dialog_reset">Quên mật khẩu ?</a>
        </v-card-subtitle>
      </v-form>
      <v-card-actions class="pt-0 my-10 card-action">
        <v-btn
          :disabled="!valid"
          @click="onSignIn()"
          color="red darken-2 white--text"
          class="px-15"
        >
          Войти
          <v-progress-circular
            v-if="isLoggedIn"
            class="ml-2"
            size="20"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog_reset" max-width="400">
      <v-card>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="teal"
        ></v-progress-linear>
        <v-card-title>Please enter email</v-card-title>
        <v-overlay absolute :value="loading" opacity="0.1"> </v-overlay>

        <v-text-field
          :disabled="loading"
          v-model="email_reset"
          class="px-5"
          label="Email"
          prepend-icon="mdi-email"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="dialog_reset = !dialog_reset"
          >
            Cancel
          </v-btn>

          <v-btn color="red darken-1" text @click="resetPass()">
            Reset Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  layout: "adminDefault",
  data() {
    return {
      show: false,
      valid: false,
      email: "",
      password: "",
      loggedIn: false,
      dialog_reset: false,
      loading: false,
      email_reset: "",
      passwordRules: {
        required: value => !!value || "Password is Required.",
        min: v => v.length >= 6 || "Min 6 characters",
        emailMatch: () => `The email and password you entered don't match`
      },
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  computed: {
    ...mapGetters("user", ["isLoggedIn"]),
    ...mapGetters("products", ["loader"]),
    isLoader() {
      return this.loader;
    }
  },
  methods: {
    ...mapActions("user", ["adminSignIn"]),
    ...mapActions("products", ["resetPassword"]),
    signUp() {
      this.$router.push("/signup");
    },
    onSignIn() {
      this.checkCurrentUser = true;
      this.adminSignIn({
        email: this.email,
        password: this.password
      });
    },
    resetPass() {
      // validate email
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // console.log(re.test(String(this.email_reset).toLowerCase()));
      let check = re.test(String(this.email_reset).toLowerCase());
      if (check) {
        this.resetPassword(this.email_reset);
        this.email_reset = "";
        this.loading = true;
      } else {
        (this.regis_email = ""), alert("Неправильный адрес электронной почты");
      }
    }
  },
  watch: {
    isLoader() {
      if (!this.loader) {
        this.loading = false;
        this.dialog_reset = false;
      }
    }
  }
};
</script>

<style scoped>
.box-admin-login {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.card-action {
  clear: right !important;
  justify-content: center;
}
a {
  color: #bcad72 !important;
}
</style>

<template>
  <div>
    <v-card width="500" class="my-4 mx-auto">
      <div class="text-center">
        <v-card-text class="mt-8">
          <h1 class="text-center headline red--text">
            Добро пожаловать в FAST FOOD
          </h1>
          <h1 class="font-weight-bold text-center headline red--text">
            Welcome to FAST FOOD
          </h1>
          <v-form class="my-8 px-7" v-model="valid" ref="form" lazy-validation>
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
              label="Эл.адрес"
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
              <a @click="dialog_reset = !dialog_reset">Забыли пароль ?</a>
            </v-card-subtitle>
          </v-form>
          <v-card-actions class="pt-0 card-action">
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
          <div>
            <v-card-subtitle class="pt-0"
              >Новый клиент? <a @click="signUp()">Регистрация</a>
            </v-card-subtitle>
          </div>
        </v-card-text>
      </div>
    </v-card>
    <v-dialog v-model="dialog_reset" max-width="400">
      <v-card>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="teal"
        ></v-progress-linear>
        <v-card-title>Введите почту</v-card-title>
        <v-overlay absolute :value="loading" opacity="0.1"> </v-overlay>

        <v-text-field
          :disabled="loading"
          v-model="email_reset"
          class="px-5"
          label="Эл.адрес"
          prepend-icon="mdi-email"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="dialog_reset = !dialog_reset"
          >
            Отмена
          </v-btn>

          <v-btn color="red darken-1" text @click="resetPass()">
            Забыли пароль
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      show: false,
      valid: true,
      email: "",
      password: "",
      loggedIn: false,
      dialog_reset: false,
      loading: false,
      email_reset: "",
      passwordRules: {
        required: value => !!value || "Необходим пароль",
        min: v => v.length >= 6 || "Минимум 6 символов",
        emailMatch: () => `Введенный адрес электронной почты и пароль не совпадают`
      },
      emailRules: [
        v => !!v || "Электронная почта обязательна",
        v => /.+@.+\..+/.test(v) || "Электронная почта должна быть действительной"
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
    ...mapActions("user", ["signIn"]),
    ...mapActions("products", ["resetPassword"]),
    signUp() {
      this.$router.push("/signup");
    },
    onSignIn() {
      this.$refs.form.validate();
      setTimeout(() => {
        if (this.valid === true) {
          this.signIn({
            email: this.email,
            password: this.password
          });
        }
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
        (this.regis_email = ""), alert("wrong email");
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
.card-action {
  clear: right !important;
  justify-content: center;
}
a {
  color: #bcad72 !important;
}
</style>

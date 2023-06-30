<template>
  <div>
    <v-card class="py-10 bg-footer" flat>
      <v-row
        class="container my-0 mx-auto"
        style="max-width: 1200px; magin: 0 auto;"
      >
        <v-col class="pl-0" cols="12" sm="4">
          <div class="logo-footer">
            <p class="gray--text text-subtitle-2">@FASTFOOD</p>
            <v-img
              height="60px"
              width="75px"
              :src="require('../assets/images/LOGO.png')"
            > 
            </v-img>
          </div>
        </v-col>
        <v-col class="pl-0" cols="12" sm="4">
          <p class="text-body-1 font-weight-bold">
            Контакты FASTFOOD:
          </p>
          <div>
            <p class="mb-0">
              Горячая линия:
              <a class="text-sm-subtitle-3 text-caption">1234568686</a>
            </p>
            <p class="mb-0">
              Эл.адрес:
              <a class="text-sm-subtitle-3 text-caption"
                >supportfastfood@gmail.com</a
              >
            </p>
            <p class="mb-0">
              Адрес:
              <a class="text-sm-subtitle-3 text-caption"
                >126 Vinh Hung, Hoang Mai, Ha Noi</a
              >
            </p>
          </div>
        </v-col>
        <v-col cols="12" sm="4" class="pl-0 d-block">
          <div class="d-inline-flex float-sm-right">
            <v-img
              height="50px"
              width="65px"
              :src="require('../assets/images/LOGO.png')"
            >
            </v-img>
            <div class="ml-5">
              <h3 class="red--text">
                shopping with FASTFOOD
              </h3>
              <span>
                Скачать приложение
              </span>
            </div>
          </div>
          <div class="py-3 d-inline-flex float-sm-right">
            <v-img
              class="mr-3 img-app"
              height="30px"
              width="95px"
              :src="require('../assets/images/google-play.png')"
            >
            </v-img>
            <v-img
              class=" img-app"
              height="30px"
              width="95px"
              :src="require('../assets/images/app-store.png')"
            >
            </v-img>
          </div>
        </v-col>
      </v-row>
      <div class="mr-3">
        <v-row class="box-info d-inline-flex d-sm-none">
          <v-col cols="6" class="py-0">
            <v-row>
              <v-col
                style="color: #D1C18E"
                cols="12"
                class="text-caption font-weight-medium d-flex justify-center align-center"
              >
                <p @click="$router.push('/')" class="mb-0">
                  ГЛАВНАЯ СТРАНИЦА
                </p>
              </v-col>
              <v-col
                cols="12"
                class="grey--text text--darken-2 text-caption font-weight-medium d-flex justify-center align-center"
              >
                <p @click="$router.push('/contact')" class="mb-0">
                  ОБСЛУЖИВАНИЕ КЛИЕНТОВ
                </p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-row>
              <v-col
                cols="12"
                class="grey--text text--darken-2 text-caption font-weight-medium d-flex justify-center align-center"
              >
                <p @click="$router.push('/')" class="mb-0">
                  ИНФОРМАЦИЯ О FASTFOOD
                </p>
              </v-col>
              <v-col
                cols="12"
                class="grey--text text--darken-2 text-caption font-weight-medium d-flex justify-center align-center"
              >
                <p @click="$router.push('/checkorder')" class="mb-0">
                  ЗАКАЗ
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <div class="py-0 box-info d-none d-sm-flex d-lg-none">
      <div
        class="box-info-item mx-md-auto py-0 align-center d-flex justify-space-between"
      >
        <v-btn to="/" text class="text-caption btn-signup">ГЛАВНАЯ СТРАНИЦА</v-btn>
        <v-btn
          to="/checkorder"
          text
          class="text-caption grey--text text--darken-1"
          >ЗАКАЗ</v-btn
        >
        <v-btn to="/contact" text class="text-caption grey--text text--darken-1"
          >ИНФОРМАЦИЯ О FASTFOOD</v-btn
        >
        <v-btn to="/contact" text class="text-caption grey--text text--darken-1"
          >ОБСЛУЖИВАНИЕ КЛИЕНТОВ</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.color-yellow {
  color: #f2e92a;
}
/* .logo-footer {
  justify-content: center;
  display: grid;
} */
.img-app {
  border-radius: 5px;
}

a {
  color: #bcad72 !important;
}
.box-info-item {
  width: 60%;
}
.box-info {
  background-color: #f2f3f7;
}
.bg-footer {
  background-color: #fbfbfb;
}
</style>

<template>
  <v-app class="adminDefault">
    <v-app-bar class="bar-admin" :clipped-left="clipped" fixed app>
      <v-toolbar-title class="title-bar d-flex align-center">
        <div>
          <v-img
            height="70"
            width="70"
            contain
            class="logo-img"
            :src="require('../assets/images/LOGO.png')"
            alt=""
          />
        </div>
        <p
          class="d-none d-sm-inline ml-4 font-weight-bold mb-0 text-h5 red--text"
        >
          AdminFastFood
        </p>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <div
        class="d-flex justify-center align-center text-center content-login-admin"
      >
        <nuxt />
      </div>
    </v-main>
    <v-footer class="footer-admin" :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      miniVariant: false,
      right: true,
      rightDrawer: false
    };
  }
};
</script>

<style>
.adminDefault {
  background-color: #e9eaec !important;
}
.bar-admin {
  background-color: #fce59f !important;
}
.v-data-table__wrapper tbody tr {
  height: 60px;
}
.table-create .v-data-table-header {
  background-color: #ede8e8;
}
.footer-admin {
  background-color: #fce59f !important;
}
.content-login-admin {
  height: 100%;
}
</style>

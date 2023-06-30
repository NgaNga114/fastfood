<template>
  <div>
    <v-card>
      <v-card-title class="box-card-title d-flex justify-space-between">
        <div class="d-block d-md-flex">
          <div class="title-detail-report pr-3">
            <p class="mb-0 red--text">
              Комментарии
              <a class="ml-2 d-inline d-sm-none">
                <v-icon class="text-h5">
                  mdi-printer
                </v-icon>
              </a>
            </p>
          </div>
          <div class="ml-0 ml-md-3 d-flex">
            <p class="text-body-2 text-sm-h6 mb-0 grey--text text--darken-2">
              С:
              <a
                class="text-caption text-sm-h6 yellow--text text--darken-3 text-decoration-underline"
                >05/4/2023</a
              >
            </p>
            <p
              class="text-body-2 text-sm-h6 mb-0 ml-3 grey--text text--darken-2"
            >
              До:
              <a
                class="text-caption text-sm-h6 yellow--text text--darken-3 text-decoration-underline"
                >01/6/2023</a
              >
            </p>
          </div>
        </div>
        <div>
          <a class="d-none d-sm-flex">
            <v-icon class="text-h4">
              mdi-printer
            </v-icon>
          </a>
        </div>
      </v-card-title>
      <div class="px-5">
        <v-row>
          <v-col cols="12" sm="10" md="6">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  class="grey lighten-3"
                  dense
                  hide-details="auto"
                  outlined
                  v-model="search"
                  label="Поиск заказа"
                  append-icon="mdi-magnify"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        loading-text="Order loading..."
        :search="search"
        :headers="headers"
        :items="dataFeedBack"
        class="elevation-1 rmr-table-custom-sort"
        :custom-filter="customFeedback"
      >
        <template v-slot:[`item.id`]="{ item }">
          <v-chip
            @click="copyToClipBoard(item.id)"
            class="personcreate red--text text--darken-3"
          >
            <v-icon class="mr-1">mdi-account</v-icon>
            {{ item.id.slice(0, 8) }}...
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  layout: "adminDefault",
  data() {
    return {
      dataFeedBack: [],
      headers: [
        { text: "№", value: "stt" },
        { text: "ID", value: "id" },
        { text: "Имя пользователя", value: "name" },
        { text: "Номер телефона", value: "phoneNumber" },
        { text: "Идентификация", value: "typeUser" },
        { text: "Электронная почта", value: "email" },
        { text: "Сообщение", value: "message" },
        { text: "Дата", value: "create_at" }
      ],
      search: ""
    };
  },
  watch: {
    "$route.query.id": {
      handler() {
        this.search = this.$route.query.id || "";
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions("user", ["getFeedBack"]),
    ...mapActions(["setSnackBar"]),
    customFeedback(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        item.id.toString().indexOf(search) !== -1
      );
    },
    copyToClipBoard(textToCopy) {
      try {
        navigator.clipboard.writeText(textToCopy);
        this.setSnackBar({
          show: true,
          text: "Скопировано",
          color: "success"
        });
      } catch (error) {
        this.setSnackBar({
          show: true,
          text: "Ошибка копирования. Повторите попытку позже.",
          color: "error"
        });
      }
    }
  },
  async created() {
    const dataFeedBack = await this.getFeedBack();
    this.dataFeedBack = dataFeedBack.map((item, index) => {
      const { id, data } = item;
      return { stt: index + 1, id, ...data };
    });
  }
};
</script>

<style scoped lang="scss">
.title-detail-report {
  border-right: 2px solid grey;
}

.box-card-title {
  border-bottom: 2px solid grey;
}
.personcreate {
  border: 2px solid grey;
  background-color: #ffffff !important;
}
</style>

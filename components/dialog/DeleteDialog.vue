<template>
  <div>
    <v-dialog persistent v-model="dialog" width="400">
      <v-card>
        <v-card-title
          class="d-flex justify-center white--text"
          :class="[!color ? 'red darken-4' : color]"
        >
          {{ title.title }}
        </v-card-title>
        <div class="pa-5 d-flex justify-center">
          <p class="mb-0">{{ title.subTitle }}</p>
        </div>
        <v-card-actions class="py-3 d-flex justify-center">
          <v-btn @click="close()" class="mr-1 grey darken-1 white--text"
            >Вернуть</v-btn
          >
          <v-btn
            class="pl-1 white--text"
            :class="[!color ? 'red darken-4' : color]"
            @click="deleteItem()"
            >Согласны</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    title: {
      type: Object,
      required: true
    },
    color: {
      type: String
    },
    idDelete: {
      type: String | Number,
      required: false
    },
  },
  methods: {
    close() {
      this.$emit("onClose");
    },
    deleteItem() {
      this.$emit("onDialog", this.idDelete);
    }
  }
};
</script>

<style scoped></style>

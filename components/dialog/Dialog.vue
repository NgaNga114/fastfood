<template>
  <div>
    <v-dialog persistent v-model="dialog.visible" width="500">
      <v-card>
        <v-card-title class="d-flex justify-center red darken-2 white--text">
          {{ dialog.header }}
        </v-card-title>
        <div class="pa-5 d-flex justify-center">
          <p>{{ dialog.text }}</p>
        </div>
        <v-card-actions class="py-3 d-flex justify-center">
          <v-btn @click="$router.push(dialog.link)" class="red white--text darken-2">
            {{ dialog.actionText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      require: true
    }
  }
};
</script>

<style scoped></style>

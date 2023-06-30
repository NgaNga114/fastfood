<template>
  <div id="app">
    <v-card class="mx-auto card-short" max-width="370">
      <v-list-item class="pr-0 pl-2" three-line>
        <v-list-item-content class="py-0">
          <div class="overline mb-0 d-flex justify-space-between">
            <div>
              <p class="red--text mb-0 d-inline-block">
                [ 20% ]
              </p>
              <span class="gray--text">Жарен. курочка 10шт</span>
            </div>
            <v-icon class="red--text text-body-1 mr-2">mdi-heart</v-icon>
          </div>
          <v-list-item-subtitle>
            <div>
              <div class=" red--text subtitle-1">
                299 ₽
              </div>
              <div class="d-flex justify-space-between">
                <p
                  class="mb-0 d-inline-block gray--text subtitle-1 text-decoration-line-through"
                >
                  399 ₽
                </p>
                <v-rating
                  class="mr-2 justify-center d-flex align-center"
                  :value="rate"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>
              </div>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-img
          class="col-4 mr-1"
          :src="require('../assets/images/combo.jpg')"
        ></v-img>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rate: 4
    };
  }
};
</script>

<style scoped>
.card-short {
  border-radius: 7px;
}
</style>

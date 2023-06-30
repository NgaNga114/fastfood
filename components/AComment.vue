<template>
  <div class="box-a-comment">
    <v-card v-if="rate" flat class="mx-auto card-acomment" max-width="500">
      <v-list-item three-line>
        <v-list-item-avatar size="60">
          <v-img :src="rate.user.avatarUrl"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="justify-space-between">
          <div class="overline">
            <span class="gray--text">{{ rate.user.name }}</span>
            <div class="d-block d-sm-flex mt-0 mt-sm-n3">
              <v-rating
                :value="rate.rate"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>
              <small class="grey--text ml-0 ml-sm-2">{{
                convertTime(rate.date)
              }}</small>
            </div>
            <div
              class="text-subtitle-2 text-lowercase grey--text text--darken-2"
            >
              {{ rate.comment }}
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <div v-if="isShowEdit" class="btn-edit-comment">
      <a v-if="!isEditComment" @click="editComment()">
        Исправить
      </a>
      <a v-else @click="closeEditComment()">
        Закрыть
      </a>
    </div>
  </div>
</template>

<script>
import { timeDifference } from "~/utils";
export default {
  props: ["rate", "isEditComment", "isShowEdit"],
  data() {
    return {};
  },
  methods: {
    convertTime(date) {
      return timeDifference(new Date(), new Date(date));
    },
    editComment() {
      this.$emit("onEditComment", this.rate.id);
    },
    closeEditComment() {
      this.$emit("onCloseEditComment");
    }
  }
};
</script>

<style scoped>
.card-acomment {
  display: table-cell;
}
.box-a-comment {
  position: relative;
}
.btn-edit-comment {
  position: absolute;
  right: 15px;
  top: 17px;
}
.btn-edit-comment a {
  color: #bcad72;
}
</style>

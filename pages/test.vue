<template>
  <div class="card vue-avatar-cropper-demo text-center">
    <div class="card-body">
      <img :src="user.avatar" class="card-img avatar" />
      <div class="card-img-overlay">
        <button class="btn btn-primary btn-sm" id="pick-avatar">
          Select an new image
        </button>
      </div>
      <h5 class="card-title mb-0">{{ user.nickname }}</h5>
      <div class="text-muted">{{ user.username }}</div>
    </div>
    <div class="card-footer text-muted" v-html="message"></div>
    <avatar-cropper
      @uploading="handleUploading"
      @uploaded="handleUploaded"
      @completed="handleCompleted"
      @error="handlerError"
      trigger="#pick-avatar"
      :upload-handler="uploadHandler()"
    />
  </div>
</template>

<script>
import AvatarCropper from "vue-avatar-cropper";

export default {
  components: { AvatarCropper },
  data() {
    return {
      message: "ready",
      user: {
        id: 1,
        nickname: "cac",
        username: "overtrue",
        avatar:
          "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.0-9/147057032_1686533111528765_7170420523207827846_o.jpg?_nc_cat=102&ccb=1-3&_nc_sid=8bfeb9&_nc_ohc=csW-wU0agg4AX9vBOCD&_nc_ht=scontent.fhan5-2.fna&oh=7f96c91b40ee5b421935d4dc5ed3622c&oe=606991F1"
      }
    };
  },
  methods: {
    uploadHandler(response) {
      console.log(response);
    },
    handleUploading(form, xhr) {
      console.log(form);
      console.log(xhr);
      this.message = "uploading...";
    },
    handleUploaded(response) {
      console.log("handle uploaded");
      if (response.status == "success") {
        this.user.avatar = response.url;
        console.log(response.url);
        // Maybe you need call vuex action to
        // update user avatar, for example:
        // this.$dispatch('updateUser', {avatar: response.url})
        this.message = "user avatar updated.";
      }
    },
    handleCompleted(response, form, xhr) {
      console.log(response);
      this.message = "upload completed.";
    },
    handlerError(message, type, xhr) {
      this.message = "Oops! Something went wrong...";
    }
  }
};
</script>

<style>
.vue-avatar-cropper-demo {
  max-width: 18em;
  margin: 0 auto;
}
.avatar {
  width: 160px;
  border-radius: 6px;
  display: block;
  margin: 20px auto;
}
.card-img-overlay {
  display: none;
  transition: all 0.5s;
}
.card-img-overlay button {
  margin-top: 20vh;
}
.card:hover .card-img-overlay {
  display: block;
}
</style>

<template>
  <div id="app">
    <editor
      :init="{
        height: 500,
        selector: 'textarea',
        placeholder: 'Type here...',
        plugins: [
          'advlist autolink link image lists charmap print preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
          'table emoticons template help'
        ],
        toolbar:
          'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image | print preview media fullpage | ' +
          'forecolor backcolor emoticons | help',
        menubar: 'favs file edit view insert format tools table help'
      }"
      v-model="test"
      class="editor-tiny"
    />
    <div>
      <div v-html="test"></div>
    </div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "app",
  components: {
    editor: Editor
  },
  data() {
    return {
      test: ""
    };
  },
  methods: {
    onChange(value) {
      console.log(value);
    }
  }
};
</script>

<style>
.tox-notifications-container {
  display: none;
}
</style>

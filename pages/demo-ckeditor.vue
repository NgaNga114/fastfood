<template>
  <div>
    <ckeditor
      :editor="editor"
      v-model="value"
      @input="onChange"
      :config="editorConfig"
    />
    <v-row>
      <v-col cols="6">
        <div class="ck-content" v-html="value"></div>
      </v-col>
      <!-- <v-col cols="6">
        {{ value }}
      </v-col> -->
    </v-row>
  </div>
</template>
<script>
// import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import MyUploadAdapter from "~/services/uploadAdapter";

let ClassicEditor;
let CKEditor;

if (process.client) {
  ClassicEditor = require("@ckeditor/ckeditor5-build-classic");
  CKEditor = require("@ckeditor/ckeditor5-vue2");
} else {
  CKEditor = { component: { template: "<div></div>" } };
}

export default {
  components: {
    ckeditor: CKEditor.component
  },
  props: {},
  data() {
    return {
      editor: ClassicEditor,
      value: "",
      editorConfig: {
        extraPlugins: [this.uploader]
      },
      link: [
        {
          rel: "stylesheet",
          href: "../assets/content-style.css"
        }
      ]
    };
  },
  methods: {
    // event(value) {
    //   console.log(value);
    // },
    onChange(event) {
      console.log(event);
    },
    uploader(editor) {
      //   console.log(editor);
      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new MyUploadAdapter(loader);
        console.log(loader);
      };
    }
  }
};
</script>

<style></style>

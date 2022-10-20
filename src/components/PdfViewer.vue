<template>
  <v-card :loading="loading">
    <p v-if="error">Error loading document</p>
    <PdfComponent
      :src="pdf"
      @loaded="(loading = false), (error = false)"
      @error="(loading = false), (error = true)"
    />
  </v-card>
</template>

<script>
import PdfComponent from "vue-pdf";
export default {
  name: "PdfViewer",
  components: {
    PdfComponent,
  },
  props: {
    pdf: {
      type: String,
    },
  },
  data() {
    return {
      loading: true,
      error: false,
    };
  },
  created() {
    if ((this.pdf == "") | (this.pdf == null) | (this.pdf == undefined)) {
      this.loading = false;
    }
  },
};
</script>

<style></style>

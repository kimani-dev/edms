<template>
  <Layout :title="department.name" :fileEdits="false" :files="files" />
</template>

<script>
import Layout from "../Layout.vue";
import { mapState } from "pinia";
import { appStore } from "@/stores/app";

export default {
  name: "OtherDepartmentView",
  data: () => ({
    files: [
      {
        id: 8,
        name: "other department document.docx",
        folder: "this department",
        subfolder: null,
      },
    ],
  }),
  components: {
    Layout,
  },
  computed: {
    ...mapState(appStore, ["department"]),
  },
};
</script>

<style></style>

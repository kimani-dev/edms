<template>
  <div>
    <Layout
      :title="'My Department Documents'"
      :fileEdits="true"
      :files="files"
    />
  </div>
</template>

<script>
import Layout from "../Layout.vue";
// import Api from "@/services/Api";

export default {
  name: "DepartmentDocuments",
  data: () => ({
    files: [
      {
        id: 1,
        name: "Television.pdf",
        folder: "assets",
        subfolder: null,
      },
    ],
  }),
  components: {
    Layout,
  },
};
</script>

<style></style>

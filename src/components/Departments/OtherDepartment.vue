<template>
  <Layout :title="department.name" />
</template>

<script>
import Layout from "../Layout.vue";
import { mapState } from "pinia";
import { appStore } from "@/stores/app";

export default {
  name: "OtherDepartmentView",
  components: {
    Layout,
  },
  computed: {
    ...mapState(appStore, ["department"]),
  },
};
</script>

<style></style>

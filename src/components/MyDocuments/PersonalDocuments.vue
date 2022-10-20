<template>
  <div>
    <Layout :title="'My Documents'" :fileEdits="true" :files="myDocuments" />
  </div>
</template>

<script>
import Layout from "../Layout.vue";
import { mapState, mapActions } from "pinia";
import { myDocuments } from "@/stores/myDocuments";

export default {
  name: "PersonalDocuments",
  components: { Layout },
  computed: {
    ...mapState(myDocuments, ["myDocuments"]),
  },
  methods: {
    ...mapActions(myDocuments, ["getMyDocuments"]),
  },
};
</script>

<style></style>

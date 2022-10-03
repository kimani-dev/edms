<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize primary--text">
        Departments management
      </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            label="Search Departments"
            append-icon="mdi-magnify"
            outlined
            dense
            v-model="search"
          ></v-text-field>
        </div>
        <v-btn color="primary" outlined class="mb-2">
          <v-icon left>mdi-account-multiple-plus</v-icon> new department</v-btn
        >
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          no-data-text="There are no departments to view"
          class="elevation-10 text-capitalize"
          show-expand
          item-key="name"
        >
          <template v-slot:[`item.add`]>
            <v-btn color="primary" small outlined>
              <v-icon left>mdi-plus</v-icon> add members
            </v-btn>
          </template>
          <template v-slot:[`item.actions`]>
            <v-btn icon color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="primary">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <template v-slot:expanded-item="{}">
            <v-list dense>
              <v-subheader class="text-uppercase primary--text"
                >members</v-subheader
              >
              <v-list-item v-for="n in 5" :key="n">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-circle-small</v-icon>
                </v-list-item-icon>
                <v-list-item-title>David Kimani</v-list-item-title>
                <v-list-item-action>
                  <v-btn small outlined color="primary">role</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "DepartmentsManagement",
  data: () => ({
    search: "",
    headers: [
      {
        text: "name",
        value: "name",
        class: "text-uppercase primary--text",
      },
      {
        text: "no. of members",
        value: "members",
        class: "text-uppercase primary--text",
      },
      {
        text: "add members",
        value: "add",
        class: "text-uppercase primary--text",
      },
      {
        text: "actions",
        value: "actions",
        class: "text-uppercase primary--text",
      },
    ],
    items: [
      {
        name: "Speaker's Office",
        members: "20",
      },
      {
        name: "Finance",
        members: "18",
      },
      {
        name: "IT",
        members: "45",
      },
    ],
  }),
};
</script>

<style></style>

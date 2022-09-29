<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize primary--text">
        users management
      </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            label="Search Users"
            append-icon="mdi-magnify"
            outlined
            dense
            v-model="search"
          ></v-text-field>
        </div>
        <v-btn color="primary" outlined class="mb-2">
          <v-icon left>mdi-account-plus</v-icon> new user</v-btn
        >
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          no-data-text="There are no users to view"
          class="elevation-10 text-capitalize"
        >
          <template v-slot:[`item.actions`]>
            <v-btn icon color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="primary">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "UsersManagement",
  data: () => ({
    search: "",
    headers: [
      {
        text: "name",
        value: "name",
        class: "text-uppercase primary--text",
      },
      {
        text: "username",
        value: "username",
        class: "text-uppercase primary--text",
      },
      {
        text: "email",
        value: "email",
        class: "text-uppercase primary--text",
      },
      {
        text: "role",
        value: "role",
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
        name: "David Kimani",
        username: "Kimani Kimani",
        email: "email@kim.co",
        role: "admin",
      },
      {
        name: "Antony Musau",
        username: "Musau Kapsha",
        email: "email@musau.co",
        role: "clerk",
      },
      {
        name: "Samia Suluhu",
        username: "Samia Salamu",
        email: "email@samia.co",
        role: "staff",
      },
    ],
  }),
};
</script>

<style></style>

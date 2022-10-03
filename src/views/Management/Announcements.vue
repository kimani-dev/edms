<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize primary--text">
        Announcements management
      </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            label="Search Announcement"
            append-icon="mdi-magnify"
            outlined
            dense
            v-model="search"
          ></v-text-field>
        </div>
        <v-btn color="primary" outlined class="mb-2">
          <v-icon left>mdi-bullhorn</v-icon> new announcement</v-btn
        >
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          no-data-text="There are no announcements to view"
          class="elevation-10 text-capitalize"
        >
          <template v-slot:[`item.date`]="{ item }">
            {{ item.date | moment("dddd, Mo MMMM YYYY") }}
          </template>
          <template v-slot:[`item.name`]="{ item }">
            <v-icon color="red darken-4">mdi-file-pdf-box</v-icon>
            {{ item.name }}
          </template>
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
  name: "AnnouncementsManagement",
  data: () => ({
    search: "",
    headers: [
      {
        text: "date",
        value: "date",
        class: "text-uppercase primary--text",
      },
      {
        text: "name",
        value: "name",
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
        name: "Speaker's office announcement.pdf",
        date: "2022-09-29",
      },
      {
        name: "announcement from clerk's office.pdf",
        date: "2022-09-29",
      },
      {
        name: "staff meeting.pdf",
        date: "2022-09-29",
      },
    ],
  }),
};
</script>

<style></style>

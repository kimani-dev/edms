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
        <v-dialog width="auto" v-model="addDialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              class="mb-2"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon left>mdi-bullhorn</v-icon> new announcement</v-btn
            >
          </template>
          <v-card width="500">
            <v-card-title class="text-uppercase">
              new announcement
              <v-spacer></v-spacer>
              <v-btn icon color="primary" @click="addDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-2">
              <v-text-field
                outlined
                dense
                label="Enter file name"
                prepend-icon="mdi-text"
                v-model="name"
              ></v-text-field>
              <v-file-input
                label="Select file"
                outlined
                dense
                v-model="file"
              ></v-file-input>
              <v-btn
                outlined
                block
                color="primary"
                :loading="addLoader"
                :disabled="name == '' || file == null"
                @click="uploadAnnouncement"
                >upload</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
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
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              icon
              color="primary"
              @click="(editName = item.name), (editDialog = true)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary"
              @click="(deleteDialog = true), (itemToDeleteId = item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- edit dialog -->
    <v-dialog v-model="editDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          edit announcement
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="editDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-text-field
            outlined
            dense
            label="Enter file name"
            v-model="editName"
            prepend-icon="mdi-text"
          ></v-text-field>
          <v-btn
            outlined
            color="primary"
            block
            :loading="editLoader"
            :disabled="editName == ''"
            >save changes</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- delete dialog -->
    <v-dialog v-model="deleteDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          delete announcement
          <v-spacer></v-spacer>
          <v-btn icon color="primary" @click="deleteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2 text-capitalize black--text">
          are you sure you want to delete this announcement?
        </v-card-text>
        <v-card-actions>
          <v-btn outlined color="primary" @click="deleteDialog = false"
            >cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn outlined color="error" @click="deleteAnnouncement"
            >delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import Api from "@/services/Api";

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
    addDialog: false,
    name: "",
    file: null,
    addLoader: false,
    editDialog: false,
    editName: "",
    editLoader: false,
    deleteDialog: false,
    itemToDeleteId: "",
  }),
  methods: {
    uploadAnnouncement() {},
    deleteAnnouncement() {
      // this.itemToDeleteId;
    },
  },
  created() {
    // Api.getAnnouncements().then((res) => {
    //   this.items = res.data.data;
    // });
  },
};
</script>

<style></style>

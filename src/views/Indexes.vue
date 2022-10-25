<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize"> Indexes </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <p class="primary--text text-capitalize">
          Search documents and filter by name, date or/and department
        </p>
        <!-- filter search results -->
        <div class="d-flex">
          <!-- file name -->
          <v-text-field
            outlined
            label="File Name"
            dense
            prepend-icon="mdi-text-search"
            :loading="searchLoader"
            v-model="name"
            clearable
            @change="searchDocuments"
          />
          <v-spacer></v-spacer>
          <!-- file date -->
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Date Created"
                prepend-icon="mdi-calendar"
                :loading="searchLoader"
                dense
                outlined
                readonly
                v-bind="attrs"
                v-on="on"
                clearable
                @change="searchDocuments"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <!-- file department -->
          <v-autocomplete
            outlined
            dense
            label="Department"
            :loading="searchLoader"
            prepend-icon="mdi-account-multiple"
            v-model="department"
            @change="searchDocuments"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="items"
          no-data-text="There are no documents for your search"
          class="elevation-10"
        >
          <template v-slot:[`item.actions`]>
            <!-- download -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-cloud-download</v-icon>
                </v-btn>
              </template>
              <span>Download</span>
            </v-tooltip>
            <!-- save -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-file-download</v-icon>
                </v-btn>
              </template>
              <span>Save to my documents</span>
            </v-tooltip>
          </template>
          <!-- icon for file -->
          <template v-slot:[`item.file`]="{ item }">
            <v-icon :color="getFileIconColor(item.file)">
              {{ getFileIcon(item.file) }}
            </v-icon>
            {{ item.file }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- snack bar -->
  </div>
</template>

<script>
import Api from "@/services/Api";

export default {
  name: "IndexView",
  data: () => ({
    name: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    department: "",
    headers: [
      {
        text: "file name",
        value: "file",
        class: "text-uppercase primary--text",
      },
      {
        text: "owner",
        value: "owner",
        class: "text-uppercase primary--text",
      },
      {
        text: "department",
        value: "department",
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
        date: "2022-09-30",
        owner: "David Kimani",
        department: "Sales and Marketing",
        file: "department notice.pdf",
      },
      {
        date: "2022-09-28",
        owner: "Samia Suluhu",
        department: "State Capture",
        file: "State finance.xlsx",
      },
      {
        date: "2022-09-29",
        owner: "Hamisi Sinia",
        department: "Speaker's Office",
        file: "New Document.docx",
      },
    ],
    searchLoader: false,
    // snack bar
    snackBar: false,
    snackBarData: {
      success: false,
      message: "",
    },
  }),
  methods: {
    getFileIcon(fileName) {
      let fileExtension = [];
      let start = false;
      Array.from(fileName).forEach((v) => {
        if (start) {
          fileExtension.push(v);
        }
        if (v == ".") {
          start = true;
        }
      });

      // switch to get color
      switch (fileExtension.join("")) {
        case "pdf":
          return "mdi-file-pdf-box";
        case "xlsx":
          return "mdi-microsoft-excel";
        case "docx":
          return "mdi-microsoft-excel";
        default:
          return "mdi-file-document";
      }
    },
    getFileIconColor(fileName) {
      let fileExtension = [];
      let start = false;
      Array.from(fileName).forEach((v) => {
        if (start) {
          fileExtension.push(v);
        }
        if (v == ".") {
          start = true;
        }
      });

      // switch to get color
      switch (fileExtension.join("")) {
        case "pdf":
          return "red darken-2";
        case "xlsx":
          return "green darken-4";
        case "docx":
          return "blue darken-4";
        default:
          return "primary";
      }
    },
    searchDocuments() {
      this.searchLoader = true;
      Api.searchDocuments({
        name: this.name,
        date: this.date,
        department: this.department,
      })
        .then((res) => {
          this.items = res.data.data;
        })
        .catch((err) => {
          this.showSnackBar(false, err.response.data.message);
        })
        .finally(() => {
          this.searchLoader = false;
        });
    },
    showSnackBar(success, message) {
      this.snackBar = true;
      this.snackBbarData.success = success;
      this.snackBbarData.message = message;
    },
  },
};
</script>

<style></style>

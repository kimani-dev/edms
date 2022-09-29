<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize">Incoming documents</v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <!-- date filters -->
        <v-row class="mb-n6 mt-2 ml-1">
          <p class="primary--text text-capitalize">Filter documents by date</p>
        </v-row>
        <v-row>
          <v-col>
            <v-menu
              v-model="fromDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fromDate"
                  label="From Date"
                  prepend-inner-icon="mdi-calendar"
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fromDate"
                @input="fromDateMenu = false"
              ></v-date-picker> </v-menu
          ></v-col>
          <v-col>
            <v-menu
              v-model="toDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="toDate"
                  label="To Date"
                  prepend-inner-icon="mdi-calendar"
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="toDate"
                @input="toDateMenu = false"
              ></v-date-picker> </v-menu
          ></v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-data-table
              :items="items"
              :headers="headers"
              class="elevation-10 text-capitalize"
              no-data-text="There are no incoming documents to view"
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
              <!-- date formatting -->
              <template v-slot:[`item.date`]="{ item }">
                {{ item.date | moment("ddd, MMMM Do YYYY") }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "IncomingDocuments",
  data: () => ({
    headers: [
      {
        text: "Incoming date",
        value: "date",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sent in by",
        value: "sender",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sender department",
        value: "department",
        class: "text-uppercase primary--text",
      },
      {
        text: "File name",
        value: "file",
        class: "text-uppercase primary--text",
      },
      {
        text: "actions",
        value: "actions",
        class: "text-uppercase primary--text",
      },
    ],
    fromDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    fromDateMenu: false,
    toDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    toDateMenu: false,
    items: [
      {
        date: "2022-09-30",
        sender: "David Kimani",
        department: "Sales and Marketing",
        file: "department notice.pdf",
      },
      {
        date: "2022-09-28",
        sender: "Samia Suluhu",
        department: "State Capture",
        file: "State finance.xlsx",
      },
      {
        date: "2022-09-29",
        sender: "Hamisi Sinia",
        department: "Speaker's Office",
        file: "New Document.docx",
      },
    ],
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
  },
};
</script>

<style></style>

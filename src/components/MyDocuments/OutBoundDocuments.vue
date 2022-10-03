<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize">Outbound documents</v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <!-- date filters -->
        <v-row class="mb-n6 mt-2 ml-1">
          <div class="d-flex flex-column">
            <p class="text-uppercase font-weight-medium primary--text">
              Recently sent documents
            </p>
            <p class="primary--text text-capitalize text-caption">
              Filter documents by date
            </p>
          </div>
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
            <v-btn color="primary" outlined>
              <v-icon left>mdi-file-move</v-icon> send new</v-btn
            >
            <v-data-table
              :items="items"
              :headers="headers"
              class="elevation-10 text-capitalize"
              no-data-text="There are no outbound documents to view"
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
                <!-- comments -->
                <v-btn icon color="primary">
                  <v-icon small>mdi-comment-multiple-outline</v-icon> 2
                </v-btn>
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
  name: "OutBoundDocuments",
  data: () => ({
    headers: [
      {
        text: "Sent date",
        value: "date",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sent to",
        value: "sender",
        class: "text-uppercase primary--text",
      },
      {
        text: "receipient",
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
        sender: "Individual",
        department: "Samia Suluhu",
        file: "department notice.pdf",
      },
      {
        date: "2022-09-28",
        sender: "Department",
        department: "Speaker's office",
        file: "State finance.xlsx",
      },
      {
        date: "2022-09-29",
        sender: "Individual",
        department: "David Kimani",
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

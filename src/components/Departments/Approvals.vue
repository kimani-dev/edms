<template>
  <div>
    <v-card width="100%">
      <v-card-title class="text-capitalize"
        >Received department approvals</v-card-title
      >
      <v-divider inset></v-divider>
      <v-card-text>
        <v-card width="100%">
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <v-list>
                  <v-list-item-group mandatory v-model="selectCategory">
                    <v-list-item link active-class="primary--text">
                      <v-list-item-icon>
                        <v-icon>mdi-circle-small</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title class="primary--text"
                        >Pending</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item link active-class="primary--text">
                      <v-list-item-icon>
                        <v-icon color="success">mdi-circle-small</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title class="success--text"
                        >Approved</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item link active-class="primary--text">
                      <v-list-item-icon>
                        <v-icon color="error">mdi-circle-small</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title class="error--text"
                        >Denied</v-list-item-title
                      >
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <div class="d-flex">
                  <p class="primary--text text-capitalize">
                    Filter department approvals by date
                  </p>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    color="primary"
                    @click="selectMultiple = !selectMultiple"
                  >
                    <v-icon>mdi-select-multiple</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="primary"
                    :disabled="selectedItems.length == 0 || selectCategory == 1"
                  >
                    <v-icon>mdi-check-underline-circle-outline</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="primary"
                    :disabled="selectedItems.length == 0 || selectCategory == 2"
                  >
                    <v-icon>mdi-close-circle-outline</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex">
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
                        class="mr-2"
                        dense
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="fromDate"
                      @input="fromDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
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
                        dense
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="toDate"
                      @input="toDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
                <v-data-table
                  :items="items"
                  :headers="headers"
                  class="elevation-10 text-capitalize"
                  no-data-text="There are no documents for my approval"
                  :show-select="selectMultiple"
                  item-key="file"
                  v-model="selectedItems"
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
                    <!-- save to my documents -->
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "DepartmentApprovals",
  data: () => ({
    headers: [
      {
        text: "date sent",
        value: "date",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sent from",
        value: "sender",
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
    selectMultiple: false,
    selectedItems: [],
    selectCategory: "",
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

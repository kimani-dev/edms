<template>
  <div>
    <v-card flat color="transparent">
      <v-card-title>
        <p class="text-capitalize">{{ title }}</p>
      </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <v-container fluid>
          <v-row no-gutters>
            <div class="d-flex" id="layout-header">
              <v-breadcrumbs
                :items="[
                  { text: 'My Documents' },
                  { text: 'Personal Documents' },
                  { text: 'New Folder' },
                ]"
                divider="/"
                class="primary--text"
              ></v-breadcrumbs>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="my-auto mr-2" small text>
                <v-icon>mdi-folder-plus</v-icon> new folder
              </v-btn>
              <v-btn color="primary" class="my-auto mr-2" small text>
                <v-icon>mdi-file-upload</v-icon> upload file
              </v-btn>
              <v-btn color="primary" class="my-auto" small text>
                <v-icon>mdi-file-download</v-icon> download
              </v-btn>
            </div>
          </v-row>
          <v-row>
            <v-card width="100%">
              <v-card-text>
                <v-row>
                  <v-col cols="3">
                    <v-list two-line dense>
                      <v-list-item link v-for="n in 5" :key="n" class="my-n2">
                        <v-list-item-icon>
                          <v-icon color="primary"> mdi-folder </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>New folder</v-list-item-title>
                          <v-list-item-subtitle>10KB</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <div class="d-flex pb-2">
                      <p class="primary--text my-auto">New Folder</p>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        text
                        @click="activateSelect = !activateSelect"
                      >
                        <v-icon left>mdi-select-multiple</v-icon> select
                      </v-btn>
                      <v-btn
                        small
                        text
                        :disabled="!selectedDocuments.length > 0"
                      >
                        <v-icon left>mdi-share</v-icon> share
                      </v-btn>
                      <v-btn
                        small
                        text
                        :disabled="!selectedDocuments.length > 0"
                      >
                        <v-icon left>mdi-delete</v-icon> delete
                      </v-btn>
                    </div>
                    <v-divider inset></v-divider>
                    <!-- show if selection inactive -->
                    <v-list dense v-if="!activateSelect">
                      <v-list-item
                        link
                        v-for="file in files"
                        :key="file.name"
                        class="py-1"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-circle-small</v-icon>
                          <v-icon :color="getFileIconColor(file.name)">{{
                            getFileIcon(file.name)
                          }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title> {{ file.name }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <!-- show if selection active -->
                    <v-list dense v-else>
                      <v-list-item-group multiple v-model="selectedDocuments">
                        <v-list-item
                          link
                          v-for="file in files"
                          :key="file.name"
                        >
                          <template v-slot:default="{ active }">
                            <v-list-item-icon>
                              <v-icon>mdi-circle-small</v-icon>
                              <v-icon :color="getFileIconColor(file.name)">{{
                                getFileIcon(file.name)
                              }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                              {{ file.name }}</v-list-item-title
                            >
                            <v-list-item-action>
                              <v-checkbox :input-value="active"></v-checkbox>
                            </v-list-item-action>
                          </template>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "LayoutView",
  props: {
    title: {
      type: String,
      default: "Documents",
    },
  },
  data: () => ({
    selectedDocuments: [],
    files: [
      { name: "SPEAKER BRIEFINGS.pdf" },
      { name: "FINANCE REPORT.xlsx" },
      { name: "NEW DOCUMENT.docx" },
      { name: "BUDGET REPORT.pdf" },
      { name: "SPEAKER APPROVAL.docx" },
      { name: "ANOTHER DOCUMENT.csv" },
    ],
    activateSelect: false,
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
  watch: {
    selectedDocuments(newValue, oldValue) {
      if (newValue.length == 0 && oldValue.length > 0) {
        this.activateSelect = false;
      }
    },
  },
};
</script>

<style scoped>
#layout-header {
  width: 100%;
}
</style>

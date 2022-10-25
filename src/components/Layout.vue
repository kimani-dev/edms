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
              <!-- bread crumbs -->
              <v-breadcrumbs
                :items="links"
                divider="/"
                class="primary--text text-capitalize"
              ></v-breadcrumbs>
              <v-spacer></v-spacer>
              <!-- new folder -->
              <v-btn
                color="primary"
                class="my-auto mr-2"
                small
                text
                v-if="fileEdits"
                @click="newFolderDialog = true"
              >
                <v-icon>mdi-folder-plus</v-icon> new folder
              </v-btn>
            </div>
          </v-row>
          <v-row>
            <v-card width="100%">
              <v-card-text>
                <v-row>
                  <v-col cols="3">
                    <v-list two-line dense>
                      <v-list-item-group mandatory v-model="folderGroup">
                        <v-list-item
                          link
                          v-for="(folder, index) in allFolders"
                          :key="index"
                          class="my-n2 text-capitalize"
                        >
                          <v-list-item-icon>
                            <v-icon color="primary"> mdi-folder </v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ folder }}
                            </v-list-item-title>
                            <v-list-item-subtitle> 10KB </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <!-- FILE ACTIONS -->
                    <div class="d-flex pb-2">
                      <p class="primary--text my-auto text-capitalize">
                        {{ allFolders[folderGroup] }}
                      </p>
                      <v-divider vertical class="ml-2"></v-divider>
                      <!-- upload file -->
                      <v-btn
                        class="my-auto ml-2"
                        small
                        text
                        v-if="fileEdits"
                        @click="uploadDialog = true"
                      >
                        <v-icon left>mdi-cloud-upload-outline</v-icon> upload
                      </v-btn>
                      <!-- create subfolder -->
                      <v-btn
                        class="my-auto ml-2"
                        small
                        text
                        v-if="fileEdits && !activateSelect"
                        @click="createSubfolderDialog = true"
                      >
                        <v-icon left>mdi-folder-plus-outline</v-icon> new
                        subfolder
                      </v-btn>
                      <v-spacer></v-spacer>
                      <!-- cancel selection -->
                      <v-btn
                        small
                        text
                        v-if="activateSelect"
                        @click="activateSelect = false"
                      >
                        <v-icon left>mdi-close</v-icon> cancel
                      </v-btn>
                      <!-- enable selection mode -->
                      <v-btn
                        small
                        text
                        @click="activateSelect = !activateSelect"
                      >
                        <v-icon left>mdi-select-multiple</v-icon> select
                      </v-btn>
                      <!-- share files -->
                      <v-btn
                        small
                        text
                        :disabled="!selectedDocuments.length > 0"
                        @click="shareDialog = true"
                      >
                        <v-icon left>mdi-share</v-icon> share
                      </v-btn>
                      <!-- delete files -->
                      <v-btn
                        small
                        text
                        :disabled="!selectedDocuments.length > 0"
                        color="error"
                        @click="deleteDialog = true"
                      >
                        <v-icon left>mdi-delete</v-icon> delete
                      </v-btn>
                    </div>
                    <v-divider inset></v-divider>
                    <!-- show if selection inactive -->
                    <v-list dense v-if="!activateSelect">
                      <div v-for="file in activeFiles" :key="file.name">
                        <!-- check and display files in folder -->
                        <v-list-item
                          v-if="!isSubfolder(file.name)"
                          link
                          class="py-1 text-capitalize"
                          @click="pdfDialog = true"
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-circle-small</v-icon>
                            <v-icon :color="getFileIconColor(file.name)">{{
                              getFileIcon(file.name)
                            }}</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ file.name }}
                          </v-list-item-title>
                          <v-icon color="primary">mdi-cloud-download</v-icon>
                        </v-list-item>
                        <!-- check and display all subfolders with their files -->
                        <v-list-group
                          v-else
                          class="text-capitalize"
                          @click="getSubfolderFiles(file.name)"
                        >
                          <template v-slot:activator>
                            <v-list-item-icon class="mr-1">
                              <v-icon> mdi-circle-small </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                              <v-icon left color="primary">mdi-folder</v-icon>
                              {{ file.name }}
                            </v-list-item-title>
                          </template>
                          <!-- get subfolder files -->
                          <v-list-item
                            link
                            @click="pdfDialog = true"
                            v-for="subfolderFile in activeSubfolderFiles"
                            :key="subfolderFile.id"
                            class="ml-4"
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-circle-small</v-icon>
                              <v-icon
                                :color="getFileIconColor(subfolderFile.name)"
                                >{{ getFileIcon(subfolderFile.name) }}</v-icon
                              >
                            </v-list-item-icon>
                            <v-list-item-title>
                              {{ subfolderFile.name }}
                            </v-list-item-title>
                            <v-icon
                              color="primary"
                              @click="downloadFile(subfolderFile.id)"
                              >mdi-cloud-download</v-icon
                            >
                          </v-list-item>
                        </v-list-group>
                      </div>
                    </v-list>
                    <v-list dense v-else>
                      <div v-for="file in activeFiles" :key="file.name">
                        <!-- check and display files in folder -->
                        <v-list-item-group
                          v-if="!isSubfolder(file.name)"
                          multiple
                          v-model="selectedDocuments"
                        >
                          <v-list-item link class="py-1 text-capitalize">
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
                        <!-- check and display all subfolders with their files -->
                        <v-list-group
                          v-else
                          class="text-capitalize"
                          @click="getSubfolderFiles(file.name)"
                        >
                          <template v-slot:activator>
                            <v-list-item-icon class="mr-1">
                              <v-icon> mdi-circle-small </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                              <v-icon left color="primary">mdi-folder</v-icon>
                              {{ file.name }}
                            </v-list-item-title>
                          </template>
                          <!-- get subfolder files -->
                          <v-list-item-group
                            multiple
                            v-model="selectedDocumentsInSubfolders[file.name]"
                          >
                            <v-list-item
                              link
                              v-for="subfolderFile in activeSubfolderFiles"
                              :key="subfolderFile.id"
                              class="ml-4"
                            >
                              <template v-slot:default="{ active }">
                                <v-list-item-icon>
                                  <v-icon>mdi-circle-small</v-icon>
                                  <v-icon
                                    :color="
                                      getFileIconColor(subfolderFile.name)
                                    "
                                    >{{
                                      getFileIcon(subfolderFile.name)
                                    }}</v-icon
                                  >
                                </v-list-item-icon>
                                <v-list-item-title>
                                  {{ subfolderFile.name }}</v-list-item-title
                                >
                                <v-list-item-action>
                                  <v-checkbox
                                    :input-value="active"
                                  ></v-checkbox>
                                </v-list-item-action>
                              </template>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list-group>
                      </div>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <!-- pdf dialog -->
    <v-dialog v-model="pdfDialog" width="80%">
      <pdf-viewer :pdf="'/Test.pdf'" />
    </v-dialog>
    <!-- new folder dialog -->
    <v-dialog v-model="newFolderDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          new folder
          <v-spacer></v-spacer>
          <v-btn icon @click="newFolderDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-text-field
            outlined
            dense
            label="Folder Name"
            prepend-icon="mdi-folder"
            v-model="folderName"
          ></v-text-field>
          <v-btn
            block
            color="primary"
            outlined
            :disabled="folderName == ''"
            :loading="createFolderLoader"
            @click="createFolder"
            >create folder</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- upload file dialog -->
    <v-dialog v-model="uploadDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          upload file
          <v-spacer></v-spacer>
          <v-btn icon @click="uploadDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-file-input
            outlined
            dense
            label="Select file"
            v-model="file"
          ></v-file-input>
          <v-text-field
            label="File Name"
            v-model="fileName"
            outlined
            dense
            prepend-icon="mdi-text"
          ></v-text-field>
          <v-btn
            block
            color="primary"
            outlined
            :loading="uploadLoader"
            :disabled="file == null || fileName == ''"
            @click="uploadFile"
            >upload</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- create subfolder dialod -->
    <v-dialog v-model="createSubfolderDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          create Subfolder
          <v-spacer></v-spacer>
          <v-btn icon @click="createSubfolderDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-text-field
            outlined
            dense
            prepend-icon="mdi-folder-outline"
            label="Subfolder name"
            v-model="subfolderName"
          ></v-text-field>
          <v-btn
            block
            color="primary"
            outlined
            :disabled="subfolderName == ''"
            :loading="createSubfolderLoader"
            @click="createSubfolder"
            >create</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- share dialog -->
    <v-dialog v-model="shareDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          share files
          <v-spacer></v-spacer>
          <v-btn icon @click="shareDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-autocomplete
            outlined
            dense
            prepend-icon="mdi-account-multiple"
            label="Select Members"
            multiple
            chips
            deletable-chips
            v-model="shareMembers"
            :items="memberNames"
          ></v-autocomplete>
          <v-btn
            block
            color="primary"
            outlined
            :disabled="!shareMembers.length > 0"
            :loading="shareLoader"
            >share</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- delete selected files dialog -->
    <v-dialog v-model="deleteDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          delete files
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <p class="black--text text-capitalize">
            Are you sure you want to delete the selected files?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="deleteLoader">cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" :loading="deleteLoader" @click="deleteFiles"
            >delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- snack bar -->
    <v-snackbar v-model="snackBar" color="primary" outlined>
      <div class="d-flex justify-center">
        <v-icon v-if="snackBarData.success" color="success" left
          >mdi-check</v-icon
        >
        <v-icon v-else color="error" left>mdi-cancel</v-icon>
        <p class="my-auto">
          {{ snackBarData.message }}
        </p>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import PdfViewer from "./PdfViewer.vue";
import { mapActions, mapState } from "pinia";
import { memberStore } from "../stores/members";

export default {
  name: "LayoutView",
  props: {
    title: {
      type: String,
      default: "Documents",
    },
    fileEdits: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
    },
  },
  components: {
    PdfViewer,
  },
  data: () => ({
    selectedDocuments: [],
    selectedDocumentsInSubfolders: [],
    allFolders: [],
    // the files in the selected folder
    activeFiles: [],
    // the files in the selected subfolder
    activeSubfolderFiles: [],
    activateSelect: false,
    pdfDialog: false,
    folderGroup: null,
    // snackBar
    snackBar: false,
    snackBarData: {
      success: false,
      message: "",
    },
    // dialogs
    newFolderDialog: false,
    createSubfolderDialog: false,
    uploadDialog: false,
    shareDialog: false,
    deleteDialog: false,
    //dialog accessories
    createFolderLoader: false,
    uploadLoader: false,
    createSubfolderLoader: false,
    shareLoader: false,
    deleteLoader: false,
    folderName: "",
    subfolderName: "",
    file: null,
    fileName: "",
    shareMembers: [],
  }),
  computed: {
    ...mapState(memberStore, ["memberNames", "members"]),
    links() {
      return [
        {
          text: "Dashboard",
          href: "/dashboard",
        },
        {
          text: this.$route.name,
        },
        {
          text: this.allFolders[this.folderGroup],
        },
      ];
    },
  },
  methods: {
    ...mapActions(memberStore, ["getMembers"]),
    getFileIcon(fileName) {
      let fileExtension = [];
      let start = false;
      let fileNameArray = Array.from(fileName);

      // check if it's a folder
      if (fileNameArray.some((v) => v === ".")) {
        fileNameArray.forEach((v) => {
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
      } else return "mdi-folder";
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
    // check if is subfolder
    isSubfolder(name) {
      return !Array.from(name).some((v) => v == ".");
    },
    // sort files and group into folders and subfolders
    sortFiles() {
      // get all folders
      let folders = [];
      for (let file of this.files) {
        if (file.folder != null) folders.push(file.folder);
      }
      this.allFolders = [...new Set(folders)];
    },
    // filter all files in subfolder
    getSubfolderFiles(subfolderName) {
      // filter files in the folder && subfolder selected
      this.activeSubfolderFiles = this.files.filter(
        (file) =>
          file.folder === this.allFolders[this.folderGroup] &&
          file.subfolder &&
          file.subfolder === subfolderName
      );
    },
    // create folder
    createFolder() {
      this.createFolderLoader = true;
      // check if folder exists
      if (!this.allFolders.some((folder) => folder == this.folderName)) {
        this.allFolders.push(this.folderName);
        this.folderName = "";
        this.newFolderDialog = false;
      } else {
        this.showSnackBar(false, "Folder already exists");
      }
      this.createFolderLoader = false;
    },
    // upload file
    uploadFile() {
      this.uploadLoader = false;
      this.$emit("uploadFile", {
        name: this.fileName,
        file: this.file,
        folder: this.allFolders[this.folderGroup],
      });
    },
    // create subfolder
    createSubfolder() {
      this.createSubfolderLoader = true;
      if (
        !this.activeFiles.some(
          (subfolder) => !subfolder.file && subfolder.name == this.subfolderName
        )
      ) {
        this.activeFiles.push({ name: this.subfolderName, size: "0b" });
        this.createSubfolderDialog = false;
        this.createFolderLoader = false;
      } else {
        this.createSubfolderLoader = false;
        this.showSnackBar(false, "Subfolder already exists in this folder");
      }
    },
    // download file
    downloadFile(id) {
      console.log(id);
    },
    // share selected files
    shareFiles() {},
    // delete selected files
    deleteFiles() {},
    // snack bar
    showSnackBar(success, message) {
      this.snackBar = true;
      this.snackBarData.success = success;
      this.snackBarData.message = message;
    },
  },
  watch: {
    selectedDocuments(newValue, oldValue) {
      if (newValue.length == 0 && oldValue.length > 0) {
        this.activateSelect = false;
      }
    },
    // watch which folder is active
    folderGroup(newValue) {
      let folderName = this.allFolders[newValue];
      let folderFiles = this.files.filter((file) => file.folder == folderName);
      // push files in direct folder
      this.activeFiles = folderFiles.filter((file) => file.subfolder == null);

      // FILES AND SUBFOLDERS
      // get all sub-folders
      let subfolders = [];
      for (let file of folderFiles) {
        if (file.subfolder !== null) subfolders.push(file.subfolder);
      }
      // unique subfolders to avoid duplicates
      let uniqueSubfolders = [...new Set(subfolders)];
      // create objects from subfolders so as to concat with files array
      for (let subfolder of uniqueSubfolders) {
        this.activeFiles.push({ name: subfolder, size: "2kb" });
      }
    },
    //watch selection && clear selection when it's deactivated
    activateSelect(newValue) {
      if (!newValue) this.selectedDocuments = [];
    },
  },
  beforeMount() {
    this.sortFiles();
    // this.getMembers();
  },
};
</script>

<style scoped>
#layout-header {
  width: 100%;
}
</style>

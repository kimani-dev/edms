<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize primary--text">
        chat rooms management
      </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <div class="">
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field
              append-icon="mdi-magnify"
              label="Search Chat Room"
              outlined
              dense
              v-model="search"
            />
          </div>

          <!-- create chat room dialog -->
          <v-dialog v-model="addDialog" width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                color="primary"
                outlined
                class="mb-2"
              >
                <v-icon left>mdi-forum-plus</v-icon> create room</v-btn
              >
            </template>
            <v-card class="mx-auto" width="500">
              <v-card-title>
                <p class="mx-auto text-uppercase">create chat room</p>
              </v-card-title>
              <v-card-text>
                <v-form v-model="addForm" ref="addForm">
                  <v-text-field
                    outlined
                    dense
                    v-model="addName"
                    label="Room name"
                    prepend-icon="mdi-text"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-autocomplete
                    prepend-icon="mdi-account-multiple"
                    label="Select participants"
                    chips
                    deletable-chips
                    outlined
                    dense
                    multiple
                    v-model="participants"
                    :items="memberNames"
                    :rules="[rules.required]"
                  />
                  <v-btn
                    color="primary"
                    block
                    :disabled="!addForm"
                    :loading="addLoader"
                    @click="createRoom"
                    >create room</v-btn
                  >
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- table -->
          <v-data-table
            :search="search"
            no-data-text="No chat rooms to show"
            :headers="headers"
            :items="items"
            class="text-capitalize elevation-10"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon
                color="primary"
                @click="
                  (editDialog = true),
                    (selectedItem = item),
                    (editSubject = item.subject)
                "
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                color="primary"
                @click="(deleteDialog = true), (selectedItem = item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:[`item.participants`]="{ item }">
              {{ Object.keys(item.participants).length }}
            </template>
          </v-data-table>
        </div>
        <!-- edit dialog -->
        <v-dialog v-model="editDialog" width="auto">
          <v-card class="mx-auto" width="500">
            <v-card-title>
              <p class="text-uppercase mx-auto">edit chat room</p>
            </v-card-title>
            <v-card-text>
              <v-form v-model="editForm" ref="editForm">
                <v-text-field
                  v-model="editSubject"
                  outlined
                  dense
                  label="Room Name"
                  prepend-icon="mdi-text"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-btn
                  color="primary"
                  block
                  :disabled="!editForm"
                  :loading="editLoader"
                  @click="editRoom"
                  >save changes</v-btn
                >
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- delete dialog -->
        <v-dialog v-model="deleteDialog" width="auto">
          <v-card width="500" class="mx-auto">
            <v-card-title>
              <p class="text-uppercase mx-auto">delete chat room</p>
            </v-card-title>
            <v-card-text>
              <p class="black--text">
                Are you sure you want to delete this chat room?
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="deleteDialog = false"
                >cancel</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="error" @click="deleteRoom" :loading="deleteLoader"
                >delete</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- snack bar -->
        <v-snackbar
          v-model="snackBar"
          :color="snackBarData.success ? 'success' : 'error'"
        >
          <div class="text-center text-capitalize">
            {{ snackBarData.message }}
          </div>
        </v-snackbar>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { memberStore } from "@/stores/members";
import Api from "@/services/Api";

export default {
  name: "ChatRooms",
  data: () => ({
    search: "",
    addDialog: false,
    addForm: false,
    addLoader: false,
    addName: "",
    participants: [],
    rules: {
      required: (v) => !!v || "required",
    },
    headers: [
      {
        text: "room name",
        value: "subject",
        class: "text-uppercase black--text",
      },
      {
        text: "participants",
        value: "participants",
        class: "text-uppercase black--text",
      },
      {
        text: "actions",
        value: "actions",
        class: "text-uppercase black--text",
      },
    ],
    items: [],
    editDialog: false,
    editSubject: "",
    editForm: false,
    editLoader: false,
    deleteDialog: false,
    deleteLoader: false,
    selectedItem: null,
    snackBar: false,
    snackBarData: {
      success: false,
      message: "",
    },
  }),
  computed: {
    ...mapState(memberStore, ["memberNames", "members"]),
  },
  methods: {
    ...mapActions(memberStore, ["getMembers"]),
    getRooms() {
      Api.getRooms().then((res) => {
        this.items = [];
        for (let room of res.data.data) {
          if (room.custom.type) {
            this.items.push(room);
          }
        }
      });
    },
    createRoom() {
      this.addLoader = true;

      //   get member objects
      let users = [];
      let convId = "";
      for (let name of this.participants) {
        for (let member of this.members) {
          if (name == member.name) {
            convId += member.id.toString();
            users.push(member.id.toString());
          }
        }
      }

      //   create room
      Api.createRoom(convId, {
        participants: users,
        subject: this.addName,
        welcomeMessages: [`Welcome to ${this.addName}`],
        custom: {
          type: "custom",
        },
      })
        .then(() => {
          this.showSnackBar(true, "Room created succesfully");
          this.addDialog = false;
          this.$refs.addForm.reset();
          this.getRooms();
          Api.sendAddedAlert(convId);
        })
        .catch(() => {
          this.showSnackBar(false, "Error creating chat room");
        })
        .finally(() => {
          this.addLoader = false;
        });
    },
    editRoom() {
      this.editLoader = true;

      // edit the room subject
      Api.createRoom(this.selectedItem.id, { subject: this.editSubject })
        .then(() => {
          this.showSnackBar(true, "Room saved succesfully");
          this.editDialog = false;
          this.$refs.editForm.reset();
          this.getRooms();
        })
        .catch(() => {
          this.showSnackBar(false, "Error modifying chat room");
        })
        .finally(() => {
          this.editLoader = false;
        });
    },
    deleteRoom() {
      this.deleteLoader = true;

      // delete a room
      Api.deleteRoom(this.selectedItem.id)
        .then(() => {
          this.showSnackBar(true, "Room deleted succesfully");
          this.deleteDialog = false;
          this.getRooms();
        })
        .catch(() => {
          this.showSnackBar(false, "Error deleting chat room");
        })
        .finally(() => {
          this.deleteLoader = false;
        });
    },
    showSnackBar(success, message) {
      this.snackBar = true;
      this.snackBarData.success = success;
      this.snackBarData.message = message;
    },
  },
  created() {
    this.getRooms();
    this.getMembers();
  },
};
</script>

<style></style>

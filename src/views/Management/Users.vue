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
        <v-dialog v-model="addDialog" width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              class="mb-2"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon left>mdi-account-plus</v-icon> new user</v-btn
            >
          </template>
          <v-card width="500">
            <v-card-title class="text-uppercase">
              add new user
              <v-spacer></v-spacer>
              <v-btn color="primary" icon @click="addDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-2">
              <v-form v-model="addForm">
                <v-text-field
                  outlined
                  dense
                  label="Name"
                  v-model="addName"
                  prepend-icon="mdi-account"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  outlined
                  dense
                  label="Email"
                  v-model="addEmail"
                  prepend-icon="mdi-email"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  outlined
                  dense
                  label="Username"
                  v-model="addUsername"
                  prepend-icon="mdi-text"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-autocomplete
                  outlined
                  dense
                  label="Select role"
                  v-model="addRole"
                  prepend-icon="mdi-key"
                ></v-autocomplete>
                <v-text-field
                  outlined
                  dense
                  label="Passsword"
                  v-model="addPassword"
                  prepend-icon="mdi-lock"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-form>
              <v-btn
                outlined
                block
                color="primary"
                :loading="addLoader"
                :disabled="!addForm"
                @click="createUser"
                >create user</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          no-data-text="There are no users to view"
          class="elevation-10 text-capitalize"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon color="primary" @click="editAction(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary"
              @click="(itemToDeleteId = item.id), (deleteDialog = true)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- edit dialog -->
    <v-dialog width="auto" v-model="editDialog">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          edit user
          <v-spacer></v-spacer>
          <v-btn icon color="primary" @click="editDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form v-model="editForm">
            <v-text-field
              outlined
              dense
              label="Name"
              v-model="editName"
              :rules="[rules.required]"
              prepend-icon="mdi-account"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              label="Email"
              v-model="editEmail"
              :rules="[rules.required]"
              prepend-icon="mdi-email"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              label="Username"
              v-model="editUsername"
              :rules="[rules.required]"
              prepend-icon="mdi-text"
            ></v-text-field>
            <v-autocomplete
              v-model="editRole"
              outlined
              dense
              label="Select role"
              :rules="[rules.required]"
              prepend-icon="mdi-key"
            ></v-autocomplete>
          </v-form>
          <v-btn
            outlined
            color="primary"
            block
            :loading="editLoader"
            :disabled="!editForm"
            @click="saveChanges"
            >save changes</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- delete dialog -->
    <v-dialog v-model="deleteDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          delete user
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="deleteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2 black--text text-capitalize">
          are you sure you want to delete this user?
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            outlined
            @click="deleteDialog = false"
            :disabled="deleteLoader"
            >cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            :loading="deleteLoader"
            @click="deleteUser"
            >delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { memberStore } from "@/stores/members";
import { mapState, mapActions } from "pinia";

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
    addDialog: false,
    addForm: false,
    rules: {
      required: (v) => !!v || "Required",
    },
    addName: "",
    addEmail: "",
    addUsername: "",
    addRole: "",
    addPassword: "",
    addLoader: false,
    // edit form
    editDialog: false,
    editForm: false,
    editName: "",
    editEmail: "",
    editUsername: "",
    editRole: "",
    editLoader: false,
    // delete
    deleteDialog: false,
    deleteLoader: false,
    itemToDeleteId: "",
  }),
  computed: {
    ...mapState(memberStore, ["members"]),
  },
  methods: {
    ...mapActions(memberStore, ["getMembers"]),
    createUser() {},
    editAction(item) {
      this.editName = item.name;
      this.editEmail = item.email;
      this.editUsername = item.username;
      this.editRole = item.role;
      this.editDialog = true;
    },
    saveChanges() {},
    deleteUser() {
      // this.itemToDeleteId;
    },
  },
  created() {
    // this.getMembers();
  },
};
</script>

<style></style>

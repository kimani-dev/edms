<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize primary--text">
        Departments management
      </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            label="Search Departments"
            append-icon="mdi-magnify"
            outlined
            dense
            v-model="search"
          ></v-text-field>
        </div>
        <!-- add dialog -->
        <v-dialog v-model="addDialog" width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              class="mb-2"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon left>mdi-account-multiple-plus</v-icon> new
              department</v-btn
            >
          </template>
          <v-card width="500">
            <v-card-title class="text-uppercase">
              create new department
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
                prepend-icon="mdi-account-multiple"
                v-model="name"
                label="Enter department name"
              ></v-text-field>
              <v-btn
                block
                outlined
                color="primary"
                :loading="addLoader"
                :disabled="name == ''"
                @click="createDepartment"
                >create department</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          no-data-text="There are no departments to view"
          class="elevation-10 text-capitalize"
          show-expand
          item-key="name"
        >
          <template v-slot:[`item.add`]="{ item }">
            <v-btn
              color="primary"
              small
              outlined
              @click="
                (departmentToAddMembers = item), (addMembersDialog = true)
              "
            >
              <v-icon left>mdi-plus</v-icon> add members
            </v-btn>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              icon
              color="primary"
              @click="(editDialog = true), (editName = item.name)"
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
          <template v-slot:expanded-item="{}">
            <v-list dense>
              <v-subheader class="text-uppercase primary--text"
                >members</v-subheader
              >
              <v-list-item v-for="n in 5" :key="n">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-circle-small</v-icon>
                </v-list-item-icon>
                <v-list-item-title>David Kimani</v-list-item-title>
                <v-list-item-action>
                  <v-switch
                    color="primary"
                    label="Admin"
                    :disabled="roleLoader"
                    @change="changeRole(n)"
                  ></v-switch>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- edit dialog -->
    <v-dialog v-model="editDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          edit department
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
            v-model="editName"
            label="Enter department name"
            prepend-icon="mdi-account-multiple"
          ></v-text-field>
          <v-btn
            color="primary"
            block
            outlined
            :loading="editLoader"
            :disabled="editName == ''"
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
          delete department
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="deleteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2 black--text text-capitalize">
          are you sure you want to delete this department?
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
            @click="deleteDepartment"
            >delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add members dialog -->
    <v-dialog v-model="addMembersDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          add members to {{ departmentToAddMembers.name }}
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="addMembersDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-autocomplete
            label="Select members"
            outlined
            dense
            chips
            deletable-chips
            v-model="selectedMembers"
          ></v-autocomplete>
          <v-btn
            color="primary"
            outlined
            block
            :loading="addMembersLoader"
            :disabled="selectedMembers.length == 0"
            @click="addMembers"
            >add members</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { departmentStore } from "@/stores/department";
import { memberStore } from "@/stores/members";
import { mapState, mapActions } from "pinia";

export default {
  name: "DepartmentsManagement",
  data: () => ({
    search: "",
    headers: [
      {
        text: "name",
        value: "name",
        class: "text-uppercase primary--text",
      },
      {
        text: "no. of members",
        value: "members",
        class: "text-uppercase primary--text",
      },
      {
        text: "add members",
        value: "add",
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
        name: "Speaker's Office",
        members: "20",
      },
      {
        name: "Finance",
        members: "18",
      },
      {
        name: "IT",
        members: "45",
      },
    ],
    // create
    name: "",
    addLoader: false,
    addDialog: false,
    // edit
    editDialog: false,
    editName: "",
    editLoader: false,
    // delete
    deleteDialog: false,
    deleteLoader: false,
    itemToDeleteId: "",
    // add members
    departmentToAddMembers: {},
    addMembersDialog: false,
    selectedMembers: [],
    addMembersLoader: false,
    // change role
    roleLoader: false,
  }),
  computed: {
    ...mapState(departmentStore, ["departments"]),
    ...mapState(memberStore, ["members"]),
  },
  methods: {
    ...mapActions(departmentStore, ["getDepartments"]),
    ...mapActions(memberStore, ["getMembers"]),
    createDepartment() {},
    saveChanges() {},
    deleteDepartment() {},
    addMembers() {},
    changeRole() {},
  },
  created() {
    // this.getDepartments();
    // this.getMembers();
  },
};
</script>

<style></style>

import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Nprogess from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/my-documents",
    name: "MyDocuments",
    component: () => import("../views/MyDocuments.vue"),
    children: [
      {
        path: "personal-documents",
        name: "PersonalDocuments",
        component: () =>
          import("../components/MyDocuments/PersonalDocuments.vue"),
      },
      {
        path: "incoming-documents",
        name: "IncomingDocuments",
        component: () =>
          import("../components/MyDocuments/IncomingDocuments.vue"),
      },
      {
        path: "outbound-documents",
        name: "OutBoundDocuments",
        component: () =>
          import("../components/MyDocuments/OutBoundDocuments.vue"),
      },
    ],
  },
  {
    path: "/approvals",
    name: "Approvals",
    component: () => import("../views/Approvals.vue"),
    children: [
      {
        path: "outbound",
        name: "ApprovalOutbound",
        component: () => import("../components/Approvals/OutBound.vue"),
      },
      {
        path: "my-approvals",
        name: "MyApprovals",
        component: () => import("../components/Approvals/ForMyApproval.vue"),
      },
    ],
  },
  {
    path: "/workflow",
    name: "WorkFlow",
    component: () => import("../views/Workflow.vue"),
  },
  {
    path: "/departments",
    name: "Departments",
    component: () => import("../views/Departments.vue"),
    children: [
      {
        path: "documents",
        name: "DepartmentDocuments",
        component: () => import("../components/Departments/Documents.vue"),
      },
      {
        path: "approvals",
        name: "DepartmentApprovals",
        component: () => import("../components/Departments/Approvals.vue"),
      },
      {
        path: "other-departments",
        name: "OtherDepartments",
        component: () =>
          import("../components/Departments/OtherDepartment.vue"),
      },
    ],
  },
  {
    path: "/cabinet",
    name: "Cabinet",
    component: () => import("../views/Cabinet.vue"),
  },
  {
    path: "/indexes",
    name: "Index",
    component: () => import("../views/Indexes.vue"),
  },
  // management routes
  {
    path: "/users-management",
    name: "UsersManagement",
    component: () => import("../views/Management/Users.vue"),
  },
  {
    path: "/departments-management",
    name: "DepartmentsManagement",
    component: () => import("../views/Management/Departments.vue"),
  },
  {
    path: "/announcements-management",
    name: "AnnouncementsManagement",
    component: () => import("../views/Management/Announcements.vue"),
  },
  {
    path: "/rooms-management",
    name: "ChatRoomsManagement",
    component: () => import("../views/Management/ChatRooms.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  Nprogess.start();
  // if (to.name === "Login") {
  //   next();
  // } else
  if (to.name !== "Login" && !localStorage.getItem("token")) {
    next({ name: "Login" });
  } else next();
});

router.afterEach(() => {
  Nprogess.done();
});

export default router;

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
    ],
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

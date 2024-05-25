import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/views/LoginView.vue";
// import HomeView from "@/views/HomeView.vue";
import DashboardView from "@/views/DashboardView.vue";
import ProductView from "@/views/ProductView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import OrderView from "@/views/OrderView.vue";
import UserView from "@/views/UserView.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    children: [
      {
        path: "products",
        name: "products",
        component: ProductView,
      },
      {
        path: "categories",
        name: "categories",
        component: CategoriesView,
      },
      {
        path: "orders",
        name: "orders",
        component: OrderView,
      },
      {
        path: "users",
        name: "users",
        component: UserView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

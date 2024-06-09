import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import ProductView from "@/views/ProductView.vue";
import ManagerProductView from "@/views/ManagerProductView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import OrderView from "@/views/OrderView.vue";
import UserView from "@/views/UserView.vue";
import AdminView from "@/views/AdminView.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardView,
      },
      {
        path: "products",
        name: "products",
        component: ProductView,
      },
      {
        path: "products/mng/:id?",
        name: "products-mng",
        component: ManagerProductView,
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

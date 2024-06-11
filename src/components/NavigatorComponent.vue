<template>
  <div class="flex flex-column" style="width: 100%">
    <div class="bg-blue-500 p-2 mb-2 text-white">Menu</div>
    <Button
      v-for="(item, index) in listNav"
      :key="index"
      class="p-2 my-1 border-round"
      :class="{ 'bg-gray-400': index === tabActived }"
      @click="clickItem(index)"
    >
      <span :class="item.icon"></span>
      <span class="ml-2">{{ item.label }}</span>
    </Button>
  </div>
</template>

<script lang="ts">
import Button from "primevue/button";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

interface MenuItem {
  label: string;
  icon: string;
  to: string;
}

export default defineComponent({
  name: "NavigatorComponent",
  components: {
    Button,
  },
  setup() {
    const router = useRouter();
    const tabActived = ref<number>(0);
    const listNav = ref<MenuItem[]>([
      { label: "Dashboard", icon: "pi pi-home", to: "/admin/dashboard" },
      {
        label: "Products",
        icon: "pi pi-shopping-cart",
        to: "/admin/products",
      },
      { label: "Categories", icon: "pi pi-tags", to: "/admin/categories" },
      { label: "Brands", icon: "pi pi-tags", to: "/admin/brands" },
      { label: "Orders", icon: "pi pi-shopping-cart", to: "/admin/orders" },
      { label: "Users", icon: "pi pi-user", to: "/admin/users" },
    ]);

    const toggleMenu = () => {
      console.log("toggle menu");
    };

    const clickItem = (index: number) => {
      tabActived.value = index;
      router.push(listNav.value[index].to);
    };
    return { tabActived, listNav, toggleMenu, clickItem };
  },
});
</script>

<template>
  <div
    class="w-full flex align-items-center h-3rem mb-2 p-1 bg-primary border-2 border-round-md"
  >
    <div
      class="flex align-items-center justify-content-center h-full font-medium text-4xl"
      style="width: 20%"
    >
      LAZY STORE
    </div>
    <InputText
      placeholder="Search"
      type="text"
      class="h-full ml-2"
      style="width: 30%"
    />
    <div
      class="bg-grey-200 h-full ml-2 flex justify-content-center align-items-center border-1 border-grey-300 border-round-sm"
      style="aspect-ratio: 1"
    >
      <i class="pi pi-search"></i>
    </div>

    <Menubar class="bg-blue-200 h-full ml-2 flex-1" :model="items">
      <template #item="{ item, props }">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <i :class="item.icon"></i>
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2">
          <Avatar image="https://i.pravatar.cc/100?u=1" shape="circle"></Avatar>
          <p>Admin</p>
          <Button
            icon="pi pi-power-off"
            class="p-button-rounded p-button-text"
            @click="logout"
          ></Button>
        </div>
      </template>
    </Menubar>
  </div>
  <div class="grid">
    <div class="col-2">
      <NavigatorComponent />
    </div>
    <div class="col-10">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

export default defineComponent({
  components: { NavigatorComponent, Button, Menubar, InputText, Avatar },
  setup() {
    const router = useRouter();

    const toast = useToast();

    const items = ref([
      {
        label: "Messages",
        icon: "pi pi-envelope",
      },
      {
        label: "Notifications",
        icon: "pi pi-bell",
      },
    ]);

    const logout = () => {
      sessionStorage.removeItem("token");
      router.push("/login");
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Logged out successfully",
        life: 3000,
      });
    };
    return { items, logout };
  },
});
</script>

<style scoped>
.navigator {
  background-color: #f4f4f4;
  border-right: 1px solid #e0e0e0;
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.navigator-show {
  transform: translateX(0);
}
</style>

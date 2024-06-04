<template>
  <div class="w-full flex h-3rem mb-2">
    <div
      class="flex w-full h-full bg-primary justify-content-end pr-3 align-items-center"
      style="background-color: aqua"
    >
      <h1>Admin</h1>
    </div>
  </div>
  <div class="grid">
    <div class="col-2">
      <NavigatorComponent />
    </div>
    <div class="col-10">
      <div class="flex">
        <Button class="block" icon="pi pi-bars" @click="toggleNavigator">
        </Button>
      </div>
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import Button from "primevue/button";

export default defineComponent({
  components: { NavigatorComponent, Button },
  setup() {
    const isShowNavigator = ref<boolean>(false);
    const toggleNavigator = () => {
      isShowNavigator.value = !isShowNavigator.value;
    };
    return { isShowNavigator, toggleNavigator };
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

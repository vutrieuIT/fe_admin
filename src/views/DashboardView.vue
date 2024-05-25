<template>
  <div class="grid">
    <div class="navigator col-2" :class="{ hidden: !isShowNavigator }">
      <NavigatorComponent />
    </div>
    <div class="col-10">
      <div class="flex">
        <Button
          class="block"
          icon="pi pi-bars"
          @click="toggleNavigator"
        ></Button>
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

<style scoped></style>

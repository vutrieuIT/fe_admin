<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Edit Profile"
    :style="{ width: '25rem' }"
  >
    <span class="p-text-secondary block mb-5">Update your information.</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-6rem">Username</label>
      <InputText
        v-model="dataModel.name"
        id="username"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="role" class="font-semibold w-6rem">role</label>
      <Dropdown
        v-model="dataModel.role"
        id="role"
        class="flex-auto"
        :options="roleOptions"
        optionLabel="name"
        optionValue="value"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="cancel"
      ></Button>
      <Button type="button" label="Save" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import User from "@/dto/userDto";

export default defineComponent({
  components: {
    Dialog,
    InputText,
    Button,
    Dropdown,
  },
  props: {
    visible: Boolean,
    data: Object as () => User,
  },
  emits: ["update:visible", "save"],
  setup(props, context) {
    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => context.emit("update:visible", value),
    });
    const save = () => {
      visibleModel.value = false;
      context.emit("save", dataModel.value);
      console.log("Save", dataModel.value);
    };
    const cancel = () => {
      context.emit("update:visible", false);
      console.log("Cancel");
    };
    const dataModel = computed(() => props.data as User);

    const roleOptions = [
      { name: "Admin", value: "admin" },
      { name: "User", value: "user" },
    ];
    return { visibleModel, dataModel, roleOptions, save, cancel };
  },
});
</script>

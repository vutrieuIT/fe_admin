<template>
  <Dialog
    v-model:visible="visibleModel"
    header="Category"
    :modal="true"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-6rem">Name</label>
      <InputText
        class="flex-auto"
        autocomplete="off"
        id="name"
        v-model="dataModel.name"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label class="font-semibold w-6rem" for="slug">Slug</label>
      <InputText
        class="flex-auto"
        autocomplete="off"
        id="slug"
        v-model="dataModel.slug"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label class="font-semibold w-6rem" for="status">Status</label>
      <Dropdown
        class="flex-auto"
        id="status"
        v-model="dataModel.status"
        :options="statusOptions"
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
import CategoryDto from "@/dto/categoryDto";

export default defineComponent({
  components: {
    Dialog,
    InputText,
    Button,
    Dropdown,
  },
  props: {
    visible: Boolean,
    data: Object,
  },
  emits: ["update:visible", "save"],
  setup(props, context) {
    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => context.emit("update:visible", value),
    });

    const dataModel = computed(() => props.data as CategoryDto);

    const statusOptions = [
      { name: "Active", value: "active" },
      { name: "Inactive", value: "inactive" },
    ];

    const save = () => {
      visibleModel.value = false;
      context.emit("save", dataModel.value);
      console.log("Save", dataModel.value);
    };

    const cancel = () => {
      context.emit("update:visible", false);
      console.log("Cancel");
    };
    return {
      visibleModel,
      dataModel,
      statusOptions,
      save,
      cancel,
    };
  },
});
</script>

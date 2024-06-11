<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Order"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-6rem">name</label>
      <InputText
        v-model="dataModel.name"
        id="name"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="slug" class="font-semibold w-6rem">slug</label>
      <InputText
        v-model="dataModel.slug"
        id="slug"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="country" class="font-semibold w-6rem">country</label>
      <Dropdown
        editable
        v-model="dataModel.country"
        :options="countryOptions"
        id="country"
        optionLabel="label"
        optionValue="value"
        class="flex-auto"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="showHide" class="font-semibold w-6rem">showHide</label>
      <Dropdown
        v-model="dataModel.showHide"
        :options="[
          { label: 'Show', value: '1' },
          { label: 'Hide', value: '0' },
        ]"
        id="showHide"
        class="flex-auto"
        optionLabel="label"
        optionValue="value"
      />
    </div>
    <template #footer>
      <Button
        label="Cancel"
        @click="$emit('update:visible', false)"
        class="p-button-secondary"
      ></Button>
      <Button
        label="Save"
        @click="$emit('save', dataModel)"
        class="mr-2"
      ></Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import BrandDto from "@/dto/brandDto";

export default defineComponent({
  components: {
    Dialog,
    InputText,
    Dropdown,
    Button,
  },
  props: {
    visible: Boolean,
    data: Object,
  },
  emits: ["update:visible", "save"],

  setup(props, context) {
    const countryOptions = [
      { label: "Việt Nam", value: "Việt Nam" },
      { label: "Mỹ", value: "Mỹ" },
      { label: "Nhật Bản", value: "Nhật Bản" },
    ];

    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => context.emit("update:visible", value),
    });

    const dataModel = computed(() => props.data as BrandDto);

    return {
      countryOptions,
      visibleModel,
      dataModel,
    };
  },
});
</script>

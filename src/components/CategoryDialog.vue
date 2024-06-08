<template>
  <Dialog
    v-model:visible="visibleModel"
    header="Category"
    :modal="true"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-6rem">Name</label>
      <div class="flex flex-column flex-auto">
        <InputText
          autocomplete="off"
          id="name"
          v-model="dataModel.name"
          required
        />
        <small id="username-help" v-if="validateModel.name">
          {{ validateModel.name }}
        </small>
      </div>
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label class="font-semibold w-6rem" for="slug">Slug</label>
      <div class="flex flex-column flex-auto">
        <InputText
          class="flex-auto"
          autocomplete="off"
          id="slug"
          v-model="dataModel.slug"
          required
        />
        <small id="username-help" v-if="validateModel.slug">
          {{ validateModel.slug }}
        </small>
      </div>
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label class="font-semibold w-6rem" for="status">Show/hide</label>
      <Dropdown
        class="flex-auto"
        id="status"
        v-model="dataModel.show_hide"
        :options="showHideOptions"
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
import { computed, defineComponent, ref } from "vue";
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
    const validateModel = ref({
      name: "",
      slug: "",
    } as CategoryDto);

    const showHideOptions = [
      { name: "Show", value: true },
      { name: "Hide", value: false },
    ];

    const save = () => {
      if (!validate()) {
        console.log("validate failed");
        return;
      }
      console.log("validate success", dataModel.value);
      visibleModel.value = false;
      context.emit("save", dataModel.value);
    };

    const cancel = () => {
      validateModel.value = {
        name: "",
        slug: "",
      } as CategoryDto;
      context.emit("update:visible", false);
    };

    const validate = () => {
      const errors = {} as CategoryDto;
      if (!dataModel.value.name) {
        errors.name = "Name is required";
      } else {
        errors.name = "";
      }
      if (!dataModel.value.slug) {
        errors.slug = "Slug is required";
      } else {
        errors.slug = "";
      }
      validateModel.value = errors;

      if (errors.name || errors.slug) {
        console.log("validate", errors);
        return false;
      } else {
        return true;
      }
    };
    return {
      visibleModel,
      dataModel,
      showHideOptions,
      validateModel,
      validate,
      save,
      cancel,
    };
  },
});
</script>

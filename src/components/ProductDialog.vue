<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Product"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="product name" class="font-semibold w-6rem">
        Product name
      </label>
      <InputText
        v-model="dataModel.name"
        id="product name"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="category" class="font-semibold w-6rem">Category</label>
      <Dropdown
        v-model="dataModel.category"
        :options="categoryOptions"
        id="category"
        class="flex-auto"
        autocomplete="off"
        optionLabel="name"
        optionValue="value"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="image" class="font-semibold w-6rem">Image</label>
      <InputText
        v-model="dataModel.image"
        id="image"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="color" class="font-semibold w-6rem">Color</label>
      <InputText
        v-model="dataModel.color"
        id="color"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-6rem">Price</label>
      <InputNumber
        v-model="dataModel.price"
        id="username"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-6rem">Amount</label>
      <InputNumber
        v-model="dataModel.amount"
        id="username"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="$emit('update:visible', false)"
      ></Button>
      <Button type="button" label="Save" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import ProductDto from "@/dto/productDto";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";

export default defineComponent({
  components: {
    Dialog,
    Button,
    InputText,
    InputNumber,
    Dropdown,
  },
  props: {
    visible: Boolean,
    data: Object,
  },
  emits: ["update:visible", "save"],
  setup(props, context) {
    const categoryOptions = [
      { name: "Category 1", value: "1" },
      { name: "Category 2", value: "2" },
      { name: "Category 3", value: "3" },
    ];

    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => context.emit("update:visible", value),
    });

    const dataModel = computed(() => props.data as ProductDto);

    const save = () => {
      visibleModel.value = false;
      context.emit("save", dataModel.value);
    };

    return {
      categoryOptions,
      visibleModel,
      dataModel,
      save,
    };
  },
});
</script>

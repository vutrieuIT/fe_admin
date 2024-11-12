<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Product"
    :style="{ width: '30rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="color" class="font-semibold w-6rem"> Màu </label>
      <Dropdown
        v-model="dataModel.color"
        :options="colorList"
        id="color"
        class="flex-auto"
        optionLabel="name"
        optionValue="name"
        :disabled="isEdit"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="quantity" class="font-semibold w-6rem"> Số lượng </label>
      <InputNumber
        v-model="dataModel.quantity"
        id="quantity"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button label="Cancel" @click="visibleModel = false"> Hủy </Button>
        <Button label="Save" @click="save"> Lưu </Button>
      </div>
    </template>
  </Dialog>
  <ConfirmDialog />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import { ColorVariant, Specification } from "@/dto/productAdminDto";
import InputNumber from "primevue/inputnumber";
import colorList from "@/dto/color";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

export default defineComponent({
  name: "ProductVariationDialog",
  components: {
    Dialog,
    InputNumber,
    Dropdown,
    ConfirmDialog,
    Button,
  },
  props: {
    visible: Boolean,
    data: {
      type: Object as () => ColorVariant,
      required: false,
      default: () => {
        return {
          color: "",
          quantity: 0,
        };
      },
    },
    specification: {
      type: Object as () => Specification,
      required: true,
    },
    categoryOptions: Array,
    brandOptions: Array,
  },
  emits: ["update:visible", "update:specification", "save"],
  setup(props, ctx) {
    const isEdit = computed(() => props.data.color !== "");

    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => {
        ctx.emit("update:visible", value);
      },
    });

    const dataModel = ref({
      color: props.data.color,
      quantity: props.data.quantity,
    });

    const specificationModel = computed({
      get: () => props.specification,
      set: (value) => {
        ctx.emit("update:specification", value);
      },
    });

    watch(
      () => props.data,
      (newData) => {
        dataModel.value = { ...newData };
      },
      { immediate: true }
    );

    const save = async () => {
      const existingVariantIndex =
        specificationModel.value.colorVariant.findIndex(
          (x: ColorVariant) => x.color === dataModel.value.color
        );

      if (existingVariantIndex >= 0) {
        specificationModel.value.colorVariant[existingVariantIndex].quantity =
          dataModel.value.quantity;
      } else {
        specificationModel.value.colorVariant.push({ ...dataModel.value });
      }

      ctx.emit("save", dataModel.value);
      visibleModel.value = false;
    };

    return {
      isEdit,
      colorList,
      visibleModel,
      dataModel,
      save,
    };
  },
});
</script>

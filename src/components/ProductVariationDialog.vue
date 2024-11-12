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
import { defineComponent, computed, ref } from "vue";
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
    const file = ref<File | undefined | null>(null);
    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => {
        ctx.emit("update:visible", value);
      },
    });
    const dataModel = computed(() => props.data);
    const specificationModel = computed({
      get: () => props.specification,
      set: (value) => {
        ctx.emit("update:specification", value);
      },
    });
    const save = async () => {
      specificationModel.value.colorVariant.some(
        (x: ColorVariant) => x.color === dataModel.value.color
      )
        ? (specificationModel.value.colorVariant =
            specificationModel.value.colorVariant.map((x) =>
              x.color === dataModel.value.color
                ? { ...x, quantity: dataModel.value.quantity }
                : x
            ))
        : specificationModel.value.colorVariant.push(dataModel.value);

      ctx.emit("save", dataModel.value);
      visibleModel.value = false;
    };

    return {
      file,
      colorList,
      visibleModel,
      dataModel,
      save,
    };
  },
});
</script>

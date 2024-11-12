<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Phiên bản sản phẩm"
    :style="{ width: '30rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="color" class="font-semibold w-6rem"> Bộ nhớ </label>
      <InputNumber
        v-model="specificationModel.internalMemory"
        id="color"
        class="flex-auto"
        suffix="GB"
        :disabled="isEdit"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="quantity" class="font-semibold w-6rem"> Giá </label>
      <InputNumber
        v-model="specificationModel.price"
        id="quantity"
        class="flex-auto"
        suffix="VND"
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
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import { Specification } from "@/dto/productAdminDto";
import InputNumber from "primevue/inputnumber";
import colorList from "@/dto/color";
import Button from "primevue/button";

export default defineComponent({
  name: "ProductSpecificationDialog",
  components: {
    Dialog,
    InputNumber,
    Button,
  },
  props: {
    visible: Boolean,
    specification: {
      type: Object as () => Specification,
      required: false,
      default: () => ({
        internalMemory: 0,
        price: 0,
        colorVariant: [],
      }),
    },
    categoryOptions: Array,
    brandOptions: Array,
  },
  emits: ["update:visible", "update:specification", "save"],
  setup(props, ctx) {
    const isEdit = computed(() => props.specification.internalMemory !== 0);

    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => {
        ctx.emit("update:visible", value);
      },
    });

    const specificationModel = ref<Specification>({ ...props.specification });

    watch(
      () => props.specification,
      (newData) => {
        specificationModel.value = { ...newData };
      },
      { immediate: true }
    );

    const save = async () => {
      console.log(specificationModel.value);
      ctx.emit("save", specificationModel.value);
      visibleModel.value = false;
    };

    return {
      isEdit,
      colorList,
      visibleModel,
      specificationModel,
      save,
    };
  },
});
</script>

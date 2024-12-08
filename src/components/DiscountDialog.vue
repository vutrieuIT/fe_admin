<template>
  <Dialog
    header="Quản lý khuyến mãi"
    modal
    closable
    v-model:visible="visibleModel"
    style="width: 80%; max-width: 700px"
  >
    <div class="grid mt-4">
      <div class="col-2 text-left" for="name">Mã khuyến mãi</div>
      <div class="col-4">
        <InputText
          class="text-left"
          id="name"
          v-model="dataModel.code"
          :disabled="dataModel.status === 'used'"
        />
      </div>
      <div class="col-2 text-left" for="discount">Giảm giá</div>
      <div class="col-4">
        <InputNumber
          class="text-left"
          id="discount"
          v-model="dataModel.discount"
          :disabled="dataModel.status === 'used'"
        />
      </div>
      <div class="col-2 text-left" for="discountType">Loại giảm giá</div>
      <div class="col-4">
        <Dropdown
          class="text-left w-full"
          v-model="dataModel.discountType"
          :options="DISCOUNT_TYPE_CONST"
          optionLabel="name"
          optionValue="value"
          :disabled="dataModel.status === 'used'"
        />
      </div>

      <div class="col-2 text-left" for="status">Trạng thái</div>
      <div class="col-4">
        <Dropdown
          class="text-left w-full"
          v-model="dataModel.status"
          :options="DISCOUNT_STATUS_CONST"
          optionLabel="label"
          optionValue="value"
          :disabled="dataModel.status === 'used'"
        />
      </div>

      <div class="col-2 text-left" for="startDate">Ngày bắt đầu</div>
      <Calendar
        class="col-4 text-left"
        v-model="dataModel.startDate"
        :disabled="dataModel.status === 'used'"
      />
      <div class="col-2 text-left" for="endDate">Ngày kết thúc</div>
      <Calendar
        class="col-4 text-left"
        v-model="dataModel.endDate"
        :disabled="dataModel.status === 'used'"
      />
    </div>

    <template #footer>
      <div class="flex justify-end">
        <Button
          label="Hủy"
          class="p-button-text"
          @click="visibleModel = false"
        />
        <Button label="Lưu" class="p-button-primary" @click="save" />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import DISCOUNT_TYPE_CONST from "@/constants/discountTypeConst";
import DISCOUNT_STATUS_CONST from "@/constants/discountStatusConst";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import DiscountDto from "@/dto/discountDto";

export default defineComponent({
  name: "DiscountDialog",
  components: {
    Dialog,
    InputText,
    Dropdown,
    Calendar,
    InputNumber,
    Button,
  },
  props: {
    visible: Boolean,
    data: {
      type: Object as () => DiscountDto,
      default: () => ({}),
    },
  },
  emits: ["update:visible", "update:data", "save"],
  setup(prop, ctx) {
    const visibleModel = computed({
      get: () => prop.visible,
      set: (value) => {
        ctx.emit("update:visible", value);
      },
    });

    const dataModel = computed({
      get: () => prop.data,
      set: (value) => {
        ctx.emit("update:data", value);
      },
    });

    watch(
      () => prop.data,
      (value) => {
        dataModel.value = value;
      },
      { deep: true }
    );

    const save = () => {
      ctx.emit("save", dataModel.value);
    };

    return {
      visibleModel,
      dataModel,
      DISCOUNT_TYPE_CONST,
      DISCOUNT_STATUS_CONST,
      save,
    };
  },
});
</script>

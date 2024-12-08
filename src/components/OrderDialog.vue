<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Order"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="id" class="font-semibold w-6rem">Mã đơn hàng</label>
      <InputText
        disabled
        v-model="dataModel.id"
        id="id"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="user" class="font-semibold w-6rem">Khách hàng</label>
      <InputText
        disabled
        v-model="dataModel.userId"
        id="user"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="status" class="font-semibold w-6rem">Trạng thái</label>
      <Dropdown
        v-model="dataModel.status"
        :options="statusOptions"
        id="status"
        optionLabel="label"
        optionValue="value"
        class="flex-auto"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="paymentStatus" class="font-semibold w-6rem">Thanh toán</label>
      <Dropdown
        v-model="dataModel.paymentStatus"
        :options="paymentOptions"
        id="paymentStatus"
        optionLabel="label"
        optionValue="value"
        class="flex-auto"
      />
    </div>
    <template #footer>
      <Button
        type="button"
        severity="secondary"
        label="Cancel"
        @click="$emit('update:visible', false)"
      ></Button>
      <Button
        type="button"
        severity="secondary"
        label="Save"
        @click="$emit('save', dataModel)"
      ></Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import OrderDto from "@/dto/orderDto";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

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
    const statusOptions = [
      { label: "Chờ xác nhận", value: "Chờ xác nhận" },
      { label: "Xác nhận", value: "Xác nhận" },
      { label: "Đang giao", value: "Đang giao" },
      { label: "Đã giao", value: "Đã giao" },
      { label: "Đã hủy", value: "Đã hủy" },
    ];

    const paymentOptions = [
      { label: "Chưa thanh toán", value: "Chưa thanh toán" },
      { label: "Đã thanh toán", value: "Đã thanh toán" },
    ];

    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => context.emit("update:visible", value),
    });

    const dataModel = computed(() => props.data as OrderDto);

    return {
      statusOptions,
      paymentOptions,
      visibleModel,
      dataModel,
    };
  },
});
</script>

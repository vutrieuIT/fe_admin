<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Order"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="id" class="font-semibold w-6rem">id</label>
      <InputText
        disabled
        v-model="dataModel.order_number"
        id="id"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="user" class="font-semibold w-6rem">user</label>
      <InputText
        disabled
        v-model="dataModel.full_name"
        id="user"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="status" class="font-semibold w-6rem">status</label>
      <Dropdown
        v-model="dataModel.status"
        :options="statusOptions"
        id="status"
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
      { label: "Paid", value: "paid" },
      { label: "Pending", value: "pending" },
      { label: "Unpaid", value: "unpaid" },
    ];

    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => context.emit("update:visible", value),
    });

    const dataModel = computed(() => props.data as OrderDto);

    return {
      statusOptions,
      visibleModel,
      dataModel,
    };
  },
});
</script>

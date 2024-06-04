<template>
  <div>Orders</div>
  <DataTable :value="data" header="Order">
    <Column field="id" header="ID"></Column>
    <Column field="user" header="User"></Column>
    <Column field="total" header="Total"></Column>
    <Column field="status" header="Status"></Column>
    <Column field="createDate" header="Create Date"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="editOrder(slotProps.data)">Edit</Button>
      </template>
    </Column>
  </DataTable>

  <OrderDialog v-model:visible="visible" :data="selectedOrder" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import OrderDto from "@/dto/orderDto";
import Button from "primevue/button";
import OrderDialog from "@/components/OrderDialog.vue";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
    OrderDialog,
  },
  setup() {
    const data = [
      {
        id: 1,
        user: "John Doe",
        total: 50,
        status: "Delivered",
        createDate: "2021-01-01",
      },
      {
        id: 2,
        user: "Jane Doe",
        total: 100,
        status: "Pending",
        createDate: "2021-01-01",
      },
    ];

    const visible = ref(false);
    const selectedOrder = ref({} as OrderDto);

    const editOrder = (data: unknown) => {
      selectedOrder.value = { ...(data as OrderDto) };
      visible.value = true;
      console.log(data);
    };

    return {
      data,
      visible,
      selectedOrder,
      editOrder,
    };
  },
});
</script>

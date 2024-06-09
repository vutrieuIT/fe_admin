<template>
  <div class="text-2xl">Orders</div>
  <DataTable :value="data" header="Order">
    <Column field="order_number" header="order id"></Column>
    <Column field="full_name" header="User"></Column>
    <Column field="total" header="Total"></Column>
    <Column field="status" header="Status"></Column>
    <Column field="date_create" header="Create Date"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="editOrder(slotProps.data)">Edit</Button>
      </template>
    </Column>
  </DataTable>

  <OrderDialog v-model:visible="visible" :data="selectedOrder" @save="save" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import OrderDto from "@/dto/orderDto";
import Button from "primevue/button";
import OrderDialog from "@/components/OrderDialog.vue";
import { useToast } from "primevue/usetoast";
import ApiUtils from "@/util/apiUtil";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
    OrderDialog,
  },
  setup() {
    const toast = useToast();

    const data = ref([] as OrderDto[]);

    const visible = ref(false);
    const selectedOrder = ref({} as OrderDto);

    const editOrder = (data: unknown) => {
      selectedOrder.value = { ...(data as OrderDto) };
      visible.value = true;
      console.log(data);
    };

    const save = (data: OrderDto) => {
      console.log(data);
      visible.value = false;
      ApiUtils.put("/api/order", data)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Order saved",
            life: 3000,
          });
          callApiInit();
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Order save failed",
            life: 3000,
          });
        });
    };

    //
    const callApiInit = async () => {
      await ApiUtils.get("/api/order")
        .then((response) => {
          data.value = response.data.orders;
          console.log(response.data.orders);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    callApiInit();

    return {
      data,
      visible,
      selectedOrder,
      editOrder,
      save,
    };
  },
});
</script>

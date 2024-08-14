<template>
  <div class="text-2xl">Orders</div>
  <DataTable
    :value="data"
    v-model:rows="rows"
    v-model:first="first"
    :paginator="true"
    paginatorPosition="top"
    :rowsPerPageOptions="[5, 10, 20]"
    header="Order"
  >
    <Column field="order_number" header="order id"></Column>
    <Column field="full_name" header="User"></Column>
    <Column field="total" header="Total"></Column>
    <Column field="status" header="Status"></Column>
    <Column field="date_create" header="Create Date"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="editOrder(slotProps.data)">Edit</Button>
        <Button class="ml-2" @click="getOrderDetail(slotProps.data)">
          Detail
        </Button>
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
import router from "@/router";

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
    const rows = ref(5);
    const first = ref(0);

    const editOrder = (data: unknown) => {
      selectedOrder.value = { ...(data as OrderDto) };
      visible.value = true;
    };

    const getOrderDetail = (data: OrderDto) => {
      router.push(`/admin/orders/detail/${data.id}`);
    };

    const save = (data: OrderDto) => {
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
      await ApiUtils.get("/api/order").then((response) => {
        data.value = response.data.orders;
      });
    };

    callApiInit();

    return {
      data,
      rows,
      first,
      visible,
      selectedOrder,
      editOrder,
      getOrderDetail,
      save,
    };
  },
});
</script>

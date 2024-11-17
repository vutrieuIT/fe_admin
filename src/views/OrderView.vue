<template>
  <div class="text-2xl">Đơn hàng</div>
  <DataTable
    :value="data"
    v-model:rows="rows"
    v-model:first="first"
    :paginator="true"
    paginatorPosition="top"
    :rowsPerPageOptions="[5, 10, 20]"
    header="Order"
    :expandedRows="expandedRows"
    sortMode="multiple"
    removableSort
  >
    <Column expander style="width: 3em"></Column>
    <Column field="id" header="Mã đơn hàng"> </Column>
    <Column field="userId" header="Mã khách hàng"></Column>
    <Column field="totalBill" header="Tổng tiền" sortable></Column>
    <Column field="status" header="Trạng thái" sortable></Column>
    <Column field="paymentStatus" header="Thanh toán" sortable></Column>
    <Column field="paymentType" header="Kiểu thanh toán" sortable></Column>
    <Column header="Ngày tạo" sortable>
      <template #body="slotProps">
        {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button class="ml-2" @click="editOrder(slotProps.data)"
          >Cập nhật</Button
        >
        <Button class="ml-2 mt-1" @click="goToGHNOrder(slotProps.data)"
          >Đơn GHN</Button
        >
      </template>
    </Column>
    <template #expansion="slotProps">
      <DataTable :value="slotProps.data.items">
        <Column field="productId" header="Product ID"></Column>
        <Column field="internalMemory" header="Bộ nhớ"></Column>
        <Column field="color" header="Màu"></Column>
        <Column field="price" header="Giá"></Column>
        <Column field="quantity" header="Số lượng"></Column>
      </DataTable>
    </template>
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
    const expandedRows = ref([]);

    const editOrder = (data: unknown) => {
      selectedOrder.value = { ...(data as OrderDto) };
      visible.value = true;
    };

    const save = (data: OrderDto) => {
      visible.value = false;
      ApiUtils.put("/api/mongo/order", data)
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

    const goToGHNOrder = (order: OrderDto) => {
      router.push(`/admin/orders/ghn/${order.id}`);
    };

    //
    const callApiInit = async () => {
      await ApiUtils.get("/api/mongo/order")
        .then((response) => {
          data.value = response.data.orders;
          console.log(data.value);
        })
        .catch((err) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: err.response.data.message,
            life: 3000,
          });
        });
    };

    callApiInit();

    return {
      data,
      rows,
      first,
      visible,
      selectedOrder,
      expandedRows,
      editOrder,
      save,
      goToGHNOrder,
    };
  },
});
</script>

<template>
  <div class="text-2xl">Orders Details</div>
  <DataTable
    :value="data"
    v-model:rows="rows"
    v-model:first="first"
    :paginator="true"
    paginatorPosition="top"
    :rowsPerPageOptions="[5, 10, 20]"
    header="Order"
  >
    <Column field="id" header="item id"></Column>
    <Column field="product_name" header="Product Name"></Column>
    <Column header="Image">
      <template #body="slotProps">
        <img
          :src="slotProps.data.image_url"
          alt="image"
          style="width: 50px; height: 50px"
        />
      </template>
    </Column>
    <Column field="quantity" header="Quantity"></Column>
    <Column field="price" header="Price"></Column>
    <Column header="Total">
      <template #body="slotProps">
        {{ slotProps.data.quantity * slotProps.data.price }}$
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts">
import ApiUtils from "@/util/apiUtil";
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import OrderItemDto from "@/dto/orderItemDto";
import Column from "primevue/column";

export default defineComponent({
  name: "OrderDetailView",
  components: {
    DataTable,
    Column,
  },

  setup() {
    const router = useRouter();
    const orderId = router.currentRoute.value.params.id;
    const data = ref([] as OrderItemDto[]);
    const rows = ref(5);
    const first = ref(0);

    const getOrderDetail = async () => {
      await ApiUtils.get(`/api/order-detail/${orderId}`)
        .then((res) => {
          data.value = res.data?.order?.items;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // init
    onMounted(async () => {
      await getOrderDetail();
    });

    return {
      data,
      rows,
      first,
    };
  },
});
</script>

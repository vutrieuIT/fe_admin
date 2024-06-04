<template>
  <div>Products</div>
  <div class="flex justify-content-end pr-2">
    <Button @click="createProduct">Add Product</Button>
  </div>
  <DataTable :value="data" rowGroupMode="rowspan" groupRowsBy="name">
    <Column header="#" headerStyle="width:3rem">
      <template #body="slotProps">
        {{ slotProps.index + 1 }}
      </template>
    </Column>
    <Column field="name" header="Name"></Column>
    <Column field="image" header="Image"></Column>
    <Column field="color" header="Color"></Column>
    <Column field="price" header="Price"></Column>
    <Column field="status" header="Status"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="editProduct(slotProps.data)">Edit</Button>
        <Button class="ml-2" @click="deleteProduct(slotProps.data)">
          Delete
        </Button>
      </template>
    </Column>
  </DataTable>
  <ProductDialog v-model:visible="visible" :data="selectedProduct" />

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>
      Are you sure you want to delete this product? {{ selectedProduct.name }},
      color: {{ selectedProduct.color }}
    </p>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visibleConfirm = false"
      ></Button>
      <Button type="button" label="Delete" @click="callApiDetete"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { defineComponent, ref } from "vue";
import ProductDialog from "@/components/ProductDialog.vue";
import ProductDto from "@/dto/productDto";
import ApiUtils from "@/util/apiUtil";
import Dialog from "primevue/dialog";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
    ProductDialog,
    Dialog,
  },
  setup() {
    const data = ref([
      {
        id: 1,
        name: "Product 1",
        image: 1,
        color: "red",
        price: 100,
        amount: 10,
      },
      {
        id: 1,
        name: "Product 1",
        image: 2,
        color: "blue",
        price: 200,
        amount: 20,
      },
      {
        id: 2,
        name: "Product 2",
        image: 1,
        color: "red",
        price: 100,
        amount: 10,
      },
      {
        id: 2,
        name: "Product 2",
        image: 2,
        color: "blue",
        price: 200,
        amount: 20,
      },
    ]);

    const selectedProduct = ref({} as ProductDto);

    const visible = ref(false);
    const visibleConfirm = ref(false);

    const createProduct = () => {
      visible.value = true;
      console.log("createProduct");
    };

    const editProduct = (data: unknown) => {
      selectedProduct.value = { ...(data as ProductDto) };
      visible.value = true;
      console.log(data);
    };

    const deleteProduct = (data: unknown) => {
      selectedProduct.value = { ...(data as ProductDto) };
      visibleConfirm.value = true;
      console.log(data);
    };

    const callApiDetete = async () => {
      visibleConfirm.value = false;
      ApiUtils.delete(`/admin/product/${selectedProduct.value.id}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("call api error: Delete product");
        });
    };

    return {
      data,
      visible,
      visibleConfirm,
      selectedProduct,
      createProduct,
      editProduct,
      deleteProduct,
      callApiDetete,
    };
  },
});
</script>

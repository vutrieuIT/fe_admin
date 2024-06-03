<template>
  <div>Products</div>
  <div>
    <Button @click="visible = true">Add Product</Button>
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
  <ProductDialog :visible="true" :data="{}" />
</template>

<script lang="ts">
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
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
        type: [
          {
            image: 1,
            color: "red",
            price: 100,
            amount: 10,
          },
          {
            image: 2,
            color: "blue",
            price: 200,
            amount: 20,
          },
        ],
      },
    ]);

    const visible = ref(false);

    const editProduct = (data: any) => {
      console.log(data);
    };

    const deleteProduct = (data: any) => {
      console.log(data);
    };

    return { data, visible, editProduct, deleteProduct };
  },
});
</script>

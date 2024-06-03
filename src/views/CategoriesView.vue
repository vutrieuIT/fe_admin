<template>
  <div>Categories</div>
  <div class="flex justify-content-end pr-2">
    <Button @click="createCategory">Create</Button>
  </div>
  <DataTable :value="data">
    <Column field="name" header="Name"></Column>
    <Column field="slug" header="Slug"></Column>
    <Column field="status" header="Status"></Column>
    <Column field="created_at" header="Created At"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="editCategory(slotProps.data)">Edit</Button>
        <Button class="ml-2" @click="deleteCategory(slotProps.data)">
          Delete
        </Button>
      </template>
    </Column>
  </DataTable>

  <CategoryDialog :visible="true" :data="{}" />

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>
      Are you sure you want to delete this category? {{ selectedCategory.name }}
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
import { defineComponent, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import CategoryDialog from "@/components/CategoryDialog.vue";
import ApiUtils from "@/util/apiUtil";
import CategoryDto from "@/dto/categoryDto";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
    CategoryDialog,
  },
  setup() {
    const data = ref([
      {
        id: 1,
        created_at: "2021-09-01",
        name: "Category 1",
        parent_id: 0,
        slug: "category-1",
        status: "active",
      },
    ]);

    const selectedCategory = ref({} as CategoryDto);

    const visible = ref(false);
    const visibleConfirm = ref(false);

    const editCategory = (category: unknown) => {
      console.log(category);
    };

    const deleteCategory = async (category: unknown) => {
      selectedCategory.value = category as CategoryDto;
      visibleConfirm.value = true;
      await ApiUtils.delete(`/categories/${selectedCategory.value.id}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const createCategory = () => {
      console.log("Create Category");
    };

    const callApiInit = async () => {
      await ApiUtils.get("/categories")
        .then((response) => {
          data.value = response.data;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    callApiInit();

    const callApiDetete = async () => {
      visibleConfirm.value = false;
      await ApiUtils.delete(`/categories/${selectedCategory.value.id}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      data,
      selectedCategory,
      visible,
      visibleConfirm,
      editCategory,
      deleteCategory,
      createCategory,
      callApiDetete,
    };
  },
});
</script>

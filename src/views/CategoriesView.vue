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

  <CategoryDialog
    v-model:visible="visible"
    :data="selectedCategory"
    @save="save"
  />

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
  <Toast position="bottom-right" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import CategoryDialog from "@/components/CategoryDialog.vue";
import ApiUtils from "@/util/apiUtil";
import CategoryDto from "@/dto/categoryDto";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    CategoryDialog,
    Toast,
  },
  setup() {
    const toast = useToast();

    const data = ref([
      {
        id: 1,
        created_at: "2021-09-01",
        name: "Category 1",
        parent_id: 0,
        slug: "category-1",
        status: "active",
      },
      {
        id: 2,
        created_at: "2021-09-02",
        name: "Category 2",
        parent_id: 0,
        slug: "category-2",
        status: "active",
      },
    ]);

    const selectedCategory = ref({} as CategoryDto);

    const visible = ref(false);
    const visibleConfirm = ref(false);

    const editCategory = (category: unknown) => {
      visible.value = true;
      selectedCategory.value = { ...(category as CategoryDto) };
      console.log(category);
    };

    const deleteCategory = async (category: unknown) => {
      selectedCategory.value = { ...(category as CategoryDto) };
      visibleConfirm.value = true;
    };

    const createCategory = () => {
      selectedCategory.value = {} as CategoryDto;
      visible.value = true;
      console.log("Create Category");
    };

    const save = (category: CategoryDto) => {
      visible.value = false;
      ApiUtils.post("/categories", category)
        .then((response) => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Data saved",
            life: 3000,
          });
          console.log(response);
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Data saved",
            life: 3000,
          });
          console.log(error);
        });
    };

    const callApiInit = async () => {
      await ApiUtils.get("/categories")
        .then((response) => {
          data.value = response.data;
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
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Data deleted",
            life: 3000,
          });
          console.log(response);
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Data deleted",
            life: 3000,
          });
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
      save,
    };
  },
});
</script>

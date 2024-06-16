<template>
  <div class="text-2xl">Categories</div>
  <div class="flex justify-content-end pr-2">
    <Button @click="createCategory">Create</Button>
  </div>
  <DataTable :value="data">
    <Column field="name" header="Name"></Column>
    <Column field="slug" header="Slug"></Column>
    <Column field="position" header="Position"></Column>
    <Column field="show_hide" header="Show/Hide"></Column>
    <Column header="Created At">
      <template #body="slotProps">
        {{ new Date(slotProps.data.created_at).toLocaleDateString() }}
      </template>
    </Column>
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
import { useToast } from "primevue/usetoast";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    CategoryDialog,
  },
  setup() {
    const toast = useToast();

    const data = ref([]);

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

    const save = async (category: CategoryDto) => {
      console.log("save");
      visible.value = false;
      if (category.id) {
        await callApiUpdate(category);
      } else {
        await callApiCreate(category);
      }
    };

    const callApiCreate = async (category: CategoryDto) => {
      await ApiUtils.post("/api/danh-muc-san-pham", category)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "lưu danh mục thành công",
            life: 3000,
          });
          callApiInit();
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "lưu danh mục thất bại",
            life: 3000,
          });
          console.log(error);
        });
    };

    const callApiUpdate = async (category: CategoryDto) => {
      await ApiUtils.put(`/api/danh-muc-san-pham`, category)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "cập nhật danh mục thành công",
            life: 3000,
          });
          callApiInit();
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "cập nhật danh mục thất bại",
            life: 3000,
          });
          console.log(error);
        });
    };

    const callApiInit = async () => {
      await ApiUtils.get("/api/danh-muc-san-pham")
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
      await ApiUtils.delete(
        `/api/danh-muc-san-pham/${selectedCategory.value.id}`
      )
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "xóa danh mục thành công",
            life: 3000,
          });
          callApiInit();
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "xóa danh mục thất bại",
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

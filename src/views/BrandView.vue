<template>
  <div class="text-2xl">Brands</div>
  <div class="flex justify-content-end pr-2">
    <Button @click="showDialog">Add</Button>
  </div>
  <DataTable :value="data" header="Order">
    <Column field="name" header="Name"></Column>
    <Column field="slug" header="Slug"></Column>
    <Column field="country" header="Country"></Column>
    <Column field="created_at" header="Create Date"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="editBrand(slotProps.data)">Edit</Button>
        <Button class="ml-2" @click="deleteBrand(slotProps.data)">
          Delete
        </Button>
      </template>
    </Column>
  </DataTable>

  <BrandDialog
    v-model:visible="isShowDialog"
    :data="selectedBrand"
    @save="save"
  />

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>Are you sure you want to delete this brand? {{ selectedBrand.name }},</p>
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
import { defineComponent, onMounted, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import BrandDto from "@/dto/brandDto";
import ApiUtils from "@/util/apiUtil";
import { useToast } from "primevue/usetoast";
import BrandDialog from "@/components/BrandDialog.vue";
import Dialog from "primevue/dialog";
export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
    BrandDialog,
    Dialog,
  },
  setup() {
    const data = ref([] as BrandDto[]);
    const toast = useToast();

    const isShowDialog = ref(false);
    const visibleConfirm = ref(false);
    const selectedBrand = ref({} as BrandDto);

    const editBrand = (data: BrandDto) => {
      selectedBrand.value = data;
      isShowDialog.value = true;
    };

    const deleteBrand = (data: BrandDto) => {
      selectedBrand.value = data;
      visibleConfirm.value = true;
    };

    const callApiCreate = async (data: BrandDto) => {
      await ApiUtils.post("/api/thuong-hieu", data)
        .then((res) => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Created successfully",
            life: 3000,
          });
          isShowDialog.value = false;
          getBrands();
        })
        .catch((err) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Create failed",
            life: 3000,
          });
        });
    };

    const callApiEdit = async (data: BrandDto) => {
      await ApiUtils.put(`/api/thuong-hieu/${data.id}`, data)
        .then((res) => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Updated successfully",
            life: 3000,
          });
          isShowDialog.value = false;
          getBrands();
        })
        .catch((err) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Update failed",
            life: 3000,
          });
        });
    };

    const callApiDetete = async () => {
      await ApiUtils.delete(`/api/thuong-hieu/${selectedBrand.value.id}`)
        .then((res) => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Deleted successfully",
            life: 3000,
          });
          getBrands();
        })
        .catch((err) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Delete failed",
            life: 3000,
          });
        })
        .finally(() => {
          visibleConfirm.value = false;
        });
    };

    const save = async (data: BrandDto) => {
      console.log("save", data);

      if (data.id) {
        await callApiEdit(data);
      } else {
        await callApiCreate(data);
      }
    };

    const showDialog = () => {
      selectedBrand.value = {} as BrandDto;
      isShowDialog.value = true;
      console.log("show dialog", isShowDialog.value);
    };

    const getBrands = async () => {
      ApiUtils.get("/api/thuong-hieu")
        .then((res) => {
          data.value = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    //
    onMounted(() => {
      getBrands();
    });

    return {
      data,
      isShowDialog,
      selectedBrand,
      visibleConfirm,
      editBrand,
      deleteBrand,
      showDialog,
      save,
      callApiDetete,
    };
  },
});
</script>

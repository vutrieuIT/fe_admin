<template>
  <div class="text-2xl">Products</div>
  <div class="flex justify-content-end pr-2">
    <Button @click="createProduct">Add Product</Button>
  </div>
  <DataTable
    :value="data"
    v-model:rows="rows"
    v-model:first="first"
    :paginator="true"
    paginatorPosition="top"
    :rowsPerPageOptions="[5, 10, 20]"
    dataKey="id"
  >
    <Column field="name" header="Tên sản phẩm"></Column>
    <Column field="brandName" header="Thương hiệu"></Column>
    <Column field="isShow" header="hiển thị">
      <template #body="slotProps">
        <Button
          type="button"
          :label="slotProps.data[slotProps.field] ? 'Hiển thị' : 'Ẩn'"
          :icon="
            slotProps.data[slotProps.field] ? 'pi pi-eye' : 'pi pi-eye-slash'
          "
          :class="
            slotProps.data[slotProps.field]
              ? 'p-button-success'
              : 'p-button-danger'
          "
          @click="
            slotProps.data[slotProps.field] = !slotProps.data[slotProps.field]
          "
        ></Button>
      </template>
    </Column>
    <Column field="status" header="Trạng thái">
      <template #body="slotProps">
        <Button
          type="button"
          :label="PRODUCT_STATUS[slotProps.data[slotProps.field]]"
          :class="
            slotProps.data[slotProps.field] === '0'
              ? 'p-button-danger'
              : slotProps.data[slotProps.field] === '1'
              ? 'p-button-warning'
              : 'p-button-success'
          "
        ></Button>
      </template>
    </Column>
    <Column header="Action" headerStyle="width:8rem">
      <template #body="slotProps">
        <Button
          type="button"
          icon="pi pi-pencil"
          class="p-button-rounded p-button-success"
          @click="editProduct(slotProps.data)"
        ></Button>
        <Button
          type="button"
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger"
          @click="deleteProduct(slotProps.data)"
        ></Button>
      </template>
    </Column>
  </DataTable>
  <ProductDialog
    v-model:visible="visible"
    :data="selectedProduct"
    @save="save"
  />

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>Bạn có chắc chắn xóa sản phẩm này? {{ selectedProduct.name }}</p>
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
import { defineComponent, ref, inject, onMounted, watch } from "vue";
import ProductDialog from "@/components/ProductDialog.vue";
import ProductDto from "@/dto/productDto";
import ApiUtils from "@/util/apiUtil";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

type ProductStatus = {
  [key: string]: string;
};

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
    ProductDialog,
    Dialog,
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventBus = inject("eventBus") as any;
    const toast = useToast();
    const router = useRouter();
    const dataApi = ref([]);
    const data = ref([] as ProductDto[]);
    const selectedProduct = ref({} as ProductDto);
    const rows = ref(20);
    const first = ref(0);
    const expandedRows = ref({});
    const PRODUCT_STATUS = {
      "0": "hết hàng",
      "1": "sắp hêt hàng",
      "2": "còn hàng",
    } as ProductStatus;

    const visible = ref(false);
    const visibleConfirm = ref(false);

    watch(dataApi, (val) => {
      data.value = val;
    });

    const createProduct = () => {
      router.push("/admin/products/mng");
    };

    const editProduct = (data: ProductDto) => {
      router.push(`/admin/products/mng/${data.id}`);
    };

    const deleteProduct = (data: unknown) => {
      selectedProduct.value = { ...(data as ProductDto) };
      visibleConfirm.value = true;
    };

    const save = (data: ProductDto) => {
      visible.value = false;
      ApiUtils.post("/api/mongo/san-pham", data)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Lưu sản phẩm thành công",
            life: 3000,
          });
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "lưu sản phẩm thất bại",
            life: 3000,
          });
        });
    };

    const callApiDetete = async () => {
      visibleConfirm.value = false;
      ApiUtils.delete(`/api/mongo/san-pham/${selectedProduct.value.id}`)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "xóa sản phẩm thành công",
            life: 3000,
          });
          callApiInit();
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "xóa sản phẩm thất bại",
            life: 3000,
          });
        });
    };

    const callApiInit = async () => {
      await ApiUtils.get("/api/mongo/san-pham")
        .then((res) => {
          console.log(res.data);
          dataApi.value = res.data;
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "lấy dữ liệu sản phẩm thất bại",
            life: 3000,
          });
        });
    };

    // call when component created
    // callApiInit();
    eventBus.on("update:product", (data: string) => {
      if (data === "success") {
        callApiInit();
      }
    });

    onMounted(async () => {
      await callApiInit();
      console.log("dataApi", dataApi.value);
    });

    return {
      data,
      rows,
      first,
      visible,
      visibleConfirm,
      selectedProduct,
      //
      expandedRows,
      createProduct,
      editProduct,
      deleteProduct,
      callApiDetete,
      save,
      // constant
      PRODUCT_STATUS,
    };
  },
});
</script>

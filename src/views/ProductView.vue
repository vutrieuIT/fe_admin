<template>
  <div class="text-2xl">Products</div>
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
    <Column header="Image">
      <template #body="slotProps">
        <img
          :src="slotProps.data.image"
          alt="image"
          style="width: 50px; height: 50px"
        />
      </template>
    </Column>
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
  <ProductDialog
    v-model:visible="visible"
    :data="selectedProduct"
    @save="save"
  />

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>
      Are you sure you want to delete this variant? {{ selectedProduct.name }},
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
import { defineComponent, ref, watch, inject } from "vue";
import ProductDialog from "@/components/ProductDialog.vue";
import ProductDto from "@/dto/productDto";
import ApiUtils from "@/util/apiUtil";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import { convertToProductDtos } from "@/dto/productAdminDto";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    DataTable,
    Column,
    Button,
    ProductDialog,
    Dialog,
  },
  setup() {
    const eventBus = inject("eventBus") as any;
    const toast = useToast();
    const router = useRouter();

    const dataApi = ref([]);

    const data = ref([] as ProductDto[]);

    const selectedProduct = ref({} as ProductDto);

    watch(dataApi, (newVal) => {
      data.value = convertToProductDtos(newVal);
    });

    const visible = ref(false);
    const visibleConfirm = ref(false);

    const createProduct = () => {
      router.push("/admin/products/mng");
    };

    const editProduct = (data: ProductDto) => {
      // selectedProduct.value = { ...(data as ProductDto) };
      // visible.value = true;
      // console.log(data);
      router.push(`/admin/products/mng/${data.id}`);
    };

    const deleteProduct = (data: unknown) => {
      selectedProduct.value = { ...(data as ProductDto) };
      visibleConfirm.value = true;
      console.log(data);
    };

    const save = (data: ProductDto) => {
      console.log(data);
      visible.value = false;
      ApiUtils.post("/api/san-pham", data)
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
      ApiUtils.delete(
        `/api/san-pham/variant/${selectedProduct.value.variant_id}`
      )
        .then((res) => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "xóa phiên bản sản phẩm thành công",
            life: 3000,
          });
          callApiInit();
          console.log(res.data);
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "xóa phiên bản sản phẩm thất bại",
            life: 3000,
          });
          console.log("call api error: Delete product");
        });
    };

    const callApiInit = async () => {
      ApiUtils.get("/api/san-pham")
        .then((res) => {
          dataApi.value = res.data;
        })
        .catch(() => {
          console.log("call api error: Init product");
        });
    };

    // call when component created
    callApiInit();
    eventBus.on("update:product", (data: string) => {
      if (data === "success") {
        callApiInit();
      }
    });

    return {
      data,
      visible,
      visibleConfirm,
      selectedProduct,
      createProduct,
      editProduct,
      deleteProduct,
      callApiDetete,
      save,
    };
  },
});
</script>

<template>
  <div class="text-2xl mb-2">Products</div>
  <div class="grid">
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="product name" class="font-semibold w-6rem">
        Tên sản phẩm
      </label>
      <InputText
        :disabled="isManageVariations"
        v-model="dataModel.name"
        id="product name"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="brand" class="font-semibold w-6rem">Thương hiệu</label>
      <InputText
        :disabled="isManageVariations"
        v-model="dataModel.brandName"
        id="brand"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="brand" class="font-semibold w-6rem">Show/Hide</label>
      <Dropdown
        :disabled="isManageVariations"
        v-model="dataModel.isShow"
        :options="showHideOptions"
        id="brand"
        class="flex-auto text-left"
        autocomplete="off"
        optionLabel="name"
        optionValue="value"
      />
    </div>
    <div
      class="flex col-6 align-items-center justify-content-end gap-3 mb-2"
      v-if="mode === 'edit'"
    >
      <Button @click="manageVariat">
        {{ isManageVariations ? "Manage Product" : "Manage Variations" }}
      </Button>
    </div>
  </div>
  <div v-if="!isManageVariations" class="grid">
    <div class="w-full text-xl mb-2">Thông số kỹ thuật</div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="operation_system" class="font-semibold w-6rem">
        Hệ điều hành
      </label>
      <Dropdown
        class="flex-auto text-left"
        v-model="dataModel.operatingSystem"
        :options="[
          { name: 'Android', value: 'Android' },
          { name: 'IOS', value: 'IOS' },
          { name: 'Windows', value: 'Windows' },
        ]"
        id="operation_system"
        autocomplete="off"
        option-label="name"
        option-value="value"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="ram" class="font-semibold w-6rem"> RAM </label>
      <InputNumber
        v-model="dataModel.ram"
        id="ram"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="GB"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="main_camera" class="font-semibold w-6rem">
        Camera chính
      </label>
      <InputNumber
        v-model="dataModel.mainCamera"
        id="main_camera"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="MP"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="selfie_camera" class="font-semibold w-6rem">
        Camera trước
      </label>
      <InputNumber
        v-model="dataModel.selfieCamera"
        id="selfie_camera"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="MP"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="batery_size" class="font-semibold w-6rem">
        Dung lượng pin
      </label>
      <InputNumber
        v-model="dataModel.batterySize"
        id="batery_size"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="mAh"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="weight" class="font-semibold w-6rem"> Trọng lượng </label>
      <InputNumber
        v-model="dataModel.weight"
        id="weight"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="g"
      />
    </div>
    <div class="w-full text-xl mb-2">Mô tả</div>
    <Editor
      class="w-full"
      v-if="!isManageVariations"
      v-model="dataModel.description"
      editorStyle="height: 200px"
    />
  </div>
  <DataTable
    v-else
    :value="dataModel.specifications"
    rowGroupMode="rowspan"
    groupRowsBy="internalMemory"
    showGridlines
    v-model:expandedRows="expandedRows"
  >
    <template #header>
      <div class="w-full flex justify-content-end">
        <Button @click="dialogVisible = true"
          >Thêm tùy chọn (update logic)</Button
        >
      </div>
    </template>
    <Column expander style="width: 2rem" />
    <Column field="internalMemory" header="Bộ nhớ"></Column>
    <Column field="price" header="Giá"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="addColorVariant(slotProps.data)"
          >Thêm tùy chọn màu (update logic)</Button
        >
        <Button class="ml-2">Xóa (update logic)</Button>
      </template>
    </Column>
    <template #expansion="slotProps">
      <DataTable
        :value="slotProps.data.colorVariant"
        rowGroupMode="rowspan"
        groupRowsBy="color"
        showGridlines
      >
        <Column field="color" header="Màu"></Column>
        <Column field="quantity" header="Số lượng"></Column>
        <Column header="Actions">
          <template #body="">
            <Button>Cập nhật (update logic)</Button>
            <Button class="ml-2">Xóa (update logic)</Button>
          </template>
        </Column>
      </DataTable>
    </template>
  </DataTable>
  <div class="flex justify-content-end gap-2">
    <Button
      type="button"
      label="Cancel"
      severity="secondary"
      @click="$router.push('/admin/products')"
    ></Button>
    <Button
      v-if="mode === 'edit'"
      type="button"
      label="Delete"
      @click="deleteProduct"
    ></Button>
    <Button type="button" label="Save" @click="save"></Button>
  </div>
  <ProductVariationDialog
    v-model:visible="dialogVisible"
    :data="selectedVariation"
    v-model:specification="selectedSpecification"
    @save="saveVariation"
    :categoryOptions="categoryOptions"
  />

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>Are you sure you want to delete this product? - {{ dataModel.name }},</p>
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
import { defineComponent, reactive, ref, inject, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Editor from "primevue/editor";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import ApiUtils from "@/util/apiUtil";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import ProductAdminDto, {
  Variant,
  ColorVariant,
  Specification,
} from "@/dto/productAdminDto";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

import ProductVariationDialog from "@/components/ProductVariationDialog.vue";

import SpecificationDto from "@/dto/specificationDto";

export default defineComponent({
  components: {
    InputText,
    Dropdown,
    Button,
    Editor,
    DataTable,
    Column,
    ProductVariationDialog,
    Dialog,
    InputNumber,
  },
  props: {
    visible: Boolean,
    data: {
      type: Object as () => ProductAdminDto,
      required: false,
      default: () => {
        return {
          id: null,
          name: "",
          brandName: "",
          image: "",
          color: "",
          price: 0,
          amount: 0,
          isShow: 1,
          description: "",
          category: { id: 0 },
        };
      },
    },
  },
  setup(props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventBus = inject("eventBus") as any;
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const mode = route.params.id ? "edit" : "create";

    const dialogVisible = ref(false);
    const visibleConfirm = ref(false);
    const dataModel = reactive(props.data);
    const specifications = reactive<SpecificationDto>({} as SpecificationDto);
    const brandOptions = ref([] as { name: string; value: number }[]);
    const categoryOptions = ref([] as { name: string; value: number }[]);
    const showHideOptions = ref([
      { name: "Show", value: true },
      { name: "Hide", value: false },
    ]);
    const isManageVariations = ref(false);
    const selectedVariation = ref({
      color: "",
      quantity: 0,
    } as unknown as ColorVariant);
    const selectedSpecification = ref({
      internalMemory: 0,
      price: 0,
      colorVariant: [],
    } as unknown as Specification);

    // dropdown của specification
    const expandedRows = ref([]);

    const save = async () => {
      let success = true;
      if (route.params.id) {
        try {
          await ApiUtils.put(`/api/mongo/san-pham`, dataModel);
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Cập nhật sản phẩm thành công",
            life: 3000,
          });
        } catch (error) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Cập nhật sản phẩm thất bại",
            life: 3000,
          });
          success = false;
        }
      } else {
        try {
          await ApiUtils.post("/api/mongo/san-pham", dataModel);
        } catch (error) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Tạo sản phẩm thất bại",
            life: 3000,
          });
          success = false;
        }
        if (success) {
          router.push("/admin/products");
          eventBus.emit("update:product", "success");
        }
      }
    };

    const saveVariation = async (data: Specification) => {
      dataModel.specifications.map((x) =>
        x.internalMemory === data.internalMemory ? data : x
      );
      console.log("data specification", dataModel.specifications);
    };
    const manageVariat = () => {
      isManageVariations.value = !isManageVariations.value;
    };

    // thêm tùy chọn màu
    const addColorVariant = (model: Specification) => {
      selectedSpecification.value = { ...model };
      selectedVariation.value = { color: "", quantity: 0 };
      dialogVisible.value = true;
    };

    const editVariation = (data: ColorVariant) => {
      selectedVariation.value = { ...data };
      dialogVisible.value = true;
    };

    const deleteProduct = () => {
      visibleConfirm.value = true;
    };

    const getApiBrand = async () => {
      await ApiUtils.get("/api/mongo/thuong-hieu").then((res) => {
        res.data.forEach((element: { name: string; id: number }) => {
          brandOptions.value.push({ name: element.name, value: element.id });
        });
      });
    };

    const getApiProduct = async () => {
      if (route.params.id) {
        await ApiUtils.get(`/api/mongo/san-pham/${route.params.id}`).then(
          (res) => {
            Object.assign(dataModel, res.data);
          }
        );
      }
    };

    const callApiDetete = async () => {
      visibleConfirm.value = false;
      await ApiUtils.delete(`/api/mongo/san-pham/${route.params.id}`)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Xóa sản phẩm thành công",
            life: 3000,
          });
          router.push("/admin/products");
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Xóa sản phẩm thất bại",
            life: 3000,
          });
        });
    };

    // init data
    onMounted(async () => {
      await getApiBrand();
      await getApiProduct();
      console.log("dataModel", dataModel);
    });

    return {
      mode,
      dialogVisible,
      dataModel,
      brandOptions,
      categoryOptions,
      showHideOptions,
      isManageVariations,
      selectedSpecification,
      selectedVariation,
      visibleConfirm,
      specifications,
      save,
      saveVariation,
      manageVariat,
      addColorVariant,
      editVariation,
      deleteProduct,
      callApiDetete,
      // test
      expandedRows,
    };
  },
});
</script>

<template>
  <div class="text-2xl mb-2">Quản lý sản phẩm</div>
  <div class="grid">
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="product name" class="font-semibold w-6rem">
        Tên sản phẩm
      </label>
      <InputText
        :disabled="typeManage !== TYPE_MANAGE.DEFAUT"
        v-model="dataModel.name"
        id="product name"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="brand" class="font-semibold w-6rem">Thương hiệu</label>
      <InputText
        :disabled="typeManage !== TYPE_MANAGE.DEFAUT"
        v-model="dataModel.brandName"
        id="brand"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="brand" class="font-semibold w-6rem">Show/Hide</label>
      <Dropdown
        :disabled="typeManage !== TYPE_MANAGE.DEFAUT"
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
      <Button
        v-if="typeManage !== TYPE_MANAGE.IMAGE"
        @click="updateTypeManage(TYPE_MANAGE.IMAGE)"
        >Quản lý hình ảnh</Button
      >
      <Button
        v-if="typeManage !== TYPE_MANAGE.VARIATION"
        @click="updateTypeManage(TYPE_MANAGE.VARIATION)"
        >Quản lý phiên bản</Button
      >
      <Button
        v-if="typeManage !== TYPE_MANAGE.DEFAUT"
        @click="updateTypeManage(TYPE_MANAGE.DEFAUT)"
        >Quản lý thông tin</Button
      >
    </div>
  </div>
  <div v-if="TYPE_MANAGE.DEFAUT === typeManage" class="grid">
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
      v-if="TYPE_MANAGE.DEFAUT === typeManage"
      v-model="dataModel.description"
      editorStyle="height: 200px"
    />
  </div>
  <DataTable
    v-if="TYPE_MANAGE.VARIATION === typeManage"
    :value="dataModel.specifications"
    rowGroupMode="rowspan"
    groupRowsBy="internalMemory"
    showGridlines
    v-model:expandedRows="expandedRows"
  >
    <template #header>
      <div class="w-full flex justify-content-end">
        <Button @click="addSpecification()">Thêm Phiên bản</Button>
      </div>
    </template>
    <Column expander style="width: 2rem" />
    <Column field="internalMemory" header="Bộ nhớ"></Column>
    <Column field="price" header="Giá"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="addColorVariant(slotProps.data)"
          >Thêm tùy chọn màu</Button
        >
        <Button class="ml-2" @click="removeSpecification(slotProps.data)"
          >Xóa</Button
        >
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
          <template #body="slotProps1">
            <Button @click="editColorVariant(slotProps1.data, slotProps.data)"
              >Cập nhật</Button
            >
            <Button
              class="ml-2"
              @click="removeColorVariant(slotProps1.data, slotProps.data)"
              >Xóa</Button
            >
          </template>
        </Column>
      </DataTable>
    </template>
  </DataTable>
  <div v-if="TYPE_MANAGE.IMAGE === typeManage">
    <div class="w-full text-xl mb-2">Hình ảnh</div>
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="dataModel.variants"
      rowGroupMode="rowspan"
      groupRowsBy="color"
      showGridlines
    >
      <template #header>
        <div class="w-full flex justify-content-end">
          <Button @click="editImageColor({ color: '', images: [] })"
            >Thêm màu</Button
          >
        </div>
      </template>
      <Column expander style="width: 2rem" />
      <Column field="color" header="Màu"></Column>
      <Column header="Thao tác">
        <template #body="slotProps">
          <Button @click="editImageColor(slotProps.data)">Cập nhật</Button>
          <Button class="ml-2" @click="deleteImageColor(slotProps.data.color)"
            >Xóa</Button
          >
        </template>
      </Column>
      <template #expansion="slotProps">
        <DataTable
          :value="slotProps.data.images"
          rowGroupMode="rowspan"
          groupRowsBy="color"
          showGridlines
        >
          <Column header="ảnh">
            <template #body="slotProps">
              <Image
                :src="`${API_URL + slotProps.data}`"
                alt="image"
                image-style="width: 100px; height: 100px"
                preview
              />
            </template>
          </Column>
          <Column header="Thao tác">
            <template #body="slotPropsChild">
              <Button
                class="ml-2"
                @click="deleteImage(slotProps.data, slotPropsChild.data)"
                >Xóa</Button
              >
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
  <div class="flex justify-content-end gap-2">
    <Button
      type="button"
      label="Hủy thao tác"
      severity="secondary"
      @click="$router.push('/admin/products')"
    ></Button>
    <Button
      v-if="mode === 'edit'"
      type="button"
      label="Xóa sản phẩm"
      @click="deleteProduct"
    ></Button>
    <Button type="button" label="Lưu sản phẩm" @click="save"></Button>
  </div>
  <ProductVariationDialog
    v-model:visible="dialogVisible"
    v-model:specification="selectedSpecification"
    :data="selectedVariation"
    :colorList="colorOptions"
    @save="saveVariation"
  />
  <ProductSpecificationDialog
    v-model:visible="specDialogVisible"
    v-model:specification="selectedSpecification"
    @save="saveSpecification"
  />
  <ProductImageDialog
    v-model:visible="imageDialogVisible"
    v-model:data="selectedColorVariant"
    @save="saveImage"
  ></ProductImageDialog>

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>Bạn có chắc chắn sẽ xóa sản phẩm này chứ? - {{ dataModel.name }},</p>
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
  <ConfirmDialog />
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
import { useConfirm } from "primevue/useconfirm";
import ProductAdminDto, {
  ColorVariant,
  Specification,
  Variant,
} from "@/dto/productAdminDto";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Image from "primevue/image";
import ProductVariationDialog from "@/components/ProductVariationDialog.vue";
import ProductSpecificationDialog from "@/components/ProductSpecificationDialog.vue";

import SpecificationDto from "@/dto/specificationDto";
import ProductImageDialog from "@/components/ProductImageDialog.vue";

class TYPE_MANAGE {
  static readonly VARIATION = "variation";
  static readonly SPECIFICATION = "specification";
  static readonly IMAGE = "image";
  static readonly DEFAUT = "default";
}

interface ColorDropdown {
  name: string;
}
export default defineComponent({
  components: {
    InputText,
    Dropdown,
    Button,
    Editor,
    DataTable,
    Column,
    ProductVariationDialog,
    ProductSpecificationDialog,
    ProductImageDialog,
    Dialog,
    InputNumber,
    Image,
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
    const confirm = useConfirm();

    const mode = route.params.id ? "edit" : "create";

    const typeManage = ref(TYPE_MANAGE.DEFAUT);
    const API_URL = window.__API_URL__;

    const dialogVisible = ref(false);
    const specDialogVisible = ref(false);
    const imageDialogVisible = ref(false);
    const visibleConfirm = ref(false);
    const dataModel = reactive(props.data);
    const specifications = reactive<SpecificationDto>({} as SpecificationDto);
    const brandOptions = ref([] as { name: string; value: number }[]);
    const categoryOptions = ref([] as { name: string; value: number }[]);
    const showHideOptions = ref([
      { name: "Show", value: true },
      { name: "Hide", value: false },
    ]);
    const selectedVariation = ref({
      color: "",
      quantity: 0,
    } as unknown as ColorVariant);
    const selectedSpecification = ref({
      internalMemory: 0,
      price: 0,
      colorVariant: [],
    } as unknown as Specification);

    const selectedColorVariant = ref({
      color: "",
      images: [],
    } as unknown as Variant);

    const colorOptions = ref([] as ColorDropdown[]);

    // dropdown của specification
    const expandedRows = ref([]);

    const save = () => {
      confirm.require({
        message: "Bạn có chắc chắn muốn lưu sản phẩm này?",
        header: "Xác nhận lưu",
        accept: () => {
          saveProduct();
        },
      });
    };

    const saveProduct = async () => {
      let success = true;
      if (route.params.id) {
        try {
          await ApiUtils.put(`/api/san-pham`, dataModel);
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
          await ApiUtils.post("/api/san-pham", dataModel);
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
    };

    const saveSpecification = async (data: Specification) => {
      dataModel.specifications.some(
        (x) => x.internalMemory === data.internalMemory
      )
        ? dataModel.specifications.map((x) =>
            x.internalMemory === data.internalMemory ? data : x
          )
        : dataModel.specifications.push(data);
    };

    const saveImage = async (data: Variant) => {
      const existingVariantIndex = dataModel.variants.findIndex(
        (x) => x.color === data.color
      );
      if (existingVariantIndex >= 0) {
        dataModel.variants[existingVariantIndex] = data;
      } else {
        dataModel.variants.push(data);
      }
    };

    const manageVariat = () => {
      // isManageVariations.value = !isManageVariations.value;
    };

    const updateTypeManage = (type: string) => {
      typeManage.value = type;
    };

    // thêm tùy chọn màu
    const addColorVariant = (model: Specification) => {
      selectedSpecification.value = { ...model };
      selectedVariation.value = { color: "", quantity: 0 };
      colorOptions.value = dataModel.variants.map((x) => {
        return { name: x.color };
      });
      console.log("colorOptions", colorOptions.value);

      dialogVisible.value = true;
    };

    const editColorVariant = (data: ColorVariant, spec: Specification) => {
      selectedSpecification.value = { ...spec };
      selectedVariation.value = { ...data };
      dialogVisible.value = true;
    };

    const removeColorVariant = (data: ColorVariant, spec: Specification) => {
      spec.colorVariant = spec.colorVariant.filter(
        (x) => x.color !== data.color
      );
      dataModel.specifications.map((x) =>
        x.internalMemory === spec.internalMemory ? spec : x
      );
    };

    const addSpecification = () => {
      selectedSpecification.value = {
        internalMemory: 0,
        price: 0,
        colorVariant: [],
      };
      specDialogVisible.value = true;
    };

    const removeSpecification = (data: Specification) => {
      dataModel.specifications = dataModel.specifications.filter(
        (x) => x.internalMemory !== data.internalMemory
      );
    };

    const deleteProduct = () => {
      visibleConfirm.value = true;
    };

    // xóa ảnh trong 1 color
    const deleteImage = (data: Variant, image: string) => {
      data.images = data.images.filter((x) => x !== image);
    };

    // xóa ảnh theo màu
    const deleteImageColor = (color: string) => {
      dataModel.variants = dataModel.variants.filter((x) => x.color !== color);
    };

    // câp nhật ảnh theo màu
    const editImageColor = (variation: Variant) => {
      selectedColorVariant.value = variation;
      imageDialogVisible.value = true;
    };

    const getApiBrand = async () => {
      await ApiUtils.get("/api/thuong-hieu").then((res) => {
        res.data.forEach((element: { name: string; id: number }) => {
          brandOptions.value.push({ name: element.name, value: element.id });
        });
      });
    };

    const getApiProduct = async () => {
      if (route.params.id) {
        await ApiUtils.get(`/api/san-pham/${route.params.id}`).then((res) => {
          Object.assign(dataModel, res.data);
        });
      }
    };

    const callApiDetete = async () => {
      visibleConfirm.value = false;
      await ApiUtils.delete(`/api/san-pham/${route.params.id}`)
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
      specDialogVisible,
      imageDialogVisible,
      dataModel,
      brandOptions,
      categoryOptions,
      showHideOptions,
      selectedSpecification,
      selectedColorVariant,
      selectedVariation,
      visibleConfirm,
      specifications,
      expandedRows,
      typeManage,
      colorOptions,
      updateTypeManage,
      save,
      saveProduct,
      saveVariation,
      saveSpecification,
      saveImage,
      manageVariat,
      addColorVariant,
      editColorVariant,
      removeColorVariant,
      addSpecification,
      removeSpecification,
      deleteProduct,
      callApiDetete,
      deleteImage,
      editImageColor,
      deleteImageColor,
      //
      TYPE_MANAGE,
      API_URL,
    };
  },
});
</script>

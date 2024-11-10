<template>
  <div class="text-2xl mb-2">Products</div>
  <div class="grid">
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="product name" class="font-semibold w-6rem">
        Product name
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
      <label for="key search" class="font-semibold w-6rem"> Key search </label>
      <InputText
        :disabled="isManageVariations"
        v-model="dataModel.seo_keywords"
        id="key search"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="category" class="font-semibold w-6rem">Category</label>
      <Dropdown
        :disabled="isManageVariations"
        v-model="dataModel.category.id"
        :options="categoryOptions"
        id="category"
        class="flex-auto text-left"
        autocomplete="off"
        optionLabel="name"
        optionValue="value"
      />
    </div>
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="brand" class="font-semibold w-6rem">Brand</label>
      <Dropdown
        :disabled="isManageVariations"
        v-model="dataModel.brand_id"
        :options="brandOptions"
        id="brand"
        class="flex-auto text-left"
        autocomplete="off"
        optionLabel="name"
        optionValue="value"
      />
    </div>
    <div class="flex col-6 align-items-center gap-3 mb-3">
      <label for="brand" class="font-semibold w-6rem">Show/Hide</label>
      <Dropdown
        :disabled="isManageVariations"
        v-model="dataModel.show_hide"
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
    <div class="w-full text-xl mb-2">Specification</div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="operation_system" class="font-semibold w-6rem">
        operation system
      </label>
      <Dropdown
        class="flex-auto text-left"
        v-model="specifications.operatingSystem"
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
      <label for="internal_memory" class="font-semibold w-6rem">
        internal memory
      </label>
      <InputNumber
        v-model="specifications.internalMemory"
        id="internal_memory"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="GB"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="ram" class="font-semibold w-6rem"> RAM </label>
      <InputNumber
        v-model="specifications.ram"
        id="ram"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="GB"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="performance" class="font-semibold w-6rem">
        performance
      </label>
      <InputNumber
        v-model="specifications.performance"
        id="performance"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="GHz"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="main_camera" class="font-semibold w-6rem">
        Main Camera
      </label>
      <InputNumber
        v-model="specifications.mainCamera"
        id="main_camera"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="MP"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="selfie_camera" class="font-semibold w-6rem">
        selfie Camera
      </label>
      <InputNumber
        v-model="specifications.selfieCamera"
        id="selfie_camera"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="MP"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="batery_size" class="font-semibold w-6rem">
        batery size
      </label>
      <InputNumber
        v-model="specifications.batterySize"
        id="batery_size"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="mAh"
      />
    </div>
    <div class="flex col-4 align-items-center gap-3 mb-3">
      <label for="weight" class="font-semibold w-6rem"> Weight </label>
      <InputNumber
        v-model="specifications.weight"
        id="weight"
        class="flex-auto"
        autocomplete="off"
        :min="0"
        suffix="g"
      />
    </div>
    <div class="w-full text-xl mb-2">Description</div>
    <Editor
      class="w-full"
      v-if="!isManageVariations"
      v-model="dataModel.description"
      editorStyle="height: 200px"
    />
  </div>
  <DataTable
    v-else
    :value="variantions"
    rowGroupMode="rowspan"
    groupRowsBy="name"
    showGridlines
  >
    <template #header>
      <div class="w-full flex justify-content-end">
        <Button @click="dialogVisible = true">Add</Button>
      </div>
    </template>
    <Column field="color_type" header="color"></Column>
    <Column field="price" header="price"></Column>
    <Column field="quantity" header="amount"></Column>
    <Column field="image_url" header="image">
      <template #body="slotProps">
        <img
          :src="slotProps.data.image_url"
          alt="image"
          style="width: 50px; height: 50px"
        />
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button @click="editVariation(slotProps.data)">Edit</Button>
        <Button class="ml-2"> Delete </Button>
      </template>
    </Column>
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
import ProductAdminDto, { Variations } from "@/dto/productAdminDto";
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
          brand_id: 0,
          image: "",
          color: "",
          price: 0,
          amount: 0,
          show_hide: 1,
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
    const variantions = ref([] as Variations[]);
    const brandOptions = ref([] as { name: string; value: number }[]);
    const categoryOptions = ref([] as { name: string; value: number }[]);
    const showHideOptions = ref([
      { name: "Show", value: 1 },
      { name: "Hide", value: 0 },
    ]);
    const isManageVariations = ref(false);
    const selectedVariation = ref({
      product_id: route.params.id.toString(),
      color: "",
      price: 0,
      price_sale: 0,
      amount: 0,
      image_url: "",
      name: "",
    } as unknown as Variations);

    const save = async () => {
      let success = true;
      dataModel.category_id = dataModel.category.id;
      if (route.params.id) {
        try {
          await ApiUtils.put(
            `/api/mongo/san-pham/${route.params.id}`,
            dataModel
          );

          try {
            await ApiUtils.put(
              `/api/mongo/san-pham/specification/${dataModel.id}`,
              specifications
            );
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
              detail: "Cập nhật specification thất bại",
              life: 3000,
            });
            success = false;
          }
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
          const res = await ApiUtils.post("/api/mongo/san-pham", dataModel);
          const product_id = res.data.id;
          await ApiUtils.put(
            `/api/mongo/san-pham/specification/${product_id}`,
            specifications
          ).then(() => {
            toast.add({
              severity: "success",
              summary: "Success",
              detail: "Tạo sản phẩm thành công",
              life: 3000,
            });
          });
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

    const saveVariation = async (data: Variations) => {
      if (data.id === null || data.id === undefined) {
        await ApiUtils.post("/api/mongo/san-pham/variant", data)
          .then(() => {
            toast.add({
              severity: "success",
              summary: "Success",
              detail: "Create variation success",
              life: 3000,
            });
          })
          .catch(() => {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: "Create variation fail",
              life: 3000,
            });
          });
      } else {
        await ApiUtils.put(`/api/mongo/san-pham/variant/${data.id}`, data)
          .then(() => {
            toast.add({
              severity: "success",
              summary: "Success",
              detail: "Update variation success",
              life: 3000,
            });
          })
          .catch(() => {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: "Update variation fail",
              life: 3000,
            });
          });
      }
    };
    const manageVariat = () => {
      isManageVariations.value = !isManageVariations.value;
    };

    const editVariation = (data: Variations) => {
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
            Object.assign(variantions.value, res.data.variations);
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

    const getApiSpecification = async () => {
      const product_id = route.params.id;
      if (product_id) {
        await ApiUtils.get(
          `/api/mongo/san-pham/specification/${product_id}`
        ).then((res) => {
          Object.assign(specifications, res.data);
        });
      }
    };

    // init data
    onMounted(() => {
      getApiBrand();
      getApiProduct();
      getApiSpecification();
    });
    return {
      mode,
      dialogVisible,
      dataModel,
      brandOptions,
      categoryOptions,
      showHideOptions,
      variantions,
      isManageVariations,
      selectedVariation,
      visibleConfirm,
      specifications,
      save,
      saveVariation,
      manageVariat,
      editVariation,
      deleteProduct,
      callApiDetete,
    };
  },
});
</script>

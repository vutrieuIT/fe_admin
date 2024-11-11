<template>
  <div class="text-2xl mb-2">Products</div>
  <div class="grid"></div>
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
    // InputText,
    // Dropdown,
    // Button,
    // Editor,
    // DataTable,
    // Column,
    // ProductVariationDialog,
    // Dialog,
    // InputNumber,
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

    // init data
    // onMounted(() => {});
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
    };
  },
});
</script>

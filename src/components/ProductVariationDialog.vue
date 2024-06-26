<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Product"
    :style="{ width: '30rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="color" class="font-semibold w-6rem"> Color </label>
      <Dropdown
        v-model="dataModel.color_type"
        :options="colorList"
        id="color"
        class="flex-auto"
        optionLabel="name"
        optionValue="name"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="price" class="font-semibold w-6rem"> Price </label>
      <InputNumber
        v-model="dataModel.price"
        id="price"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="price_sale" class="font-semibold w-6rem"> Price Sale </label>
      <InputNumber
        v-model="dataModel.price_sale"
        id="price_sale"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="quantity" class="font-semibold w-6rem"> quantity </label>
      <InputNumber
        v-model="dataModel.quantity"
        id="quantity"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="image" class="font-semibold w-6rem"> image </label>
      <InputText
        v-model="dataModel.image_url"
        id="image"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="image_file" class="font-semibold w-6rem"> imageFile </label>
      <FileUpload
        ref="file"
        mode="basic"
        id="image_file"
        class="flex-auto"
        autocomplete="off"
        @select="file = $event.files[0]"
      ></FileUpload>
    </div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button label="Cancel" @click="visibleModel = false"> Cancel </Button>
        <Button label="Save" @click="save"> Save </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { Variations } from "@/dto/productAdminDto";
import InputNumber from "primevue/inputnumber";
import colorList from "@/dto/color";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import axios from "axios";

export default defineComponent({
  name: "ProductVariationDialog",
  components: {
    Dialog,
    InputText,
    InputNumber,
    Dropdown,
    FileUpload,
  },
  props: {
    visible: Boolean,
    data: {
      type: Object as () => Variations,
      required: false,
      default: () => {
        return {
          color: "",
          price: 0,
          amount: 0,
        };
      },
    },
    categoryOptions: Array,
    brandOptions: Array,
  },
  emits: ["update:visible", "save"],
  setup(props, ctx) {
    const file = ref<File | undefined>();
    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => {
        ctx.emit("update:visible", value);
      },
    });
    const dataModel = computed(() => props.data);

    const save = async () => {
      visibleModel.value = false;
      if (file.value) {
        const formData = new FormData();
        formData.append("file", file.value);
        const token = localStorage.getItem("token");
        await axios
          .post(`${process.env.VUE_APP_SERVER_URL}/api/file`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            dataModel.value.image_url = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
      ctx.emit("save", dataModel.value);
    };
    return {
      file,
      colorList,
      visibleModel,
      dataModel,
      save,
    };
  },
});
</script>

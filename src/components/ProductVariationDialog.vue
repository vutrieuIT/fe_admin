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
        readonly
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
  <ConfirmDialog />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import InputText from "primevue/inputtext";
import { Variations } from "@/dto/productAdminDto";
import InputNumber from "primevue/inputnumber";
import colorList from "@/dto/color";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import axios from "axios";
import Button from "primevue/button";

export default defineComponent({
  name: "ProductVariationDialog",
  components: {
    Dialog,
    InputText,
    InputNumber,
    Dropdown,
    FileUpload,
    ConfirmDialog,
    Button,
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
    const file = ref<File | undefined | null>(null);
    const confirm = useConfirm();
    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => {
        ctx.emit("update:visible", value);
      },
    });
    const dataModel = computed(() => props.data);

    const save = async () => {
      visibleModel.value = false;
      let isAcceptSave = true;
      if (file.value?.size && file.value?.name) {
        const formData = new FormData();
        formData.append("file", file.value);
        const token = localStorage.getItem("token");

        // verify image have phone
        await axios
          .post(`${window.__API_PREDICT_URL__}/predict?conf=0.7`, formData, {
            timeout: 10000,
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(async (res) => {
            isAcceptSave = await confirmImage(res.data.code);

            if (isAcceptSave) {
              await uploadFile(formData); // Pass formData if necessary
            }
          })
          .catch(async () => {
            // code 2: error
            isAcceptSave = await confirmImage(2);

            if (isAcceptSave) {
              await uploadFile(formData); // Pass formData if necessary
            }
          });
      }
    };

    const confirmImage = (code: number): Promise<boolean> => {
      return new Promise((resolve) => {
        let message = "";
        switch (code) {
          case 0:
            resolve(true);
            return;
          case 1:
            message =
              "ảnh gửi lên không có ảnh điện thoại, bạn có muốn tiêp tục không?";
            break;
          default:
            message =
              "xác thực ảnh không thành công, bạn có muốn tiêp tục không?";
            break;
        }

        confirm.require({
          message: message,
          header: "Thông báo",
          rejectLabel: "Hủy",
          acceptLabel: "Đồng ý",
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          },
        });
      });
    };

    // eslint-disable-next-line
    const uploadFile = async (formData: any) => {
      // upload image to server
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
          file.value = undefined;
        })
        .catch((err) => {
          console.error(err);
        });
      ctx.emit("save", dataModel.value);
    };

    return {
      file,
      colorList,
      visibleModel,
      dataModel,
      save,
      // handleFileSelect,
    };
  },
});
</script>

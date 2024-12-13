<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="Quản lý ảnh"
    style="width: 80%; max-width: 1000px"
  >
    <h3 v-if="isEdit">Quản lý hình ảnh cho {{ dataModel.color }}</h3>
    <div v-else>
      <InputText
        v-model="dataModel.color"
        :disabled="isEdit"
        placeholder="Màu"
      />
    </div>
    <OrderList
      v-model="dataModel.images"
      :dragdrop="true"
      :list-style="{ height: '15rem' }"
      :style="{ width: '100%' }"
    >
      <template #item="slotProps">
        <div class="p-d-flex p-ai-center">
          <Image
            :src="API_URL + slotProps.item"
            alt="image"
            image-style="width: 100px; height: 100px"
            preview
          />
        </div>
      </template>
    </OrderList>
    <FileUpload
      customUpload
      @uploader="onUpload"
      :multiple="true"
      accept="image/*"
      :maxFileSize="1000000"
    >
      <template #empty>
        <p>Drag and drop files to here to upload.</p>
      </template>
    </FileUpload>
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button label="Cancel" @click="visibleModel = false"> Hủy </Button>
        <Button label="Save" @click="save"> Lưu </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { Variant } from "@/dto/productAdminDto";
import { defineComponent, computed, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import OrderList from "primevue/orderlist";
import FileUpload from "primevue/fileupload";
import ApiUtils from "@/util/apiUtil";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Image from "primevue/image";

export default defineComponent({
  name: "ProductImageDialog",
  components: {
    Dialog,
    InputText,
    OrderList,
    FileUpload,
    Button,
    Image,
  },
  props: {
    visible: Boolean,
    data: {
      type: Object as () => Variant,
      required: false,
      default: () => {
        return {
          color: "",
          images: [],
        };
      },
    },
  },

  emits: ["update:visible", "update:data", "save"],

  setup(props, ctx) {
    const API_URL = window.__API_URL__;
    const isEdit = computed(() => props.data.color !== "");

    const dataModel = ref<Variant>({ ...props.data });
    const toast = useToast();

    watch(
      () => props.data,
      (newData) => {
        dataModel.value = { ...newData };
      },
      { immediate: true }
    );

    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => {
        ctx.emit("update:visible", value);
      },
    });

    const save = () => {
      ctx.emit("save", dataModel.value);
      visibleModel.value = false;
    };

    // tải ảnh lên
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUpload = async (event: any) => {
      console.log("upload image");
      const files = event.files;
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      // gọi api tải ảnh lên
      await ApiUtils.post("/api/file/admin/list", formData)
        .then((res) => {
          console.log("upload image done", res);

          if (res.data.predict.length > 0) {
            toast.add({
              severity: "warn",
              summary: "Cảnh báo",
              detail: `Có ảnh không phù hợp, vui lòng kiểm tra lại ${res.data.predict.join(
                ", "
              )}`,
            });
          }

          // Cập nhật hình ảnh và emit dữ liệu mới
          dataModel.value.images = [
            ...dataModel.value.images,
            ...res.data.images,
          ];
          ctx.emit("update:data", dataModel.value);

          toast.add({
            severity: "success",
            summary: "Tải ảnh lên thành công",
            life: 3000,
          });
        })
        .catch((err) => {
          console.log("upload image fail", err);
          toast.add({
            severity: "error",
            summary: "Tải ảnh lên thất bại",
            life: 3000,
          });
        });
    };

    return {
      isEdit,
      visibleModel,
      dataModel,
      save,
      onUpload,
      //
      API_URL,
    };
  },
});
</script>

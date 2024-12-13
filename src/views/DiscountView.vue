<template>
  <h2>Khuyến mãi</h2>
  <DataTable
    v-model:value="discounts"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20]"
  >
    <template #header>
      <div class="flex justify-content-end">
        <Button class="p-button-success" icon="pi pi-plus" @click="newDiscount">
        </Button>
      </div>
    </template>
    <Column field="code" header="Mã khuyến mãi"></Column>
    <Column field="discount" header="Giảm giá"></Column>
    <Column field="discountType" header="Loại giảm giá">
      <template #body="slotProp">
        {{ slotProp.data.discountType === "amount" ? "Số tiền" : "Phần trăm" }}
      </template>
    </Column>
    <Column header="Ngày bắt đầu">
      <template #body="slotProp">
        {{ new Date(slotProp.data.startDate).toLocaleDateString() }}
      </template>
    </Column>
    <Column header="Ngày kết thúc">
      <template #body="slotProp">
        {{ new Date(slotProp.data.endDate).toLocaleDateString() }}
      </template>
    </Column>
    <Column header="Trạng thái">
      <template #body="slotProp">
        <div>
          <span
            class="p-tag p-tag-rounded"
            :class="
              slotProp.data.status === 'active'
                ? 'p-tag-success'
                : slotProp.data.status === 'inactive'
                ? 'p-tag-warning'
                : 'p-tag-danger'
            "
          >
            {{ getStatus(slotProp.data.status) }}
          </span>
        </div>
      </template>
    </Column>
    <Column header="Hành động">
      <template #body="slotProp">
        <Button
          class="p-button-success"
          icon="pi pi-pencil"
          @click="editDiscount(slotProp.data)"
        />
      </template>
    </Column>
  </DataTable>
  <DiscountDialog
    v-model:visible="displayDialog"
    v-model:data="selectedDiscount"
    @save="saveDiscount"
  ></DiscountDialog>
</template>

<script lang="ts">
import DiscountDto from "@/dto/discountDto";
import ApiUtils from "@/util/apiUtil";
import { useToast } from "primevue/usetoast";
import { defineComponent, onMounted, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import DiscountDialog from "@/components/DiscountDialog.vue";
import DISCOUNT_STATUS_CONST from "@/constants/discountStatusConst";

export default defineComponent({
  name: "DiscountView",
  components: {
    DataTable,
    Column,
    Button,
    DiscountDialog,
  },
  setup() {
    const toast = useToast();
    const discounts = ref([] as DiscountDto[]);
    const displayDialog = ref(false);
    const selectedDiscount = ref({} as DiscountDto);

    const getStatus = (status: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (DISCOUNT_STATUS_CONST as any).find((x: any) => x.value === status)
        ?.label;
    };

    const getDiscounts = async () => {
      await ApiUtils.get("/api/discount")
        .then((res) => {
          discounts.value = res.data;
        })
        .catch(() =>
          toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Không thể lấy dữ liệu khuyến mãi",
            life: 3000,
          })
        );
    };

    const newDiscount = () => {
      console.log("newDiscount");

      selectedDiscount.value = {} as DiscountDto;
      displayDialog.value = true;
    };

    const editDiscount = (discount: DiscountDto) => {
      selectedDiscount.value = { ...discount };
      displayDialog.value = true;
    };

    const saveDiscount = async (discount: DiscountDto) => {
      if (discount.id) {
        await ApiUtils.put("/api/discount/update", discount)
          .then(() => {
            getDiscounts();
            displayDialog.value = false;
            toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Lưu khuyến mãi thành công",
              life: 3000,
            });
          })
          .catch(() =>
            toast.add({
              severity: "error",
              summary: "Lỗi",
              detail: "Không thể lưu khuyến mãi",
              life: 3000,
            })
          );
      } else {
        await ApiUtils.post("/api/discount/create", discount)
          .then(() => {
            getDiscounts();
            displayDialog.value = false;
            toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Lưu khuyến mãi thành công",
              life: 3000,
            });
          })
          .catch(() =>
            toast.add({
              severity: "error",
              summary: "Lỗi",
              detail: "Không thể lưu khuyến mãi",
              life: 3000,
            })
          );
      }
    };

    onMounted(() => {
      getDiscounts();
    });
    return {
      discounts,
      displayDialog,
      selectedDiscount,
      getStatus,
      newDiscount,
      editDiscount,
      saveDiscount,
    };
  },
});
</script>

<template>
  <h2>Nhân viên</h2>
  <DataTable :value="employeeList" :paginator="true" :rows="10">
    <template #header>
      <div class="flex justify-between items-center">
        <h3>Danh sách nhân viên</h3>
        <div class="ml-auto align-self-center">
          <Button
            icon="pi pi-plus"
            class="p-button-rounded p-button-success"
          ></Button>
        </div>
      </div>
    </template>
    <Column field="id" header="ID"></Column>
    <Column field="name" header="Tên"></Column>
    <Column field="email" header="Email"></Column>
    <Column field="phone" header="Số điện thoại"></Column>
    <Column field="address" header="Địa chỉ"></Column>
    <Column header="Chức vụ">
      <template #body="slotProps">
        <span v-if="slotProps.data.role === 1">Quản lý</span>
        <span v-else>Nhân viên</span>
      </template>
    </Column>
    <Column header="Hành động">
      <template #body="">
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-success"
        ></Button>
      </template>
    </Column>
  </DataTable>
</template>
<script lang="ts">
import EmployeeDto from "@/dto/employeeDto";
import ApiUtils from "@/util/apiUtil";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { useToast } from "primevue/usetoast";
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "EmployeeView",
  components: {
    DataTable,
    Column,
    Button,
  },
  setup() {
    const toast = useToast();

    const employeeList = ref<EmployeeDto[]>([] as EmployeeDto[]);

    const getEmployeeList = async () => {
      await ApiUtils.get("/api/mongo/employee")
        .then((res) => {
          employeeList.value = res.data;
        })
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Thành công",
            detail: "Lấy dữ liệu thành công",
            life: 3000,
          });
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Lấy dữ liệu thất bại",
            life: 3000,
          });
        });
    };

    onMounted(() => {
      getEmployeeList();
    });

    return {
      employeeList,
    };
  },
});
</script>

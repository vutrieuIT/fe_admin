<template>
  <h2>Nhân viên</h2>
  <DataTable :value="employeeList" :paginator="true" :rows="10">
    <template #header>
      <div class="flex justify-between items-center">
        <h3>Danh sách nhân viên</h3>
        <div class="ml-auto align-self-center">
          <Button
            @click="createEmployee"
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
        {{ getRole(slotProps.data.role) }}
      </template>
    </Column>
    <Column field="status" header="Trạng thái">
      <template #body="slotProps">
        {{ getStatus(slotProps.data.status) }}
      </template>
    </Column>
    <Column header="Hành động">
      <template #body="slotProps">
        <Button
          @click="editEmployee(slotProps.data)"
          icon="pi pi-pencil"
          class="p-button-rounded p-button-success"
        ></Button>
      </template>
    </Column>
  </DataTable>
  <EmployeeDialog
    v-model:visible="isVisibleDialog"
    v-model:data="selectedEmployee"
    @save="saveEmployee"
  ></EmployeeDialog>
</template>
<script lang="ts">
import EmployeeDto from "@/dto/employeeDto";
import ApiUtils from "@/util/apiUtil";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { useToast } from "primevue/usetoast";
import { defineComponent, onMounted, ref } from "vue";
import EmployeeDialog from "@/components/EmployeeDialog.vue";
import EMPLOYEE_ROLE_CONST from "@/constants/employeeRoleConst";
import EMPLOYEE_STATUS_CONST from "@/constants/employeeStatusConst";
export default defineComponent({
  name: "EmployeeView",
  components: {
    DataTable,
    Column,
    Button,
    EmployeeDialog,
  },
  setup() {
    const toast = useToast();
    const isVisibleDialog = ref(false);
    const selectedEmployee = ref({} as EmployeeDto);

    const employeeList = ref<EmployeeDto[]>([] as EmployeeDto[]);

    const getRole = (role: number) => {
      return EMPLOYEE_ROLE_CONST.find((item) => item.value === role)?.role;
    };

    const getStatus = (status: number) => {
      return EMPLOYEE_STATUS_CONST.find((item) => item.value === status)
        ?.status;
    };

    const getEmployeeList = async () => {
      await ApiUtils.get("/api/mongo/employee")
        .then((res) => {
          employeeList.value = res.data;
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

    const saveEmployee = async (employee: EmployeeDto) => {
      if (employee.id) {
        await ApiUtils.put(`/api/mongo/employee/update`, employee)
          .then(() => {
            toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Cập nhật nhân viên thành công",
              life: 3000,
            });
            getEmployeeList();
          })
          .catch(() => {
            toast.add({
              severity: "error",
              summary: "Lỗi",
              detail: "Cập nhật nhân viên thất bại",
              life: 3000,
            });
          });
      } else {
        await ApiUtils.post(`/api/mongo/employee/create`, employee)
          .then(() => {
            toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Tạo nhân viên thành công",
              life: 3000,
            });
            getEmployeeList();
          })
          .catch(() => {
            toast.add({
              severity: "error",
              summary: "Lỗi",
              detail: "Tạo nhân viên thất bại",
              life: 3000,
            });
          });
      }
    };

    const editEmployee = (employee: EmployeeDto) => {
      console.log("editEmployee", employee);
      selectedEmployee.value = { ...employee };
      isVisibleDialog.value = true;
    };

    const createEmployee = () => {
      selectedEmployee.value = {} as EmployeeDto;
      isVisibleDialog.value = true;
    };

    onMounted(() => {
      getEmployeeList();
    });

    return {
      employeeList,
      isVisibleDialog,
      selectedEmployee,
      saveEmployee,
      editEmployee,
      createEmployee,
      getRole,
      getStatus,
    };
  },
});
</script>

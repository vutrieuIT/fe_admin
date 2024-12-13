<template>
  <div
    class="w-full flex align-items-center h-3rem mb-2 p-1 bg-primary border-2 border-round-md"
  >
    <div
      class="flex align-items-center justify-content-center h-full font-medium text-4xl"
      style="width: 20%"
    >
      LAZY STORE
    </div>
    <InputText
      placeholder="Search"
      type="text"
      class="h-full ml-2"
      style="width: 30%"
    />
    <div
      class="bg-grey-200 h-full ml-2 flex justify-content-center align-items-center border-1 border-grey-300 border-round-sm"
      style="aspect-ratio: 1"
    >
      <i class="pi pi-search"></i>
    </div>

    <Menubar class="bg-blue-200 h-full ml-2 flex-1" :model="items">
      <template #item="{ item, props }">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <i :class="item.icon"></i>
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2">
          <Avatar image="https://i.pravatar.cc/100?u=1" shape="circle"></Avatar>
          <Button @click="toggleEmployeeMenu">{{ employee.name }}</Button>
          <OverlayPanel ref="isEmployeeMenuShow">
            <div id="overlay_panel" class="flex flex-column gap-2">
              <Button
                icon="pi pi-user"
                class="p-button-rounded p-button-text"
                label="Thông tin cá nhân"
                @click="openInfoDialog"
              ></Button>
              <Button
                class="p-button-rounded p-button-text"
                label="Đăng xuất"
                @click="logout"
              ></Button>
            </div>
          </OverlayPanel>
        </div>
      </template>
    </Menubar>
  </div>
  <div class="grid">
    <div class="col-2">
      <NavigatorComponent />
    </div>
    <div class="col-10">
      <router-view />
    </div>
  </div>
  <EmployeeDialog
    v-model:visible="isVisibleDialog"
    v-model:data="selectedEmployee"
    @save="saveEmployee"
    :mode="ModeEnum.EMPLOYEE"
  ></EmployeeDialog>
  <ConfirmPopup></ConfirmPopup>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import EmployeeDto from "@/dto/employeeDto";
import OverlayPanel from "primevue/overlaypanel";
import ApiUtils from "@/util/apiUtil";
import EmployeeDialog, { ModeEnum } from "@/components/EmployeeDialog.vue";
import { useConfirm } from "primevue/useconfirm";

export default defineComponent({
  components: {
    NavigatorComponent,
    Button,
    Menubar,
    InputText,
    Avatar,
    OverlayPanel,
    EmployeeDialog,
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const employee = ref({} as EmployeeDto);

    const isEmployeeMenuShow = ref();
    const isVisibleDialog = ref(false);
    const selectedEmployee = ref({} as EmployeeDto);

    const items = ref([
      {
        label: "Messages",
        icon: "pi pi-envelope",
      },
      {
        label: "Notifications",
        icon: "pi pi-bell",
      },
    ]);

    const logout = () => {
      sessionStorage.removeItem("token");
      router.push("/login");
      toast.add({
        severity: "success",
        summary: "Đăng xuất",
        detail: "Đăng xuất thành công",
        life: 3000,
      });
    };

    const openInfoDialog = () => {
      selectedEmployee.value = { ...employee.value };
      isVisibleDialog.value = true;
      isEmployeeMenuShow.value.hide();
    };

    const getEmployee = async () => {
      const id = sessionStorage.getItem("id");

      await ApiUtils.get(`/api/employee/${id}`)
        .then((res) => {
          employee.value = res.data;
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Lấy thông tin nhân viên thất bại",
            life: 3000,
          });
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toggleEmployeeMenu = (event: any) => {
      isEmployeeMenuShow.value.toggle(event);
    };

    const saveEmployee = async (employee: EmployeeDto) => {
      await ApiUtils.put(`/api/employee/update`, employee)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Thành công",
            detail: "Cập nhật nhân viên thành công",
            life: 3000,
          });
          getEmployee();
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Cập nhật nhân viên thất bại",
            life: 3000,
          });
        });
    };

    onMounted(() => {
      getEmployee();
    });

    return {
      items,
      employee,
      isEmployeeMenuShow,
      isVisibleDialog,
      selectedEmployee,
      logout,
      toggleEmployeeMenu,
      saveEmployee,
      openInfoDialog,

      ModeEnum,
    };
  },
});
</script>

<style scoped>
.navigator {
  background-color: #f4f4f4;
  border-right: 1px solid #e0e0e0;
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.navigator-show {
  transform: translateX(0);
}
</style>

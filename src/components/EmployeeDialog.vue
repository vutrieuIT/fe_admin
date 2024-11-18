<template>
  <Dialog
    :header="header"
    modal
    closable
    v-model:visible="visibleModel"
    style="width: 80%; max-width: 600px"
  >
    <div class="grid mt-4">
      <div class="col-2 my-1 text-left" for="name">Tên</div>
      <InputText
        class="col-4 my-1 text-left"
        id="name"
        v-model="dataModel.name"
      />
      <div class="col-2 my-1 text-left" for="email">Email</div>
      <InputText
        class="col-4 my-1 text-left"
        id="email"
        v-model="dataModel.email"
      />
      <div class="col-2 my-1 text-left" for="phone">Điện thoại</div>
      <InputText
        class="col-4 my-1 text-left"
        id="phone"
        v-model="dataModel.phone"
      />
      <div class="col-2 my-1 text-left" for="address">Địa chỉ</div>
      <InputText
        class="col-4 my-1 text-left"
        id="address"
        v-model="dataModel.address"
      />
      <div class="col-2 my-1 text-left" for="account">Tài khoản</div>
      <InputText
        class="col-4 my-1 text-left"
        id="account"
        v-model="dataModel.account"
      />
      <div class="col-2 my-1 text-left" for="password">Mật khẩu</div>
      <InputText
        class="col-4 my-1 text-left"
        id="password"
        v-model="dataModel.password"
      />
      <div class="col-2 my-1 text-left" for="role">Chức vụ</div>
      <Dropdown
        class="col-4 my-1 text-left"
        v-model="dataModel.role"
        :options="EMPLOYEE_ROLE_CONST"
        optionLabel="role"
        optionValue="value"
      />
      <div class="col-2 my-1 text-left" for="status">Trạng thái</div>
      <Dropdown
        class="col-4 my-1 text-left"
        v-model="dataModel.status"
        :options="EMPLOYEE_STATUS_CONST"
        optionLabel="status"
        optionValue="value"
      />
    </div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button div="Cancel" @click="visibleModel = false"> Hủy </Button>
        <Button div="Save" @click="save"> Lưu </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import EMPLOYEE_ROLE_CONST from "@/constants/employeeRoleConst";
import EMPLOYEE_STATUS_CONST from "@/constants/employeeStatusConst";
import EmployeeDto from "@/dto/employeeDto";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import { computed, defineComponent, watch } from "vue";

export default defineComponent({
  name: "EmployeeDialog",
  components: {
    Dialog,
    Button,
    InputText,
    Dropdown,
  },
  props: {
    visible: Boolean,
    data: {
      type: Object as () => EmployeeDto,
      required: false,
      default: () => ({
        id: null,
        name: null,
        email: null,
        phone: null,
        address: null,
      }),
    },
    mode: {
      type: String,
      required: false,
      default: "new",
    },
  },

  emits: ["update:visible", "update:data", "save"],
  setup(props, ctx) {
    const visibleModel = computed({
      get: () => props.visible,
      set: (value) => ctx.emit("update:visible", value),
    });

    const dataModel = computed({
      get: () => props.data,
      set: (value) => ctx.emit("update:data", value),
    });
    watch(
      () => props.data,
      (value) => {
        dataModel.value = value;
      }
    );

    const header = computed(() => "Edit Employee");
    const save = () => {
      ctx.emit("save", dataModel.value);
      visibleModel.value = false;
    };
    return {
      header,
      visibleModel,
      dataModel,
      save,

      EMPLOYEE_ROLE_CONST,
      EMPLOYEE_STATUS_CONST,
    };
  },
});
</script>

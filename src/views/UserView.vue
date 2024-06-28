<template>
  <div class="text-2xl">User</div>

  <DataTable
    :value="users"
    v-model:rows="rows"
    v-model:first="first"
    :paginator="true"
    paginatorPosition="top"
    :rowsPerPageOptions="[5, 10, 20]"
  >
    <Column field="name" header="Name"></Column>
    <Column header="avatar">
      <template #body="slotProps">
        <img
          :src="`https://i.pravatar.cc/100?u=${slotProps.data.id}`"
          alt="avatar"
          class="rounded-full"
        />
      </template>
    </Column>
    <Column field="email" header="Email"></Column>
    <Column field="role" header="Role">
      <template #body="slotProps">
        <span>
          {{ slotProps.data.role === 1 ? "Admin" : "User" }}
        </span>
      </template>
    </Column>
    <Column field="status" header="Status"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button
          :disabled="slotProps.data.role"
          @click="editUser(slotProps.data)"
          >Edit</Button
        >
      </template>
    </Column>
  </DataTable>
  <UserDialog
    v-model:visible="visible"
    :data="selectedUser"
    @save="save"
  ></UserDialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import UserDialog from "@/components/UserDialog.vue";
import User from "@/dto/userDto";
import ApiUtils from "@/util/apiUtil";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

export default defineComponent({
  components: {
    DataTable,
    Column,
    UserDialog,
    Button,
  },
  setup() {
    const toast = useToast();
    const users = ref([] as User[]);
    const rows = ref(5);
    const first = ref(0);

    const callInitApi = async () => {
      await ApiUtils.get("/api/all-user").then((res) => {
        users.value = res.data;
      });
    };

    const visible = ref(false);

    const visibleConfirm = ref(false);

    const selectedUser = ref<User>({
      id: 0,
      name: "",
      avatar: "",
      email: "",
      role: "",
      status: "",
    } as User);

    const editUser = (user: unknown) => {
      selectedUser.value = user as User;
      visible.value = true;
    };

    const deleteUser = (user: unknown) => {
      selectedUser.value = user as User;
      visibleConfirm.value = true;
    };

    const save = async (user: unknown) => {
      visible.value = false;
      await ApiUtils.post("/api/user/status", user as User)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "cập nhật trạng thái user thành công",
            life: 3000,
          });
        })
        .catch(() => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "cập nhật trạng thái user thất bại",
            life: 3000,
          });
        });
    };

    callInitApi();

    return {
      rows,
      first,
      users,
      visible,
      visibleConfirm,
      selectedUser,
      editUser,
      deleteUser,
      save,
    };
  },
});
</script>

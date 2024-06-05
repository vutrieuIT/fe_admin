<template>
  <div class="">User</div>
  <DataTable :value="users">
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
    <Column field="role" header="Role"></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <button @click="editUser(slotProps.data)">Edit</button>
        <button class="ml-2" @click="deleteUser(slotProps.data)">Delete</button>
      </template>
    </Column>
  </DataTable>
  <UserDialog
    v-model:visible="visible"
    :data="selectedUser"
    @save="save"
  ></UserDialog>

  <Dialog v-model:visible="visibleConfirm" header="confirm delete">
    <p>Are you sure you want to delete this user? {{ selectedUser.name }}</p>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visibleConfirm = false"
      ></Button>
      <Button type="button" label="Delete" @click="callApiDetete"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import UserDialog from "@/components/UserDialog.vue";
import User from "@/dto/userDto";
import ApiUtils from "@/util/apiUtil";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

export default defineComponent({
  components: {
    DataTable,
    Column,
    UserDialog,
    Dialog,
    Button,
  },
  setup() {
    const users = ref([
      {
        id: 1,
        name: "Alice",
        email: "Alice@gmail.com",
        role: "admin",
      },
      {
        id: 2,
        name: "Bob",
        email: "Bob@gmail.com",
        role: "user",
      },
    ]);

    const callInitApi = async () => {
      await ApiUtils.get("/admin/user")
        .then((res) => {
          users.value = res.data;
          console.log(users.value);
        })
        .catch((err) => {
          console.log("call api error: Init user");
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
    } as User);

    const editUser = (user: unknown) => {
      selectedUser.value = user as User;
      visible.value = true;
      console.log("Edit user", user);
    };

    const deleteUser = (user: unknown) => {
      selectedUser.value = user as User;
      visibleConfirm.value = true;
      console.log("Delete user", user);
    };

    const callApiDetete = async () => {
      visibleConfirm.value = false;
      await ApiUtils.delete(`/admin/user/${selectedUser.value.id}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("call api error: Delete user");
        });
    };

    const save = async (user: unknown) => {
      visible.value = false;
      console.log("Save user", user);
      await ApiUtils.post("admin/user", user as User)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("call api error: Save user", err.response.data);
        });
    };

    callInitApi();

    return {
      users,
      visible,
      visibleConfirm,
      selectedUser,
      editUser,
      deleteUser,
      save,
      callApiDetete,
    };
  },
});
</script>

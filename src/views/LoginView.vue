<template>
  <div class="flex justify-content-center">
    <div
      class="login-container flex flex-column align-items-center px-4 pb-4 bg-blue-300"
    >
      <p class="text-4xl mb-0">ADMIN</p>
      <p class="text-4xl mt-0">LAZY STORE</p>
      <div class="login-form">
        <div class="flex flex-column gap-2">
          <label class="align-self-start" for="username">Tài khoản</label>
          <InputText
            id="username"
            v-model="loginData.email"
            aria-describedby="username-help"
          />
          <small
            class="text-red-500"
            id="username-help"
            v-if="errorMessageDto.email"
          >
            {{ errorMessageDto.email }}
          </small>
        </div>
        <div class="flex flex-column gap-2 mt-2">
          <label class="align-self-start" for="password">Password</label>
          <InputText
            id="password"
            v-model="loginData.password"
            aria-describedby="password-help"
          />
          <small
            class="text-red-500"
            id="password-help"
            v-if="errorMessageDto.password"
          >
            {{ errorMessageDto.password }}
          </small>
        </div>
      </div>
      <Button class="mt-6" label="Đăng nhập" @click="postLogin"></Button>
    </div>
  </div>
</template>

<script lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ApiUtils from "@/util/apiUtil";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

import { defineComponent, ref } from "vue";

interface LoginDto {
  email: string;
  password: string;
  remember: boolean;
}

interface ErrorMessageDto {
  email: string | null | undefined;
  password: string | null | undefined;
}

export default defineComponent({
  components: {
    Button,
    InputText,
  },
  setup() {
    const toast = useToast();
    const router = useRouter();

    const loginData = ref<LoginDto>({
      email: "",
      password: "",
      remember: false,
    });

    const errorMessageDto = ref<ErrorMessageDto>({
      email: null,
      password: null,
    });

    const validateForm = () => {
      if (loginData.value.email === null || loginData.value.email === "") {
        errorMessageDto.value.email = "vui lòng nhập email";
      } else {
        errorMessageDto.value.email = null;
      }
      if (
        loginData.value.password === null ||
        loginData.value.password === ""
      ) {
        errorMessageDto.value.password = "vui lòng nhập password";
      } else {
        errorMessageDto.value.password = null;
      }
      if (
        loginData.value.email !== null &&
        loginData.value.email !== "" &&
        loginData.value.password !== null &&
        loginData.value.password !== ""
      ) {
        return true;
      }
    };

    const postLogin = async () => {
      if (!validateForm()) {
        return;
      }
      await ApiUtils.post("/api/login", loginData.value)
        .then((response) => {
          sessionStorage.setItem("token", response.data.token);

          router.push("/admin/dashboard");
        })
        .catch((err) => {
          const msg = err.response?.data;
          toast.add({
            severity: "error",
            summary: "Error",
            detail: msg ? msg : "Đăng nhập thất bại",
            life: 3000,
          });
        });
    };

    return {
      loginData,
      errorMessageDto,
      validateForm,
      postLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 500px;
}
.login-form {
  max-width: 300px;
}
</style>

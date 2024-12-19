<template>
  <div class="flex justify-content-center">
    <div
      class="login-container flex flex-column align-items-center px-4 pb-4 bg-blue-300"
    >
      <p class="text-4xl mb-0">QUẢN TRỊ</p>
      <p class="text-4xl mt-0">LAZY STORE</p>
      <div class="login-form">
        <div class="flex flex-column gap-2">
          <label class="align-self-start" for="username">Tài khoản</label>
          <InputText
            id="username"
            v-model="loginData.account"
            aria-describedby="username-help"
          />
          <small
            class="text-red-500"
            id="username-help"
            v-if="errorMessageDto.account"
          >
            {{ errorMessageDto.account }}
          </small>
        </div>
        <div class="flex flex-column gap-2 mt-2">
          <label class="align-self-start" for="password">Password</label>
          <IconField>
            <InputText
              id="password"
              v-model="loginData.password"
              aria-describedby="password-help"
              :type="isShowPassword ? 'text' : 'password'"
            />
            <InputIcon
              :class="`pi ${isShowPassword ? 'pi-eye-slash' : 'pi-eye'}`"
              @click="isShowPassword = !isShowPassword"
            />
          </IconField>
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
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import ApiUtils from "@/util/apiUtil";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

import { defineComponent, ref } from "vue";

interface LoginDto {
  account: string;
  password: string;
  remember: boolean;
}

interface ErrorMessageDto {
  account: string | null | undefined;
  password: string | null | undefined;
}

export default defineComponent({
  components: {
    Button,
    InputText,
    IconField,
    InputIcon,
  },
  setup() {
    const toast = useToast();
    const router = useRouter();

    const isShowPassword = ref(false);

    const loginData = ref<LoginDto>({
      account: "",
      password: "",
      remember: false,
    });

    const errorMessageDto = ref<ErrorMessageDto>({
      account: null,
      password: null,
    });

    const validateForm = () => {
      if (loginData.value.account === null || loginData.value.account === "") {
        errorMessageDto.value.account = "vui lòng nhập account";
      } else {
        errorMessageDto.value.account = null;
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
        loginData.value.account !== null &&
        loginData.value.account !== "" &&
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
      await ApiUtils.post("/api/employee/login", loginData.value)
        .then((response) => {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("id", response.data.id);
          sessionStorage.setItem("name", response.data.name);

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
      isShowPassword,
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

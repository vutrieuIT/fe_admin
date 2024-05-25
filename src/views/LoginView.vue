<template>
  <div class="flex justify-content-center">
    <div
      class="login-container flex flex-column align-items-center mt-2 p-4 bg-blue-300"
    >
      <p class="text-2xl text-blue-500 m-0">Đăng nhập Admin</p>
      <p>lazy store</p>
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
        <div class="remember-box mt-5 flex align-content-start">
          <Checkbox v-model="loginData.remember" :binary="true" />
          <label class="ml-2" for="">Ghi nhớ đăng nhập</label>
        </div>
      </div>
      <Button class="mt-6" label="Đăng nhập" @click="postLogin"></Button>
    </div>
  </div>
</template>

<script lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import ApiUtils from "@/util/apiUtil";
import { useRouter } from "vue-router";

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
    Checkbox,
  },
  setup() {
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
      console.log(loginData.value);
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
      await ApiUtils.post("/login", loginData.value)
        .then((response) => {
          sessionStorage.setItem("token", response.data.token);
          router.push("/dashboard");
        })
        .catch(() => {
          alert("Đăng nhập thất bại");
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

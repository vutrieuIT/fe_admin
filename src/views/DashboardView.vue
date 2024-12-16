<template>
  <div class="text-2xl">Thống kê</div>
  <div class="flex justify-content-center align-items-center">
    <div class="text-xl ml-2">Từ Ngày</div>
    <Calendar class="ml-2" v-model="fromDate" dateFormat="dd/mm/yy" />
    <div class="text-xl ml-2">Đến ngày</div>
    <Calendar class="ml-2" v-model="toDate" dateFormat="dd/mm/yy" />
    <div class="text-xl ml-2">Thương hiệu</div>
    <Dropdown
      class="ml-2"
      v-model="brand"
      :options="brandOptions"
      optionLabel="label"
      optionValue="value"
    />
    <Button class="ml-2" @click="callSumary">Tạo thống kê</Button>
  </div>
  <div class="grid">
    <div class="col-12">
      <h3>order</h3>
      <Chart type="bar" :data="data" :options="options" />
    </div>
    <div class="col-12">
      <h3>Sale</h3>
      <Chart type="bar" :data="dataRevenue" :options="options" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Chart from "primevue/chart";
import ApiUtils from "@/util/apiUtil";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";

export default defineComponent({
  name: "DashboardView",
  components: {
    Chart,
    Calendar,
    Button,
    Dropdown,
  },
  setup() {
    const data = ref({});

    const dataRevenue = ref({});

    const toDate = ref(new Date());
    const fromDate = ref(new Date());
    fromDate.value.setDate(fromDate.value.getDate() - 10);

    const brand = ref("All");
    const brandOptions = ref([]);

    const options = {
      aspectRatio: 3,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    const callApiSales = async () => {
      // call api
      await ApiUtils.get(
        `/api/sumary/sales?startDate=${fromDate.value
          .toISOString()
          .slice(0, 10)}&endDate=${toDate.value
          .toISOString()
          .slice(0, 10)}&brand=${brand.value === "All" ? "" : brand.value}`
      ).then((res) => {
        data.value = res.data;
      });
    };

    const callApiRevenue = async () => {
      // call api
      await ApiUtils.get(
        `/api/sumary/revenue?startDate=${fromDate.value
          .toISOString()
          .slice(0, 10)}&endDate=${toDate.value
          .toISOString()
          .slice(0, 10)}&brand=${brand.value === "All" ? "" : brand.value}`
      ).then((res) => {
        dataRevenue.value = res.data;
      });
    };

    const callApiBrand = async () => {
      // call api
      await ApiUtils.get("/api/thuong-hieu").then((res) => {
        const listOptions = res.data.map((item: any) => {
          return { label: item, value: item };
        });
        listOptions.unshift({ label: "Tất cả", value: "All" });
        brandOptions.value = listOptions;
      });
    };

    const callSumary = () => {
      callApiSales();
      callApiRevenue();
      callApiBrand();
    };

    //
    onMounted(() => {
      callApiSales();
      callApiRevenue();
      callApiBrand();
    });

    return {
      data,
      dataRevenue,
      options,
      fromDate,
      toDate,
      brand,
      brandOptions,
      callSumary,
    };
  },
});
</script>

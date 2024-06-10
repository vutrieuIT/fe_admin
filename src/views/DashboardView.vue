<template>
  <div class="text-2xl">Dashboard</div>
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

export default defineComponent({
  name: "DashboardView",
  components: {
    Chart,
  },
  setup() {
    const data = ref({});

    const dataRevenue = ref({});

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
        "/api/sumary/sales?startDate=2024-04-01&endDate=2024-05-01"
      ).then((res) => {
        data.value = res.data;
      });
    };

    const callApiRevenue = async () => {
      // call api
      await ApiUtils.get(
        "/api/sumary/revenue?startDate=2024-04-01&endDate=2024-05-01"
      ).then((res) => {
        dataRevenue.value = res.data;
        console.log(dataRevenue.value);
      });
    };

    //
    onMounted(() => {
      callApiSales();
      callApiRevenue();
    });

    return { data, dataRevenue, options };
  },
});
</script>

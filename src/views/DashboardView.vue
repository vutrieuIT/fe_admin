<template>
  <div class="text-2xl">Dashboard</div>
  <div class="flex justify-content-center align-items-center">
    <div class="text-xl ml-2">From Date</div>
    <Calendar class="ml-2" v-model="fromDate" dateFormat="dd/mm/yy" />
    <div class="text-xl ml-2">To Date</div>
    <Calendar class="ml-2" v-model="toDate" dateFormat="dd/mm/yy" />
    <Button class="ml-2" @click="callSumary">Get Sumary</Button>
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

export default defineComponent({
  name: "DashboardView",
  components: {
    Chart,
    Calendar,
    Button,
  },
  setup() {
    const data = ref({});

    const dataRevenue = ref({});

    const toDate = ref(new Date());
    const fromDate = ref(new Date());
    fromDate.value.setDate(fromDate.value.getDate() - 10);

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
          .slice(0, 10)}&endDate=${toDate.value.toISOString().slice(0, 10)}`
      )
        .then((res) => {
          data.value = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const callApiRevenue = async () => {
      // call api
      await ApiUtils.get(
        `/api/sumary/revenue?startDate=${fromDate.value
          .toISOString()
          .slice(0, 10)}&endDate=${toDate.value.toISOString().slice(0, 10)}`
      )
        .then((res) => {
          dataRevenue.value = res.data;
          console.log(dataRevenue.value);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const callSumary = () => {
      callApiSales();
      callApiRevenue();
    };

    //
    onMounted(() => {
      callApiSales();
      callApiRevenue();
    });

    return { data, dataRevenue, options, fromDate, toDate, callSumary };
  },
});
</script>

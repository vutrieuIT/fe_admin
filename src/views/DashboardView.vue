<template>
  <div>Dashboard</div>
  <div class="grid">
    <div class="col-6">
      <h3>order</h3>
      <Chart type="line" :data="data" :options="options" />
    </div>
    <div class="col-6">
      <h3>Sale</h3>
      <Chart type="line" :data="data" :options="options" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chart from "primevue/chart";

export default defineComponent({
  name: "DashboardView",
  components: {
    Chart,
  },
  setup() {
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Sales",
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
    return { data, options };
  },
});
</script>

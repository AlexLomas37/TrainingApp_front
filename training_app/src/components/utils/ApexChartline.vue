<template>
  <div class="chart-container">
    <apexchart 
      type="line" 
      :options="chartOptions" 
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "ApexChartline",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
    curve: {
      type: String,
      default: "smooth", // Options: "smooth", "straight", "stepline"
    },
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: "line",
        },
        title: {
          text: this.title,
          align: "center",
        },
        xaxis: {
          categories: this.labels,
        },
        stroke: {
          curve: this.curve,
        },
      };
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}

.apexcharts-canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>

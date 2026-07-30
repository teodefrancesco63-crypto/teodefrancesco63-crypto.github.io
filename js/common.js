window.CalcTools = (function () {
  "use strict";

  function formatMoney(value, currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatNumber(value, decimals) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: decimals === undefined ? 0 : decimals
    }).format(value);
  }

  function clamp(value, min, fallback) {
    var n = parseFloat(value);
    if (isNaN(n) || n < min) return fallback;
    return n;
  }

  var PALETTE = ["#1e3a5f", "#2ecc71", "#f5a623", "#9b59b6", "#e74c3c", "#16a2a2"];

  function upsertChart(state, ctx, config) {
    if (state.chart) {
      state.chart.data = config.data;
      if (config.options) state.chart.options = config.options;
      state.chart.update();
    } else {
      state.chart = new Chart(ctx, config);
    }
    return state.chart;
  }

  return {
    formatMoney: formatMoney,
    formatNumber: formatNumber,
    clamp: clamp,
    PALETTE: PALETTE,
    upsertChart: upsertChart
  };
})();

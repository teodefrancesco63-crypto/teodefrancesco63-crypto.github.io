(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var amountInput = document.getElementById("amount");
  var fromInput = document.getElementById("fromCurrency");
  var toInput = document.getElementById("toCurrency");

  var convertedOut = document.getElementById("result-converted");
  var rateOut = document.getElementById("result-rate");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  // Approximate units of currency per 1 EUR (illustrative reference rates).
  var RATES = { EUR: 1, USD: 1.08, GBP: 0.86, JPY: 163.5, CHF: 0.94, CAD: 1.47 };
  var ALL_CURRENCIES = ["EUR", "USD", "GBP", "JPY", "CHF", "CAD"];

  function convert(amount, from, to) {
    var amountInEur = amount / RATES[from];
    return amountInEur * RATES[to];
  }

  function formatAmount(value, currency) {
    var decimals = currency === "JPY" ? 0 : 2;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function calculate() {
    var amount = CalcTools.clamp(amountInput.value, 0, 0);
    var from = fromInput.value;
    var to = toInput.value;

    var result = convert(amount, from, to);
    var unitRate = convert(1, from, to);

    convertedOut.textContent = formatAmount(result, to);
    rateOut.textContent = "1 " + from + " = " + CalcTools.formatNumber(unitRate, 4) + " " + to;

    var others = ALL_CURRENCIES.filter(function (c) { return c !== from; });
    var values = others.map(function (c) { return convert(amount, from, c); });

    CalcTools.upsertChart(chartState, ctx, {
      type: "bar",
      data: {
        labels: others,
        datasets: [{
          label: amount + " " + from + " converted to",
          data: values,
          backgroundColor: CalcTools.PALETTE[0]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  form.addEventListener("input", calculate);
  calculate();
})();

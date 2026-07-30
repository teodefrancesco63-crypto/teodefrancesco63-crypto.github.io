(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var hoursInput = document.getElementById("estimatedHours");
  var rateInput = document.getElementById("hourlyRate");
  var expensesInput = document.getElementById("flatExpenses");
  var bufferInput = document.getElementById("bufferPct");

  var quoteOut = document.getElementById("result-quote");
  var baseOut = document.getElementById("result-base");
  var bufferOut = document.getElementById("result-buffer");
  var effectiveOut = document.getElementById("result-effective-hourly");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var hours = CalcTools.clamp(hoursInput.value, 0, 0);
    var rate = CalcTools.clamp(rateInput.value, 0, 0);
    var expenses = CalcTools.clamp(expensesInput.value, 0, 0);
    var bufferPct = CalcTools.clamp(bufferInput.value, 0, 0);

    var base = hours * rate + expenses;
    var quote = base * (1 + bufferPct / 100);
    var bufferAmount = quote - base;
    var effectiveHourly = hours > 0 ? quote / hours : 0;

    quoteOut.textContent = CalcTools.formatMoney(quote);
    baseOut.textContent = CalcTools.formatMoney(base);
    bufferOut.textContent = CalcTools.formatMoney(bufferAmount);
    effectiveOut.textContent = CalcTools.formatMoney(effectiveHourly) + " / hr";

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Base cost", "Contingency buffer"],
        datasets: [{
          data: [base, bufferAmount],
          backgroundColor: [CalcTools.PALETTE[0], CalcTools.PALETTE[2]]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } }
      }
    });
  }

  form.addEventListener("input", calculate);
  calculate();
})();

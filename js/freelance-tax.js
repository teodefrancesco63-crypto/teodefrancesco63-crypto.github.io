(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var grossInput = document.getElementById("grossIncome");
  var expensesInput = document.getElementById("businessExpenses");
  var seRateInput = document.getElementById("seTaxRate");
  var incomeRateInput = document.getElementById("incomeTaxRate");

  var netOut = document.getElementById("result-net");
  var taxableOut = document.getElementById("result-taxable");
  var taxOut = document.getElementById("result-tax");
  var effectiveOut = document.getElementById("result-effective-rate");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var gross = CalcTools.clamp(grossInput.value, 0, 0);
    var expenses = Math.min(CalcTools.clamp(expensesInput.value, 0, 0), gross);
    var seRate = CalcTools.clamp(seRateInput.value, 0, 0);
    var incomeRate = CalcTools.clamp(incomeRateInput.value, 0, 0);

    var netBeforeTax = gross - expenses;
    var totalTaxRate = seRate + incomeRate;
    var totalTax = netBeforeTax * (totalTaxRate / 100);
    var netIncome = netBeforeTax - totalTax;
    var effectiveRateOnGross = gross > 0 ? (totalTax / gross) * 100 : 0;

    netOut.textContent = CalcTools.formatMoney(netIncome);
    taxableOut.textContent = CalcTools.formatMoney(netBeforeTax);
    taxOut.textContent = CalcTools.formatMoney(totalTax);
    effectiveOut.textContent = CalcTools.formatNumber(effectiveRateOnGross, 1) + "%";

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Net income", "Estimated tax"],
        datasets: [{
          data: [netIncome, totalTax],
          backgroundColor: [CalcTools.PALETTE[1], CalcTools.PALETTE[4]]
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

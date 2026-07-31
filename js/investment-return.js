(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var initialInput = document.getElementById("initialInvestment");
  var finalInput = document.getElementById("finalValue");
  var yearsInput = document.getElementById("years");

  var totalReturnOut = document.getElementById("result-total-return");
  var cagrOut = document.getElementById("result-cagr");
  var gainOut = document.getElementById("result-gain");
  var finalOut = document.getElementById("result-final");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var initial = CalcTools.clamp(initialInput.value, 0.01, 0.01);
    var finalValue = CalcTools.clamp(finalInput.value, 0, 0);
    var years = CalcTools.clamp(yearsInput.value, 0.1, 5);

    var gain = finalValue - initial;
    var totalReturnPct = (finalValue / initial - 1) * 100;
    var cagr = (Math.pow(finalValue / initial, 1 / years) - 1) * 100;

    totalReturnOut.textContent = (totalReturnPct >= 0 ? "+" : "") + CalcTools.formatNumber(totalReturnPct, 1) + "%";
    cagrOut.textContent = (cagr >= 0 ? "+" : "") + CalcTools.formatNumber(cagr, 1) + "% / yr";
    gainOut.textContent = (gain >= 0 ? "+" : "") + CalcTools.formatMoney(gain);
    finalOut.textContent = CalcTools.formatMoney(finalValue);

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Initial investment", "Gain"],
        datasets: [{
          data: [initial, Math.max(gain, 0)],
          backgroundColor: [CalcTools.PALETTE[0], CalcTools.PALETTE[1]]
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

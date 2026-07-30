(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var ids = ["cash", "investments", "realEstate", "otherAssets", "mortgageBalance", "otherLoans", "creditCardDebt", "otherLiabilities"];
  var inputs = {};
  ids.forEach(function (id) { inputs[id] = document.getElementById(id); });

  var netWorthOut = document.getElementById("result-networth");
  var assetsOut = document.getElementById("result-assets");
  var liabilitiesOut = document.getElementById("result-liabilities");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var cash = CalcTools.clamp(inputs.cash.value, 0, 0);
    var investments = CalcTools.clamp(inputs.investments.value, 0, 0);
    var realEstate = CalcTools.clamp(inputs.realEstate.value, 0, 0);
    var otherAssets = CalcTools.clamp(inputs.otherAssets.value, 0, 0);
    var mortgage = CalcTools.clamp(inputs.mortgageBalance.value, 0, 0);
    var otherLoans = CalcTools.clamp(inputs.otherLoans.value, 0, 0);
    var creditCard = CalcTools.clamp(inputs.creditCardDebt.value, 0, 0);
    var otherLiabilities = CalcTools.clamp(inputs.otherLiabilities.value, 0, 0);

    var totalAssets = cash + investments + realEstate + otherAssets;
    var totalLiabilities = mortgage + otherLoans + creditCard + otherLiabilities;
    var netWorth = totalAssets - totalLiabilities;

    netWorthOut.textContent = CalcTools.formatMoney(netWorth);
    assetsOut.textContent = CalcTools.formatMoney(totalAssets);
    liabilitiesOut.textContent = CalcTools.formatMoney(totalLiabilities);

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Total assets", "Total liabilities"],
        datasets: [{
          data: [totalAssets, totalLiabilities],
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

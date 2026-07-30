(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var principalInput = document.getElementById("principal");
  var contribInput = document.getElementById("monthlyContribution");
  var rateInput = document.getElementById("annualRate");
  var yearsInput = document.getElementById("years");

  var balanceOut = document.getElementById("result-balance");
  var startOut = document.getElementById("result-start");
  var contribOut = document.getElementById("result-contrib");
  var interestOut = document.getElementById("result-interest");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var principal = CalcTools.clamp(principalInput.value, 0, 0);
    var contrib = CalcTools.clamp(contribInput.value, 0, 0);
    var rate = CalcTools.clamp(rateInput.value, 0, 0);
    var years = Math.min(CalcTools.clamp(yearsInput.value, 1, 1), 50);

    var monthlyRate = rate / 100 / 12;
    var balance = principal;
    var totalContrib = principal;
    var yearly = [balance];

    for (var m = 1; m <= years * 12; m++) {
      balance = balance * (1 + monthlyRate) + contrib;
      totalContrib += contrib;
      if (m % 12 === 0) yearly.push(balance);
    }

    var interestEarned = Math.max(balance - totalContrib, 0);

    balanceOut.textContent = CalcTools.formatMoney(balance);
    startOut.textContent = CalcTools.formatMoney(principal);
    contribOut.textContent = CalcTools.formatMoney(totalContrib);
    interestOut.textContent = CalcTools.formatMoney(interestEarned);

    var labels = yearly.map(function (_, i) { return "Year " + i; });
    CalcTools.upsertChart(chartState, ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Balance",
          data: yearly,
          borderColor: CalcTools.PALETTE[1],
          backgroundColor: "rgba(46, 204, 113, 0.12)",
          fill: true,
          tension: 0.3,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: function (v) { return CalcTools.formatMoney(v); } } } }
      }
    });
  }

  form.addEventListener("input", calculate);
  calculate();
})();

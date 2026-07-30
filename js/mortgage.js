(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var priceInput = document.getElementById("homePrice");
  var downInput = document.getElementById("downPayment");
  var rateInput = document.getElementById("annualRate");
  var termInput = document.getElementById("termYears");
  var extrasInput = document.getElementById("monthlyExtras");

  var totalPaymentOut = document.getElementById("result-total-payment");
  var piOut = document.getElementById("result-pi");
  var loanAmountOut = document.getElementById("result-loan-amount");
  var totalInterestOut = document.getElementById("result-total-interest");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function monthlyPayment(principal, monthlyRate, n) {
    if (n <= 0) return 0;
    if (monthlyRate === 0) return principal / n;
    var factor = Math.pow(1 + monthlyRate, n);
    return principal * monthlyRate * factor / (factor - 1);
  }

  function calculate() {
    var price = CalcTools.clamp(priceInput.value, 0, 0);
    var down = Math.min(CalcTools.clamp(downInput.value, 0, 0), price);
    var rate = CalcTools.clamp(rateInput.value, 0, 0);
    var years = CalcTools.clamp(termInput.value, 5, 30);
    var extras = CalcTools.clamp(extrasInput.value, 0, 0);

    var loanAmount = Math.max(price - down, 0);
    var n = Math.round(years * 12);
    var monthlyRate = rate / 100 / 12;

    var pi = monthlyPayment(loanAmount, monthlyRate, n);
    var totalPaid = pi * n;
    var totalInterest = Math.max(totalPaid - loanAmount, 0);
    var totalMonthly = pi + extras;

    totalPaymentOut.textContent = CalcTools.formatMoney(totalMonthly);
    piOut.textContent = CalcTools.formatMoney(pi);
    loanAmountOut.textContent = CalcTools.formatMoney(loanAmount);
    totalInterestOut.textContent = CalcTools.formatMoney(totalInterest);

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Principal", "Total interest"],
        datasets: [{
          data: [loanAmount, totalInterest],
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

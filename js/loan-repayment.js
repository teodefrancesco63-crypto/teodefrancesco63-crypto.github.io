(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var loanInput = document.getElementById("loanAmount");
  var rateInput = document.getElementById("annualRate");
  var termInput = document.getElementById("termYears");

  var paymentOut = document.getElementById("result-payment");
  var totalPaidOut = document.getElementById("result-total-paid");
  var totalInterestOut = document.getElementById("result-total-interest");
  var numPaymentsOut = document.getElementById("result-num-payments");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function monthlyPayment(principal, monthlyRate, n) {
    if (n <= 0) return 0;
    if (monthlyRate === 0) return principal / n;
    var factor = Math.pow(1 + monthlyRate, n);
    return principal * monthlyRate * factor / (factor - 1);
  }

  function calculate() {
    var loan = CalcTools.clamp(loanInput.value, 0, 0);
    var rate = CalcTools.clamp(rateInput.value, 0, 0);
    var years = CalcTools.clamp(termInput.value, 0.5, 5);
    var n = Math.round(years * 12);

    var monthlyRate = rate / 100 / 12;
    var payment = monthlyPayment(loan, monthlyRate, n);
    var totalPaid = payment * n;
    var totalInterest = Math.max(totalPaid - loan, 0);

    paymentOut.textContent = CalcTools.formatMoney(payment);
    totalPaidOut.textContent = CalcTools.formatMoney(totalPaid);
    totalInterestOut.textContent = CalcTools.formatMoney(totalInterest);
    numPaymentsOut.textContent = n;

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Principal", "Total interest"],
        datasets: [{
          data: [loan, totalInterest],
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

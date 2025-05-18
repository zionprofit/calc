let currentLang = 'ru';

const texts = {
  ru: {
    title: "Калькулятор сложного процента",
    labelInitial: "Начальная сумма",
    labelRate: "Процент в неделю (%)",
    labelWeeks: "Количество недель",
    labelDeposit: "Еженедельное пополнение",
    button: "Рассчитать",
    finalAmount: "Итого на конец периода: ",
    userInvestment: "Собственные инвестиции: ",
    weeklyIncome: "Доход за неделю в конце периода: ",
    tableHeaders: ["Неделя", "Начальный баланс", "Пополнение", "Проценты", "Конечный баланс", "Итого прибыль"]
  },
  en: {
    title: "Compound Interest Calculator",
    labelInitial: "Initial Amount",
    labelRate: "Weekly Interest Rate (%)",
    labelWeeks: "Number of Weeks",
    labelDeposit: "Weekly Deposit",
    button: "Calculate",
    finalAmount: "Total at the end: ",
    userInvestment: "Your investment: ",
    weeklyIncome: "Weekly income at end of period: ",
    tableHeaders: ["Week", "Start Balance", "Deposit", "Interest", "End Balance", "Total Profit"]
  }
};

function updateLanguage(lang) {
  const t = texts[lang];
  document.getElementById('title').innerText = t.title;
  document.getElementById('label-initial').innerText = t.labelInitial;
  document.getElementById('label-rate').innerText = t.labelRate;
  document.getElementById('label-weeks').innerText = t.labelWeeks;
  document.getElementById('label-deposit').innerText = t.labelDeposit;
  document.getElementById('calcBtn').innerText = t.button;

  const headers = document.querySelector("#tableHeader tr").children;
  t.tableHeaders.forEach((val, i) => {
    headers[i].innerText = val;
  });

  document.body.classList.toggle("en", lang === 'en');

  calculate();
}

function toggleLanguage() {
  currentLang = document.getElementById('langToggle').checked ? 'en' : 'ru';
  updateLanguage(currentLang);
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function sanitizeInput(id) {
  const input = document.getElementById(id);
  let value = parseFloat(input.value);
  if (isNaN(value)) {
    input.value = '0';
    value = 0;
  }
  return value;
}

function calculate() {
  const t = texts[currentLang];
  const initial = sanitizeInput('initial');
  const ratePercent = sanitizeInput('rate');
  const weeks = Math.floor(sanitizeInput('weeks'));
  const deposit = sanitizeInput('deposit');
  const rate = ratePercent / 100;

  let balance = initial;
  let totalProfit = 0;
  const tableBody = document.querySelector("#resultTable tbody");
  tableBody.innerHTML = '';

  if (weeks <= 0) {
    document.getElementById("userInvestment").innerText = `${t.userInvestment}0.00`;
    document.getElementById("finalAmount").innerText = `${t.finalAmount}0.00`;
    document.getElementById("futureEarnings").innerText = `${t.weeklyIncome}0.00`;
    return;
  }

  for (let week = 1; week <= weeks; week++) {
    const interest = balance * rate;
    const newBalance = balance + interest + deposit;
    totalProfit += interest;

    tableBody.innerHTML += `
      <tr>
        <td>${week}</td>
        <td>${balance.toFixed(2)}</td>
        <td>${deposit.toFixed(2)}</td>
        <td>${interest.toFixed(2)}</td>
        <td>${newBalance.toFixed(2)}</td>
        <td>${totalProfit.toFixed(2)}</td>
      </tr>
    `;
    balance = newBalance;
  }

  const totalInvested = initial + deposit * weeks;

  document.getElementById("userInvestment").innerText = `${t.userInvestment}${totalInvested.toFixed(2)}`;
  document.getElementById("finalAmount").innerText = `${t.finalAmount}${balance.toFixed(2)}`;
  document.getElementById("futureEarnings").innerText = `${t.weeklyIncome}${(balance * rate).toFixed(2)}`;
}

window.onload = () => {
  updateLanguage('ru');
};

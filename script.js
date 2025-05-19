let currentLang = 'ru';
let currencySymbol = '₽';

const texts = {
  ru: {
    title: "Калькулятор сложного процента",
    labelInitial: "Начальная сумма",
    labelRate: "Процент в неделю (%)",
    labelWeeks: "Количество недель (1 год = 52 недели)",
    labelDeposit: "Еженедельное пополнение / снятие",
    button: "Рассчитать",
    finalAmount: "Итого на конец периода: ",
    userInvestment: "Собственные инвестиции: ",
    totalProfit: "Итого прибыль за период: ",
    weeklyIncome: "Доход за неделю в конце периода: ",
    tableHeaders: ["Неделя", "Начальный баланс", "Проценты", "Пополнение", "Конечный баланс", "Итого прибыль"]
  },
  en: {
    title: "Compound Interest Calculator",
    labelInitial: "Initial Amount",
    labelRate: "Weekly Interest Rate (%)",
    labelWeeks: "Number of Weeks (1 year = 52)",
    labelDeposit: "Weekly Deposit / Withdrawal",
    button: "Calculate",
    finalAmount: "Total at the end: ",
    userInvestment: "Your investment: ",
    totalProfit: "Total profit over period: ",
    weeklyIncome: "Weekly income at end of period: ",
    tableHeaders: ["Week", "Start Balance", "Interest", "Deposit", "End Balance", "Total Profit"]
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
  localStorage.setItem('lang', currentLang);
  updateLanguage(currentLang);
}

function toggleTheme() {
  const dark = document.body.classList.toggle("dark-mode");
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

function toggleCurrency() {
  const isDollar = document.getElementById('currencyToggle').checked;
  currencySymbol = isDollar ? '$' : '₽';
  localStorage.setItem('currency', currencySymbol);

  // Обновляем отображение символов в input'ах
  document.getElementById('currencyInitial').innerText = currencySymbol;
  document.getElementById('currencyDeposit').innerText = currencySymbol;
  calculate();
}

function sanitizeInput(id) {
  const input = document.getElementById(id);
  let value = parseFloat(input.value);
  if (isNaN(value)) {
    input.value = '0';
    value = 0;
  }
  localStorage.setItem(id, value);
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
    document.getElementById("userInvestment").innerText = `${t.userInvestment}${currencySymbol}0.00`;
    document.getElementById("finalAmount").innerText = `${t.finalAmount}${currencySymbol}0.00`;
    document.getElementById("totalProfit").innerText = `${t.totalProfit}${currencySymbol}0.00`;
    document.getElementById("futureEarnings").innerText = `${t.weeklyIncome}${currencySymbol}0.00`;
    return;
  }

  for (let week = 1; week <= weeks; week++) {
    const interest = balance * rate;
    const newBalance = balance + interest + deposit;
    totalProfit += interest;

    tableBody.innerHTML += `
      <tr>
        <td>${week}</td>
        <td>${currencySymbol}${balance.toFixed(2)}</td>
        <td>${currencySymbol}${interest.toFixed(2)}</td>
        <td>${currencySymbol}${deposit.toFixed(2)}</td>
        <td>${currencySymbol}${newBalance.toFixed(2)}</td>
        <td>${currencySymbol}${totalProfit.toFixed(2)}</td>
      </tr>
    `;
    balance = newBalance;
  }

  const totalInvested = initial + deposit * weeks;
  const profit = balance - totalInvested;

  document.getElementById("userInvestment").innerText = `${t.userInvestment}${currencySymbol}${totalInvested.toFixed(2)}`;
  document.getElementById("finalAmount").innerText = `${t.finalAmount}${currencySymbol}${balance.toFixed(2)}`;
  document.getElementById("totalProfit").innerText = `${t.totalProfit}${currencySymbol}${profit.toFixed(2)}`;
  document.getElementById("futureEarnings").innerText = `${t.weeklyIncome}${currencySymbol}${(balance * rate).toFixed(2)}`;
}

window.onload = () => {
  ['initial', 'rate', 'weeks', 'deposit'].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved !== null) {
      document.getElementById(id).value = saved;
    }
  });

  const savedLang = localStorage.getItem('lang') || 'ru';
  currentLang = savedLang;
  document.getElementById('langToggle').checked = savedLang === 'en';

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add("dark-mode");
    document.getElementById('themeToggle').checked = true;
  }

  const savedCurrency = localStorage.getItem('currency') || '₽';
  currencySymbol = savedCurrency;
  document.getElementById('currencyToggle').checked = savedCurrency === '$';

  updateLanguage(savedLang);
};

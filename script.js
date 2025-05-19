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
    tableHeaders: ["Неделя", "Начальный баланс", "Проценты", "Пополнение", "Конечный баланс", "Итого прибыль"]
  },
  en: {
    title: "Compound Interest Calculator",
    labelInitial: "Initial Amount",
    labelRate: "Weekly Interest Rate (%)",
    labelWeeks: "Number of Weeks (1 year = 52)",
    labelDeposit: "Weekly Deposit / Withdrawal",
    button: "Calculate",
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

function formatNumber(num) {
  return num.toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function setValue(idOrClass, value) {
  const elById = document.getElementById(idOrClass);
  if (elById) elById.innerText = value;

  const elByClass = document.getElementsByClassName(idOrClass);
  for (let el of elByClass) {
    el.innerText = value;
  }
}

function calculate() {
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
    setValue("userInvestment", `${currencySymbol}0,00`);
    setValue("finalAmount", `${currencySymbol}0,00`);
    setValue("totalProfit", `${currencySymbol}0,00`);
    setValue("futureEarnings", `${currencySymbol}0,00`);
    return;
  }

  for (let week = 1; week <= weeks; week++) {
    const interest = balance * rate;
    const newBalance = balance + interest + deposit;
    totalProfit += interest;

    tableBody.innerHTML += `
      <tr>
        <td>${week}</td>
        <td>${currencySymbol}${formatNumber(balance)}</td>
        <td>${currencySymbol}${formatNumber(interest)}</td>
        <td>${currencySymbol}${formatNumber(deposit)}</td>
        <td>${currencySymbol}${formatNumber(newBalance)}</td>
        <td>${currencySymbol}${formatNumber(totalProfit)}</td>
      </tr>
    `;
    balance = newBalance;
  }

  const totalInvested = initial + deposit * weeks;
  const profit = balance - totalInvested;

  setValue("userInvestment", `${currencySymbol}${formatNumber(totalInvested)}`);
  setValue("finalAmount", `${currencySymbol}${formatNumber(balance)}`);
  setValue("totalProfit", `${currencySymbol}${formatNumber(profit)}`);
  setValue("futureEarnings", `${currencySymbol}${formatNumber(balance * rate)}`);
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

  document.getElementById('currencyInitial').innerText = currencySymbol;
  document.getElementById('currencyDeposit').innerText = currencySymbol;

  updateLanguage(savedLang);
};

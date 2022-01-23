import { obj } from './obj.js'

const getUser = () => JSON.parse(localStorage.getItem('user'));
const saveUser = (obj) => localStorage.setItem('user', JSON.stringify(obj));

const checkUser = () => {
  if (!getUser()) {
    saveUser(obj);
  }
}

const printUser = () => {
  const { rooms, fence, insurance, clean, repair, price } = getUser();

  const roomsInput = document.getElementById('hab-input');
  roomsInput.value = rooms;

  const cleanBox = document.getElementById('cb-clean');
  cleanBox.checked = clean;

  const repairBox = document.getElementById('cb-repair');
  repairBox.checked = repair;

  const fenceBox = document.getElementById('input-fence');
  fenceBox.value = fence;

  const insuranceBox = document.getElementById('input-insurance');
  insuranceBox.value = insurance;

  const priceInput = document.getElementById('price-input');
  priceInput.value = price;
}

const updateRooms = () => {
  const input = document.getElementById('hab-input');
  const roomsNumber = input.value;
  const user = getUser();
  user.rooms = Number(roomsNumber);
  saveUser(user);
}

const updateBoxes = () => {
  const clean = document.getElementById('cb-clean');
  const repair = document.getElementById('cb-repair');
  const fence = document.getElementById('input-fence');
  const insurance = document.getElementById('input-insurance');

  let user = getUser();

  if (clean.checked === true) {
    user.clean = true;
  } else { user.clean = false };

  if (repair.checked === true) {
    user.repair = true;
  } else { user.repair = false };


  user.fence = Number(fence.value);
  user.insurance = Number(insurance.value);

  saveUser(user);
}

const calcRent = () => {
  let user = getUser();
  const rent = user.rooms * 150;
  return rent;
}

const printRent = () => {
  const rentDom = document.getElementById('rent-calc');
  rentDom.textContent = `${calcRent()} NE`;
}

const calcTasks = () => {
  let user = getUser();
  let clean = 0;
  let repair = 0;

  if (user.clean) {
    clean = 600;
  }

  if (user.repair) {
    repair = 400;
  }

  let tasks = clean + repair;
  return tasks;
}

const printTasks = () => {
  const tasksDom = document.getElementById('tasks-calc');
  tasksDom.textContent = `${calcTasks()} NE`;
}

const calcExpenses = () => {
  let user = getUser();
  let fences = user.fence * 30;
  let insurance = user.insurance * 80;
  const expenses = fences + insurance;
  return Number(expenses);
}

const printExpenses = () => {
  const fencesDom = document.getElementById('expenses-calc');
  fencesDom.textContent = `${calcExpenses()} NE`
}

const calcProfit = () => {
  const profit = calcRent() + calcTasks() - calcExpenses();
  return Number(profit);
}

const calcNinti = () => {
  const profit = calcProfit();
  const ninti = profit / 125;
  console.log('priting ninti ' + ninti);
  return Number(ninti);
}

const printProfit = () => {
  const dailyNeDom = document.getElementById('results-ne');
  dailyNeDom.textContent = `${calcProfit()} NE al día.`

  const nintiDom = document.getElementById('results-ninti');
  nintiDom.textContent = `${calcNinti()} $NINTI al día.`;

}

const updatePrice = () => {
  const priceInput = document.getElementById('price-input');
  let user = getUser();
  user.price = Number(priceInput.value);
  saveUser(user);
}

const calcUSD = () => {
  let user = getUser();
  let ninti = calcNinti();
  const { price } = user;

  const dailyUsd = Number(ninti * price);
  return dailyUsd.toFixed(2);
}

const printUSD = () => {
  const usdDom = document.getElementById('results-usd');
  usdDom.textContent = `$${calcUSD()} USD al día.`
}

const printCalcs = () => {
  printRent();
  printTasks();
  printExpenses();
  printProfit();
  printUSD();
}


export { checkUser, printUser, updateRooms, updateBoxes, printCalcs, updatePrice };
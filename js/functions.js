import { obj } from './obj.js'

const getUser = () => JSON.parse(localStorage.getItem('user'));
const saveUser = (obj) => localStorage.setItem('user', JSON.stringify(obj));

const checkUser = () => {
  if (!getUser()) {
    saveUser(obj);
    location.reload();
  }
}

const checkVersion = () => {
  const user = getUser();
  if(user.ver !== obj.ver){
    localStorage.clear();
    location.reload();
  }
}

const printUser = () => {
  const { rooms, fence, insurance, clean, repair, price, bonus0, bonus2, bonus4, bonus6 } = getUser();

  const roomsInput = document.getElementById('hab-input');
  roomsInput.value = rooms;

  const bonus0Input = document.getElementById('bonus-0');
  bonus0Input.checked = bonus0;

  const bonus2Input = document.getElementById('bonus-2');
  bonus2Input.checked = bonus2;

  const bonus4Input = document.getElementById('bonus-4');
  bonus4Input.checked = bonus4;

  const bonus6Input = document.getElementById('bonus-6');
  bonus6Input.checked = bonus6;

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
    clean = 25 * 40;
  }

  if (user.repair) {
    repair = 5 * 80;
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

const calcUsdDays = (days) => {
  return Number(calcUSD() * days).toFixed(2);
}

const printUsdDays = () => {
  const usd7 = document.getElementById('results-usd-7');
  const usd30 = document.getElementById('results-usd-30');

  usd7.textContent = `$${calcUsdDays(7)} USD cada 7 días`;
  usd30.textContent = `$${calcUsdDays(30)} USD cada 30 días`;
}

const printCalcs = () => {
  printRent();
  printTasks();
  printExpenses();
  printProfit();
  printUSD();
  printUsdDays();
}

const addEventListeners = () => {
  const roomsInput = document.getElementById('hab-input');
roomsInput.addEventListener('keyup', () => {
  updateRooms();
  printCalcs();
})

const boxes = document.querySelectorAll('.set-boxes');
boxes.forEach((box) => {
  box.addEventListener('change', () => {
    updateBoxes();
    printCalcs();
  })
})

const setInputs = document.querySelectorAll('.set-input');
setInputs.forEach((input) => {
  input.addEventListener('keyup', () => {
    updateBoxes();
    printCalcs();
  })
})

const priceInput = document.getElementById('price-input');
priceInput.addEventListener('keyup', () => {
  updatePrice();
  printCalcs();
})
}


export { checkUser, printUser, updateRooms, updateBoxes, printCalcs, updatePrice, addEventListeners, checkVersion };
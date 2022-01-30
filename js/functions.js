import { obj, api } from './obj.js'

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
  if (user.ver !== obj.ver) {
    localStorage.clear();
    location.reload();
  }
}

function fetchPrice(api) {
  let price = fetch(api)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return price;
}

async function getPrice(api) {
  let price = fetchPrice(api)
  const a = await price;
  return Number(a.data.price);
};

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

const setBonusFalse = (bonus) => {
  const id = `bonus${bonus.id.charAt(6)}`;
  const user = getUser();
  user[id] = false;
  saveUser(user);
}

const setBonusTrue = (bonus) => {
  const id = `bonus${bonus.id.charAt(6)}`;
  const user = getUser();
  user[id] = true;
  saveUser(user);
}

const updateBonus = (bonus) => {
  const allBonus = document.querySelectorAll('#set-bonus input')
  allBonus.forEach((box) => {
    box.checked = false;
    setBonusFalse(box);
  })
  bonus.checked = true;
  setBonusTrue(bonus);
}

const calcBonus = (profit) => {
  const user = getUser();
  if(user.bonus0 === true){
    return profit;
  } else if (user.bonus2 === true){
    return (profit * 102) / 100;
  } else if (user.bonus4 === true){
    return (profit * 104) / 100;
  } else if (user.bonus6 === true){
    return (profit * 106) / 100;
  }
}

const calcRent = () => {
  let user = getUser();
  const rent = user.rooms * 180;
  return calcBonus(rent);
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

const convertNE = () => {
  const user = getUser();
  const ne = user.ne;
  const ninti = ne / 125;
  return Number(ninti).toFixed(2);
}

const convertNinti = () => {
  const ninti = convertNE();
  const user = getUser();
  const usd = ninti * user.price
  return Number(usd).toFixed(2);
}

const printConvertedNE = () => {
  const convertionNE = document.getElementById('converter-ninti');
  convertionNE.innerHTML = `Tienes ${convertNE()} $NINTI`;
  const convertionUSD = document.getElementById('converter-usd')
  convertionUSD.innerHTML =`que son $${convertNinti()} USD.`
}

const updatePrice = async () => {
  let price = await getPrice(api); 
  let user = getUser();
  user.price = price;
  saveUser(user);
}


const calcUSD = async () => {
  let ninti = calcNinti();

  let price = await getPrice(api);

  const dailyUsd = Number(ninti * price);
  return dailyUsd.toFixed(2);
}

const printUSD = async () => {
  const usdDom = document.getElementById('results-usd');
  usdDom.textContent = `$${await calcUSD()} USD al día.`
}

const calcUsdDays = async (days) => {
  return Number(await calcUSD() * days).toFixed(2);
}

const printUsdDays = async () => {
  const usd7 = document.getElementById('results-usd-7');
  const usd30 = document.getElementById('results-usd-30');

  usd7.textContent = `$${await calcUsdDays(7)} USD cada 7 días`;
  usd30.textContent = `$${await calcUsdDays(30)} USD cada 30 días`;
}

const printPrice = async () => {
  await updatePrice();
  const user = getUser();
  const priceText = document.getElementById('text-price');
  priceText.textContent = `$${user.price.toFixed(2)} USD`;
}

const printCalcs = async () => {
  printRent();
  printTasks();
  printExpenses();
  printProfit();
  await printUSD();
  await printUsdDays();
  await printPrice();
}

const addEventListeners = () => {
  const roomsInput = document.getElementById('hab-input');
  roomsInput.addEventListener('keyup', async () => {
    updateRooms();
    await printCalcs();
  })

  const bonusBoxes = document.querySelectorAll('#set-bonus input');
  bonusBoxes.forEach((bonusBox) => {
    bonusBox.addEventListener('change', async ()=> {
      updateBonus(bonusBox);
      await printCalcs();
    })
  })

  const boxes = document.querySelectorAll('.set-boxes');
  boxes.forEach((box) => {
    box.addEventListener('change', async () => {
      updateBoxes();
      await printCalcs();
    })
  })

  const setInputs = document.querySelectorAll('.set-input');
  setInputs.forEach((input) => {
    input.addEventListener('keyup', async () => {
      updateBoxes();
      await printCalcs();
    })
  })

  const neInput = document.getElementById('converter-input');
  neInput.addEventListener('keyup', () => {
    if(neInput.value !== 0){
      const user = getUser();
      user.ne = neInput.value;
      saveUser(user);
      printConvertedNE();
    }
  })

}

const printUser = () => {
  const { rooms, fence, insurance,
    clean, repair, price, ne, 
    bonus0, bonus2, bonus4, bonus6 } = getUser();

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

  const priceText = document.getElementById('text-price');
  priceText.textContent = Number(price);

  const converterInput = document.getElementById('converter-input');
  converterInput.value = ne;
  printConvertedNE();
}


export { checkUser, printUser, updateRooms,
  updateBoxes, printCalcs, addEventListeners,
  checkVersion, fetchPrice, updatePrice };
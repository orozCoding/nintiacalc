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
  const clean = document.getElementById('input-clean');
  const repair = document.getElementById('input-repair');
  const fence = document.getElementById('input-fence');
  const insurance = document.getElementById('input-insurance');
  const selfRepair = document.getElementById('input-self-repair');

  let user = getUser();

  user.clean = Number(clean.value);
  user.repair = Number(repair.value);
  user.fence = Number(fence.value);
  user.insurance = Number(insurance.value);
  user.selfRepair = Number(selfRepair.value);

  saveUser(user);
}

const updateBonus = () => {
  const user = getUser();
  const bonusInput = document.getElementById('bonus-input');
  user.bonus = Number(bonusInput.value);
  saveUser(user);
}

const calcBonus = (profit) => {
  const user = getUser();
  if (user.bonus === 0) {
    return profit;
  } else {
    return (profit * (100 + user.bonus)) / 100;
  }
}

const updateColors = () => {
  const gold = document.getElementById('input-gold');
  const black = document.getElementById('input-black');
  const white = document.getElementById('input-white');
  let user = getUser();
  user.gold = Number(gold.value);
  user.black = Number(black.value);
  user.white = Number(white.value);
  saveUser(user);
}

const printColors = () => {
  const goldInput = document.getElementById('input-gold');
  const blackInput = document.getElementById('input-black');
  const whiteInput = document.getElementById('input-white');
  const { gold, black, white } = getUser();

  goldInput.value = gold;
  blackInput.value = black;
  whiteInput.value = white;
}

const sumColors = () => {
  const {
    gold, black, white
  } = getUser();
  return gold + black + white;
}

const sumNoColors = () => {
  const { rooms } = getUser();
  return rooms - sumColors();
}

const calcColorsRent = () => {
  const {
    gold, black, white
  } = getUser();

  const goldProfit = gold * 207;
  const blackProfit = black * 190.8;
  const whiteProfit = white * 183.6;

  return goldProfit + blackProfit + whiteProfit
}

const calcNoColorRent = () => {
  return sumNoColors() * 180;
}

const calcRent = () => {
  return Math.round(
    (calcBonus(calcNoColorRent() + calcColorsRent()) + calcElectricity())
  );
}

const printRent = () => {
  const rentDom = document.getElementById('rent-calc');
  rentDom.textContent = `${calcRent()} NE`;
}

const calcTasks = () => {
  let user = getUser();
  let clean = 90 * user.clean;
  let repair = 130 * user.repair;

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
  let selfRepair = user.selfRepair * 20;
  const expenses = fences + insurance + selfRepair;
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

const updateConversion = () => {
  const neInput = document.getElementById('converter-input');
  const user = getUser();
  user.ne = Number(neInput.value);
  saveUser(user);
}

const printConvertedNE = () => {
  const convertionNE = document.getElementById('converter-ninti');
  const convertionUSD = document.getElementById('converter-usd');
  const userNe = document.getElementById('converter-input');
  if (userNe.value <= 0) {
    convertionNE.innerHTML = `Ingresa tus NE.`;
    convertionUSD.innerHTML = ``;
  } else {
    convertionNE.innerHTML = `Tienes&nbsp;<p class="color-ninti"> ${convertNE()} $NINTI</p>.`;
    convertionUSD.innerHTML = `que son&nbsp;<p class="color-usd">$${convertNinti()} USD</p>.`
  }
}

const updatePrice = async () => {
  let price = await getPrice(api);
  let user = getUser();
  user.price = price;
  saveUser(user);
}

const saveUSD = (usd) => {
  const user = getUser();
  user.usd = Number(usd);
  saveUser(user);
}

const calcUSD = async () => {
  let ninti = calcNinti();

  let price = await getPrice(api);

  const dailyUsd = Number(ninti * price).toFixed(2);
  saveUSD(dailyUsd);
  return dailyUsd;
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
  priceText.textContent = `$${user.price.toFixed(3)} USD`;
}

const calcRoi = async () => {
  await updatePrice();
  const { usd, inv, prod } = getUser();
  const roi = (inv - prod) / usd;
  return Number(roi);
};

const updateRoi = async () => {
  const roi = Number(await calcRoi());
  const user = getUser();
  user.roi = roi;
  saveUser(user);
};

const updateInv = () => {
  const investedInput = document.getElementById('invested-input');
  const user = getUser();
  user.inv = Number(investedInput.value);
  saveUser(user);
}

const printRoi = async () => {
  await updateRoi();
  const user = getUser();
  const roiDaysDom = document.getElementById('roi-days');
  const investedInput = document.getElementById('invested-input');

  if (user.rooms <= 0 || user.rooms === null) {
    return roiDaysDom.innerHTML = `No hay habitaciones.`;
  } else {

    if (investedInput.value <= 0) {
      return roiDaysDom.innerHTML = `Ingresa $USD.`;
    } else if (user.roi <= 0 && user.roi !== null) {
      roiDaysDom.innerHTML = `Inversión recuperada.`;
    } else if (user.roi > 0 && user.roi < 0.9) {
      roiDaysDom.innerHTML = `ROI casi logrado.`;
    } else if (user.roi > 0) {
      roiDaysDom.innerHTML = `ROI en ${user.roi.toFixed(0)} días.`;
    } else {
      roiDaysDom.innerHTML = `No hay habitaciones.`;
    }
  }
}

const printRoiInputs = () => {
  const { inv, prod } = getUser();
  const investedInput = document.getElementById('invested-input');
  investedInput.value = inv;
  const producedInput = document.getElementById('produced-input');
  producedInput.value = prod;

}

const updateProduced = () => {
  const producedInput = document.getElementById('produced-input');
  const user = getUser();
  user.prod = Number(producedInput.value);
  saveUser(user);
}

const printExchangeInputs = () => {
  const input = document.querySelectorAll('.exchange-input');
  input.forEach((input) => {
    input.value = 0;
  })
}

const exchangeNintiUsd = () => {
  const input = document.getElementById('exchange-ninti-usd');
  const { price } = getUser();
  const exchange = (input.value * price).toFixed(2);
  return exchange;
}

const exchangeUsdNinti = () => {
  const input = document.getElementById('exchange-usd-ninti');
  const { price } = getUser();
  const exchange = (input.value / price).toFixed(2);
  return exchange;
}

const printExchangeNinti = () => {
  const input = document.getElementById('exchange-ninti-usd');
  const div = document.getElementById('exchange-result-ninti');
  if (input.value <= 0 || input.value === null || input.value === undefined) {
    div.innerHTML = `Ingresa $NINTI`;
  } else {
    div.innerHTML = `<p>${input.value} $NINTI = &nbsp;</p><p class="cl-green-light"> $${exchangeNintiUsd()} USD</p>`;
  }
}

const printExchangeUsd = () => {
  const input = document.getElementById('exchange-usd-ninti');
  const div = document.getElementById('exchange-result-usd');
  if (input.value <= 0 || input.value === null || input.value === undefined) {
    div.innerHTML = `Ingresa $USD`;
  } else {
    div.innerHTML = `<p>${input.value} $USD = &nbsp;</p><p class="cl-yellow">${exchangeUsdNinti()} $NINTI</p>`;
  }
}


const printElectricity = () => {
  const check = document.getElementById('elect-check');
  const user = getUser();
  const housesInput = document.getElementById('input-houses');
  housesInput.value = user.houses;
  const mansionsInput = document.getElementById('input-mansions');
  mansionsInput.value = user.mansions;
  const buildingsInput = document.getElementById('input-buildings');
  buildingsInput.value = user.buildings;
  const skyscrapersInput = document.getElementById('input-skycrapers');
  skyscrapersInput.value = user.skyscrapers;
  check.checked = user.electricity;
  if (!check.checked) {
    const inputs = document.querySelectorAll('.elect-input');
    inputs.forEach((input) => {
      input.setAttribute('disabled', '');
      input.classList.add('disabled');
    })
  }
}

const toggleElectDisable = () => {
  const check = document.getElementById('elect-check');
  const inputs = document.querySelectorAll('.elect-input');
  if (!check.checked) {
    inputs.forEach((input) => {
      input.setAttribute('disabled', '');
      input.classList.add('disabled');
    })
  } else {
    inputs.forEach((input) => {
      if (input.disabled) {
        input.removeAttribute('disabled');
      }

      if (input.classList.contains('disabled')) {
        input.classList.remove('disabled')
      }
    })
  }
}

const updateElectricity = () => {
  const check = document.getElementById('elect-check');
  const housesInput = document.getElementById('input-houses');
  const mansionsInput = document.getElementById('input-mansions');
  const buildingsInput = document.getElementById('input-buildings');
  const skyscrapersInput = document.getElementById('input-skycrapers');
  const user = getUser();
  user.electricity = check.checked;
  user.houses = Number(housesInput.value);
  user.mansions = Number(mansionsInput.value);
  user.buildings = Number(buildingsInput.value);
  user.skyscrapers = Number(skyscrapersInput.value);
  saveUser(user);
  printElectricity();
}

const calcElectricity = () => {
  const { 
    electricity, houses, mansions,
    buildings, skyscrapers
   } = getUser();
  
   if(!electricity) return 0;

   const housesProfit = 340 * houses;
   const mansionsProfit = 394 * mansions;
   const buildingsProfit = 466 * buildings;
   const skyscrapersProfit = 610 * skyscrapers;

   return housesProfit + mansionsProfit + buildingsProfit + skyscrapersProfit;
}

const printCalcs = async () => {
  printRent();
  printTasks();
  printExpenses();
  printProfit();
  printConvertedNE();
  await printUSD();
  await printUsdDays();
  await printPrice();
  await printRoi();
}

const limitInputs = () => {
  const limit3 = document.querySelectorAll('.limit-3');
  limit3.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value > 3) {
        input.value = 3;
      }
    })
  })

  const limit5 = document.querySelectorAll('.limit-5');
  limit5.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value > 5) {
        input.value = 5;
      }
    })
  })

  const limit12 = document.querySelectorAll('.limit-12');
  limit12.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value > 12) {
        input.value = 12;
      }
    })
  })

  const limit14 = document.querySelectorAll('.limit-14');
  limit14.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value > 14) {
        input.value = 14;
      }
    })
  })

  const limit30 = document.querySelectorAll('.limit-30');
  limit30.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value > 30) {
        input.value = 30;
      }
    })
  })

  const noNegInputs = document.querySelectorAll('.no-neg');
  noNegInputs.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value < 0 || !input.value.match(/[0-9%]/)) {
        input.value = '';
      }
    })
  })

  const max2Input = document.querySelectorAll('.max-2');
  max2Input.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value.length > 2) {
        input.value = '';
      }
    })
  })

  const max3Input = document.querySelectorAll('.max-3');
  max3Input.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value.length > 3) {
        input.value = '';
      }
    })
  })

  const colorInput = document.querySelectorAll('.color-input');
  colorInput.forEach((input) => {
    input.addEventListener('keyup', () => {
      const user = getUser();
      if (input.value > user.rooms) {
        input.value = '';
      }
    })
  })
}

const addEventListeners = () => {
  limitInputs();

  const roomsInput = document.getElementById('hab-input');
  roomsInput.addEventListener('keyup', async () => {
    if (roomsInput.value > 3000) {
      roomsInput.value = roomsInput.value.substring(0, 4);
    }
    updateRooms();
    await printCalcs();
  })

  const bonusInput = document.getElementById('bonus-input');

  bonusInput.addEventListener('keyup', async () => {
    updateBonus();
    await printCalcs();
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

  const colorInputs = document.querySelectorAll('.color-input');
  colorInputs.forEach((input) => {
    input.addEventListener('keyup', async () => {
      updateColors();
      if (sumColors() > getUser().rooms) {
        input.value = '';
      }
      await printCalcs();
    })
  })

  const neInput = document.getElementById('converter-input');
  neInput.addEventListener('keyup', () => {
    if (neInput.value !== 0) {
      if (neInput.value > 100000000) {
        neInput.value = neInput.value.substring(0, 9);
      }
      updateConversion();
      printConvertedNE();
    }
  })

  const investedInput = document.getElementById('invested-input');
  investedInput.addEventListener('keyup', async () => {
    if (investedInput.value > 1000000) {
      investedInput.value = investedInput.value.substring(0, 7);
    }
    updateInv();
    await printRoi();
  })

  const producedInput = document.getElementById('produced-input');
  producedInput.addEventListener('keyup', async () => {
    if (producedInput.value > 1000000) {
      producedInput.value = producedInput.value.substring(0, 7);
    }
    updateProduced();
    await printRoi();
  })

  const exchangeNintiInput = document.getElementById('exchange-ninti-usd');
  exchangeNintiInput.addEventListener('keyup', () => {
    if (exchangeNintiInput.value > 10000000) {
      exchangeNintiInput.value = exchangeNintiInput.value.substring(0, 8);
    }
    printExchangeNinti();
  })

  const exchangeUsdInput = document.getElementById('exchange-usd-ninti');
  exchangeUsdInput.addEventListener('keyup', () => {
    if (exchangeUsdInput.value > 1000000) {
      exchangeUsdInput.value = exchangeUsdInput.value.substring(0, 7);
    }
    printExchangeUsd();
  })

  const resetLink = document.getElementById('reset');
  resetLink.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  })

  const electCheck = document.getElementById('elect-check');
  electCheck.addEventListener('change', async () => {
    toggleElectDisable();
    updateElectricity();
    await printCalcs();
  })

  const electInputs = document.querySelectorAll('.elect-input');
  electInputs.forEach((input) => {
    input.addEventListener('keyup', async () => {
      updateElectricity();
      await printCalcs();
    })
  })

  document.addEventListener("wheel", function (event) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  });
}


const printUser = () => {
  const { rooms, fence, insurance,
    clean, repair, price, ne,
    bonus, selfRepair } = getUser();

  const roomsInput = document.getElementById('hab-input');
  roomsInput.value = rooms;

  const bonusInput = document.getElementById('bonus-input');
  bonusInput.value = bonus;

  const cleanInput = document.getElementById('input-clean');
  cleanInput.value = clean;

  const repairInput = document.getElementById('input-repair');
  repairInput.value = repair;

  const fenceInput = document.getElementById('input-fence');
  fenceInput.value = fence;

  const insuranceInput = document.getElementById('input-insurance');
  insuranceInput.value = insurance;

  const selfRepairInput = document.getElementById('input-self-repair');
  selfRepairInput.value = selfRepair;

  const priceText = document.getElementById('text-price');
  priceText.textContent = Number(price);

  const converterInput = document.getElementById('converter-input');
  converterInput.value = ne;
  printConvertedNE();
  printRoiInputs();
  printExchangeInputs();
  printColors();
  printElectricity();
}


export {
  checkUser, printUser, updateRooms,
  updateBoxes, printCalcs, addEventListeners,
  checkVersion, fetchPrice, updatePrice,
  printRoiInputs, printExchangeInputs
};
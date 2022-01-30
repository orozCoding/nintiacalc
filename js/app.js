import { checkUser, updatePrice, printUser,
  printCalcs, addEventListeners,
  checkVersion, printRoiInputs, printExchangeInputs } from "./functions.js";

  window.addEventListener('load', ()=> {
    updatePrice();
    checkUser();
    checkVersion();
    printUser();
    printCalcs();
    addEventListeners();
  })

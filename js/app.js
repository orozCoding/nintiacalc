import { checkUser, printUser, updateRooms, updateBoxes, printCalcs, updatePrice } from "./functions.js";

checkUser();
printUser();
printCalcs();

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
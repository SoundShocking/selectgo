import vars from '../_vars'
import customSelect from 'custom-select';
import noUiSlider from 'nouislider'
import Inputmask from "inputmask";

if (vars.$calcMileage) {
  const $mileageRange = vars.$calcMileage;
  console.log($mileageRange)

  noUiSlider.create($mileageRange, {
    start: 100000,
    step: 10000,
    connect: 'lower',
    tooltips: true,
    range: {
      'min': 0,
      'max': 200000
    },
    format: {
      to: (value) => value.toLocaleString('ru-RU'),
      from: value => value.toLocaleString('ru-RU')
    }
  })
}

document.documentElement.classList.add('is-touch');
const calcCustomSelects = document.querySelectorAll('.calc-custom-select');

if (calcCustomSelects.length) {
  customSelect(calcCustomSelects, {
    containerClass: '_custom-select-container',
    openerClass: '_custom-select-opener',
    panelClass: '_custom-select-panel',
    optionClass: '_custom-select-option'
  });

  calcCustomSelects.forEach(el => {
    el.addEventListener('change', e => {
      console.log(e.target.value)
      e.target.closest('._custom-select-container').querySelector('._custom-select-opener').classList.add('is-selected')
    })
  })
}

const inputMaskPhone = new Inputmask("+7 999 99 99");
const inputTypeTel = document.querySelectorAll('input[type="tel"]');
if (inputTypeTel.length) inputMaskPhone.mask(inputTypeTel)
// im.mask(document.querySelector('.calc__form input[type="tel"]'))
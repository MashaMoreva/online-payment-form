import { el, setChildren } from 'redom';
import Inputmask from 'inputmask';
import cardValidator from 'card-validator';
import './styles.css';
import visaImage from './assets/images/visa-logo.svg';
import mastercardImage from './assets/images/mastercard-logo.svg';
import mirImage from './assets/images/mir-logo.svg';

const visaImgElement = el('img', {
  src: visaImage,
  alt: 'Visa',
});
const mastercardImgElement = el('img', {
  src: mastercardImage,
  alt: 'Mastercard',
});
const mirImgElement = el('img', {
  src: mirImage,
  alt: 'МИР',
});

const cardImageContainer = el('div.flex.items-center.w-16.h-10');

function updateCardLogo(cardType) {
  setChildren(cardImageContainer, []);

  switch (cardType) {
    case 'visa':
      setChildren(cardImageContainer, [visaImgElement]);
      break;
    case 'mastercard':
      setChildren(cardImageContainer, [mastercardImgElement]);
      break;
    case 'mir':
      setChildren(cardImageContainer, [mirImgElement]);
      break;
    default:
      break;
  }
}

function getInputValue(input) {
  return input.value.replace(/\D/g, '');
}

// Вынесла отдельно функцию для валидации номера карты
export function validateCardNumber(cardNumber) {
  const cardInfo = cardValidator.number(cardNumber);
  return cardInfo.isValid;
}

export function validateCvc(cvc) {
  const cvcInfo = cardValidator.cvv(cvc);
  return cvcInfo.isValid;
}

function validateEmail(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const isValid = emailRegex.test(email);
  return { isValid };
}

// Новая функция для создания элементов формы
export function createFormElements() {
  const cardNumberInput = el(
    'input#card-number.input.w-full.p-2.border.rounded-md',
    {
      placeholder: 'Введите номер карты',
      required: true,
    },
  );

  const expiryInput = el('input#expiry.input.w-full.p-2.border.rounded-md', {
    placeholder: 'ММ/ГГ',
    required: true,
  });

  const cvcInput = el('input#cvc.input.w-full.p-2.border.rounded-md', {
    placeholder: 'Введите CVC/CVV',
    required: true,
  });

  const emailInput = el('input#email.input.w-full.p-2.border.rounded-md', {
    placeholder: 'Введите email',
    required: true,
    type: 'email',
  });

  return {
    cardNumberInput,
    expiryInput,
    cvcInput,
    emailInput,
  };
}

// prettier-ignore
const {
  cardNumberInput, expiryInput, cvcInput, emailInput,
} = createFormElements();

export const payButton = el(
  'button.button.bg-blue-500.text-white.w-1/4.p-2.rounded-md.disabled:bg-gray-400.disabled:text-gray-600.disabled:cursor-not-allowed',
  {
    disabled: true,
  },
  'Оплатить',
);

export function updatePayButtonState() {
  const cardNumber = getInputValue(cardNumberInput);
  const isCardNumberValid = validateCardNumber(cardNumber);

  const expiryDate = getInputValue(expiryInput);
  const expiryInfo = cardValidator.expirationDate(expiryDate);

  const cvc = getInputValue(cvcInput);
  const isCvcValid = validateCvc(cvc);

  const email = emailInput.value;
  const emailInfo = validateEmail(email);

  // prettier-ignore
  payButton.disabled = !(
    isCardNumberValid
    && expiryInfo.isValid
    && isCvcValid
    && emailInfo.isValid
  );
}

const cardNumberError = el('div.text-red-600.hidden', 'Неверный номер карты');

cardNumberInput.addEventListener('input', () => {
  cardNumberError.classList.add('hidden');
  updatePayButtonState();
  const cardNumber = getInputValue(cardNumberInput);
  const cardInfo = cardValidator.number(cardNumber);

  if (cardInfo.card && cardInfo.card.type) {
    updateCardLogo(cardInfo.card.type.toLowerCase());
  } else {
    updateCardLogo('');
  }
});

cardNumberInput.addEventListener('blur', () => {
  const cardNumber = getInputValue(cardNumberInput);
  const cardInfo = cardValidator.number(cardNumber);
  if (!cardInfo.isValid) {
    cardNumberError.classList.remove('hidden');
  }
  updatePayButtonState();
});

const expiryError = el('div.text-red-600.hidden', 'Неверная дата окончания');

expiryInput.addEventListener('input', () => {
  expiryError.classList.add('hidden');
  updatePayButtonState();
});

expiryInput.addEventListener('blur', () => {
  const expiryDate = getInputValue(expiryInput);
  const expiryInfo = cardValidator.expirationDate(expiryDate);
  if (!expiryInfo.isValid) {
    expiryError.classList.remove('hidden');
  }
  updatePayButtonState();
});

const cvcError = el('div.text-red-600.hidden', 'Неверный CVC/CVV');

cvcInput.addEventListener('input', () => {
  cvcError.classList.add('hidden');
  updatePayButtonState();
});

cvcInput.addEventListener('blur', () => {
  const cvc = getInputValue(cvcInput);
  const cvcInfo = cardValidator.cvv(cvc);
  if (!cvcInfo.isValid) {
    cvcError.classList.remove('hidden');
  }
  updatePayButtonState();
});

const emailError = el('div.text-red-600.hidden', 'Неверный email');

emailInput.addEventListener('input', () => {
  emailError.classList.add('hidden');
  updatePayButtonState();
});

emailInput.addEventListener('blur', () => {
  const email = emailInput.value;
  const emailInfo = validateEmail(email);
  if (!emailInfo.isValid) {
    emailError.classList.remove('hidden');
  }
  updatePayButtonState();
});

const cardNumberInputContainer = el('div.flex.items-center.gap-4', [
  cardNumberInput,
  cardImageContainer,
]);

const form = el('form#payment-form.flex.flex-col.items-center.w-1/4', [
  el('div.mb-4.w-full', [
    el('label.text-gray-600', 'Номер карты'),
    [cardNumberInputContainer],
    cardNumberError,
  ]),
  el('div.mb-4.flex.w-full', [
    el('div.w-1/2.pr-2', [
      el('label.text-gray-600', 'Дата окончания'),
      [expiryInput],
      expiryError,
    ]),
    el('div.w-1/2.pl-2', [
      el('label.text-gray-600', 'CVC/CVV'),
      [cvcInput],
      cvcError,
    ]),
  ]),
  el('div.mb-4.w-full', [
    el('label.text-gray-600', 'Email'),
    [emailInput],
    emailError,
  ]),
  payButton,
]);

const pageTitle = el('h1.text-4xl.font-semibold.mb-3.mt-5', 'Форма оплаты');

setChildren(document.body, [pageTitle, form]);

Inputmask('9999 9999 9999 9999 [99]').mask(cardNumberInput);
Inputmask('99/99').mask(expiryInput);
Inputmask('999').mask(cvcInput);

payButton.addEventListener('click', (evt) => {
  evt.preventDefault();

  const cardNumber = getInputValue(cardNumberInput);
  const expiryDate = getInputValue(expiryInput);
  const cvc = getInputValue(cvcInput);
  const email = emailInput.value;

  const paymentData = {
    cardNumber,
    expiryDate,
    cvc,
    email,
  };

  console.log(paymentData);
});

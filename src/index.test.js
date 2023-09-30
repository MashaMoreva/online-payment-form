import { validateCardNumber, validateCvc, createFormElements } from './index';

describe('Проверка валидации номера карты', () => {
  test('пропускает корректный номер карты', () => {
    const validCardNumber = '5536914106095064';
    const isValid = validateCardNumber(validCardNumber);
    expect(isValid).toBe(true);
  });

  test('не пропускает произвольную строку, содержащую любые нецифровые символы', () => {
    const invalidCardNumber = '2200-4568,89Po45';
    const isValid = validateCardNumber(invalidCardNumber);
    expect(isValid).toBe(false);
  });

  test('не пропускает строку с недостаточным количеством цифр', () => {
    const shortCardNumber = '5536914';
    const isValid = validateCardNumber(shortCardNumber);
    expect(isValid).toBe(false);
  });

  test('не пропускает строку со слишком большим количеством цифр', () => {
    const longCardNumber = '4111111111111111111111111';
    const isValid = validateCardNumber(longCardNumber);
    expect(isValid).toBe(false);
  });
});

describe('Проверка валидации CVV/CVC карты', () => {
  test('пропускает строку с тремя цифровыми символами', () => {
    const validCvc = '575';
    const isValid = validateCvc(validCvc);
    expect(isValid).toBe(true);
  });

  test('не пропускает строки с 1-2 цифровыми символами', () => {
    const shortCvc = '63';
    const isValid = validateCvc(shortCvc);
    expect(isValid).toBe(false);
  });

  test('не пропускает строки с 4+ цифровыми символами', () => {
    const longCvc = '1152';
    const isValid = validateCvc(longCvc);
    expect(isValid).toBe(false);
  });

  test('не пропускает строки с тремя нецифровыми символами', () => {
    const invalidCvc = 'Rф7';
    const isValid = validateCvc(invalidCvc);
    expect(isValid).toBe(false);
  });
});

describe('Проверка cоздания элементов формы', () => {
  test('должна создавать элементы формы с правильными плейсхолдерами', () => {
    const formElements = createFormElements();
    // prettier-ignore
    const {
      cardNumberInput, expiryInput, cvcInput, emailInput,
    } = formElements;

    expect(cardNumberInput.getAttribute('placeholder')).toBe(
      'Введите номер карты',
    );
    expect(expiryInput.getAttribute('placeholder')).toBe('ММ/ГГ');
    expect(cvcInput.getAttribute('placeholder')).toBe('Введите CVC/CVV');
    expect(emailInput.getAttribute('placeholder')).toBe('Введите email');
  });
});

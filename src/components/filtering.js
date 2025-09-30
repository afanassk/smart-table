import {createComparison, defaultRules} from "../lib/compare.js";

// #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // #4.1 — заполнить выпадающие списки опциями
  // предполагается, что indexes = { fieldName: {id: "name", ...}, ... }
  Object.keys(indexes).forEach((elementName) => {
      const el = elements[elementName];
      if (!el) return; // на случай, если какого-то элемента нет в шаблоне

      const options = Object
        .values(indexes[elementName])          // ["name1", "name2", ...]
        .map((name) => {
          const option = document.createElement('option'); // <option value="name">name</option>
          option.value = name;
          option.textContent = name;
          return option;
        });

      el.append(...options);
    });

  // Возвращаем функцию применения фильтра к данным
  return (data, state, action) => {
    // #4.2 — обработать очистку поля
    if (action && action.name === 'clear') {
      const field = action.dataset.field; // по атрибуту data-field у кнопки
      // сбрасываем значение в DOM
      if (field && elements[field]) {
        const input = elements[field];
        if (input && 'value' in input) input.value = '';
      } else {
        // запасной вариант — найти инпут рядом с кнопкой
        const container = action.parentElement;
        const input = container?.querySelector('input, select, textarea');
        if (input && 'value' in input) input.value = '';
      }
      // и в state
      if (field) state[field] = '';
    }

    // #4.5 — отфильтровать данные, используя компаратор
    return data.filter(row => compare(row, state));
  };
}
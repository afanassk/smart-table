import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === 'sort') {
      // #3.1 — ротируем состояние нажатой кнопки
      action.dataset.value = sortMap[action.dataset.value];     // none -> up -> down -> none
      field = action.dataset.field;                             // поле из кнопки
      order = action.dataset.value;                             // направление из кнопки

      // #3.2 — сбрасываем остальные кнопки
      columns.forEach(column => {                                    // Перебираем элементы (в columns у нас массив кнопок)
        if (column.dataset.field !== action.dataset.field) {    // Если это не та кнопка, что нажал пользователь
          column.dataset.value = 'none';                        // тогда сбрасываем её в начальное состояние
        }
      });

      // если вернулись в 'none' — снимаем сортировку
      if (order === 'none') {
        field = null;
        order = null;
      }

    } else {
      // #3.3 — применяем выбранный режим при других действиях (пагинация, reset и т.п.)
      columns.forEach(column => {                        // Перебираем все наши кнопки сортировки
        if (column.dataset.value !== 'none') {        // Ищем ту, что находится не в начальном состоянии (предполагаем, что одна)
          field = column.dataset.field;            // Сохраняем в переменных поле
          order = column.dataset.value;            // и направление сортировки
        }
      });
    }
    
    return sortCollection(data, field, order);
  };
}
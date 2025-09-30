import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
  // #5.1 — компаратор: только skipEmptyTargetValues + правило поиска по нескольким полям
  const compare = createComparison(
    ['skipEmptyTargetValues'],
    [ rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false) ]
  );

  // #5.2 — применяем компаратор к данным
  return (data, state) => {
    const q = state[searchField];
    if (typeof q === 'string') state[searchField] = q.trim();
    return data.filter(row => compare(row, state));
  };
}
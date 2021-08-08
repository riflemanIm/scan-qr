const isEmpty = (value) => {
  return (
    value == null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
export const ifEmptyArr = (value) => {
  return !isEmpty(value) ? value : [];
};

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default isEmpty;

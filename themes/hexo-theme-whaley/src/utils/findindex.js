export default function findIndex(array, filter) {
  let index = -1;
  if (Array.isArray(array)) {
    array.some((element, i) => {
      if (filter(element)) {
        index = i;
        return true;
      }
      return false;
    });
  }
  return index;
}

export default function sortArrayOfObjects(arr, propertyName, order = "asc") {
  const sortedArr = arr.sort((a, b) => {
    if (parseInt(a[propertyName]) < parseInt(b[propertyName])) {
      return -1;
    }
    if (parseInt(a[propertyName]) > parseInt(b[propertyName])) {
      return 1;
    }
    return 0;
  });

  if (order === "desc") {
    return sortedArr.reverse();
  }

  return sortedArr;
}

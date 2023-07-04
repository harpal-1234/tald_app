const array = [1,2,3,4,5,7,5,4,6,4];
for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) {
      return false; 
    }
}

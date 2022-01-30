const sample = (array) => {
  const length = array == null ? 0 : array.length;
  return length ? array[Math.floor(Math.random() * length)] : undefined;
};

const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

module.exports = {
  sample,
  randomIntBetween,
};

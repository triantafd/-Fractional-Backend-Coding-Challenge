const info = (...params: Array<unknown>): void => {
  console.log(...params);
};

const error = (...params: Array<unknown>): void => {
  console.error(...params);
};

export default {
  info, error
};
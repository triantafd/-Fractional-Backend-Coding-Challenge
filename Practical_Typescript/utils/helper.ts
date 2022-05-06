export const onlyNumbers = (str: string): boolean => {
  return /^[0-9]+$/.test(str);
};

export const titleCase = (str: string = '') => {
  if (!str) return '';

  const ignoredWords = ['at'];

  if (str.toLowerCase() !== str) return str;

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (!ignoredWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      return word;
    })
    .join(' ');
};

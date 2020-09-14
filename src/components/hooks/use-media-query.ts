export const useMediaQuery = () => {
  if (typeof window === 'undefined') return { matchesMediaQuery: () => false };

  const matchesMediaQuery = (width: string) =>
    window.matchMedia(`(min-width: ${width})`).matches;

  return { matchesMediaQuery };
};

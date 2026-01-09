const cache = new Map<string, any>();

export const getCache = (key: string) => {
  return cache.get(key);
};

export const setCache = (key: string, value: any) => {
  cache.set(key, value);
};

export const setSessionData = (key: string, value: string) => sessionStorage.setItem(key, value);
export const getSessionData = (key: string) => sessionStorage.getItem(key);
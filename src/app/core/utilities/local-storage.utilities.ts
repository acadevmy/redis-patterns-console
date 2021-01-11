export enum SESSIONSTORAGEKEYS {
    HISTORYCOMMAND = 'HistoryCommand',
}
export const getFromLocalStorage = (key: SESSIONSTORAGEKEYS) =>
    sessionStorage.getItem(key);

export const setToLocalStorage = (key: SESSIONSTORAGEKEYS, value: string) =>
    sessionStorage.setItem(key, value);

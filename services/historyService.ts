import type { HistoryEntry } from '../types';

const HISTORY_KEY_PREFIX = 'calorie-vision-history-';

export const getHistory = (username: string): HistoryEntry[] => {
  const userHistoryKey = `${HISTORY_KEY_PREFIX}${username}`;
  try {
    const historyJson = localStorage.getItem(userHistoryKey);
    if (historyJson) {
      const history = JSON.parse(historyJson);
      if (Array.isArray(history)) {
        return history;
      }
    }
  } catch (error) {
    console.error("Failed to load history from localStorage", error);
  }
  return [];
};

export const saveHistory = (username: string, history: HistoryEntry[]): void => {
  const userHistoryKey = `${HISTORY_KEY_PREFIX}${username}`;
  try {
    const historyJson = JSON.stringify(history);
    localStorage.setItem(userHistoryKey, historyJson);
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("No se pudo guardar la comida en el historial porque el almacenamiento está lleno.");
    }
  }
};

import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

Api.interceptors.response.use(
  (response) => {
    if (response && typeof response === "object") {
      convertDates(response);
    }
    convertDates(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função recursiva para converter strings de data
function convertDates(obj: unknown): void {
  if (!obj || typeof obj !== "object") return;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, unknown>)[key];

      // Se for string que parece uma data, converte para Date
      if (typeof value === "string" && isDateString(value)) {
        (obj as Record<string, unknown>)[key] = new Date(value);
      }
      // Se for objeto, chama recursivamente (excluindo null)
      else if (typeof value === "object" && value !== null) {
        convertDates(value);
      }
      // Se for array, processa cada elemento
      else if (Array.isArray(value)) {
        value.forEach((item) => convertDates(item));
      }
    }
  }
}

// Função para verificar se a string parece ser uma data
function isDateString(value: string): boolean {
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO string
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, // YYYY-MM-DD HH:MM:SS
  ];

  return datePatterns.some((pattern) => pattern.test(value)) && !isNaN(Date.parse(value));
}

export default Api;

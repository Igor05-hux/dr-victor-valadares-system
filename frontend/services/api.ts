import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    "A variável NEXT_PUBLIC_API_URL não foi configurada no arquivo .env.local.",
  );
}

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
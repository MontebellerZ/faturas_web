import { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

type FaturaData = {
  date: Date;
  title: string;
  amount: number;
};

function App() {
  const [faturas, setFaturas] = useState<FaturaData[]>([]);

  useEffect(() => {
    Api.get("faturas")
      .then((res) => setFaturas(res.data))
      .catch((err) => console.error("Erro ao buscar as faturas:", err));
  }, []);

  return (
    <div>
      {faturas.slice(0, 5).map((f, i) => (
        <div key={i}>
          <p>
            {new Date(f.date).toLocaleDateString()} - {f.title}
          </p>
          <p>R$ {f.amount}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

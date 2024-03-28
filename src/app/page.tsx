import React, { useEffect, useState } from "react";
import axios from "axios";
import useGetTransactions from "@/components/Hooks/GetTransactions"; // Corrigindo o caminho do hook useGetTransactions
import usePostTransactions from "@/components/Hooks/PostTransactions"; // Corrigindo o caminho do hook usePostTransactions

interface Transaction {
  _id: string;
  name: string;
  value: number;
}

export default function MepagaIvan() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const { getTransactionsAll } = useGetTransactions(); // Usando o hook useGetTransactions

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransactionsAll();
        setTransactions(data);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    };
    fetchData();
  }, [getTransactionsAll]);

  const { postTransaction } = usePostTransactions(); // Usando o hook usePostTransactions

  const addTransaction = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newTransaction = {
      name,
      value: +value
    };
    try {
      await postTransaction(newTransaction); // Chamando a função postTransaction diretamente
      setName("");
      setValue("");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/transactions?transactionId=${id}`);
      setTransactions(transactions.filter(transaction => transaction._id !== id));
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  };

  return (
    <div>
      <h1>Transações</h1>
      <form>
        <input type="text" name="name" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" name="value" placeholder="Valor" value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={addTransaction}>Add</button>
      </form>
      <ul>
        {transactions.map((transaction) => (
          <div key={transaction._id}>
            <h1>{transaction.name}</h1>
            <h2>{transaction.value}</h2>
            <button onClick={() => deleteTransaction(transaction._id)}>Excluir</button> {/* Corrigindo o texto do botão */}
          </div>
        ))}
      </ul>
    </div>
  );
}

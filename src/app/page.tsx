"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import useGetTransactions from "@/components/Hooks/GetTransactions";
import usePostTransactions from "@/components/Hooks/PostTransactions";

interface Transaction {
  _id: string;
  name: string;
  value: number;
}

const MepagaIvan = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const { getTransactionsAll } = useGetTransactions();
  const { postTransaction } = usePostTransactions(); // Colocando aqui fora da função addTransaction

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

  const addTransaction = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newTransaction = {
      name,
      value: +value
    };
    try {
      await postTransaction(newTransaction); // Agora está chamando diretamente do hook
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
            <button onClick={() => deleteTransaction(transaction._id)}>Excluir</button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MepagaIvan;

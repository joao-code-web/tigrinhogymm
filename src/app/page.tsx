"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  _id: string;
  name: string;
  value: number;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<{ name: string; value: string }>({ name: '', value: '' });

  const fetchTransactions = async () => {
    try {
      const response = await axios.get<Transaction[]>('/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/transactions', formData);
      fetchTransactions();
      setFormData({ name: '', value: '' });
    } catch (error) {
      console.error('Erro ao enviar transação:', error);
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      await axios.delete(`/api/transactions?transactionId=${transactionId}`);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  return (
    <div>
      <h1>Transações</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <label>
          Valor:
          <input type="number" name="value" value={formData.value} onChange={handleInputChange} />
        </label>
        <button type="submit">Enviar Transação</button>
      </form>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.name} - R$ {transaction.value}{' '}
            <button onClick={() => handleDelete(transaction._id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

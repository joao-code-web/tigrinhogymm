"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./page.css"

interface Transaction {
  _id: string;
  name: string;
  value: number;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<{ name: string; value: string }>({ name: '', value: '' });
  const [allSomTransaction, setAllSumTransaction] = useState<number>(0);
  const [positive, setPositive] = useState<number>(0);
  const [negative, setNegative] = useState<number>(0);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get<Transaction[]>('/api/transactions');
      setTransactions(response.data);

      let sum = 0;
      let positiveSum = 0;
      let negativeSum = 0;

      response.data.forEach(transaction => {
        sum += transaction.value;
        if (transaction.value > 0) {
          positiveSum += transaction.value;
        } else {
          negativeSum += transaction.value;
        }
      });

      setAllSumTransaction(sum);
      setPositive(positiveSum);
      setNegative(negativeSum);
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
    <div className='displayAll'>
      <h1>Me paga ivan</h1>

      <div className="dashboard">
        <div className="dashTotal">
          <h2>Total: {allSomTransaction}</h2>
        </div>
        <div className="dashPositive">
          <h2>Positivo: {positive}</h2>
        </div>
        <div className="dashNegative">
          <h2>Negativo: {negative}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="value">Valor:</label>
          <input type="number" id="value" name="value" value={formData.value} onChange={handleInputChange} />
        </div>
        <button type="submit" className='buttonAdd'>Enviar Transação</button>
      </form>

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction._id}>
                <td>{transaction.name}</td>
                <td>{transaction.value}</td>
                <td><button onClick={() => handleDelete(transaction._id)}>Deletar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

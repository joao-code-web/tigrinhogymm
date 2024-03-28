import axios, { AxiosResponse } from "axios";

interface Transaction {
    name: string;
    value: number;
}

export default function PostTransactions() {

    const postTransaction = async (newTransaction: Transaction): Promise<AxiosResponse<any>> => {
        try {
            const result = await axios.post("http://localhost:8000/api/transactions", newTransaction);
            return result;
        } catch (error) {
            console.error("Erro ao postar transação:", error);
            throw error;
        }
    }

    return {
        postTransaction
    }
}

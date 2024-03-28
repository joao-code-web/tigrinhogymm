import axios from "axios";

export default function useGetTransactions() {
    const getTransactionsAll = async () => {
        try {
            const result = await axios.get("http://localhost:8000/api/transactions");
            return result.data; // Retorna os dados diretamente
        } catch (error) {
            console.log(error);
            throw error; // Lança o erro para ser tratado fora
        }
    };

    return {
        getTransactionsAll
    };
}

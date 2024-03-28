import axios from "axios";

export default function useDeleteTransaction() {
    const deleteTransactions = async (idTransaction: string) => {
        try {
            const result = await axios.delete(`http://localhost:8000/api/transactions/${idTransaction}`);
            return result;
        } catch (error) {
            console.log(error);
            throw error; 
        }
    };

    return {
        deleteTransactions
    };
}
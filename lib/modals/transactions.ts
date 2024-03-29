import mongoose, { Schema, Document } from 'mongoose';


interface TransactionModel extends Document {
    name: string;
    value: number;
    dataTransaction: string;
}

const transactionSchema = new Schema<TransactionModel>({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    dataTransaction: { type: String, required: true },
});


const Transaction = mongoose.model<TransactionModel>('Transaction', transactionSchema);

export default Transaction;

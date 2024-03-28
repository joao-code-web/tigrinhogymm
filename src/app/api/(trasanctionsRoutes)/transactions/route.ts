import { NextRequest, NextResponse } from "next/server";
import Transaction from "../../../../../lib/modals/transactions";
import connect from "../../../../../lib/db";

const connectToDatabase = async () => {
  await connect();
};

// rota de pegar tudo

export const GET = async (): Promise<void | NextResponse<unknown>> => {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find().select('_id name value');
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return new NextResponse("Erro ao buscar transações", { status: 500 });
  }
};


// rota de postar mas não é foto e sim transações

export const POST = async (req: NextRequest): Promise<void | NextResponse<unknown>> => {
  try {
    const body = await req.json();
    const { name, value } = body;
    if (!name || !value) {
      return new NextResponse("Nome e valor são obrigatórios", { status: 400 });
    }
    await connectToDatabase();

    const newTransaction = new Transaction(body);
    await newTransaction.save();

    return NextResponse.json({ message: "Transação criada com sucesso", transaction: newTransaction });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return new NextResponse("Erro ao criar transação", { status: 500 });
  }
};


// rota de deletar transação

export const DELETE = async (req: NextRequest): Promise<void | NextResponse<unknown>> => {
  try {
    const { searchParams } = new URL(req.url);
    const transactionIdentifier = searchParams.get("transactionId");

    if (!transactionIdentifier) {
      return new NextResponse("O parâmetro transactionId é obrigatório", { status: 400 });
    }

    await connectToDatabase();

    const deletedTransaction = await Transaction.findOneAndDelete({ _id: transactionIdentifier });

    if (!deletedTransaction) {
      return new NextResponse("Transação não encontrada", { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: "Transação excluída com sucesso", transaction: deletedTransaction }), { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    return new NextResponse("Erro ao excluir transação", { status: 500 });
  }
};


// rota de modificar transação

export const PATCH = async (req: NextRequest): Promise<void | NextResponse<unknown>> => {
  try {
    const { searchParams } = new URL(req.url);
    const transactionIdentifier = searchParams.get("transactionId");

    if (!transactionIdentifier) {
      return new NextResponse("O parâmetro transactionId é obrigatório", { status: 400 });
    }

    const body = await req.json();

    await connectToDatabase();

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionIdentifier },
      body,
      { new: true }
    );

    if (!updatedTransaction) {
      return new NextResponse("Transação não encontrada", { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: "Transação atualizada com sucesso", transaction: updatedTransaction }), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return new NextResponse("Erro ao atualizar transação", { status: 500 });
  }
};

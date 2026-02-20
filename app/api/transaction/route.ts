import { TransactionService, CreateTransactionPayload } from '@/lib/services/transactionService'
import { ApiResponse } from '@/lib/core/response'

export async function POST(request: Request) {
    try {
        const body: CreateTransactionPayload = await request.json()

        // Pass payload straight to isolated Service Layer
        const transaction = await TransactionService.createTransaction(body);

        // Return Standardized Uniform Response Wrapper
        return ApiResponse.success(transaction, "Transaksi berhasil diproses");

    } catch (error) {
        // Uniformly handle exceptions via core errorHandler
        return ApiResponse.error(error);
    }
}

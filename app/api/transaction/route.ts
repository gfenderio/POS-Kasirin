import { TransactionService, CreateTransactionPayload } from '@/lib/services/transactionService'
import { ApiResponse } from '@/lib/core/response'
import { posCache } from '@/lib/cache'

export async function POST(request: Request) {
    try {
        const body: CreateTransactionPayload = await request.json()

        // Pass payload straight to isolated Service Layer
        const transaction = await TransactionService.createTransaction(body);

        // Invalidate POS cache to reflect new stock levels immediately
        posCache.delete('all_products');

        // Return Standardized Uniform Response Wrapper
        return ApiResponse.success(transaction, "Transaksi berhasil diproses");

    } catch (error) {
        // Uniformly handle exceptions via core errorHandler
        return ApiResponse.error(error);
    }
}

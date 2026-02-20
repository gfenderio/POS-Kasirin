import { AuthService } from '@/lib/services/authService'
import { ApiResponse } from '@/lib/core/response'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Delegate verification logic to Service layer
        const authData = await AuthService.login(body)

        // Return Uniform Response
        return ApiResponse.success(authData, "Login berhasil")

    } catch (error) {
        return ApiResponse.error(error)
    }
}

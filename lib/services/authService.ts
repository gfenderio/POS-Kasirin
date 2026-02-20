import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession } from '../auth'
import { ValidationError, AuthenticationError } from '../core/errors'

export interface LoginPayload {
    username?: string
    password?: string
}

/**
 * Service Layer for User Authentication Operations
 */
export class AuthService {

    /**
     * Authenticates a user, verifies their password via bcrypt, and issues an HttpOnly JWT session cookie.
     * 
     * @param payload Username and password provided by client
     * @returns The user data omitting the password
     * @throws ValidationError if input is incomplete
     * @throws AuthenticationError if credentials do not match any DB record
     */
    static async login(payload: LoginPayload) {
        const { username, password } = payload

        if (!username || !password) {
            throw new ValidationError('ID Karyawan/Email dan Kata Sandi wajib diisi')
        }

        const user = await prisma.tbl_user.findFirst({
            where: {
                username: username
            }
        })

        if (!user) {
            throw new AuthenticationError('ID Karyawan atau Kata Sandi salah')
        }

        // Verify password hash
        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new AuthenticationError('ID Karyawan atau Kata Sandi salah')
        }

        // Drop password hash from return object
        const { password: _, ...userWithoutPassword } = user

        // Enhance Security: Create HttpOnly JWT Session Cookie
        await createSession(userWithoutPassword)

        return userWithoutPassword
    }
}

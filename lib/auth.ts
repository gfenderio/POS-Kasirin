import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// In a real app, use a strong env variable
const secretKey = process.env.JWT_SECRET || 'super-secret-pos-key-2026'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d') // Expire in 1 day
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function createSession(user: any) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
    const sessionData = {
        id: user.userid,
        username: user.username,
        level: user.level,
        fullname: user.fullname
    }
    const session = await encrypt(sessionData)

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        expires,
        httpOnly: true, // Prevents XSS from reading the cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    })
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    return await decrypt(session)
}

export async function clearSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

/**
 * Core Application Error class linking HTTP error statuses to custom business logic exceptions.
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    /**
     * @param message User-friendly error message
     * @param statusCode HTTP Status Code (default: 400 Bad Request)
     * @param isOperational True if it's a predicted business logic error (e.g., Validation Failed), False if it's an unhandled bug.
     */
    constructor(message: string, statusCode: number = 400, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Restore prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

// Pre-defined Error Subclasses for precise HTTP mappings

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400); // Bad Request
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Autentikasi gagal. Silakan login kembali.') {
        super(message, 401); // Unauthorized
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Akses ditolak.') {
        super(message, 403); // Forbidden
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Data tidak ditemukan.') {
        super(message, 404); // Not Found
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409); // Conflict (e.g. Race Condition, Oversell)
    }
}

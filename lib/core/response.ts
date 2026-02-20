import { NextResponse } from "next/server";
import { AppError } from "./errors";

/**
 * Standard HTTP Response Wrapper for the Application.
 * Guarantees that the client always receives a `{ success, data, message, error }` JSON structure.
 */
export const ApiResponse = {
    /**
     * Return a standardized 2xx Success response.
     * @param data The payload to return
     * @param message Optional success message
     * @param statusCode HTTP Status (default 200)
     */
    success: <T>(data: T, message?: string, statusCode: number = 200) => {
        return NextResponse.json(
            {
                success: true,
                message: message || "Success",
                data,
                error: null
            },
            { status: statusCode }
        );
    },

    /**
     * Return a standardized 4xx/5xx Error response.
     * Automatically extracts messages from custom AppError instances.
     * @param error Generic Error or AppError instance
     */
    error: (error: unknown) => {
        let statusCode = 500;
        let message = "Terjadi kesalahan pada server (Internal Server Error)";
        let isOperational = false;

        // Catch explicitly thrown Business Logic Errors
        if (error instanceof AppError) {
            statusCode = error.statusCode;
            message = error.message;
            isOperational = error.isOperational;
        }
        // Catch standard JS Errors
        else if (error instanceof Error) {
            message = error.message;
        }

        // Only log unhandled / non-operational errors to console
        if (!isOperational) {
            console.error("[CRITICAL ERROR]", error);
        } else {
            // For business errors, log as warning
            console.warn(`[BUSINESS OP] ${statusCode} - ${message}`);
        }

        return NextResponse.json(
            {
                success: false,
                message: message,
                data: null,
                error: isOperational ? 'Operational Error' : 'System Error'
            },
            { status: statusCode }
        );
    }
};

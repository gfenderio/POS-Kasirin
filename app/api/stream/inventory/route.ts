import { NextRequest } from "next/server";

// This is a minimal SSE implementation for Real-time Inventory Updates
// In production, we'd trigger events via Redis Pub/Sub, Postgres triggers (pg_notify), 
// or an internal EventEmitter within the Next.js process for single-instance scaling.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    // Create a ReadableStream for SSE
    const stream = new ReadableStream({
        start(controller) {
            // Send an initial connected message
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: "connected" })}\n\n`));

            // This is a placeholder for where you would listen to DB updates.
            // E.g., globalEventEmitter.on('inventory_update', (data) => {
            //   controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            // });

            // Simulated heartbeat every 10 seconds to keep connection alive
            const intervalId = setInterval(() => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ keepAlive: true })}\n\n`));
            }, 10000);

            // On close, clear interval
            req.signal.addEventListener("abort", () => {
                clearInterval(intervalId);
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { destination, weight, courier } = await req.json();

        // Placeholder Logic:
        // Here we would integrate with RajaOngkir or specific courier APIs (JNE, Sicepat).

        const price = Math.ceil(weight) * 15000; // Simulated flat rate per KG
        const etd = "2-3 Hari";

        return NextResponse.json({
            success: true,
            data: {
                courier: courier || "JNE",
                service: "REG",
                price,
                etd
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch shipping rates" }, { status: 500 });
    }
}

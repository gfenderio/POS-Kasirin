import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { amount, invoiceNo } = await req.json();

        // Placeholder Logic:
        // Here we would integrate with Midtrans, Xendit, or another QRIS provider.
        // 1. Hit Third-Party Payment Gateway
        // 2. Receive QRIS String (QR Code Data)
        // 3. Save to DB

        const qrisString = `00020101021226570011ID.CO.QRIS.WWW011893600918000000000002151234567890123450303UMO51440014ID.CO.QRIS.WWW0215ID10200210000000303UMO5204411153033605404${amount}5802ID5910POS KASIRIN6007JAKARTA61051234562560114001000000000002030010303UMO6304C204`;

        return NextResponse.json({
            success: true,
            data: {
                invoiceNo,
                amount,
                qrisString,
                status: "PENDING_PAYMENT"
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to generate QRIS" }, { status: 500 });
    }
}

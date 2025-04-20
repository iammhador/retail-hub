import { NextResponse } from "next/server";
import { connectDb } from "../../../lib/db/connectDb";
import { Retailer } from "../../../lib/models/Retailer.model";

// GET handler - Fetch all retailers
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";

    try {
        await connectDb();
        return NextResponse.json(await Retailer.find({ $or: [{ name: { $regex: query, $options: "i" } }, { location: { $regex: query, $options: "i" } }] }));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch retailers" }, { status: 500 });
    }
}

// POST handler - Add a new retailer
export async function POST(request) {
    try {
        const body = await request.json();

        // Required fields
        const { name, location, category } = body;

        // Client-side already validates, but server-side check for security
        if (!name || !location || !category) {
            return NextResponse.json({ error: "Name, location, category are required." }, { status: 400 });
        }

        const newRetailer = {
            name,
            location,
            category,
            contact: body.contact || "",
            note: body.note || "",
            pros: body.prosCons?.split("||")[0] || "",
            cons: body.prosCons?.split("||")[1] || "",
        };

        await connectDb();

        const savedRetailer = await Retailer.create(newRetailer);

        return NextResponse.json(savedRetailer, { status: 201 });
    } catch (error) {
        console.error("Error adding retailer:", error);
        return NextResponse.json({ error: "Failed to add retailer" }, { status: 500 });
    }
}

// DELETE handler - Delete a retailer
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Retailer ID is required" }, { status: 400 });
        }

        await connectDb();

        await Retailer.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting retailer:", error);
        return NextResponse.json({ error: "Failed to delete retailer" }, { status: 500 });
    }
}

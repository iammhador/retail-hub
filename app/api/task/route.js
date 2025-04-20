import { NextResponse } from "next/server";
import { Task } from "../../../lib/models/Task";
import { connectDb } from "../../../lib/db/connectDb";

export async function GET(request) {
    try {
        // before any database interaction, connecting to db function call once
        await connectDb();
        const tasks = await Task.find();
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

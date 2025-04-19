import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "retailers.json");

// Helper function to read the JSON file
function readRetailersFile() {
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading retailers file:", error);
    return [];
  }
}

// Helper function to write to the JSON file
function writeRetailersFile(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to retailers file:", error);
    return false;
  }
}

// GET handler - Fetch all retailers
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";

  let retailers = readRetailersFile();

  // Filter retailers if search query exists
  if (query) {
    retailers = retailers.filter(
      (retailer) =>
        retailer.name.toLowerCase().includes(query.toLowerCase()) ||
        retailer.location.toLowerCase().includes(query.toLowerCase()) ||
        retailer.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  return NextResponse.json(retailers);
}

// POST handler - Add a new retailer
export async function POST(request) {
  try {
    const body = await request.json();

    // Required fields
    const { name, location, category } = body;

    // Client-side already validates, but server-side check for security
    if (!name || !location || !category) {
      return NextResponse.json(
        { error: "Name, location, category are required." },
        { status: 400 }
      );
    }

    const retailers = readRetailersFile();

    const newRetailer = {
      id: Date.now().toString(),
      name,
      location,
      category,
      contact: body.contact || "",
      note: body.note || "",
      pros: body.prosCons?.split("||")[0] || "",
      cons: body.prosCons?.split("||")[1] || "",
      createdAt: new Date().toISOString(),
    };

    retailers.push(newRetailer);
    writeRetailersFile(retailers);

    return NextResponse.json(newRetailer, { status: 201 });
  } catch (error) {
    console.error("Error adding retailer:", error);
    return NextResponse.json(
      { error: "Failed to add retailer" },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a retailer
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Retailer ID is required" },
        { status: 400 }
      );
    }

    let retailers = readRetailersFile();
    const initialLength = retailers.length;

    // Filter out the retailer with the specified ID
    retailers = retailers.filter((retailer) => retailer.id !== id);

    // Check if a retailer was actually removed
    if (retailers.length === initialLength) {
      return NextResponse.json(
        { error: "Retailer not found" },
        { status: 404 }
      );
    }

    writeRetailersFile(retailers);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting retailer:", error);
    return NextResponse.json(
      { error: "Failed to delete retailer" },
      { status: 500 }
    );
  }
}

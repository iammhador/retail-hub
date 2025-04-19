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

// GET handler - Fetch all unique categories
export async function GET() {
  try {
    const retailers = readRetailersFile();

    // Extract unique categories from retailers
    const categories = [
      ...new Set(retailers.map((retailer) => retailer.category)),
    ];

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

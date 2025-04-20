import mongoose from "mongoose";

const retailerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    category: {
        type: String,
    },
    contact: {
        type: String,
    },
    note: {
        type: String,
    },
    pros: {
        type: String,
    },
    cons: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Retailer = mongoose.models.Retailer || mongoose.model("Retailer", retailerSchema);

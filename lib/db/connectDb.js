import  mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}`);
        console.log(`\n <------ database connection successfull ------> host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("database connection failed ", error);
        process.exit(1);
    }
};


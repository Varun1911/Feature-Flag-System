import mongoose from "mongoose";

export const connectMongo = async () => {
    const uri = process.env.MONGO_URI;
    if(!uri) throw new Error("Mongo uri missing");

    await mongoose.connect(uri);
    console.log("Connect to mongoDB");
}
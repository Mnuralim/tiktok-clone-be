import mongoose from "mongoose";

export const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_URL as string);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
};

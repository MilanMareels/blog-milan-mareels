import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Verbonden met MongoDB!");
    return true;
  } catch (error) {
    console.error("Fout bij verbinden met MongoDB:", error);
  }
};

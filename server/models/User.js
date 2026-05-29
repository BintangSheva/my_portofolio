import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        // --- TAMBAHAN BARU: Wadah buat hasil AI ---
        ratio: {
            type: Number,
            default: 0, // Biar pas baru daftar nggak NaN
        },
        clusterLabel: {
            type: String,
            default: "Waiting",
        },
    },
    {timestamps: true} 
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
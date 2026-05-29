import mongoose from "mongoose";

const ClusterResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user', //asumsi nanti lu bikin model user buat login
        unique: true //setiap user hanya boleh punya 1 entry hasil cluster
    },
    clusterId: {
        type: Number,
        required: true,
    }, 
    runDate: {// untuk tau kapan cluster ini terakhir dihitung
        type:Date,
        default: Date.now,
    }
});

export default mongoose.models.ClusterResult ||
    mongoose.model("ClusterResult", ClusterResultSchema);
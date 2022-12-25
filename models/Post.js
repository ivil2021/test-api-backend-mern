import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    postText: {
        type: String,
        required: true, // свойство обязательно
        unique: true, // свойство должно быть уникальным
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{
    timestamps: true
});

export default mongoose.model('Post', PostSchema);
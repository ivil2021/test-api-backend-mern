import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // свойство обязательно
        unique: true, // свойство должно быть уникальным
    },
    text: {
        type: String,
        required: true, // свойство обязательно
        unique: true, // свойство должно быть уникальным
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to model User // relationship between 2 tables
        required: true,
    },
},{
    timestamps: true
});

export default mongoose.model('Post', PostSchema);
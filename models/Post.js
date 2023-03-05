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
    countTen: {
        type: Number,
        default: 0, // значение 0 по умолчанию
    },
    resCountTen: {
        type: Number,
        default: 0, // значение 0 по умолчанию
    },
    createdAt: {
        type: String,
        default: '', // значение 0 по умолчанию
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to model User // relationship between 2 tables
        required: true,
    },
},{
    timestamps: false
});

export default mongoose.model('Post', PostSchema);
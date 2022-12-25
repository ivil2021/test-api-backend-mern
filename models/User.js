import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // свойство обязательно
        unique: true, // свойство должно быть уникальным
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    isUserAuthenticated: {
        type: Boolean,
        required: true,
    },
    // свойство НЕ обязательно если пропишем как на следующей строке
    avatarUrl: String,
},{
    timestamps: true
});

export default mongoose.model('User', UserSchema);




/*import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // свойство обязательно
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    // свойство НЕ обязательно если пропишем как на следующей строке
    avatarUrl: String,
},{
    timestamps: true
});

export default mongoose.model('User', UserSchema);*/
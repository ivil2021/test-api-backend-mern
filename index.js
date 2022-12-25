import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'express-validator';

const { validationResult } = validator;

import { registerValidation } from './validations/auth.js';
import UserModel from './models/User.js';
import PostModel from './models/Post.js';
import checkAuth from './utils/checkAuth.js';

import cors from 'cors';

// добавил, так как при установке npm i было предупреждение об этом
mongoose.set('strictQuery', false)

mongoose
    .connect(
        // user2 - user of database, user2 - password of user2 user for database
        // social-network - name of the database
        'mongodb+srv://user2:user2@cluster0.mrg0h.mongodb.net/social-network?retryWrites=true&w=majority'
    )
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db error', err));

const app = express();

app.use(cors());
// это делает возможным читать содержание тела запроса
app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'пользователь не существует',
            });
        }

        // проверяем что пароль в базе сходится с переданным пользователем паролем
        const isValidPass = bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: 'wrong login or password',
            });
        }

        // сгенерировать токен и в этот токен передать инфу, которую нужно зашифровать
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );
        console.log('token:88888888', token);

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
            // возвращаем токен в ответ клиенту
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось авторизоваться',
        });
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(res);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        
        // пароль берём из тела запроса на регистрацию
        const password = req.body.password;
        // console.log('password:-------', password);

        const salt = await bcrypt.genSalt(10);
        // console.log('salt:-------', salt);

        const hash = await bcrypt.hash(password, salt);
        // console.log('hash:-------', hash);

        // создаём пользователя в базе с данными из запроса
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
            isUserAuthenticated: false
        });

        const user = await doc.save();

        // сгенерировать токен и в этот токен передать инфу, которую нужно зашифровать
        const token = jwt.sign(
            {_id: user._id},
            'secret123',
            {expiresIn: '30d'}
        );
        console.log('token222222222222222222222222222222222222:', token);

        // прописываем здесь passwordHash и __v, чтобы не передавать их в ответе
        const { passwordHash, __v, ...userData } = user._doc;
        // console.log('userData=======: ', userData);

        res.json({
            // передаем все данные пользователя, кроме passwordHash и __v
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось зарегистрироваться',
        });
    }
});

app.post('/posts/add', async (req, res) => {
    try {
        // создаём пост в базе с данными из запроса
        const doc = new PostModel({
            postText: req.body.postText,
        });

        const post = await doc.save();

        // прописываем здесь __v, чтобы не передавать его в ответе
        const { __v, ...postData } = post._doc;

        res.json({
            // передаем все данные поста, кроме __v
            ...postData,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось добавить пост',
        });
    }
});

// app.get('/auth/me', async (req, res) => {

// ЗАПРОС ИЗ ПОСТМАНА http://localhost:4444/auth/me/6398d9122d3ab18e48e0023b
// 6398d9122d3ab18e48e0023b - id пользователя из базы данных
app.get('/auth/me/:id', async (req, res) => {
    try {
        // req.params.id - получаем доступ к id через параметры запроса (.../:id)
        const userId = req.params.id;
        // const token = req.headers.authorization;
        // const pureTokenWithoutBearer = token.split(' ')[1];
        console.log('===============userId===============================: ', userId);
        // const user = await UserModel.findById(req.userId);
        const user = await UserModel.findById(userId);
        console.log('user', user);
        console.log('-------req.params*************', req.params);
        

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        res.send(user);
        // НЕЛЬЗЯ делать и json(user) и send(user) вместе
        // res.json(user).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить посты',
        });
    }
});

app.get('/posts/getAll', registerValidation, async (req, res) => {
    try {
        const posts = await PostModel.find().populate('User').exec();

        res.json({posts});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить посты',
        });
    }
});


// GET ONE USER BY ID
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        } else {
            res.status(404).json(user);
        }
    } catch (error) {
        console.log(error);
    }
});


// GET ALL USERS
app.get('/users', async (req, res) => {
    try {
        const AllUsers = await UserModel.find();

        // const {fullName} = AllUsers[0];
        // console.log(AllUsers[0].fullName);
        // console.log(AllUsers[0].email);

        if (!AllUsers) {
            return res.status(404).json({
                message: 'Пользователи не найдены',
            });
        } else {
            res.status(404).json(AllUsers);
        }
    } catch (error) {
        console.log(error);
    }
});



app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('server ok');
});

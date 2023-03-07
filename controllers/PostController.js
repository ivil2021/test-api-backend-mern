import PostModel from '../models/Post.js';
import moment from 'moment';

export const addOne = async (req, res) => {
    try {
        const isUserLoggedIn = req.query.isUserLoggedIn;

        if(isUserLoggedIn) {
            if(req.body.title === '') {
                return res.status(500).json({
                    message: 'Заголовок поста не может быть пустым',
                });
            }

            if(req.body.title.length > 12) {
                return res.status(500).json({
                    message: 'Заголовок поста не может быть длиннее 12 символов',
                });
            }

            if(req.body.text === '') {
                return res.status(500).json({
                    message: 'Пост не может быть пустым',
                });
            }

            if(req.body.text.length > 24) {
                return res.status(500).json({
                    message: 'Пост не может быть длиннее 24 символов',
                });
            }

            const actualDate = new Date();

            // приводим дату в нужный формат
            const actualDateFormatted = moment(actualDate).locale('ru').format('YYYY.MM.DD');

            // создаём пост в базе с данными из запроса
            const doc = new PostModel({
                title: req.body.title,
                text: req.body.text,
                countTen: req.body.countTen,
                resCountTen: req.body.countTen + 10,
                user: '63a8ab738e5fca38ee9602a2',
                createdAt: actualDateFormatted
            });

            const post = await doc.save();

            // прописываем здесь __v и user, чтобы не передавать их в ответе
            const { __v, user, ...postData } = post._doc;

            res.json({
                // передаем все данные поста, кроме __v и user
                ...postData,
            });
        } else {
            res.status(500).json({
                message: 'Войдите в свой аккаунт, чтобы совершить операцию',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось добавить пост',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        posts.forEach(item => {
            const { ...rest } = item;
            item = rest;
            // удаляем ненужное из объектов
            delete item._doc.__v;
            delete item._doc.user;
        });

        // если есть посты, то возвращаем массив постов
        // если постов нет, то возвращаем сообщение 'Посты не найдены'
        res.json(posts.length != 0 ? posts : {message: 'Посты не найдены'});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить посты',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        // console.log('=====req.query: =====', req.query);
        // const post = await PostModel.find({id: req.params.id}).populate('user').exec();
        // ищем пост, у которого id совпадает с id из базы данных
        const post = await PostModel.find({_id: req.params.id});

        // delete doc[0].__v;

        // posts.forEach(item => {
        //     const { ...rest } = item;
        //     item = rest;
        //     // удаляем ненужное из объектов
        //     delete item._doc.__v;
        //     delete item._doc.user;
        // });

            // const { ...rest } = doc[0];
            // doc[0] = rest;
            // delete doc[0].__v;
            // delete doc[0].user;

        // const { ...postData } = doc;
        // const post = postData[0];

        // delete post.__v;

        // const aaa = ...post

        // const { __v, user, ...postData } = post[0];

        // const { ...postData } = post[0];
        const { __v, user, ...postData } = post[0]._doc;

        // delete postData._doc.__v;
        // delete postData._doc.user;

        // res.json(post[0]);
        // res.json(doc._doc);
        // res.json(postData._doc);
        // res.json(postData._doc);

        // res.json(post[0]._doc);
        res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить пост',
        });
    }
}

export const updateOne = async (req, res) => {
    try {
        const isUserLoggedIn = req.query.isUserLoggedIn;

        if(isUserLoggedIn) {
            const postId = req.params.id;

            await PostModel.updateOne(
                {
                    // обязательно должно быть нижнее подчеркивание _id,
                    // так как именно в таком виде хранится id в базе данных mongo
                    _id: postId
                },
                {
                    title: req.body.title,
                    text: req.body.text,
                }
            );

            res.json({message: 'Пост успешно обновлен'});
        } else {
            res.status(500).json({
                message: 'Войдите в свой аккаунт, чтобы совершить операцию',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить пост',
        });
    }
}

export const deleteOne = async (req, res) => {
    try {
        const isUserLoggedIn = req.query.isUserLoggedIn;

        if(isUserLoggedIn) {
            const postId = req.params.id;

            await PostModel.findOneAndDelete({_id: postId});

            res.json({message: 'Пост успешно удален'});
        } else {
            res.status(500).json({
                message: 'Войдите в свой аккаунт, чтобы совершить операцию',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить пост',
        });
    }
}

// res.json({...posts, postsLength: posts.length});
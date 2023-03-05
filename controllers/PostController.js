import PostModel from '../models/Post.js';
import moment from 'moment';

export const addOne = async (req, res) => {
    try {
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

// res.json({...posts, postsLength: posts.length});

export const getOne = async (req, res) => {
    try {
        // console.log('=====req.query: =====', req.query);
        // const post = await PostModel.find({id: req.params.id}).populate('user').exec();
        // ищем пост, у которого id совпадает с id из базы данных
        const post = await PostModel.find({_id: req.params.id});

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить пост',
        });
    }
}

export const updateOne = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
            _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text
            }
        );

        res.json({message: 'Пост успешно обновлен'});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить пост',
        });
    }
}

export const removeOne = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.findOneAndDelete(
            {
            _id: postId
            }
        );

        res.json({message: 'Пост успешно удален'});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить пост',
        });
    }
}

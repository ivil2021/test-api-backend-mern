import PostModel from '../models/Post.js';

export const addOne = async (req, res) => {
    try {
        // создаём пост в базе с данными из запроса
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            user: '63a8ab738e5fca38ee9602a2',
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
            message: 'Не удалось добавить пост',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        // если есть посты, то возвращаем массив постов
        // если постов нет, то возвращаем сообщение
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

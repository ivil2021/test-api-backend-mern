// это функция мидлвар (посредник)
// она решит можно возвращать секретную инфу или нет
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    // если токен есть, то ...
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');

            // если смогли расшифровать токен, то передаем этот айди,
            // чтобы потом использовать его когда нужно
            req.userId = decoded._id;
            next();
        } catch (e) {
            return res.status(403).json({
                message: 'нет доступа',
            });
        }
    } else {
        // ставим ретурн чтобы после возврата ответа выполнение кода не продолжалось
        return res.status(403).json({
            message: 'нет доступа',
        });
    }

    next();
}

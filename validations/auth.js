// import { body, validationResult } from 'express-validator';
// import * as all from 'express-validator';
// import {body} from 'express-validator';

// console.log('body===', body);

import validator from 'express-validator'
// console.log('validator===', validator);
const { body } = validator
// console.log('body===', body);

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isURL()
]

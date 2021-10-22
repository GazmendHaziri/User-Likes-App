import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

export const validator = createValidator({ passError: true });

const defaultUserIdParam = Joi.object({
	id: Joi.string().required(),
});

export const getUserLikesValidator = [
	validator.params(defaultUserIdParam),
];

export const likeUnlikeUserValidator = [
	validator.params(defaultUserIdParam),
];

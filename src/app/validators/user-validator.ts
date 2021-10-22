import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

export const validator = createValidator({ passError: true });

const defaultBody = Joi.object().keys({
	username: Joi.string().min(3).max(18).required(),
	password: Joi.string().min(6).max(24).required(),
});

export const defaultUserValidator = [
	validator.body(defaultBody),
];

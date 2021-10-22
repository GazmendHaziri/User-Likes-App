import express, { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

import UserService from '../../services/user-service';
import { CustomRequest } from '../../interfaces/CustomRequest';
import { ERROR } from '../../constants/constants';
import { generateToken, validatePassword } from '../../utils/utils';
import { defaultUserValidator } from '../validators/user-validator';
import authenticateToken from '../authentication';

const router = express.Router();

router.post(
	'/signup',
	...defaultUserValidator,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { username, password } = req.body;

		const response = await UserService.create(username, password);

		if (!response.id) {
			if (response.error === ERROR.UserAlreadyExists) {
				return res.status(httpStatus.BAD_REQUEST).json({
					error: ERROR.UserAlreadyExists,
				}).end();
			}

			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				error: response.error,
			}).end();
		}

		const token = generateToken(response.id);

		return res.status(httpStatus.OK).json({ token }).end();
	},
);

router.post(
	'/login',
	...defaultUserValidator,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { username, password } = req.body;

		const user = await UserService.getByUsername(username);

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ERROR.InvalidCredentials,
			}).end();
		}

		const isValid = await validatePassword(password, user.password);

		if (!isValid) {
			return res.status(httpStatus.FORBIDDEN).json({
				error: ERROR.InvalidCredentials,
			}).end();
		}

		const token = generateToken(user.id);

		return res.status(httpStatus.OK).json({ token }).end();
	},
);

router.get(
	'/me',
	authenticateToken,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { id } = req;

		const user = await UserService.get(id);

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ERROR.UserNotFound,
			}).end();
		}

		return res.status(httpStatus.OK).json({ user }).end();
	},
);

router.post(
	'/me/update-password',
	authenticateToken,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { id } = req;

		const user = await UserService.get(id);

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ERROR.UserNotFound,
			}).end();
		}

		const { currentPassword, newPassword } = req.body;

		const isValid = await validatePassword(currentPassword, user.password);

		if (!isValid) {
			return res.status(httpStatus.FORBIDDEN).json({
				error: ERROR.InvalidCredentials,
			}).end();
		}

		await UserService.updatePassword(id, newPassword);

		return res.status(httpStatus.OK).end();
	},
);

export default router;

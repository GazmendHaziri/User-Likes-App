import express, { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

import authenticateToken from '../authentication';
import UserService from '../../services/user-service';
import { CustomRequest } from '../../interfaces/CustomRequest';
import { ERROR } from '../../constants/constants';
import LikeService from '../../services/like-service';
import { getUserLikesValidator, likeUnlikeUserValidator } from '../validators/like-validator';

const router = express.Router();

router.get(
	'/most-liked',
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

		const users = await LikeService.getMostLikedUsers();

		return res.status(httpStatus.OK).json(users).end();
	},
);

router.get(
	'/user/:id',
	authenticateToken,
	...getUserLikesValidator,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { id } = req.params;

		const userId = Number(id);

		const user = await UserService.getUserLikeCount(userId);

		return res.status(httpStatus.OK).json(user).end();
	},
);

router.post(
	'/user/:id/like',
	authenticateToken,
	...likeUnlikeUserValidator,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { id } = req;
		const { id: receiverId } = req.params;

		const user = await UserService.get(Number(receiverId));

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ERROR.UserNotFound,
			}).end();
		}

		await LikeService.create(id, Number(receiverId));

		return res.status(httpStatus.OK).end();
	},
);

router.delete(
	'/user/:id/unlike',
	authenticateToken,
	...likeUnlikeUserValidator,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { id } = req;
		const { id: receiverId } = req.params;

		const user = await UserService.get(Number(receiverId));

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ERROR.UserNotFound,
			}).end();
		}

		await LikeService.delete(id, Number(receiverId));

		return res.status(httpStatus.OK).end();
	},
);

export default router;

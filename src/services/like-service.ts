import { QueryTypes } from 'sequelize';

import {
	likeUserQuery,
	unlikeUserQuery,
	userLikesCountQuery,
	getMostLikedUsersQuery,
} from '../database/queries';
import { database } from '../database/connection';
import { QueryTestId } from '../constants/constants';

export default class LikeService {
	static create = async (
		senderId: number,
		receiverId: number,
	): Promise<void> => {
		await database.query(
			likeUserQuery,
			{
				replacements: {
					senderId,
					receiverId,
					QueryTestId: QueryTestId.CreateLike,
				},
				type: QueryTypes.INSERT,
			},
		);
	};

	static delete = async (
		senderId: number,
		receiverId: number,
	): Promise<void> => {
		await database.query(
			unlikeUserQuery,
			{
				replacements: {
					senderId,
					receiverId,
					QueryTestId: QueryTestId.DeleteLike,
				},
				type: QueryTypes.DELETE,
			},
		);
	};

	static getUserLikesCount = async (
		id: number,
	): Promise<object> => {
		const results = await database.query(
			userLikesCountQuery,
			{
				replacements: {
					id,
				},
				type: QueryTypes.SELECT,
			},
		);

		return results.length ? results[0] : null;
	};

	static getMostLikedUsers = async (): Promise<object> => {
		const results = await database.query(
			getMostLikedUsersQuery,
			{
				type: QueryTypes.SELECT,
			},
		);

		return results;
	};
}

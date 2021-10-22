import bcrypt from 'bcrypt';
import { QueryTypes } from 'sequelize';

import {
	insertUserQuery, getUserByUsername, getUserById, updatePasswordQuery, userLikesCountQuery,
} from '../database/queries';
import { database } from '../database/connection';
import { User } from '../interfaces/User';
import { LikesResponse } from '../interfaces/LikesResponse';
import { CreateUserResponse } from '../interfaces/CreateUserResponse';
import { ERROR, QueryTestId } from '../constants/constants';

export default class UserService {
	static get = async (
		id: number,
	): Promise<User> => {
		const users = await database.query<User>(
			getUserById,
			{
				replacements: {
					QueryTestId: QueryTestId.GetUser,
					id,
				},
				type: QueryTypes.SELECT,
				raw: true,
			},
		);

		return users.length ? users[0] : null;
	};

	static getByUsername = async (
		username: string,
	): Promise<User> => {
		const users = await database.query<User>(
			getUserByUsername,
			{
				replacements: {
					QueryTestId: QueryTestId.GetUser,
					username,
				},
				type: QueryTypes.SELECT,
				raw: true,
			},
		);

		return users.length ? users[0] : null;
	};

	static create = async (
		username: string,
		plainPassword: string,
	): Promise<CreateUserResponse> => {
		try {
			const existingUser = await UserService.getByUsername(username);

			if (existingUser) {
				return {
					error: ERROR.UserAlreadyExists,
				};
			}

			const hashedPassword = await bcrypt.hash(plainPassword, 10);

			await database.query(
				insertUserQuery,
				{
					replacements: {
						username,
						password: hashedPassword,
						QueryTestId: QueryTestId.CreateUser,
					},
					type: QueryTypes.INSERT,
				},
			);

			const createdUser = await UserService.getByUsername(username);

			if (createdUser) {
				return { id: createdUser.id };
			}

			return {
				error: ERROR.UserCreationFailed,
			};
		} catch (err) {
			return {
				error: ERROR.UserCreationFailed,
			};
		}
	};

	static updatePassword = async (
		id: number,
		newPassword: string,
	): Promise<void> => {
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await database.query(
			updatePasswordQuery,
			{
				replacements: {
					id,
					password: hashedPassword,
				},
				type: QueryTypes.UPDATE,
			},
		);
	};

	static getUserLikeCount = async (
		id: number,
	): Promise<LikesResponse> => {
		const users = await database.query<LikesResponse>(
			userLikesCountQuery,
			{
				replacements: {
					id,
				},
				type: QueryTypes.SELECT,
				raw: true,
			},
		);

		return users.length ? users[0] : null;
	};
}

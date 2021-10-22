import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const generateToken = (
	id: number,
) => jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: '1d' });

export const validatePassword = async (
	password: string,
	dbPassword: string,
): Promise<boolean> => bcrypt.compare(password, dbPassword);

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import httpStatus from 'http-status';

import { CustomRequest } from '../interfaces/CustomRequest';
import { JWTResponse } from '../interfaces/JWTResponse';

dotenv.config();

const authenticateToken = (
	req: CustomRequest,
	res: Response,
	next: NextFunction,
): void => {
    try {
        const { authorization } = req.headers;
    
        if (authorization) {
            const token = authorization;
    
            if (!token) {
                return res.status(httpStatus.UNAUTHORIZED).end();
            }

            jwt.verify(
                token,
                process.env.SECRET_TOKEN,
                (err: any, data: JWTResponse) => {
                    if (
                        err
                        || !data.id
                        || data.exp > new Date().getTime()
                    ) {
                        return res.status(httpStatus.FORBIDDEN).json(err).end();
                    }
    
                    req.id = data.id;
    
                    return next();
                },
            );
        }
    
        return next();
    } catch (err) {
		// eslint-disable-next-line no-console
		console.log('ERROR', err);
    }
};

export default authenticateToken;

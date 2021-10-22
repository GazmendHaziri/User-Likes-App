import express, { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status';
import bodyParser from 'body-parser';

import likeRoutes from './routes/like-routes';
import userRoutes from './routes/user-routes';

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user-api', userRoutes);
app.use('/like-api', likeRoutes);

app.use(
	(
		req: Request,
		res: Response,
		_: NextFunction,
	): Response => res.status(statusCode.NOT_FOUND).send({
		message: `${req.url} is not a valid URL route`,
	}),
);

app.listen(Number(process.env.PORT), (): void => {
	// eslint-disable-next-line no-console
	console.log(`server started at http://localhost:${Number(process.env.PORT)}`);
});

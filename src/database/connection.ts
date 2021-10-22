import { Sequelize } from 'sequelize';

export const database = new Sequelize(
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		database: process.env.MYSQL_DATABASE,
		port: Number(process.env.MYSQL_LOCAL_PORT),
		dialect: 'mysql',
		pool: {
			max: 3,
			min: 0,
			idle: 20 * 1000,
			acquire: 30 * 1000,
		},
	},
);

export const drainDbConnections = (): void => {
	(database.connectionManager as any).pool.destroyAllNow();
};

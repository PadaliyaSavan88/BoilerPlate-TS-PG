import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
	path: path.join(__dirname, '../../../.env'),
});
console.log("Log Environment Variable>>",process.env.DB_NAME)

type DbConnection = {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	dbLogging: boolean;
};

const connection: DbConnection = {
	host: process.env.DB_HOST as string,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER as string,
	password: process.env.DB_PASSWORD as string,
	database: process.env.DB_NAME as string,
	dbLogging:
		process.env.NODE_ENV === 'development' || process.env.LOG === 'true',
};

export default connection;
import App from "./App";
import logger from './lib/logger';
import { AddressInfo } from 'net';
import * as http from 'http';

const app: App = new App();
let server: http.Server

function serverError(error: NodeJS.ErrnoException): void {
	if (error.syscall !== 'listen') {
		throw error;
	}
	// handle specific error codes here.
	throw error;
}

function serverListening(): void {
	const addressInfo: AddressInfo = server.address() as AddressInfo;
	logger.info(
		`Listening on ${addressInfo.address}:${process.env.PORT || 8080}`,
	);
}

app.init()
	.then(() => {
		app.express.set('port', process.env.PORT || 8080);

		server = app.httpServer;
		server.on('error', serverError);
		server.listen(process.env.PORT || 8080);
		server.on('listening', serverListening);
	})
	.catch((err: Error) => {
		logger.info('app.init error');
		logger.error(err.name);
		logger.error(err.message);
		logger.error(err.stack);
	});

process.on('unhandledRejection', (reason: Error) => {
	logger.error('Unhandled Promise Rejection: reason:', reason.message);
	logger.error(reason.stack);
	// application specific logging, throwing an error, or other logic here/
});

console.info(`Magic Happens at Port: ${process.env.PORT}`)
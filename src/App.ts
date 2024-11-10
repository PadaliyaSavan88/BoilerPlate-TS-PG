import database from './database';
import logger from './lib/logger';
import express, {Application, NextFunction} from 'express';
import http from 'http';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import registerRoutes from './routes';

export default class App {

    public express: Application;
    public httpServer: http.Server;

    

    public async init(): Promise<void> {
        this.express = express();
        this.httpServer = http.createServer(this.express);

        // add all global middleware like cors
		this.middleware();

        // // register the all routes
		this.routes();

        await this.assertDatabaseConnection()
    }

    /**
	 * here register your all routes
	 */
	private routes(): void {
		this.express.get('/', this.basePathRoute);
		this.express.use('/api', registerRoutes());
		this.express.get('/web', this.parseRequestHeader, this.basePathRoute);
	}

    private middleware(): void {
		// support application/json type post data
		// support application/x-www-form-urlencoded post data
		// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
		this.express.use(helmet({ contentSecurityPolicy: false }));
		this.express.use(express.json({ limit: '100mb' }));
		this.express.use(
			express.urlencoded({ limit: '100mb', extended: true }),
		);
		this.express.use(
			session({
				secret: process.env.SESSION_SECRET,
				resave: false,
				saveUninitialized: false,
			}),
		);
		// add multiple cors options as per your use
		const corsOptions = {
			origin: [
				'http://localhost:8080/',
				'http://example.com/',
				'http://127.0.0.1:8080',
			],
		};
		this.express.use(cors(corsOptions));
	}

    private parseRequestHeader(
		_req: Request,
		_res: Response,
		next: NextFunction,
	): void {
		// parse request header
		// console.log(req.headers.access_token);
		next();
	}

    private basePathRoute(_request: Request, response: Response): void {
		response.json({ message: 'base path' });
	}


    private async assertDatabaseConnection(): Promise<void> {
        try {
            await database.authenticate();
            await database.sync();
            logger.info('Connection has been established successfully.');
        } catch (error) {
            logger.error('Unable to connect to the database:', error);
        }
    }
}
import { Server } from "http";
import app from "./app";

async function bootstrap() {
    let server: Server;
    try {
        // TODO: seed admin

        // Start the server
        server = app.listen(5000, () => {
            console.log(`Server is running on http://localhost:5000`); // Todo : import form env 
        });

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed gracefully.');
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.log('Unhandled Rejection is detected, we are closing our server...');
            exitHandler()
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.log('Uncaught Exception detected, closing server...');
            console.error(error);
            exitHandler()
        });

        // Handle SIGTERM and SIGINT for graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully...');
            exitHandler();
        });
        process.on('SIGINT', () => {
            console.log('SIGINT (Ctrl+C) received, shutting down gracefully...');
            exitHandler();
        });
    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
}

bootstrap();
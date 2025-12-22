import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from '@prisma/client';
import config from "../config";


const pool = new Pool({
    connectionString: config.database_url, 
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 10000, 
})

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
    ],
});

export default prisma;
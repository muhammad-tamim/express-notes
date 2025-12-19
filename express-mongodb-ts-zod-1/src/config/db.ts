import { MongoClient, ServerApiVersion } from "mongodb";
import config from "./env.js";

const client = new MongoClient(config.mongodb_uri!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db: any = null;

const initDB = async () => {
    if (db) return db;

    await client.connect();
    db = client.db(config.database_name);

    await db.command({ ping: 1 });
    console.log("Connected to MongoDB");

    return db;
};

const getDB = () => {
    if (!db) throw new Error("DB not initialized. Call initDB() first.");
    return db;
};

export { initDB, getDB }
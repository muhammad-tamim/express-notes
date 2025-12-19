import dotenv from "dotenv"

dotenv.config()

const evn = {
    mongodb_uri: process.env.MONGODB_URI,
    port: process.env.PORT,
    database_name: process.env.DB_NAME


}

export default evn
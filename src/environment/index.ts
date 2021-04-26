
import * as dotenv from "dotenv";
dotenv.config();

const configData = {
  env: process.env.NODE_ENV || 'dev',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '3000',
  mongo_uri: process.env.MONGO_URI || 'mongodb://localhost/my_database',
  secret_key: process.env.SECRET_KEY || 'secret-key',
  telegram_api_key: process.env.TELEGRAM_API_KEY || ''
}

export default configData;
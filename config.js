import dotenv from 'dotenv';

dotenv.config();

//importing environment variables in a config file to use later
export default {
  PORT: process.env.PORT || 3003,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10,
  },
  client: {
     url: process.env.CLIENT_URL || 'http://localhost:5173'
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100,
    message: 'Too many requests from this IP, please try again after some time',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
     format: process.env.LOG_FORMAT || 'json'

  }
};

// Validate required configurations
const validateConfig = () => {
  if (!config.database.uri) {
    console.error('Error: MONGODB_URI environment variable is not set.');
    process.exit(1);
  }

  if (!config.jwt.secret) {
    console.error('Error: JWT_SECRET environment variable is not set.');
    process.exit(1);
  }
  
    if (!config.client.url){
      console.error("Error: CLIENT_URL environment variable is not set.")
        process.exit(1);
    }
};

validateConfig();

export default config;
require('dotenv').config();

const appConfig = {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryUrl: process.env.CLOUDINARY_URL,
    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
}

const SMTPConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    provider: process.env.SMTP_PROVIDER,
    from: process.env.SMTP_FROM
}

const DBconfig = {
    mongodbURL: process.env.MONGODB_URL,
    mongodbName: process.env.MONGODB_DB_NAME,
}

const PaymentConfig = {
    khalti: {
        url: process.env.KHALTI_URL,
        secretKey: process.env.KHALTI_SECRET_KEY,
    }
}
const SQLConfig = {
    dialect: process.env.SQL_DIALECT,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
}

const SupabaseConfig = {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
}

module.exports = {
    appConfig,
    SMTPConfig, // Export the appConfig and SMTPConfig objects for use in other modules
    DBconfig, // Export the DBconfig object for use in other modules
    PaymentConfig,
    SQLConfig, 
    SupabaseConfig,
}
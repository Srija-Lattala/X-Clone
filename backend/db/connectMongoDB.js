import mangoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        const conn = await mangoose.connect(process.env.MONGO_URI) 
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connection to mongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB;
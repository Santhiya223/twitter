import mongoose from 'mongoose';

 const connectToMongodb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log(`Mongodb connected: ${conn.connection.host}`);
    } catch (e) {
        console.error(`Error in db connection ${e}`);
        process.exit(1);
    }
}

export default connectToMongodb;
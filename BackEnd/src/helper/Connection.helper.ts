import mongoose from "mongoose";

const ConnectionData = () => {
    if(!process.env.MONGODB_URL) {
        throw new Error('MONGODB_URL environment variable is not defined.');
    };

    mongoose.connect(process.env.MONGODB_URL)
    .then((data) => {
        console.log(`MongoDb connected with server: ${data.connection.name}`);
    }).catch((error) => {
        console.error('MongoDb connection error:', error);
    });
};

module.exports = ConnectionData;
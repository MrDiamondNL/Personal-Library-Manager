require("dotenv").config();
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    } catch (err) {
        console.log("error connting to database", err);
        process.exit(1);
    }
}



module.exports = connectToDb;

// module.exports = {
//     connectToDb: (cb) => {
//         MongoClient.connect(process.env.MONGODB_URI)
//         .then((client) => {
//             dbConnection = client.db();
//             return cb();
//         })
//         .catch(err => {
//             console.log(err);
//             return cb(err);
//         })
//     },
//     getDb: () => {
//         return dbConnection;
//     }
// }
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

let dbConnection;

const connectToDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/personal-library-manager");
        console.log("Connected to database")
    } catch (err) {
        console.log("error connting to database", err);
        process.exit(1)
    }
}

module.exports = connectToDb;

// module.exports = {
//     connectToDb: (cb) => {
//         MongoClient.connect("mongodb://localhost:27017/personal-library-manager")
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
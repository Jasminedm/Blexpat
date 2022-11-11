// config/database.js
require("dotenv").config({ path: "./config/.env" });
module.exports = {

    'url' : process.env.DB_STRING, 
    'dbName': process.env.DB_NAME 
};

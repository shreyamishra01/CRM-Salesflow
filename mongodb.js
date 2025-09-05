// mongodb.js
const MONGODB_CONFIG = {
    connectionString: "mongodb+srv://shreyamishra210001_db_user:Shreya@afh1crm.ybfrtbe.mongodb.net/salesflow_crm?retryWrites=true&w=majority",
    databaseName: "salesflow_crm",
    usersCollection: "users",
    jwtSecret: "your-secret-key"
};

module.exports = MONGODB_CONFIG;

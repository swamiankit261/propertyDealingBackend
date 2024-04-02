const dotenv = require('dotenv');
const connectDB = require("./db/dbconnection");
const app = require("./app");

const PORT = process.env.PORT || 8000;

dotenv.config({ path: "./.env" });

process.on("SIGINT", () => {
    console.log('Server shutting down gracefully !');
    process.exit(0);
})

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => console.error(err));

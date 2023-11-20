const mongoose = require("mongoose");

require("colors");

const app = require("./app");

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running. Use our API on port: ${PORT}`.green.italic.bold
      );
    });
    console.log("Database connection successful".green.italic.bold);
  })
  .catch((error) => {
    console.log(error.message.red.italic.bold);
    process.exit(1);
  });

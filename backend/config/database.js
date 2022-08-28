const mongoose = require("mongoose");

const connectDatabase = (url) => {
  mongoose.connect(url).then((data) => {
    console.log(`MondoD connected with: ${data.connection.host}`);
  });
};

module.exports = connectDatabase;

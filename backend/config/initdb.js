const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://dhruv23261:s3XAv2JVE2DD7w1R@cluster0.ejemc8a.mongodb.net/PY?appName=Cluster0");
    console.log("mongodb connected");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;

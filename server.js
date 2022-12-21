import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import path from "path";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";

const app = express();

dotenv.config();

mongoose.set("strictQuery", true);
const connect = async () => {
  await mongoose
    .connect(process.env.MONG_URL)
    .then(() => {
      console.log("Connected to DB and ");
    })
    .catch((err) => {
      throw err;
    });
};

//cors

var allowlist = ["https://saanyo.onrender.com"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
//middlewares

app.use(express.json());
app.use("/api/auth", cors(corsOptionsDelegate), authRoutes);
app.use("/api/users", cors(corsOptionsDelegate), userRoutes);

//if (process.env.NODE_ENV === 'production') {
//*Set static folder
//app.use(express.static('client/build'));

//app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
//}

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

connect().then(() => {
  app.listen(8002, () => {
    connect();
    console.log("Connected to Server");
  });
});

import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const connect = (url) => {
  return mongoose.connect(url, {});
};

export default connect;

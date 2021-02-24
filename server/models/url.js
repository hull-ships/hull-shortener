import mongoose from "mongoose";

const { Schema } = mongoose;

const CounterSchema = Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const counter = mongoose.model("counter", CounterSchema);

// create a schema for our links
const urlSchema = new Schema({
  _id: { type: Number, index: true },
  long_url: String,
  clicks: { type: Number, default: 0 },
  ship: String,
  organization: String,
  facebook: String,
  google: String,
  linkedin: String,
  twitter: String,
  created_at: Date
});

urlSchema.pre("save", function urlPreSave(next) {
  const doc = this;
  counter.findByIdAndUpdate(
    { _id: "url_count" },
    { $inc: { seq: 1 } },
    (error, c) => {
      if (error) return next(error);
      doc.created_at = new Date();
      doc._id = c.seq;
      return next();
    }
  );
});

const Url = mongoose.model("Url", urlSchema);

export default Url;

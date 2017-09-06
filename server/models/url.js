import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CounterSchema = Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const counter = mongoose.model("counter", CounterSchema);

// create a schema for our links
const urlSchema = new Schema({
  _id: { type: Number, index: true },
  long_url: String,
  short_url: String,
  ship: String,
  organization: String,
  created_at: Date
});

urlSchema.pre("save", function urlPreSave(next) {
  const doc = this;
  counter.findByIdAndUpdate({ _id: "url_count" }, { $inc: { seq: 1 } }, (error, c) => {
    if (error) return next(error);
    doc.created_at = new Date();
    doc._id = c.seq;
    return next();
  });
});

const Url = mongoose.model("Url", urlSchema);

export default Url;

import express from "express";
import bodyParser from "body-parser";
import devMode from "./dev-mode";
import path from "path";
import mongoose from "mongoose";
import buildRedirect from "./build_redirect.js";
import { encode, decode } from "./base58.js";
import Url from "./models/url";

export default function Server(connector, options = {}) {
  mongoose.connect(options.mongodbUri, { useMongoClient: true });

  const app = express();

  app.use(bodyParser.json());

  const { Hull, hostSecret } = options;

  const HullMiddleware = connector.clientMiddleware({ hostSecret, fetchShip: true, cacheShip: false });
  if (options.devMode) app.use(devMode());
  connector.setupApp(app);

  app.get("/admin.html", HullMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
  });

  app.post("/api/shorten", (req, res, next) => {
    const { ship, organization, secret } = req.body;
    req.hull = { config: { ship, organization, secret } };
    next();
  }, HullMiddleware, (req, res) => {
    const longUrl = req.body.url;
    let shortUrl = "";
    const { ship, organization } = req.hull.config;

    // check if url already exists in database
    Url.findOne({ long_url: longUrl, ship }, (err, doc) => {
      if (doc) {
        shortUrl = `https://${req.hostname}/${encode(doc._id)}`;
        // the document exists, so we return it without creating a new entry
        res.send({ shortUrl });
      } else {
        // since it doesn't exist, let's go ahead and create it:
        const newUrl = Url({ long_url: longUrl, ship, /* secret, */ organization });
        // save the new link
        newUrl.save(error => {
          if (error) { console.log(error); }
          shortUrl = `https://${req.hostname}/${encode(newUrl._id)}`;
          res.send({ shortUrl });
        });
      }
    });
  });

  app.get("/:encoded_id", (req, res) => {
    const base58Id = req.params.encoded_id;
    const id = decode(base58Id);
    // check if url already exists in database
    Url.findOne({ _id: id }, (err, doc) => {
      const { ship, /* secret, */ organization, long_url } = doc;
      if (doc) {
        res.redirect(buildRedirect({ ship, organization, long_url, req }));
      } else {
        res.redirect(req.hostname);
      }
    });
  });

  // Error Handler
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err) {
      const data = {
        status: err.status,
        segmentBody: req.segment,
        method: req.method,
        headers: req.headers,
        url: req.url,
        params: req.params
      };
      Hull.logger.error("Error ----------------", err.message, err.status, data);
      return res.status(err.status || 500).send({ message: err.message });
    }
    return res.status(err.status || 500).send({ message: "undefined error" });
  });
  return app;
}

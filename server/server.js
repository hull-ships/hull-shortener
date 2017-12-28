import compression from "compression";
import express from "express";
import bodyParser from "body-parser";
import devMode from "./dev-mode";
import path from "path";
import _ from "lodash";
import mongoose from "mongoose";
import buildRedirect from "./build_redirect.js";
import { encode, decode } from "./base58.js";
import Url from "./models/url";
import updatePixels from "./update-pixels";
import notifHandler from "./notify-handler";

const buildShortUrl = ({ req, doc }) => `https://${req.hostname}/${encode(doc._id)}`;

export default function Server(connector, options = {}) {
  mongoose.connect(options.mongodbUri, { useMongoClient: true });

  const app = express();

  app.use(compression());

  const { Hull, hostSecret } = options;

  const HullMiddleware = connector.clientMiddleware({ hostSecret, fetchShip: true, cacheShip: false });
  if (options.devMode) app.use(devMode());
  connector.setupApp(app);
  app.post("/smart-notifier", notifHandler);


  app.use(bodyParser.json());

  app.get("/admin.html", HullMiddleware, (req, res) => {
    if (req.hull && req.hull.token) {
      const { client, ship, config } = req.hull;
      Url.where("ship").equals(config.ship)
      .exec(function getLinks(err, urls) {
        if (ship) updatePixels({ client, ship, urls });
        const u = _.map(urls, doc => ({
          long_url: doc.long_url,
          facebook: doc.facebook,
          twitter: doc.twitter,
          linkedin: doc.linkedin,
          google: doc.google,
          clicks: doc.clicks,
          short_url: buildShortUrl({ req, doc })
        }))
        res.render(path.join(__dirname, "../views/index.ejs"), { urls: u });
      });
    } else {
      res.send("Unauthorized");
    }
  });

  app.post("/api/shorten", (req, res, next) => {
    Hull.logger.info("generate link", { body: req.body });
    const { ship, organization, secret } = req.body;
    req.hull = { config: { ship, organization, secret } };
    next();
  },
  HullMiddleware,
  (req, res) => {
    const longUrl = req.body.url;
    let shortUrl = "";
    const { ship, config } = req.hull;
    const { organization } = config;
    const { settings } = ship;

    // check if url already exists in database
    Url.findOne({ long_url: longUrl, ship: ship.id }, (err, doc) => {
      if (doc) {
        shortUrl = buildShortUrl({ req, doc });
        // the document exists, so we return it without creating a new entry
        res.send({ shortUrl });
      } else {
        // since it doesn't exist, let's go ahead and create it:
        const pixels = _.pick(settings, ["facebook", "linkedin", "google", "twitter"]);
        const newUrl = Url({ long_url: longUrl, short_url: shortUrl, ship: ship.id, organization, ...pixels });
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
    try {
      const { body, url, query } = req;
      const referrer = req.get("Referer");
      const base58Id = req.params.encoded_id;
      const id = decode(base58Id);

      const logMessage = { body, url, id, referrer };
      Hull.logger.info("incoming.user.start", { ...logMessage, message: "Follow link" });

      // check if url already exists in database
      Url.findOne({ _id: id }, (err, doc = {}) => {
        if (doc) {
          // Increment click counter
          Url.update({ _id: id }, { $inc: { clicks: 1 } }).exec();

          const { ship, /* secret, */ organization, long_url, facebook, linkedin, google, twitter } = doc;
          if (ship && long_url && organization) {
            Hull.logger.info("incoming.user.success", { ...logMessage, message: "Link Followed" });
            // res.redirect(buildRedirect({ query, organization, long_url, referrer }));
            res.render(path.join(__dirname, "../views/r.ejs"), {
              facebook,
              linkedin,
              google,
              twitter,
              destination: buildRedirect({ query, organization, long_url, referrer })
            });
          } else {
            // Invalid link
            Hull.logger.error("incoming.user.error", { ...logMessage, doc, message: "Invalid link" });
            res.send("Invalid Link");
          }
        } else {
          Hull.logger.error("incoming.user.error", { ...logMessage, doc, message: "Invalid link" });
          res.send("Invalid Link");
        }
      });
    } catch (e) {
      Hull.logger.error("incoming.user.error", { error: e.message, message: "Invalid link" });
      res.send("An error occurred, We've been notified");
    }
  });

  // Error Handler
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err) {
      const data = {
        status: err.status,
        method: req.method,
        headers: req.headers,
        url: req.url,
        params: req.params
      };
      Hull.logger.error("Error", err.message, err.status, data);
      return res.status(err.status || 500).send({ message: err.message });
    }
    return res.status(err.status || 500).send({ message: "undefined error" });
  });
  return app;
}

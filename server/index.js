import Hull from "hull";

import server from "./server";

if (process.env.NEW_RELIC_LICENSE_KEY) {
  console.warn(
    "Starting newrelic agent with key: ",
    process.env.NEW_RELIC_LICENSE_KEY
  );
  require("newrelic"); // eslint-disable-line global-require
}

if (process.env.LOG_LEVEL) {
  Hull.logger.transports.console.level = process.env.LOG_LEVEL;
}

Hull.logger.debug("hull-shortener.boot");

const options = {
  hostSecret: process.env.SECRET || "1234",
  devMode: process.env.NODE_ENV === "development",
  port: process.env.PORT || 8082,
  mongodbUri: process.env.MONGODB_URI,
  Hull,
  clientConfig: {
    firehoseUrl: process.env.OVERRIDE_FIREHOSE_URL
  }
};

const connector = new Hull.Connector(options);
const app = server(connector, options);
connector.startApp(app);

Hull.logger.debug("hull-shortener.started", { port: options.port });

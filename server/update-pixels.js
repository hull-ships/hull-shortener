import _ from "lodash";
import Url from "./models/url";

const update = ({ client, settings, urls }) => {
  if(!client) { return Promise.reject("Can't find Client") }
  client.logger.info("shortener.links.startUpdate", { urls, settings })
  return Promise.all(_.map(urls, (url) => {
    client.logger.info("shortener.links.update", { id: url.id, ...settings });
    return Url.update({ _id: url.id }, settings).exec();
  }));
};

const updatePixels = ({ client, ship, urls }) => {
  // Update pixels for all the links
  const settings = _.omit(ship.settings, "_id");
  if (!urls || _.size(urls)) {
    return Url
      .where("ship").equals(ship.id)
      .exec((err, u) => {
        if (err) return err;
        return update({ client, settings, urls: u });
      });
  }
  return update({ settings, urls });
};

export default updatePixels;

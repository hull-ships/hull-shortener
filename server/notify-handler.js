import Promise from "bluebird";
import updatePixels from "./update-pixels";
import { smartNotifierHandler } from "hull/lib/utils";

const handler = smartNotifierHandler({
  handlers: {
    "user:update": () => Promise.resolve({}),
    "account:update": () => Promise.resolve({}),
    "ship:update": ({
      ship,
      client
    }) => {
      updatePixels({ ship, client });
      return Promise.resolve({});
    }
  }
});

export default handler;

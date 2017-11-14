import Promise from "bluebird";
import updatePixels from "./update-pixels";
import { smartNotifierHandler } from "hull/lib/utils";

const handler = smartNotifierHandler({
  handlers: {
    "ship:update": ({
      ship,
      client
    }) => {
      console.log("Ships ")
      updatePixels({ ship, client });
    }
  }
});

export default handler;

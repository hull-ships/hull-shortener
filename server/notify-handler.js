import Promise from "bluebird";
import updatePixels from "./update-pixels";
import { notifHandler } from "hull/lib/utils";

const handler = notifHandler({
  handlers: {
    "ship:update": ({ ship, client }) => {
      updatePixels({ ship, client });
    }
  }
});

export default handler;

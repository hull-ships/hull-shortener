import Promise from "bluebird";
import updatePixels from "./update-pixels";
import { notifHandler } from "hull/lib/utils";

const handler = notifHandler({
  handlers: {
    "ship:update": (ctx) => {
      const { ship } = ctx;
      updatePixels({ ship });
    }
  }
});

export default handler;

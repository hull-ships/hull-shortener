import updatePixels from "./update-pixels";
import { smartNotifierHandler } from "hull/lib/utils";

const handler = smartNotifierHandler({
  handlers: {
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

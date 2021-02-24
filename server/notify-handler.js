import { smartNotifierHandler } from "hull/lib/utils";
import updatePixels from "./update-pixels";

const handler = smartNotifierHandler({
  handlers: {
    "ship:update": ({ ship, client }) => {
      updatePixels({ ship, client });
      return Promise.resolve({});
    }
  }
});

export default handler;

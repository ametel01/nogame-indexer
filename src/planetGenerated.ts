// import { hash } from "https://esm.sh/starknet@5.14";
import { Block, EventWithTransaction } from "./deps.ts";
import {
  SELECTOR_KEYS,
  NOGAME_CONTRACT,
  GOERLI_URL,
  formatFelt,
} from "./common/constants.ts";

export const config = {
  streamUrl: GOERLI_URL,
  startingBlock: 894605,
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.PLANET)],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("PGQL_CONNECTION"),
    tableName: "planet",
    tlsCertificate: Deno.env.get("PEM_CERTIFICATE"),
    tlsAcceptInvalidCertificates: true,
  },
};

export default function transform({ events, header }: Block) {
  if (!header) {
    console.log("missing header, unable to process", events.length, "events");
    return;
  }

  const output = events.map(({ event }: EventWithTransaction) => {
    console.log(event);
    const { timestamp } = header;
    const planetId = parseInt(event.data[0], 16);
    const account = event.data[1].toString();

    const key = BigInt(event.keys[0]);

    switch (key) {
      case SELECTOR_KEYS.PLANET: {
        return {
          id: planetId,
          account: account,
          time: timestamp,
        };
      }
      default:
        return;
    }
  });
  return output;
}

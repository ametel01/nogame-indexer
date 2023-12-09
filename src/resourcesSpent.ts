// import { hash } from "https://esm.sh/starknet@5.14";
import { Block, EventWithTransaction } from "./common/deps.ts";
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
        keys: [formatFelt(SELECTOR_KEYS.COMPOUNDS)],
      },
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.TECHS)],
      },
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.FLEET)],
      },
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.DEFENCES)],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("PGQL_CONNECTION"),
    tableName: "resourcespent",
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
    const { timestamp } = header;
    const planetId = parseInt(event.data[0], 16);
    const steel = parseInt(event.data[1], 16);
    const quartz = parseInt(event.data[2], 16);

    const key = BigInt(event.keys[0]);

    switch (key) {
      case SELECTOR_KEYS.COMPOUNDS: {
        return {
          planet_id: planetId,
          type: "compound",
          amount: steel + quartz,
          time: timestamp,
        };
      }
      case SELECTOR_KEYS.TECHS: {
        return {
          planet_id: planetId,
          type: "tech",
          amount: steel + quartz,
          time: timestamp,
        };
      }
      case SELECTOR_KEYS.FLEET: {
        return {
          planet_id: planetId,
          type: "fleet",
          amount: steel + quartz,
          time: timestamp,
        };
      }
      case SELECTOR_KEYS.DEFENCES: {
        return {
          planet_id: planetId,
          type: "defence",
          amount: steel + quartz,
          time: timestamp,
        };
      }
      default:
        return;
    }
  });
  return output;
}

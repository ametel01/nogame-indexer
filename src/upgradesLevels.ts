// import { hash } from "https://esm.sh/starknet@5.14";
import { Block, EventWithTransaction } from "./common/deps.ts";
import {
  SELECTOR_KEYS,
  NOGAME_CONTRACT,
  STARTING_BLOCK,
  SEPOLIA_URL,
  formatFelt,
  Names,
} from "./common/constants.ts";

export const config = {
  streamUrl: SEPOLIA_URL,
  startingBlock: STARTING_BLOCK,
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
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("PGQL_CONNECTION"),
    tableName: "upgradelevels",
    tlsCertificate: Deno.env.get("PEM_CERTIFICATE"),
    tlsAcceptInvalidCertificates: true,
  },
};

export default function transform({ events, header }: Block) {
  if (!header) {
    console.log("missing header, unable to process", events.length, "events");
    return;
  }

  return events.flatMap(({ event }: EventWithTransaction) => {
    const timestamp = header.timestamp;
    const planet_id = parseInt(event.data[0], 16);
    const name = parseInt(event.data[1], 16);
    const quantity = parseInt(event.data[2], 16);

    const columnName = getColumnNameForEnumValue(name);
    if (!columnName) {
      console.log("Unknown upgrade type:", name);
      return [];
    }

    return {
      planet_id,
      timestamp,
      [columnName]: quantity,
    };
  });
}

function getColumnNameForEnumValue(enumValue: number): string | null {
  switch (enumValue) {
    case Names.STEEL:
      return "steel";
    case Names.QUARTZ:
      return "quartz";
    case Names.TRITIUM:
      return "tritium";
    case Names.ENERGY_PLANT:
      return "energy_plant";
    case Names.LAB:
      return "lab";
    case Names.DOCKYARD:
      return "dockyard";
    case Names.ENERGY_TECH:
      return "energy_tech";
    case Names.DIGITAL:
      return "digital";
    case Names.BEAM_TECH:
      return "beam_tech";
    case Names.ARMOUR:
      return "armour";
    case Names.ION:
      return "ion";
    case Names.PLASMA_TECH:
      return "plasma_tech";
    case Names.WEAPONS:
      return "weapons";
    case Names.SHIELD:
      return "shield";
    case Names.SPACETIME:
      return "spacetime";
    case Names.COMBUSTION:
      return "combustion";
    case Names.THRUST:
      return "thrust";
    case Names.WARP:
      return "warp";
    default:
      return null;
  }
}

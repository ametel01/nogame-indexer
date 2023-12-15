import {
  NOGAME_CONTRACT,
  SELECTOR_KEYS,
  STARTING_BLOCK,
  formatFelt,
} from "../src/common/constants.ts";
import { Block } from "../src/common/deps.ts";

export const config = {
  streamUrl: "https://goerli.starknet.a5a.ch",
  startingBlock: 918163,
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.BATTLE)],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    tableName: "battlereport",
  },
};

export default function transform({ events, header }: Block) {
  if (!header) {
    console.log("missing header, unable to process", events.length, "events");
    return;
  }
  return events.map(({ event }) => {
    const { timestamp } = header;
    return {
      time: timestamp,
      attacker_planet_id: parseInt(event.data[1], 16),
      attacker_position: {
        system: parseInt(event.data[2], 16),
        orbit: parseInt(event.data[3], 16),
      },
      attacker_initial_fleet: {
        carrier: parseInt(event.data[4], 16),
        scraper: parseInt(event.data[5], 16),
        sparrow: parseInt(event.data[6], 16),
        frigate: parseInt(event.data[7], 16),
        armade: parseInt(event.data[8], 16),
      },
      attacker_fleet_loss: {
        carrier: parseInt(event.data[9], 16),
        scraper: parseInt(event.data[10], 16),
        sparrow: parseInt(event.data[11], 16),
        frigate: parseInt(event.data[12], 16),
        armade: parseInt(event.data[13], 16),
      },
      defender_planet_id: parseInt(event.data[14], 16),
      defender_position: {
        system: parseInt(event.data[15], 16),
        orbit: parseInt(event.data[16], 16),
      },
      defender_initial_fleet: {
        carrier: parseInt(event.data[17], 16),
        scraper: parseInt(event.data[18], 16),
        sparrow: parseInt(event.data[19], 16),
        frigate: parseInt(event.data[20], 16),
        armade: parseInt(event.data[21], 16),
      },
      defender_fleet_loss: {
        carrier: parseInt(event.data[22], 16),
        scraper: parseInt(event.data[23], 16),
        sparrow: parseInt(event.data[24], 16),
        frigate: parseInt(event.data[25], 16),
        armade: parseInt(event.data[26], 16),
      },
      initial_defences: {
        celestia: parseInt(event.data[27], 16),
        blaster: parseInt(event.data[28], 16),
        beam: parseInt(event.data[29], 16),
        astral: parseInt(event.data[30], 16),
        plasma: parseInt(event.data[31], 16),
      },
      defences_loss: {
        celestia: parseInt(event.data[32], 16),
        blaster: parseInt(event.data[33], 16),
        beam: parseInt(event.data[34], 16),
        astral: parseInt(event.data[35], 16),
        plasma: parseInt(event.data[36], 16),
      },
      loot: {
        steel: parseInt(event.data[37], 16),
        quartz: parseInt(event.data[38], 16),
        tritium: parseInt(event.data[39], 16),
      },
      debris: {
        steel: parseInt(event.data[40], 16),
        quartz: parseInt(event.data[41], 16),
      },
    };
  });
}

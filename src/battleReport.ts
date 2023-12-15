import { Block, EventWithTransaction } from "./common/deps.ts";
import {
  SELECTOR_KEYS,
  NOGAME_CONTRACT,
  STARTING_BLOCK,
  GOERLI_URL,
  formatFelt,
} from "./common/constants.ts";

export const config = {
  streamUrl: GOERLI_URL,
  startingBlock: STARTING_BLOCK,
  network: "starknet",
  finally: "DATA_STATUS_PENDING",
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
    connectionString: Deno.env.get("PGQL_CONNECTION"),
    tableName: "battlereport",
    tlsCertificate: Deno.env.get("PEM_CERTIFICATE"),
    tlsAcceptInvalidCertificates: true,
  },
};

export default function transform({ events, header }: Block) {
  if (!header) {
    console.log("missing header, unable to process", events.length, "events");
    return;
  }

  return events.map(({ event }: EventWithTransaction) => {
    const { timestamp } = header;
    // Temporary to avoid null pk error
    const uniqueId =
      Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
    const attackerId = parseInt(event.data[1], 16);
    const attackerPosition = {
      system: parseInt(event.data[2], 16),
      orbit: parseInt(event.data[3], 16),
    };
    const attackerInitialFleet = {
      carrier: parseInt(event.data[4], 16),
      scraper: parseInt(event.data[5], 16),
      sparrow: parseInt(event.data[6], 16),
      frigate: parseInt(event.data[7], 16),
      armade: parseInt(event.data[8], 16),
    };
    const attackerFleetLoss = {
      carrier: parseInt(event.data[9], 16),
      scraper: parseInt(event.data[10], 16),
      sparrow: parseInt(event.data[11], 16),
      frigate: parseInt(event.data[12], 16),
      armade: parseInt(event.data[13], 16),
    };
    const defenderId = parseInt(event.data[14], 16);
    const defenderPosition = {
      system: parseInt(event.data[15], 16),
      orbit: parseInt(event.data[16], 16),
    };
    const defenderInitialFleet = {
      carrier: parseInt(event.data[17], 16),
      scraper: parseInt(event.data[18], 16),
      sparrow: parseInt(event.data[19], 16),
      frigate: parseInt(event.data[20], 16),
      armade: parseInt(event.data[21], 16),
    };
    const defenderFleetLoss = {
      carrier: parseInt(event.data[22], 16),
      scraper: parseInt(event.data[23], 16),
      sparrow: parseInt(event.data[24], 16),
      frigate: parseInt(event.data[25], 16),
      armade: parseInt(event.data[26], 16),
    };
    const initialDefences = {
      celestia: parseInt(event.data[27], 16),
      blaster: parseInt(event.data[28], 16),
      beam: parseInt(event.data[29], 16),
      astral: parseInt(event.data[30], 16),
      plasma: parseInt(event.data[31], 16),
    };
    const defencesLoss = {
      celestia: parseInt(event.data[32], 16),
      blaster: parseInt(event.data[33], 16),
      beam: parseInt(event.data[34], 16),
      astral: parseInt(event.data[35], 16),
      plasma: parseInt(event.data[36], 16),
    };
    const loot = {
      steel: parseInt(event.data[37], 16),
      quartz: parseInt(event.data[38], 16),
      tritium: parseInt(event.data[39], 16),
    };
    const debris = {
      steel: parseInt(event.data[40], 16),
      quartz: parseInt(event.data[41], 16),
    };

    return {
      battle_id: uniqueId,
      time: timestamp,
      attacker_planet_id: attackerId,
      attacker_position: attackerPosition,
      attacker_initial_fleet: attackerInitialFleet,
      attacker_fleet_loss: attackerFleetLoss,
      defender_planet_id: defenderId,
      defender_position: defenderPosition,
      defender_initial_fleet: defenderInitialFleet,
      defender_fleet_loss: defenderFleetLoss,
      initial_defences: initialDefences,
      defences_loss: defencesLoss,
      loot: loot,
      debris: debris,
    };
  });
}

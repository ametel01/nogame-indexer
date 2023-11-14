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

  const output = events.map(({ event }: EventWithTransaction) => {
    const { timestamp } = header;
    const attackerId = parseInt(event.data[1], 16);
    const attackerCarrier = parseInt(event.data[2], 16);
    const attackerScraper = parseInt(event.data[3], 16);
    const attackerSparrow = parseInt(event.data[4], 16);
    const attackerFrigate = parseInt(event.data[5], 16);
    const attackerArmade = parseInt(event.data[6], 16);

    const defenderId = parseInt(event.data[7], 16);
    const defenderCarrier = parseInt(event.data[8], 16);
    const defenderScraper = parseInt(event.data[9], 16);
    const defenderSparrow = parseInt(event.data[10], 16);
    const defenderFrigate = parseInt(event.data[11], 16);
    const defenderArmade = parseInt(event.data[12], 16);

    const celestia = parseInt(event.data[13], 16);
    const blaster = parseInt(event.data[14], 16);
    const beam = parseInt(event.data[15], 16);
    const astral = parseInt(event.data[16], 16);
    const plasma = parseInt(event.data[17], 16);

    const debrisSteel = parseInt(event.data[18], 16);
    const debrisQuartz = parseInt(event.data[19], 16);

    const key = BigInt(event.keys[0]);

    switch (key) {
      case SELECTOR_KEYS.BATTLE: {
        return {
          time: timestamp,
          attacker: attackerId,
          defender: defenderId,
          attacker_carrier_loss: attackerCarrier,
          attacker_scraper_loss: attackerScraper,
          attacker_sparrow_loss: attackerSparrow,
          attacker_frigate_loss: attackerFrigate,
          attacker_armade_loss: attackerArmade,
          defender_carrier_loss: defenderCarrier,
          defender_scraper_loss: defenderScraper,
          defender_sparrow_loss: defenderSparrow,
          defender_frigate_loss: defenderFrigate,
          defender_armade_loss: defenderArmade,
          celestia_loss: celestia,
          blaster_loss: blaster,
          beam_loss: beam,
          astral_loss: astral,
          plasma_loss: plasma,
          debris_steel: debrisSteel,
          debris_quartz: debrisQuartz,
        };
      }
      default:
        return;
    }
  });
  return output;
}

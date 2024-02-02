import { Block, EventWithTransaction } from './common/deps.ts';
import {
  SELECTOR_KEYS,
  NOGAME_CONTRACT,
  SEPOLIA_URL,
  formatFelt,
} from './common/constants.ts';

export const config = {
  streamUrl: SEPOLIA_URL,
  startingBlock: 21782,
  network: 'starknet',
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.DEBRIS)],
      },
    ],
  },
  sinkType: 'postgres',
  sinkOptions: {
    connectionString: Deno.env.get('PGQL_SELF_HOST'),
    tableName: 'debriscollected',
    tlsCertificate: Deno.env.get('PEM_CERTIFICATE'),
    tlsAcceptInvalidCertificates: true,
    entityMode: false,
  },
};

function generateRandomPostgresInt(): number {
  const min = -2147483648;
  const max = 2147483647;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function transform({ events, header }: Block) {
  if (!header) {
    console.log('missing header, unable to process', events.length, 'events');
    return;
  }

  const output = events.map(({ event }: EventWithTransaction) => {
    const { timestamp } = header;
    const rawPlanetId = parseInt(event.data[0], 16);
    const planetId =
      rawPlanetId > 1000
        ? Math.floor(parseInt(event.data[0], 16) / 1000)
        : rawPlanetId;
    const rawDebrisFieldId = parseInt(event.data[1], 16);
    const debrisFieldId =
      rawDebrisFieldId > 1000
        ? Math.floor(parseInt(event.data[1], 16) / 1000)
        : rawDebrisFieldId;
    const steel = parseInt(event.data[2], 16);
    const quartz = parseInt(event.data[3], 16);

    const collectionId = generateRandomPostgresInt();

    return {
      collection_id: collectionId,
      timestamp: timestamp,
      planet_id: planetId,
      debris_field_id: debrisFieldId,
      steel: steel,
      quartz: quartz,
    };
  });
  return output;
}

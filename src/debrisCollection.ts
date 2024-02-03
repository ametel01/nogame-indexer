import { Block, EventWithTransaction } from './common/deps.ts';
import {
  SELECTOR_KEYS,
  NOGAME_CONTRACT,
  SEPOLIA_URL,
  formatFelt,
} from './common/constants.ts';

export const config = {
  streamUrl: SEPOLIA_URL,
  startingBlock: 29415,
  network: 'starknet',
  finality: 'DATA_STATUS_PENDING',
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
    const planet_id =
      rawPlanetId > 1000
        ? Math.floor(parseInt(event.data[0], 16) / 1000)
        : rawPlanetId;
    const system = parseInt(event.data[1], 16);
    const orbit = parseInt(event.data[2], 16);
    const collectible_steel = parseInt(event.data[3], 16);
    const collectible_quartz = parseInt(event.data[4], 16);
    const collected_steel = parseInt(event.data[5], 16);
    const collected_quartz = parseInt(event.data[6], 16);

    const collection_id = generateRandomPostgresInt();

    return {
      collection_id,
      timestamp,
      planet_id,
      system,
      orbit,
      collectible_steel,
      collectible_quartz,
      collected_steel,
      collected_quartz,
    };
  });
  return output;
}

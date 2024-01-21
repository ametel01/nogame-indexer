import { Block, EventWithTransaction } from './common/deps.ts';
import {
  SELECTOR_KEYS,
  NOGAME_CONTRACT,
  STARTING_BLOCK,
  SEPOLIA_URL,
  formatFelt,
} from './common/constants.ts';

export const config = {
  streamUrl: SEPOLIA_URL,
  startingBlock: STARTING_BLOCK,
  network: 'starknet',
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
  sinkType: 'postgres',
  sinkOptions: {
    connectionString: Deno.env.get('PGQL_CONNECTION'),
    tableName: 'resourcespent',
    tlsCertificate: Deno.env.get('PEM_CERTIFICATE'),
    tlsAcceptInvalidCertificates: true,
  },
};

export default function transform({ events, header }: Block) {
  if (!header) {
    console.log('missing header, unable to process', events.length, 'events');
    return;
  }

  const output = events.map(({ event }: EventWithTransaction) => {
    const planetId = parseInt(event.data[0], 16);
    const steel = parseInt(event.data[2], 16);
    const quartz = parseInt(event.data[3], 16);
    const key = BigInt(event.keys[0]);

    // Temporary to avoid null pk error
    const uniqueId =
      (Math.floor(parseInt(event.data[4], 16) / 1000) +
        Math.floor(Math.random() * 100000000)) %
      2147483647;

    console.log(uniqueId);

    let type = '';
    switch (key) {
      case SELECTOR_KEYS.COMPOUNDS:
        type = 'compound';
        break;
      case SELECTOR_KEYS.TECHS:
        type = 'tech';
        break;
      case SELECTOR_KEYS.FLEET:
        type = 'fleet';
        break;
      case SELECTOR_KEYS.DEFENCES:
        type = 'defence';
        break;
      default:
        return;
    }

    return {
      spent_id: uniqueId,
      planet_id: planetId,
      type: type,
      steel: steel,
      quartz: quartz,
    };
  });

  return output.filter((item) => item !== undefined);
}

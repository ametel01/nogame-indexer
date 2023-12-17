import {
  NOGAME_CONTRACT,
  SELECTOR_KEYS,
  formatFelt,
} from "../src/common/constants.ts";
import { Block } from "../src/common/deps.ts";

export const config = {
  streamUrl: "https://goerli.starknet.a5a.ch",
  startingBlock: 918779,
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
    tableName: "planet",
  },
};

export default function transform({ header, events }: Block) {
  const { blockNumber, blockHash, timestamp } = header!;
  return events.map(({ event, receipt }) => {
    const { transactionHash } = receipt;

    return {
      network: "starknet-goerli",
      block_hash: blockHash,
      block_number: +blockNumber,
      block_timestamp: timestamp,
      transaction_hash: transactionHash,
      planet_id: event.data[0],
      system: event.data[1],
      orbit: event.data[2],
      account: event.data[3],
    };
  });
}

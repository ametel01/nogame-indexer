import {
  NOGAME_CONTRACT,
  SELECTOR_KEYS,
  formatFelt,
} from "../src/common/constants.ts";
import { Block } from "../src/common/deps.ts";

export const config = {
  streamUrl: "https://goerli.starknet.a5a.ch",
  startingBlock: 918762,
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
        keys: [formatFelt(SELECTOR_KEYS.FLEET)],
      },
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.TECHS)],
      },
      {
        fromAddress: NOGAME_CONTRACT,
        keys: [formatFelt(SELECTOR_KEYS.DEFENCES)],
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
      steel: event.data[1],
      quartz: event.data[2],
      tritium: event.data[3],
    };
  });
}

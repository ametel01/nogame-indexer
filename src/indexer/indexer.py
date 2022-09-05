from apibara import Client, IndexerRunner, Info, NewBlock, NewEvents
from apibara.indexer.runner import IndexerRunnerConfiguration
from apibara.model import EventFilter
from pymongo import MongoClient
from starknet_py.utils.data_transformer.data_transformer import DataTransformer
from starknet_py.contract import identifier_manager_from_abi
from datetime import datetime

indexer_id = "my-indexer"


async def handle_events(info: Info, block_events: NewEvents):
    """Handle a group of events grouped by block."""
    print(f"Received events for block {block_events.block.number}")
    for event in block_events.events:
        print(event)

    events = [
        {"address": event.address, "data": event.data, "name": event.name}
        for event in block_events.events
    ]

    # Insert multiple documents in one call.
    await info.storage.insert_many("events", events)


async def handle_block(info: Info, block: NewBlock):
    """Handle a new _live_ block."""
    print(block.new_head)


async def run_indexer(server_url=None, mongo_url=None, restart=None):
    print("Starting Apibara indexer")
    if mongo_url is None:
        mongo_url = "mongodb://apibara:apibara@localhost:27017"

    if restart:
        async with Client.connect(server_url) as client:
            existing = await client.indexer_client().get_indexer(indexer_id)
            if existing:
                await client.indexer_client().delete_indexer(indexer_id)

            # Delete old database entries.
            # Notice that apibara maps indexer ids to database names by
            # doing `indexer_id.replace('-', '_')`.
            # In the future all data will be handled by Apibara and this step
            # will not be necessary.
            mongo = MongoClient(mongo_url)
            mongo.drop_database(indexer_id.replace("-", "_"))

    runner = IndexerRunner(
        config=IndexerRunnerConfiguration(
            apibara_url=server_url,
            storage_url=mongo_url,
        ),
        network_name="starknet-goerli",
        indexer_id=indexer_id,
        new_events_handler=handle_events,
    )

    runner.add_block_handler(handle_block)

    # Create the indexer if it doesn't exist on the server,
    # otherwise it will resume indexing from where it left off.
    #
    # For now, this also helps the SDK map between human-readable
    # event names and StarkNet events.
    runner.create_if_not_exists(
        filters=[
            EventFilter.from_event_name(
                name="resources_spent",
                address="0x06d1e8024d2375e38d9a56955b7fefcbde5c5422bf5d792fe417f766bda3c11f",
            )
        ],
        index_from_block=300_853,
    )

    print("Initialization completed. Entering main loop.")

    await runner.run()


# ...

uint256_abi = {
    "name": "Uint256",
    "type": "struct",
    "size": 2,
    "members": [
        {"name": "low", "offset": 0, "type": "felt"},
        {"name": "high", "offset": 1, "type": "felt"},
    ],
}

resources_spent_abi = {
    "name": "resources_spent",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "planet_id", "type": "Uint256"},
        {"name": "spent", "type": "felt"},
    ],
}

spending_decoder = DataTransformer(
    abi=resources_spent_abi,
    identifier_manager=identifier_manager_from_abi(
        [resources_spent_abi, uint256_abi]
    ),
)


def decode_spending_event(data):
    data = [int.from_bytes(b, "big") for b in data]
    return spending_decoder.to_python(data)


def encode_int_as_bytes(n):
    return n.to_bytes(32, "big")


# (Handle Events Section)


async def handle_events(info, block_events):
    # (Get Block Section)
    block = await info.rpc_client.get_block_by_hash(block_events.block)
    block_time = datetime.fromtimestamp(block["accepted_time"])

    # (Store Transfers Section)
    spendings = [
        decode_spending_event(event.data) for event in block_events.events
    ]
    spendings_docs = [
        {
            "planet_id": tr.planet_id,
            "spent": tr.spent,
            "timestamp": block_time,
        }
        for tr in spendings
    ]
    await info.storage.insert_many("spendings", spendings_docs)

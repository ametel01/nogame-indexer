import asyncio
from datetime import datetime
from typing import List, NewType, Optional

import strawberry
from aiohttp import web
from pymongo import MongoClient
from strawberry.aiohttp.views import GraphQLView
from indexer.indexer import indexer_id

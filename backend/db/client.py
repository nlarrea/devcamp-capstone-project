import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

db_uri = os.getenv("DB_URI")

db_client = MongoClient(
    db_uri
).nlarrea
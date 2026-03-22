import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import logging

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "")

if not MONGO_URI:
    logging.warning("MONGO_URI is missing from environment variables. MongoDB features may fail if a local instance is not running.")
    MONGO_URI = "mongodb://localhost:27017" # Fallback to local MongoDB

try:
    # Use certifi for TLS secured connections (required by MongoDB Atlas)
    client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
    database = client.resumatch
    resume_collection = database.get_collection("resumes")
    logging.info("MongoDB client initialized successfully.")
except Exception as e:
    logging.error(f"Failed to initialize MongoDB client: {e}")
    database = None
    resume_collection = None

from pymongo import MongoClient
from voyageai import Client as VoyageClient
from tqdm import tqdm

# -----------------------------
# CONFIG (hardcode as requested)
# -----------------------------
MONGODB_URI = ""
DB_NAME = "membermatch"
COLLECTION_NAME = "patients"

VOYAGE_API_KEY = ""
VOYAGE_MODEL = "voyage-4-large"
EMBEDDING_DIM = 1024

# -----------------------------
# CLIENTS
# -----------------------------
mongo = MongoClient(MONGODB_URI)
db = mongo[DB_NAME]
patients = db[COLLECTION_NAME]

voyage = VoyageClient(api_key=VOYAGE_API_KEY)

# -----------------------------
# FETCH DOCS TO EMBED
# -----------------------------
docs = list(
    patients.find(
        {
            "incomingMemberMatchValue.identityText": {"$exists": True},
            "incomingMemberMatchValue.identityEmbedding": {"$exists": False}
        },
        {
            "_id": 1,
            "incomingMemberMatchValue.identityText": 1
        }
    )
)

print(f"Found {len(docs)} documents to embed")

# -----------------------------
# EMBED + UPDATE
# -----------------------------
BATCH_SIZE = 16

for i in tqdm(range(0, len(docs), BATCH_SIZE)):
    batch = docs[i:i + BATCH_SIZE]

    texts = [
        d["incomingMemberMatchValue"]["identityText"]
        for d in batch
    ]

    embeddings = voyage.embed(
        texts,
        model=VOYAGE_MODEL
    ).embeddings

    for doc, vector in zip(batch, embeddings):
        assert len(vector) == EMBEDDING_DIM, "Embedding dimension mismatch!"

        patients.update_one(
            {"_id": doc["_id"]},
            {
                "$set": {
                    "incomingMemberMatchValue.identityEmbedding": vector
                }
            }
        )

print("✅ Embeddings successfully written to MongoDB")

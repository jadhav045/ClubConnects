const { MongoClient } = require("mongodb");

// Replace this with your actual MongoDB Atlas connection string
const uri = "mongodb+srv://mrshaktiman01:T3rs4Nn07F473S5v@cluster0.t1hi4.mongodb.net/"; 

const dbName = "clubConnects";  // Change this if your DB name is different
const collectionName = "events"; 

async function dropUniqueIndex() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Drop the unique index on requestUniqueId
        await collection.dropIndex("requestUniqueId_1");
        console.log("Successfully dropped unique index on requestUniqueId");

    } catch (error) {
        console.error("Error dropping index:", error.message);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

// Run the function
dropUniqueIndex();

import mongoose from "mongoose";

let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ MONGODB_URI is not defined. Database features will be simulated.");
  } else {
    throw new Error("❌ MONGODB_URI is not defined. Please add it to your environment variables.");
  }
}

/**
 * Global cache to prevent multiple connections on Vercel/Serverless hot reloads.
 */
interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseGlobal | undefined;
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Optimal for serverless to prevent exhaustion
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    };

    // Ensure a database name is specified; default to 'trustcert'
    let uri = MONGODB_URI!;
    if (uri.includes('mongodb.net/') && uri.includes('mongodb.net/?')) {
      uri = uri.replace('mongodb.net/?', 'mongodb.net/trustcert?');
    } else if (uri.includes('mongodb.net') && !uri.match(/mongodb\.net\/[a-zA-Z]/)) {
      uri = uri.replace('mongodb.net/', 'mongodb.net/trustcert/');
    }

    cached!.promise = mongoose.connect(uri, opts).then(async (mongooseInstance) => {
      console.log("✅ TrustCert Registry effectively settled on MongoDB.");
      // Fix stale indexes: drop walletAddress_1 unique index (without sparse)
      // so Mongoose can recreate it with sparse:true from the schema
      try {
        const db = mongooseInstance.connection.db;
        if (db) {
          const collections = await db.listCollections({ name: 'institutions' }).toArray();
          if (collections.length > 0) {
            const indexes = await db.collection('institutions').indexes();
            const walletIdx = indexes.find((idx: any) => 
              idx.key?.walletAddress && idx.unique && !idx.sparse
            );
            if (walletIdx) {
              await db.collection('institutions').dropIndex(walletIdx.name!);
              console.log("✅ Dropped stale walletAddress index. Will be recreated with sparse:true.");
            }
          }
        }
      } catch (indexErr) {
        console.warn("⚠️ Index fix warning:", indexErr);
      }
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e: any) {
    cached!.promise = null;
    
    // Provide a more descriptive error for Atlas IP whitelisting
    if (e.name === 'MongooseServerSelectionError' || e.message.includes('whitelist')) {
      console.error("\n❌ TRUSTCERT_DATABASE_FATAL: MongoDB Atlas IP Access Denied.");
      console.error("👉 Please ensure your IP address is effectively whitelisted on the Atlas cluster.");
      console.error("👉 Visit: https://www.mongodb.com/docs/atlas/security-whitelist/\n");
      
      throw new Error(`[TRUSTCERT_DATABASE_DENIED] Your IP is not effectively whitelisted on the established registry. Settlement failed.`);
    }
    
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
export { dbConnect };

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get database name from connection string
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📦 Database: ${dbName}`);

    // Clear collections
    const collections = ['clients', 'calllogs', 'users'];
    
    for (const collectionName of collections) {
      const collection = mongoose.connection.db.collection(collectionName);
      const count = await collection.countDocuments();
      
      if (count > 0) {
        await collection.deleteMany({});
        console.log(`🗑️  Cleared ${count} documents from ${collectionName}`);
      } else {
        console.log(`ℹ️  ${collectionName} is already empty`);
      }
    }

    // Note: We're keeping users so you don't have to re-register
    // If you want to clear users too, uncomment the line below:
    // await mongoose.connection.db.collection('users').deleteMany({});

    console.log('\n✅ Database cleared successfully!');
    console.log('💡 Note: Users collection was kept. Delete it manually if needed.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

clearDatabase();


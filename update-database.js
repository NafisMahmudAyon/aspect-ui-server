// update-database.js - Reads JSON file and updates MongoDB

const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const dotenv = require("dotenv");
dotenv.config();

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = "component_library";
const COMPONENTS_COLLECTION = "components";
const UTILS_COLLECTION = "utils";
const STATIC_COLLECTION = "static_files";
const METADATA_COLLECTION = "metadata";
const JSON_FILE_PATH = "component-data.json";

class DatabaseUpdater {
	constructor() {
		this.client = null;
		this.db = null;
	}

	// Connect to MongoDB
	async connect() {
		try {
			console.log("🔗 Connecting to MongoDB...");
			this.client = new MongoClient(MONGODB_URI);
			await this.client.connect();
			this.db = this.client.db(DATABASE_NAME);
			console.log("✅ Connected to MongoDB successfully");
		} catch (error) {
			console.error("❌ MongoDB connection failed:", error);
			throw error;
		}
	}

	// Disconnect from MongoDB
	async disconnect() {
		if (this.client) {
			await this.client.close();
			console.log("🔌 Disconnected from MongoDB");
		}
	}

	// Read JSON file
	async readJsonFile(filePath) {
		try {
			console.log(`📖 Reading JSON file: ${filePath}`);
			const fileContent = await fs.readFile(filePath, "utf8");
			const data = JSON.parse(fileContent);
			console.log("✅ JSON file loaded successfully");
			return data;
		} catch (error) {
			console.error("❌ Error reading JSON file:", error);
			throw error;
		}
	}

	// Create indexes for better performance
	async createIndexes() {
		try {
			console.log("📊 Creating database indexes...");

			// Components collection indexes
			await this.db
				.collection(COMPONENTS_COLLECTION)
				.createIndex({ id: 1 }, { unique: true });
			await this.db.collection(COMPONENTS_COLLECTION).createIndex({ name: 1 });
			await this.db
				.collection(COMPONENTS_COLLECTION)
				.createIndex({ dependencies: 1 });
			await this.db
				.collection(COMPONENTS_COLLECTION)
				.createIndex({ "files.javascript.filename": 1 });
			await this.db
				.collection(COMPONENTS_COLLECTION)
				.createIndex({ "files.typescript.filename": 1 });

			// Utils collection indexes
			await this.db
				.collection(UTILS_COLLECTION)
				.createIndex({ id: 1 }, { unique: true });
			await this.db.collection(UTILS_COLLECTION).createIndex({ name: 1 });

			// Static files collection indexes
			await this.db
				.collection(STATIC_COLLECTION)
				.createIndex({ id: 1 }, { unique: true });
			await this.db.collection(STATIC_COLLECTION).createIndex({ name: 1 });
			await this.db
				.collection(STATIC_COLLECTION)
				.createIndex({ "files.css.filename": 1 });

			// Metadata collection indexes
			await this.db
				.collection(METADATA_COLLECTION)
				.createIndex({ type: 1 }, { unique: true });

			console.log("✅ Indexes created successfully");
		} catch (error) {
			console.error("❌ Error creating indexes:", error);
			throw error;
		}
	}

	// Update components collection
	async updateComponents(components) {
		try {
			console.log("📦 Updating components collection...");
			const collection = this.db.collection(COMPONENTS_COLLECTION);

			// Clear existing data
			await collection.deleteMany({});
			console.log("🗑️ Cleared existing components");

			// Insert new data
			const componentArray = Object.values(components);
			if (componentArray.length > 0) {
				const result = await collection.insertMany(componentArray);
				console.log(`✅ Inserted ${result.insertedCount} components`);
			}

			return componentArray.length;
		} catch (error) {
			console.error("❌ Error updating components:", error);
			throw error;
		}
	}

	// Update utils collection
	async updateUtils(utils) {
		try {
			console.log("🔧 Updating utils collection...");
			const collection = this.db.collection(UTILS_COLLECTION);

			// Clear existing data
			await collection.deleteMany({});
			console.log("🗑️ Cleared existing utils");

			// Insert new data
			const utilsArray = Object.values(utils);
			if (utilsArray.length > 0) {
				const result = await collection.insertMany(utilsArray);
				console.log(`✅ Inserted ${result.insertedCount} utils`);
			}

			return utilsArray.length;
		} catch (error) {
			console.error("❌ Error updating utils:", error);
			throw error;
		}
	}

	// Update static files collection
	async updateStaticFiles(staticFiles) {
		try {
			console.log("🎨 Updating static files collection...");
			const collection = this.db.collection(STATIC_COLLECTION);

			// Clear existing data
			await collection.deleteMany({});
			console.log("🗑️ Cleared existing static files");

			// Insert new data
			const staticArray = Object.values(staticFiles || {});
			if (staticArray.length > 0) {
				const result = await collection.insertMany(staticArray);
				console.log(`✅ Inserted ${result.insertedCount} static file groups`);
			}

			return staticArray.length;
		} catch (error) {
			console.error("❌ Error updating static files:", error);
			throw error;
		}
	}

	// Update metadata collection
	async updateMetadata(metadata) {
		try {
			console.log("📋 Updating metadata collection...");
			const collection = this.db.collection(METADATA_COLLECTION);

			// Prepare metadata document
			const metadataDoc = {
				type: "app_metadata",
				...metadata,
				databaseUpdatedAt: new Date().toISOString(),
			};

			// Upsert metadata
			const result = await collection.replaceOne(
				{ type: "app_metadata" },
				metadataDoc,
				{ upsert: true }
			);

			console.log("✅ Metadata updated successfully");
			return result;
		} catch (error) {
			console.error("❌ Error updating metadata:", error);
			throw error;
		}
	}

	// Get database statistics
	async getStatistics() {
		try {
			const componentsCount = await this.db
				.collection(COMPONENTS_COLLECTION)
				.countDocuments();
			const utilsCount = await this.db
				.collection(UTILS_COLLECTION)
				.countDocuments();
			const staticCount = await this.db
					.collection(STATIC_COLLECTION)
					.countDocuments();

			// Get file statistics
			const pipeline = [
				{ $unwind: "$files" },
				{
					$group: {
						_id: null,
						totalFiles: { $sum: { $size: { $objectToArray: "$files" } } },
					},
				},
			];

			const fileStats = await this.db
				.collection(COMPONENTS_COLLECTION)
				.aggregate(pipeline)
				.toArray();
			const totalFiles = fileStats.length > 0 ? fileStats[0].totalFiles : 0;

			return {
				components: componentsCount,
				utils: utilsCount,
				static: staticCount,
				totalFiles: totalFiles,
			};
		} catch (error) {
			console.error("❌ Error getting statistics:", error);
			return { components: 0, utils: 0, totalFiles: 0 };
		}
	}

	// Main update process
	async updateDatabase(jsonFilePath = JSON_FILE_PATH) {
		try {
			const startTime = Date.now();

			// Read JSON data
			const data = await this.readJsonFile(jsonFilePath);

			// Connect to database
			await this.connect();

			// Create indexes
			await this.createIndexes();

			// Update collections
			const componentsCount = await this.updateComponents(data.components);
			const utilsCount = await this.updateUtils(data.utils);
      const staticCount = await this.updateStaticFiles(data.static);
			await this.updateMetadata(data.metadata);

			// Get final statistics
			const stats = await this.getStatistics();

			const endTime = Date.now();
			const duration = (endTime - startTime) / 1000;

			// Display results
			console.log("\n📊 UPDATE SUMMARY");
			console.log("================");
			console.log(`Components updated: ${componentsCount}`);
			console.log(`Utils updated: ${utilsCount}`);
      console.log(`Static files updated: ${staticCount}`);
			console.log(`Database components: ${stats.components}`);
			console.log(`Database utils: ${stats.utils}`);
      console.log(`Database static files: ${stats.static}`);
			console.log(`Total processing time: ${duration.toFixed(2)} seconds`);
			console.log("✅ Database update completed successfully!");

			return {
				success: true,
				componentsCount,
				utilsCount,
				staticCount,
				duration: duration.toFixed(2),
			};
		} catch (error) {
			console.error("❌ Database update failed:", error);
			return {
				success: false,
				error: error.message,
			};
		} finally {
			await this.disconnect();
		}
	}
}

// CLI functionality
async function main() {
	const jsonFile = process.argv[2] || JSON_FILE_PATH;

	console.log("🚀 Starting database update process...");
	console.log(`JSON file: ${jsonFile}`);
	console.log(`MongoDB URI: ${MONGODB_URI}`);
	console.log(`Database: ${DATABASE_NAME}\n`);

	const updater = new DatabaseUpdater();
	const result = await updater.updateDatabase(jsonFile);

	process.exit(result.success ? 0 : 1);
}

// Utility functions for manual operations

// Clear all collections
async function clearDatabase() {
	const updater = new DatabaseUpdater();
	try {
		await updater.connect();

		await updater.db.collection(COMPONENTS_COLLECTION).deleteMany({});
		await updater.db.collection(UTILS_COLLECTION).deleteMany({});
    await updater.db.collection(STATIC_COLLECTION).deleteMany({});
		await updater.db.collection(METADATA_COLLECTION).deleteMany({});

		console.log("✅ Database cleared successfully");
	} catch (error) {
		console.error("❌ Error clearing database:", error);
	} finally {
		await updater.disconnect();
	}
}

// Backup database to JSON
async function backupDatabase() {
	const updater = new DatabaseUpdater();
	try {
		await updater.connect();

		const components = await updater.db
			.collection(COMPONENTS_COLLECTION)
			.find({})
			.toArray();
		const utils = await updater.db
			.collection(UTILS_COLLECTION)
			.find({})
			.toArray();
		const staticFiles = await updater.db
				.collection(STATIC_COLLECTION)
				.find({})
				.toArray();
		const metadata = await updater.db
			.collection(METADATA_COLLECTION)
			.findOne({ type: "app_metadata" });

		const backup = {
			components: components.reduce((acc, comp) => {
				acc[comp.id] = comp;
				return acc;
			}, {}),
			utils: utils.reduce((acc, util) => {
				acc[util.id] = util;
				return acc;
			}, {}),
			static: staticFiles.reduce((acc, staticFile) => {
				acc[staticFile.id] = staticFile;
				return acc;
			}, {}),
			metadata: metadata || {},
		};

		const backupFile = `backup-${new Date().toISOString().split("T")[0]}.json`;
		await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
		console.log(`✅ Database backed up to ${backupFile}`);
	} catch (error) {
		console.error("❌ Error backing up database:", error);
	} finally {
		await updater.disconnect();
	}
}

// Export for use as module
module.exports = {
	DatabaseUpdater,
	clearDatabase,
	backupDatabase,
};

// Run if called directly
if (require.main === module) {
	main();
}

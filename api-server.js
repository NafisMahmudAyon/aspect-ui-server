// api-server.js - Express API server that serves data from MongoDB like GitHub raw URLs

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'component_library';
const COMPONENTS_COLLECTION = 'components';
const UTILS_COLLECTION = 'utils';
const METADATA_COLLECTION = 'metadata';
console.log(MONGODB_URI,PORT)
// Global database connection
let db = null;

// Middleware
app.use(cors());
app.use(express.json());
// Allow all origins
app.use(cors({
  origin: true, // This allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Set to false when allowing all origins
}));

// Connect to MongoDB
async function connectDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Database helper functions
async function getComponents(filter = {}) {
  return await db.collection(COMPONENTS_COLLECTION).find(filter).toArray();
}

async function getComponent(componentId) {
  return await db.collection(COMPONENTS_COLLECTION).findOne({ id: componentId });
}

async function getUtils(filter = {}) {
  return await db.collection(UTILS_COLLECTION).find(filter).toArray();
}

async function getUtil(utilId) {
  return await db.collection(UTILS_COLLECTION).findOne({ id: utilId });
}

async function getMetadata() {
  return await db.collection(METADATA_COLLECTION).findOne({ type: 'app_metadata' });
}

// 1. Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected'
  });
});

// 2. Get metadata and statistics
app.get('/api/info', async (req, res) => {
  try {
    const metadata = await getMetadata();
    const componentsCount = await db.collection(COMPONENTS_COLLECTION).countDocuments();
    const utilsCount = await db.collection(UTILS_COLLECTION).countDocuments();
    
    res.json({
      success: true,
      data: {
        metadata: metadata || {},
        statistics: {
          components: componentsCount,
          utils: utilsCount,
          lastUpdated: metadata?.lastUpdated || null,
          databaseUpdatedAt: metadata?.databaseUpdatedAt || null
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metadata',
      details: error.message
    });
  }
});

// 3. Get list of all components
app.get('/api/components', async (req, res) => {
  try {
    const components = await getComponents();
    const utils = await getUtils();
    
    // Format response similar to original structure
    const formattedComponents = components.map(comp => ({
      id: comp.id,
      name: comp.name,
      path: comp.path,
      dependencies: comp.dependencies,
      utils: comp.utils,
      files: Object.keys(comp.files || {}).reduce((acc, lang) => {
        acc[lang] = comp.files[lang].map(file => file.filename);
        return acc;
      }, {})
    }));
    
    const formattedUtils = utils.map(util => ({
      id: util.id,
      name: util.name,
      path: util.path,
      dependencies: util.dependencies,
      files: Object.keys(util.files || {}).reduce((acc, lang) => {
        acc[lang] = util.files[lang].map(file => file.filename);
        return acc;
      }, {})
    }));
    
    res.json({
      success: true,
      data: {
        components: formattedComponents,
        utils: formattedUtils
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components',
      details: error.message
    });
  }
});

// 4. Get specific component info
app.get('/api/components/:componentId', async (req, res) => {
  try {
    const { componentId } = req.params;
    const component = await getComponent(componentId);
    
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }
    
    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch component',
      details: error.message
    });
  }
});

app.get('/api/raw/:componentId/:language/:filename', async (req, res) => {
  try {
    const { componentId, language, filename } = req.params;
    const component = await getComponent(componentId);
    
    if (!component) {
      return res.status(404).send('Component not found');
    }
    
    if (!component.files[language]) {
      return res.status(404).send('Language not found');
    }
    
    const file = component.files[language].find(f => f.filename === filename);
    
    if (!file) {
      return res.status(404).send('File not found');
    }
    
    // Set appropriate content type based on file extension
    const ext = filename.split('.').pop().toLowerCase();
    const contentTypes = {
      'js': 'application/javascript',
      'jsx': 'application/javascript',
      'ts': 'application/typescript',
      'tsx': 'application/typescript',
      'css': 'text/css',
      'json': 'application/json',
      'md': 'text/markdown'
    };
    
    res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
    res.send(file.content);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// 6. Get utility file content (GitHub raw style)
app.get('/api/raw/utils/:utilId/:language/:filename', async (req, res) => {
  try {
    const { utilId, language, filename } = req.params;
    const util = await getUtil(utilId);
    
    if (!util) {
      return res.status(404).send('Utility not found');
    }
    
    if (!util.files[language]) {
      return res.status(404).send('Language not found');
    }
    
    const file = util.files[language].find(f => f.filename === filename);
    
    if (!file) {
      return res.status(404).send('File not found');
    }
    
    // Set appropriate content type
    const ext = filename.split('.').pop().toLowerCase();
    const contentTypes = {
      'js': 'application/javascript',
      'jsx': 'application/javascript',
      'ts': 'application/typescript',
      'tsx': 'application/typescript',
      'css': 'text/css',
      'json': 'application/json',
      'md': 'text/markdown'
    };
    
    res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
    res.send(file.content);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// 7. Get all files for a specific component with content
app.get('/api/components/:componentId/files/:language', async (req, res) => {
  try {
    const { componentId, language } = req.params;
    const component = await getComponent(componentId);
    
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }
    
    if (!component.files[language]) {
      return res.status(404).json({
        success: false,
        error: `Language '${language}' not available for this component`
      });
    }
    
    res.json({
      success: true,
      data: {
        component: componentId,
        language,
        files: component.files[language]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch component files',
      details: error.message
    });
  }
});

// 8. Get specific file with metadata (JSON response)
app.get('/api/components/:componentId/files/:language/:filename', async (req, res) => {
  try {
    const { componentId, language, filename } = req.params;
    const component = await getComponent(componentId);
    
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }
    
    if (!component.files[language]) {
      return res.status(404).json({
        success: false,
        error: 'Language not found'
      });
    }
    
    const file = component.files[language].find(f => f.filename === filename);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        filename: file.filename,
        language,
        component: componentId,
        url: file.url,
        content: file.content,
        size: file.size,
        rawUrl: `${req.protocol}://${req.get('host')}/api/raw/${componentId}/${language}/${filename}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file',
      details: error.message
    });
  }
});

// 9. Get utility file with metadata (JSON response)
app.get('/api/utils/:utilId/:language/:filename', async (req, res) => {
  try {
    const { utilId, language, filename } = req.params;
    const util = await getUtil(utilId);
    
    if (!util) {
      return res.status(404).json({
        success: false,
        error: 'Utility not found'
      });
    }
    
    if (!util.files[language]) {
      return res.status(404).json({
        success: false,
        error: 'Language not found'
      });
    }
    
    const file = util.files[language].find(f => f.filename === filename);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        filename: file.filename,
        language,
        util: utilId,
        url: file.url,
        content: file.content,
        size: file.size,
        rawUrl: `${req.protocol}://${req.get('host')}/api/raw/utils/${utilId}/${language}/${filename}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch utility file',
      details: error.message
    });
  }
});

// 10. Get all components with their files (bulk operation)
app.get('/api/components/bulk/:language', async (req, res) => {
  try {
    const { language } = req.params;
    const components = await getComponents();
    
    const result = {};
    
    for (const component of components) {
      if (!component.files[language]) continue;
      
      result[component.id] = {
        info: {
          id: component.id,
          name: component.name,
          path: component.path,
          dependencies: component.dependencies,
          utils: component.utils
        },
        files: component.files[language]
      };
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bulk components',
      details: error.message
    });
  }
});

// 11. Search components by name or dependencies
app.get('/api/components/search', async (req, res) => {
  try {
    const { q, dependency } = req.query;
    
    let filter = {};
    
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { id: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (dependency) {
      filter.dependencies = dependency;
    }
    
    const components = await getComponents(filter);
    
    const formattedResults = components.map(comp => ({
      id: comp.id,
      name: comp.name,
      path: comp.path,
      dependencies: comp.dependencies,
      utils: comp.utils
    }));
    
    res.json({
      success: true,
      data: formattedResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search components',
      details: error.message
    });
  }
});

// 12. List available languages for a component
app.get('/api/components/:componentId/languages', async (req, res) => {
  try {
    const { componentId } = req.params;
    const component = await getComponent(componentId);
    
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }
    
    const languages = Object.keys(component.files || {});
    
    res.json({
      success: true,
      data: {
        component: componentId,
        languages,
        filesPerLanguage: Object.keys(component.files || {}).reduce((acc, lang) => {
          acc[lang] = component.files[lang].length;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch languages',
      details: error.message
    });
  }
});

// 13. Get file tree structure
// app.get('/api/tree/:language?', async (req, res) => {
//   try {
//     const { language } = req.params;
//     const components = await getComponents();
//     const utils = await getUtils();
    
//     const tree = {
//       components: {},
//       utils: {}
//     };
    
//     // Build components tree
//     for (const component of components) {
//       tree.components[component.id] = {
//         name: component.name,
//         path: component.path,
//         files: {}
//       };
      
//       if (language) {
//         if (component.files[language]) {
//           tree.components[component.id].files[language] = component.files[language].map(f => f.filename);
//         }
//       } else {
//         for (const [lang, files] of Object.entries(component.files || {})) {
//           tree.components[component.id].files[lang] = files.map(f => f.filename);
//         }
//       }
//     }
    
//     // Build utils tree
//     for (const util of utils) {
//       tree.utils[util.id] = {
//         name: util.name,
//         path: util.path,
//         files: {}
//       };
      
//       if (language) {
//         if (util.files[language]) {
//           tree.utils[util.id].files[language] = util.files[language].map(f => f.filename);
//         }
//       } else {
//         for (const [lang, files] of Object.entries(util.files || {})) {
//           tree.utils[util.id].files[lang] = files.map(f => f.filename);
//         }
//       }
//     }
    
//     res.json({
//       success: true,
//       data: tree
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Failed to generate tree',
//       details: error.message
//     });
//   }
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
async function startServer() {
  // Connect to database first
  const dbConnected = await connectDatabase();
  
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Exiting...');
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`);
    console.log(`📊 Database: ${DATABASE_NAME}`);
    console.log(`🔗 MongoDB: ${MONGODB_URI}`);
    console.log('\n📚 Available endpoints:');
    console.log(`GET  /health - Health check`);
    console.log(`GET  /api/info - Metadata and statistics`);
    console.log(`GET  /api/components - List all components`);
    console.log(`GET  /api/components/:componentId - Get component info`);
    console.log(`GET  /api/components/:componentId/files/:language - Get component files`);
    console.log(`GET  /api/components/:componentId/files/:language/:filename - Get specific file (JSON)`);
    console.log(`GET  /api/raw/:componentId/:language/:filename - Get raw file content (GitHub style)`);
    console.log(`GET  /api/utils/:utilId/:language/:filename - Get utility file (JSON)`);
    console.log(`GET  /api/raw/utils/:utilId/:language/:filename - Get raw utility file`);
    console.log(`GET  /api/components/bulk/:language - Get all components with files`);
    console.log(`GET  /api/components/search?q=query&dependency=dep - Search components`);
    console.log(`GET  /api/components/:componentId/languages - List available languages`);
    console.log(`GET  /api/tree/:language? - Get file tree structure`);
    console.log('\n✅ Server ready!');
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
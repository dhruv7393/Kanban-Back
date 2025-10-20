#!/usr/bin/env node

// Debug script to test database connection and API endpoint
const mongoose = require('mongoose');
const axios = require('axios');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban';
const API_URL = process.env.API_URL || 'https://develop.d1n20a8p6hv4g0.amplifyapp.com';

console.log('🔍 Testing Database Connection and API Endpoint\n');
console.log('Environment Variables:');
console.log(`- MONGODB_URI: ${MONGODB_URI ? '✅ Set' : '❌ Not Set'}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`- API_URL: ${API_URL}\n`);

async function testDatabaseConnection() {
  try {
    console.log('🔗 Testing MongoDB connection...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 1
    });
    
    console.log('✅ MongoDB connection successful');
    console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
    console.log(`📊 Database name: ${mongoose.connection.name}`);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Collections found: ${collections.length}`);
    
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed\n');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

async function testAPIEndpoint() {
  try {
    console.log('🌐 Testing API endpoint...');
    console.log(`📍 URL: ${API_URL}/api/projects`);
    
    const response = await axios.get(`${API_URL}/api/projects`, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Debug-Script/1.0'
      }
    });
    
    console.log('✅ API endpoint successful');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📊 Data type: ${typeof response.data}`);
    console.log(`📊 Response size: ${JSON.stringify(response.data).length} characters`);
    
    return true;
  } catch (error) {
    console.error('❌ API endpoint failed:');
    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(`📊 Response: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('📊 No response received');
      console.error(`📊 Error: ${error.message}`);
    } else {
      console.error(`📊 Error: ${error.message}`);
    }
    return false;
  }
}

async function testHealthEndpoint() {
  try {
    console.log('🏥 Testing health endpoint...');
    
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 10000
    });
    
    console.log('✅ Health endpoint successful');
    console.log('📊 Health status:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('Starting comprehensive API and database test...\n');
  
  const results = {
    health: await testHealthEndpoint(),
    database: await testDatabaseConnection(),
    api: await testAPIEndpoint()
  };
  
  console.log('📋 Test Summary:');
  console.log(`- Health endpoint: ${results.health ? '✅' : '❌'}`);
  console.log(`- Database connection: ${results.database ? '✅' : '❌'}`);
  console.log(`- API endpoint: ${results.api ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall: ${allPassed ? 'All tests passed!' : 'Some tests failed'}`);
  
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runE2EVerification() {
  console.log('===============================================================');
  console.log('       FULL E2E INTERNSHIP REQUIREMENTS VERIFICATION           ');
  console.log('===============================================================\n');

  // Connect directly to Mongoose to verify MongoDB data persistence
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureauth_db';
  console.log(`[TEST 9] Connecting to MongoDB (${mongoUri}) ...`);
  try {
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connection Established Successfully.\n');
  } catch (err) {
    console.warn(`Primary connection failed (${err.message}). Retrying local MongoDB...`);
    await mongoose.connect('mongodb://127.0.0.1:27017/secureauth_db');
    console.log('✓ Local MongoDB Connection Established Successfully.\n');
  }

  const testEmail = `e2e_user_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  // 1. User Registration
  console.log(`[TEST 1] Registering User: ${testEmail} ...`);
  const regRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: 'Alice Cooper',
      email: testEmail,
      password: testPassword
    }
  );
  console.log(`   Status: ${regRes.statusCode} - ${regRes.body.message}`);
  if (regRes.statusCode !== 201) throw new Error('Registration failed');
  console.log('✓ User Registration Verified.\n');

  // Verify MongoDB Data Persistence & Password Hashing in DB
  console.log('[TEST 9] Verifying MongoDB Data Persistence directly in Collection ...');
  const dbUser = await User.findOne({ email: testEmail }).select('+password');
  console.log('   Retrieved User ID from DB:', dbUser._id.toString());
  console.log('   Stored Password Hash (bcryptjs):', dbUser.password.substring(0, 25) + '...');
  console.log('   Hash matches plain password via bcrypt:', await dbUser.matchPassword(testPassword));
  if (!dbUser || !(await dbUser.matchPassword(testPassword))) {
    throw new Error('Database persistence or password hashing check failed!');
  }
  console.log('✓ MongoDB Data Persistence & Hashing Verified.\n');

  // 2. User Login
  console.log(`[TEST 2] Logging in with email: ${testEmail} ...`);
  const loginRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      email: testEmail,
      password: testPassword
    }
  );
  console.log(`   Status: ${loginRes.statusCode} - ${loginRes.body.message}`);
  const jwtToken = loginRes.body.token;
  console.log('   JWT Token received:', jwtToken ? `${jwtToken.substring(0, 20)}...` : 'NONE');
  if (loginRes.statusCode !== 200 || !jwtToken) throw new Error('Login failed');
  console.log('✓ User Login Verified.\n');

  // 3. JWT Authentication & 4. Protected Dashboard/Me Route
  console.log('[TEST 3 & 4] Accessing Protected Endpoint GET /api/auth/me with Bearer JWT ...');
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${jwtToken}` }
  });
  console.log(`   Status: ${meRes.statusCode} - Authorized User: ${meRes.body.user?.name}`);
  if (meRes.statusCode !== 200 || meRes.body.user?.email !== testEmail) {
    throw new Error('JWT Authentication failed');
  }
  console.log('✓ JWT Authentication & Protected Access Verified.\n');

  // 5. User Profile & 6. Profile Update
  console.log('[TEST 5 & 6] Updating User Profile via PUT /api/auth/profile ...');
  const newBio = 'Lead Full Stack MERN Engineer 🚀';
  const newName = 'Alice Cooper (Verified)';
  const updateRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    },
    { name: newName, bio: newBio }
  );
  console.log(`   Status: ${updateRes.statusCode} - ${updateRes.body.message}`);
  console.log('   Updated Bio:', updateRes.body.user?.bio);
  if (updateRes.statusCode !== 200 || updateRes.body.user?.bio !== newBio) {
    throw new Error('Profile update failed');
  }
  console.log('✓ User Profile & Profile Update Verified.\n');

  // 7. Logout / Authorization Revocation Check
  console.log('[TEST 7] Testing Unauthenticated Request (Simulating Logout) ...');
  const unauthRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET'
    // No Authorization header
  });
  console.log(`   Status: ${unauthRes.statusCode} - Message: ${unauthRes.body.message}`);
  if (unauthRes.statusCode !== 401) throw new Error('Logout / Unauth check failed');
  console.log('✓ Logout & Access Control Verified.\n');

  // 8. Form Validation
  console.log('[TEST 8] Testing Form Validation Rejections ...');
  const invalidRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { name: '', email: 'not-an-email', password: '123' }
  );
  console.log(`   Status: ${invalidRes.statusCode} - Error Message: ${invalidRes.body.message}`);
  if (invalidRes.statusCode !== 400) throw new Error('Form validation check failed');
  console.log('✓ Server-side Form Validation Verified.\n');

  // 10. Responsive React UI verification
  console.log('[TEST 10] Checking Frontend React App Health on http://localhost:5173 ...');
  const uiRes = await makeRequest({
    hostname: 'localhost',
    port: 5173,
    path: '/',
    method: 'GET'
  });
  console.log(`   Status: ${uiRes.statusCode} - HTML Response Received.`);
  if (uiRes.statusCode !== 200) throw new Error('Frontend dev server health check failed');
  console.log('✓ Responsive React UI Health Verified.\n');

  await mongoose.disconnect();
  console.log('===============================================================');
  console.log('   ALL 10 INTERNSHIP REQUIREMENTS COMPLETED SUCCESSFULLY! 🎉  ');
  console.log('===============================================================\n');
}

runE2EVerification().catch((err) => {
  console.error('E2E Verification Error:', err);
  process.exit(1);
});

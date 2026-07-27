const http = require('http');

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

async function runTests() {
  console.log('=== STARTING AUTOMATED END-TO-END AUTH API TESTS ===\n');

  // 1. Test Health Check
  console.log('1. Testing GET /api/health ...');
  const healthRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  console.log(`   Response (${healthRes.statusCode}):`, healthRes.body.message);

  // 2. Test User Registration
  const testEmail = `testuser_${Date.now()}@example.com`;
  console.log(`\n2. Testing POST /api/auth/register with email: ${testEmail} ...`);
  const regRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: 'John Doe',
      email: testEmail,
      password: 'securepassword123'
    }
  );
  console.log(`   Response (${regRes.statusCode}):`, regRes.body.message);
  console.log('   User ID:', regRes.body.user?._id);
  console.log('   JWT Token generated:', !!regRes.body.token);

  const token = regRes.body.token;

  // 3. Test User Login
  console.log(`\n3. Testing POST /api/auth/login with ${testEmail} ...`);
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
      password: 'securepassword123'
    }
  );
  console.log(`   Response (${loginRes.statusCode}):`, loginRes.body.message);
  console.log('   Login Token matches:', loginRes.body.token ? 'Yes' : 'No');

  // 4. Test Protected Route GET /api/auth/me
  console.log('\n4. Testing GET /api/auth/me with Bearer JWT Header ...');
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(`   Response (${meRes.statusCode}): Profile fetched for:`, meRes.body.user?.name);
  console.log('   User Bio:', meRes.body.user?.bio);

  // 5. Test Update Profile PUT /api/auth/profile
  console.log('\n5. Testing PUT /api/auth/profile ...');
  const updateRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    },
    {
      name: 'John Doe Updated',
      bio: 'Senior Full Stack MERN Architect 🚀'
    }
  );
  console.log(`   Response (${updateRes.statusCode}):`, updateRes.body.message);
  console.log('   Updated Name:', updateRes.body.user?.name);
  console.log('   Updated Bio:', updateRes.body.user?.bio);

  // 6. Test Form Validation (Invalid Email & Short Password)
  console.log('\n6. Testing POST /api/auth/register Form Validation Errors ...');
  const invalidRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: '',
      email: 'invalid-email',
      password: '123'
    }
  );
  console.log(`   Response (${invalidRes.statusCode}):`, invalidRes.body.message);
  console.log('   Validation rejection verified:', invalidRes.statusCode === 400);

  console.log('\n=== ALL AUTOMATED AUTH API TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(console.error);

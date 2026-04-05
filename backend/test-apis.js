const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', e => reject(e));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

async function runTests() {
  console.log("1. Testing Health...");
  const health = await request('/api/health');
  console.log(health.body);

  console.log("\n2. Creating Organization...");
  const org = await request('/api/organizations', 'POST', {
    name: 'Xalq Banki',
    category: 'bank',
    branch: 'Chilonzor',
    address: 'Toshkent',
    phone: '+998711234567',
    services: ['Kredit', 'Karta']
  });
  console.log(org.body);
  const orgId = org.body.data ? org.body.data.id : null;

  console.log("\n3. Creating User (Client)...");
  const userPrefix = Math.floor(Math.random() * 10000);
  const user = await request('/api/auth/register', 'POST', {
    name: 'Test Mijoz',
    phone: `+99890123${userPrefix}`,
    password: 'password123',
    role: 'client'
  });
  console.log("Token received:", !!user.body.token);
  const token = user.body.token;

  if (orgId && token) {
    console.log("\n4. Booking a Queue...");
    const book = await request('/api/queues/book', 'POST', {
      organizationId: orgId,
      service: 'Kredit',
      date: new Date().toISOString().split('T')[0],
      bookedTime: '10:00 - 10:30'
    }, token);
    console.log(book.body);

    console.log("\n5. Getting Stats...");
    const stats = await request(`/api/stats/org/${orgId}`);
    console.log(stats.body);
  } else {
    console.log("orgId or token missing, skipping Queue booking.");
  }
}

runTests();

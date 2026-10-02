async function runTests() {
  console.log("--- TEST 1: Health Endpoint ---");
  const healthRes = await fetch('http://localhost:5000/api/health');
  console.log("Health status:", healthRes.status, await healthRes.text());

  console.log("\n--- TEST 2: Backend Unavailable Scenario ---");
  try {
    await fetch('http://localhost:5001/api/health'); // wrong port
  } catch (err) {
    console.log("Caught expected connection error:", err.message);
  }

  console.log("\n--- TEST 3: Unauthorized Request ---");
  const unauthRes = await fetch('http://localhost:5000/api/analyze', { method: 'POST' });
  console.log("Unauthorized status:", unauthRes.status, await unauthRes.text());

  console.log("\n--- TEST 4: Invalid Request (Bad Token) ---");
  const invalidRes = await fetch('http://localhost:5000/api/analyze', { 
    method: 'POST',
    headers: { 'Authorization': 'Bearer INVALID_TOKEN' }
  });
  console.log("Invalid status:", invalidRes.status, await invalidRes.text());
}

runTests();
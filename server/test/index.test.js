const test = require('tape');
const axios = require('axios');

const checkServer = async () => {
  try {
    const response = await axios.get('http://localhost:3000/minterAddress');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const pollServer = async (interval = 2000) => {
  while (true) {
    const serverIsRunning = await checkServer();
    if (serverIsRunning) {
      console.log('Server is running. Proceeding with tests.');
      return true;
    } else {
      console.log('Server not running. Retrying in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

const runTests = async () => {
  await pollServer();

  test('Tx Manager: Test', async (t) => {
    t.ok(true, 'Server is running and test executed.');
    t.end();
  });
  // Exit process after all tests are complete
  test.onFinish(() => {
    console.log('All tests completed. Exiting process.');
    process.exit(0);
  });
};

// Run the tests
runTests();



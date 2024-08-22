import test from 'tape';
import axios from 'axios';

const PORT = 3001
const BASE_URL = `http://localhost:${PORT}/mint`;

const validPayload = {
  evmAddress: "0xe6eB28398CCBe46aA505b62b96822c2Ce8DAABf4",
  contractAddress: "0x9f00671530137a433d5a775698094e5c68aae996",
  isERC1155: false,
  amount: 1,
  chainHandle: 'xr-sepolia'
};

const checkServer = async () => {
  try {
    const response = await axios.get(`http://localhost:${PORT}/minterAddress`);
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

const wait = (ms) => new Promise((res) => setTimeout((res), ms))

const runTests = async () => {
  await pollServer();

  test('Tx Manager: Valid ERC721 Minting', async (t) => {
    try {
      const response = await axios.post(BASE_URL, validPayload);
      t.equal(response.status, 200, 'Should return 200 status');
      t.ok(response.data.txHash, 'Should return a txHash');
    } catch (error) {
      t.fail('Failed valid ERC721 minting');
    }
    t.end();
  });

  test('Tx Manager: Bad EVM Address', async (t) => {
    const payload = { ...validPayload, evmAddress: "invalid_address" };
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail with bad evm address');
    } catch (error) {
      t.pass('Failed with bad evm address as expected');
    }
    t.end();
  });

  test('Tx Manager: No EVM Address', async (t) => {
    const { evmAddress, ...payload } = validPayload;
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail without evm address');
    } catch (error) {
      t.pass('Failed without evm address as expected');
    }
    t.end();
  });

  test('Tx Manager: Bad Contract Address', async (t) => {
    const payload = { ...validPayload, contractAddress: "invalid_address" };
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail with bad contract address');
    } catch (error) {
      t.pass('Failed with bad contract address as expected');
    }
    t.end();
  });

  test('Tx Manager: No Contract Address', async (t) => {
    const { contractAddress, ...payload } = validPayload;
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail without contract address');
    } catch (error) {
      t.pass('Failed without contract address as expected');
    }
    t.end();
  });

  test('Tx Manager: No isERC1155', async (t) => {
    const { isERC1155, ...payload } = validPayload;
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail without isERC1155');
    } catch (error) {
      t.pass('Failed without isERC1155 as expected');
    }
    t.end();
  });

  test('Tx Manager: Bad Amount', async (t) => {
    const payload = { ...validPayload, amount: -1 };
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail with bad amount');
    } catch (error) {
      t.pass('Failed with bad amount as expected');
    }
    t.end();
  });

  test('Tx Manager: No Amount', async (t) => {
    const { amount, ...payload } = validPayload;
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail without amount');
    } catch (error) {
      t.pass('Failed without amount as expected');
    }
    t.end();
  });

  test('Tx Manager: Valid ERC1155', async (t) => {
    await wait(1000)
    const payload = { ...validPayload, tokenID: 1025,contractAddress: "0x9c4ef3a17b8760169cc4e9c0f4f32f6757f87880", isERC1155: true };
    try {
      const response = await axios.post(BASE_URL, payload);
      t.equal(response.status, 200, 'Should return 200 status');
      t.ok(response.data.txHash, 'Should return a txHash');
    } catch (error) {
      t.fail('Failed with ERC1155');
    }
    t.end();
  });

  test('Tx Manager: ERC1155 with false isERC1155', async (t) => {
    const payload = { ...validPayload, contractAddress: "0x9c4ef3a17b8760169cc4e9c0f4f32f6757f87880", isERC1155: false };
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail with ERC1155 and false isERC1155');
    } catch (error) {
      t.pass('Failed with ERC1155 and false isERC1155 as expected');
    }
    t.end();
  });

  test('Tx Manager: No Chain Handle', async (t) => {
    const { chainHandle, ...payload } = validPayload;
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail without chainHandle');
    } catch (error) {
      t.pass('Failed without chainHandle as expected');
    }
    t.end();
  });

  test('Tx Manager: ERC1155 with incorrect network', async (t) => {
    const payload = { ...validPayload, contractAddress: "0x9c4ef3a17b8760169cc4e9c0f4f32f6757f87880", chainHandle: 'mainet'};
    try {
      await axios.post(BASE_URL, payload);
      t.fail('Should fail with bad network');
    } catch (error) {
      t.pass('Failed with bad network');
    }
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
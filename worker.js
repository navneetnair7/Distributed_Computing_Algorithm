const { Worker, parentPort, workerData } = require("worker_threads");
const axios = require("axios");

// Function to check status of a single port
async function checkStatus(port) {
  try {
    const response = await axios.get(`http://localhost:${port}/status`);
    return { port, status: response.data.status };
  } catch (error) {
    return { port, status: "Server down" };
  }
}

// Worker thread logic to check status of a single port
async function main() {
  const result = await checkStatus(workerData.port);
  console.log(`Port ${result.port}: ${result.status}`);
  parentPort.postMessage(result); // Send result back to main thread
}

main();

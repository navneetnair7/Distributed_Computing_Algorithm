const express = require("express");
const axios = require("axios");

const app = express();

const ports = [3001, 3002, 3003, 3004, 3005, 3006];
const working = [true, true, true, true, true, true];
const currPort = 3007;

async function getStatus() {
  try {
    const results = await Promise.all(
      ports.map(async (port, index) => {
        let left = 0;
        let right = 0;
        try {
          const response = await axios.get(`http://localhost:${port}/status`);
          console.log(`Port ${port} is up!`);
          left = response.data.left;
          right = response.data.right;
          if (!working[index]) {
            console.log(`Port ${port} is back up!`);
            await axios.get(`http://localhost:${left}/update`, {
              params: { right: port },
            });
            await axios.get(`http://localhost:${right}/update`, {
              params: { left: port },
            });
          }
          return { port, status: response.data.status };
        } catch (error) {
          working[index] = false;
          left = ports[(index - 1 + ports.length) % ports.length];
          right = ports[(index + 1) % ports.length];
          console.error(`Port ${port} is down. Connecting to the next port...`);
          working[index] = false;
          await axios.get(`http://localhost:${left}/update`, {
            params: { right: right },
          });
          await axios.get(`http://localhost:${right}/update`, {
            params: { left: left },
          });
          return { port, status: "down" };
        }
      })
    );
    console.log("Results:", results);
  } catch (error) {
    console.error("Error:", error);
  }
}

app.get("/", (req, res) => {
  res.send("Hello from " + currPort);
});

app.get("/getstatus", (req, res) => {
  getStatus();

  const intervalId = setInterval(getStatus, 2000);

  res.send("Status check initiated!");
  // setTimeout(() => clearInterval(intervalId), 10000);
});

app.listen(currPort, () => {
  console.log("Server is up and running on port " + currPort);
});

const express = require("express");
const axios = require("axios");

const app = express();

var ts = 0;

const ports = [3001, 3002, 3003, 3004, 3005, 3006];
const mainPort = 3000;
const currPort = 3005;
let leftPort = 3004;
let rightPort = 3006;

app.get("/status", (req, res) => {
  res.send({
    status: "Server" + currPort + " is up and running",
    left: leftPort,
    right: rightPort,
  });
});

app.get("/message", (req, res) => {
  ts += 1;
  const to = req.query.to;
  const message = "Hello from " + currPort;
  const rightDistance = Math.abs(to - currPort);
  const leftDistance = Math.abs(ports.length - rightDistance);

  if (leftDistance < rightDistance) {
    axios
      .get("http://localhost:" + leftPort + "/forward", {
        params: {
          message: message,
          target: to,
          path: "left",
        },
      })
      .then((response) => {
        console.log(response.data);
        res.send({
          message: "Message sent to port " + leftPort,
        });
      });
  } else {
    axios
      .get("http://localhost:" + rightPort + "/forward", {
        params: {
          message: message,
          target: to,
          path: "right",
        },
      })
      .then((response) => {
        console.log(response.data);
        res.send({
          message: "Message sent to port " + rightPort,
        });
      });
  }
});

app.get("/forward", (req, res) => {
  const message = req.query.message;
  const target = req.query.target;
  const path = req.query.path;
  console.log("Forwarded message: " + message);
  console.log("Path: " + path);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  if (target == currPort) {
    res.send({
      message: "Message received at " + currPort,
    });
  } else {
    if (path == "right") {
      console.log("Forwarding to right port");
      sleep(2000);
      axios
        .get("http://localhost:" + rightPort + "/forward", {
          params: {
            message: message,
            target: target,
            path: path,
          },
        })
        .then((response) => {
          console.log(response.data);
          res.send({
            message: "Message forwarded to port " + rightPort,
          });
        });
    } else {
      console.log("Forwarding to left port");
      sleep(2000);
      axios
        .get("http://localhost:" + leftPort + "/forward", {
          params: {
            message: message,
            target: target,
            path: path,
          },
        })
        .then((response) => {
          console.log(response.data);
          res.send({
            message: "Message forwarded to port " + leftPort,
          });
        });
    }
  }
});

app.get("/update", (req, res) => {
  const left = req.query.left || leftPort;
  const right = req.query.right || rightPort;
  console.log("Updating left and right ports...");
  leftPort = left;
  rightPort = right;
  console.log("Left port: " + leftPort);
  console.log("Right port: " + rightPort);
  res.send({
    message: "Left and right ports updated",
  });
});

app.listen(currPort, () => {
  console.log("Server started at port " + currPort);
});

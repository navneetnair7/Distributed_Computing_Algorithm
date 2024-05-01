const express = require("express");
const app = express();

// Function to perform the job
function performJob() {
  // Replace this with the job you want to perform
  console.log("Job performed at: ", new Date());
}

// Route that triggers the job every 2 seconds
app.get("/performJob", (req, res) => {
  // Perform the job immediately when the route is accessed
  performJob();

  // Set interval to perform the job every 2 seconds
  const intervalId = setInterval(performJob, 2000);

  // Send a response indicating that the job has started
  res.send("Job started!");

  // Optionally, you can stop the interval after a certain time or under certain conditions
  // For example, to stop the job after 10 seconds, you can use:
  // setTimeout(() => clearInterval(intervalId), 10000);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

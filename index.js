const http = require("http");
const app = require("./app");
const {
  scheduleRevenueCalculation,
} = require("./api/Schedules/revenueCalculation");

const port = process.env.PORT || 3002;

const server = http.createServer(app);

// scheduleRevenueCalculation();

server.listen(port, function () {
  console.log("Susila Life is running on http://localhost:" + port);
});

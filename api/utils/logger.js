const winston = require("winston");

// Define custom colors for log levels
const customColors = {
  silly: "magenta",
  debug: "blue",
  info: "green",
  warn: "yellow",
  error: "red",
};

// Apply the custom colors
winston.addColors(customColors);

// Configure the logger
const loggerMiddleware = winston.createLogger({
  level: "silly", // Set the default log level
  format: winston.format.combine(
    winston.format.colorize({ all: true }), // Colorize the log levels
    winston.format.timestamp(),
    winston.format.printf(
      ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
  levels: customColors,
  transports: [new winston.transports.Console()],
});

const logger = (req, res, next) => {
  const { method, originalUrl, headers, ip, body } = req;

  loggerMiddleware.silly(`${method} ${originalUrl}`, {
    headers,
    ip,
    body,
  });

  loggerMiddleware.debug(`${method} ${originalUrl} - Request received`, {
    headers,
    ip,
    body,
  });

  res.on("finish", () => {
    loggerMiddleware.info(
      `${method} ${originalUrl} - Response sent with status code ${res.statusCode}`,
      {
        headers,
        ip,
        body,
      }
    );
  });

  res.on("error", (err) => {
    loggerMiddleware.error(`${method} ${originalUrl} - Request failed`, {
      headers,
      ip,
      body,
      error: err, // Include the error object in the log
    });

    // Handle the error and send an appropriate response to the client
    res.status(500).send("Internal Server Error");
  });

  next();
};

module.exports = { logger };

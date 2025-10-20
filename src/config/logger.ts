import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Add CloudWatch transport if in production or AWS environment
if (process.env.NODE_ENV === "production" || process.env.AWS_REGION) {
  logger.add(
    new WinstonCloudWatch({
      logGroupName: "kanban-back",
      logStreamName: `kanban-backend-${new Date().toISOString().split("T")[0]}`,
      awsRegion: process.env.AWS_REGION || "us-east-2",
    })
  );
}

export default logger;

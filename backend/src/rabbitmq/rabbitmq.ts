import { connect } from "amqplib";
import { logger } from "../lib/logger";

const url = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";

const connection = await connect(url);

connection.on("error", (err) => {
  logger.error("rabbitmq.connection_error", {}, err);
});

export const rabbitmq = connection;

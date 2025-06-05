import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import logger from "./logger"
const db = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query"
    },
    {
      emit: "stdout",
      level: "error"
    },
    {
      emit: "stdout",
      level: "info"
    },
    {
      emit: "stdout",
      level: "warn"
    },
  ]
}).$on("query", e => {
  logger.debug("Query: %s", e.query);
  logger.debug("Params: %s", e.params);
  logger.debug("Duration: %dms", e.duration);
  logger.debug("Time: %s", e.timestamp);
}).$extends(withAccelerate());




export default db
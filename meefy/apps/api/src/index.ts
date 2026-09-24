/**
 * Server Entrypoint
 * Listens on PORT (default 4000)
 */

import { app } from "./app";
import { logger } from "./lib/logger";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`[VAMS API] Server active and listening on port ${PORT}`);
});

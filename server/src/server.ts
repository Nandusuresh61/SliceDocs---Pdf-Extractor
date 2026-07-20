import app from "./app";
import { env } from "./config/env";
import { connetDB } from "./config/database";

const startServer = async () => {
  await connetDB();
  app.listen(env.PORT, () => {
    console.log(`Server is running at port : ${env.PORT}`);
  });
};

startServer();
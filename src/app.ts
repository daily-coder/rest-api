import dotenv from "dotenv";
dotenv.config();
import connect from "./utils/connect";
import createServer from "./utils/server";

const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  connect();
});

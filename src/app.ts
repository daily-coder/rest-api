import connect from "./utils/connect";
import createServer from "./utils/server";

const app = createServer();

app.listen(3000, () => {
  console.log("listening on port 3000");
  connect();
});

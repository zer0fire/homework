const http = require("http");
const server = http.createServer();

const PORT = 3000;

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }
});

server.listen(PORT, () => {
  console.log("listening port ", PORT);
});

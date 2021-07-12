import { createServer } from "http";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "jumpdash",
  },
});

createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    const body = JSON.parse(data);

    switch ([req.method, req.url].join(" ")) {
      case "POST /dashboards":
        const { name } = body;
        const newDashboard = await db("dashboards")
          .insert({ name })
          .returning("*");
        res.end(JSON.stringify(newDashboard[0]));
        break;

      case "GET /dashboards":
        res.end(JSON.stringify(await db.select("*").from("dashboards")));
        break;

      default:
        res.statusCode = 404;
        res.end("Not Found");
    }
  });
}).listen(8000);

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
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000,
  });

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    const body = data ? JSON.parse(data) : null;

    const pattern = [req.method, req.url].join(" ");

    if (pattern === "POST /dashboards") {
      const { name = "(Untitled)" } = body;

      const newDashboard = await db("dashboards")
        .insert({ name })
        .returning("*");

      return res.end(JSON.stringify(newDashboard[0]));
    }

    if (pattern === "GET /dashboards") {
      return res.end(
        JSON.stringify(
          await db.select("*").from("dashboards").orderBy("created_at", "desc")
        )
      );
    }

    if (pattern === "GET /dashboards") {
      return res.end(JSON.stringify(await db.select("*").from("dashboards")));
    }

    // if (pattern.match(/^GET \/dashboards\/.+$/)) {
    //   return res.end(
    //     JSON.stringify([
    //       { id: 1, name: "Recodable Dashboard" },
    //       { id: 2, name: "SolidJS Dashboard" },
    //     ])
    //   );
    // }

    res.statusCode = 404;
    return res.end("Not Found");
  });
}).listen(8000);

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
  let matches;
  try {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    res.setHeader("Access-Control-Max-Age", 2592000);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const body = data ? JSON.parse(data) : null;

      const pattern = [req.method, req.url].join(" ");

      if (pattern === "POST /dashboards") {
        const { name = "(Untitled)" } = body;

        const [newDashboard] = await db("dashboards")
          .insert({ name })
          .returning("*");

        return res.end(JSON.stringify(newDashboard));
      }

      if (pattern === "GET /dashboards") {
        return res.end(
          JSON.stringify(
            await db
              .select("*")
              .from("dashboards")
              .orderBy("created_at", "desc")
          )
        );
      }

      if (pattern === "GET /dashboards") {
        return res.end(JSON.stringify(await db.select("*").from("dashboards")));
      }

      if ((matches = pattern.match(/^GET \/dashboards\/(.+)$/))) {
        return res.end(
          JSON.stringify(
            await db
              .select("*")
              .from("dashboards")
              .where({ id: matches[1] })
              .first()
          )
        );
      }

      if ((matches = pattern.match(/^PUT \/dashboards\/(.+)$/))) {
        const [updatedDashboard] = await db
          .from("dashboards")
          .where({ id: matches[1] })
          .update({
            name: body.name || "(Untitled)",
          })
          .returning("*");

        return res.end(JSON.stringify(updatedDashboard));
      }

      res.writeHead(404);
      return res.end("Not Found");
    });
  } catch (e) {
    console.error(e);

    res.writeHead(500);
    return res.end("Something very wrong happened.");
  }
}).listen(8000);

import { createServer } from "http";
import knex from "knex";
import dotenv from "dotenv";
import { join } from "path";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import body from "koa-body";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

const app = new Koa();

app.use(cors());

app.use(body());

const router = new Router();

router.get("/dashboards", async (ctx) => {
  ctx.body = await db
    .select("*")
    .from("dashboards")
    .orderBy("created_at", "desc");
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8000, () => console.log("API running on port 8000"));

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
        try {
          const dashboard = await db
            .select("*")
            .from("dashboards")
            .where({ "dashboards.id": matches[1] })
            .first();

          const dashboardBlocks = await db
            .select("*")
            .from("blocks")
            .where({ dashboard_id: dashboard.id });

          return res.end(
            JSON.stringify({ ...dashboard, blocks: dashboardBlocks })
          );
        } catch (err) {
          res.writeHead(404);
          return res.end("Not Found");
        }
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

      if ((matches = pattern.match(/^POST \/dashboards\/(.+)\/blocks/))) {
        const { type, settings } = body;
        const [newBlock] = await db
          .insert({
            type,
            settings: JSON.stringify({
              repository: { full_name: settings.repository.full_name },
            }),
            dashboard_id: matches[1],
          })
          .into("blocks")
          .returning("*");

        return res.end(JSON.stringify(newBlock));
      }

      res.writeHead(404);
      return res.end("Not Found");
    });
  } catch (e) {
    console.error(e);

    res.writeHead(500);
    return res.end("Something very wrong happened.");
  }
});

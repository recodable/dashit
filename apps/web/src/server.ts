import knex from "knex";
import dotenv from "dotenv";
import { join } from "path";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import body from "koa-body";
import jwt from "koa-jwt";
import jwks from "jwks-rsa";

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

const dashboardRouter = new Router();

dashboardRouter.use(
  jwt({
    secret: jwks.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.VITE_AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.VITE_API_URL,
    issuer: `https://${process.env.VITE_AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
  })
);

// dashboardRouter.use(async (ctx, next) => {
//   await next();

//   if (
//     ctx.request.method !== "GET" &&
//     ctx.body?.owner_id !== ctx.state.user.sub
//   ) {
//     ctx.status = 401;
//     ctx.body = "Unauthorized";
//   }
// });

dashboardRouter.get("/dashboards", async (ctx) => {
  ctx.body = await db
    .select("*")
    .from("dashboards")
    .where({ owner_id: ctx.state.user.sub })
    .orderBy("created_at", "desc");
});

dashboardRouter.post("/dashboards", async (ctx) => {
  const { name = "(Untitled)" } = JSON.parse(ctx.request.body);

  const [newDashboard] = await db("dashboards")
    .insert({ name, owner_id: ctx.state.user.sub })
    .returning("*");

  ctx.body = newDashboard;
});

const fetchDashboard = async (ctx, next) => {
  ctx.state.dashboard = await db
    .select("*")
    .from("dashboards")
    .where({ "dashboards.id": ctx.params.id })
    .first();

  await next();
};

const checkDashboardOwnership = async (ctx, next) => {
  if (ctx.state.dashboard.owner_id !== ctx.state.user.sub) {
    ctx.status = 401;
    ctx.body = "Unauthorized";
  } else {
    await next();
  }
};

dashboardRouter.put(
  "/dashboards/:id",
  fetchDashboard,
  checkDashboardOwnership,
  async (ctx) => {
    const [updatedDashboard] = await db
      .from("dashboards")
      .where({ id: ctx.params.id })
      .update({
        name: JSON.parse(ctx.request.body).name || "(Untitled)",
      })
      .returning("*");

    ctx.body = updatedDashboard;
  }
);

dashboardRouter.post(
  "/dashboards/:id/blocks",
  fetchDashboard,
  checkDashboardOwnership,
  async (ctx) => {
    const { type, settings } = JSON.parse(ctx.request.body);

    const [newBlock] = await db
      .insert({
        type,
        settings: JSON.stringify({
          repository: { full_name: settings.repository.full_name },
        }),
        dashboard_id: ctx.params.id,
      })
      .into("blocks")
      .returning("*");

    ctx.body = newBlock;
  }
);

app.use(dashboardRouter.routes()).use(dashboardRouter.allowedMethods());

const publicRouter = new Router();

publicRouter.get("/dashboards/:id", fetchDashboard, async (ctx) => {
  try {
    const { dashboard } = ctx.state;

    const dashboardBlocks = await db
      .select("*")
      .from("blocks")
      .where({ dashboard_id: dashboard.id });

    ctx.body = { ...dashboard, blocks: dashboardBlocks };
  } catch (err) {
    console.error(err);
    ctx.status = 404;
    ctx.body = "Not Found";
  }
});

app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

app.listen(8000, () => {
  console.log("API running on port 8000");
});

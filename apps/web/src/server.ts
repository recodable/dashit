import knex from "knex";
import dotenv from "dotenv";
import { join } from "path";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import body from "koa-body";
import jwt, { Options as JWTOptions } from "koa-jwt";
import jwks from "jwks-rsa";
import fetch from "node-fetch";
import { encode } from "querystring";

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

const createJWTMiddleware = (options: Partial<JWTOptions> = {}) => {
  return jwt({
    secret: jwks.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.VITE_AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.VITE_API_URL,
    issuer: `https://${process.env.VITE_AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
    ...options,
  });
};

const dashboardRouter = new Router();

dashboardRouter.use(createJWTMiddleware());

dashboardRouter.get("/dashboards", async (ctx) => {
  ctx.body = await db
    .select("*")
    .from("dashboards")
    .where({ owner_id: ctx.state.user.sub })
    .orderBy("created_at", "desc");
});

dashboardRouter.post("/dashboards", async (ctx) => {
  const { name = "(Untitled)" } = ctx.request.body;

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
        name: ctx.request.body.name || "(Untitled)",
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
    const { type, settings } = ctx.request.body;

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

const accessRouter = new Router();

accessRouter.get("/accesses", createJWTMiddleware(), async (ctx) => {
  ctx.body = await db
    .select("*")
    .from("accesses")
    .where({ user_id: ctx.state.user.sub });
});

app.use(accessRouter.routes()).use(accessRouter.allowedMethods());

const oauthRouter = new Router();

oauthRouter.use(
  createJWTMiddleware({
    getToken: (ctx) => {
      return ctx.request.query.state as string;
    },
  })
);

oauthRouter.get("/auth/github", async (ctx) => {
  ctx.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${ctx.request.query.state}`
  );
});

const fetchAccess = (type: string) => {
  return async (ctx, next) => {
    ctx.state.access = await db
      .select("*")
      .from("accesses")
      .where({ user_id: ctx.state.user.sub, type })
      .first();

    console.log(ctx.state.access);

    await next();
  };
};

oauthRouter.get("/auth/github/callback", fetchAccess("github"), async (ctx) => {
  const { code } = ctx.request.query;

  const { access_token: token } = await fetch(
    [
      "https://github.com/login/oauth/access_token",
      encode({
        code,
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      }),
    ].join("?"),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ).then((response) => response.json());

  const { access } = ctx.state;

  if (!access) {
    await db("accesses").insert({
      token,
      user_id: ctx.state.user.sub,
      type: "github",
    });
  }

  // TODO: redirect to dashboard add page
  ctx.redirect(process.env.WEB_URL);
});

app.use(oauthRouter.routes()).use(oauthRouter.allowedMethods());

app.listen(8000, () => {
  console.log("API running on port 8000");
});

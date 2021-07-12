import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable("blocks", (table) => {
    table.increments("id").primary();
    table.foreign("dashboard_id").references("dashboards.id");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}

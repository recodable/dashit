import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("blocks", (table) => {
    table.increments("id").primary();
    table.string("type").notNullable();
    table.jsonb("settings").defaultTo(JSON.stringify({})).notNullable();

    table.integer("dashboard_id").notNullable();
    table
      .foreign("dashboard_id")
      .references("dashboards.id")
      .onDelete("CASCADE");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("blocks");
}

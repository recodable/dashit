import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("dashboards", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    // table.string("description").nullable();
    // table.string("owner_id").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("dashboards");
}

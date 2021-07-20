import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("accesses", (table: any) => {
    table.increments("id").primary();
    table.string("token").notNullable();
    table.string("user_id").notNullable();
    table.string("type").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("accesses");
}

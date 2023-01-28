import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("comments", function (table) {
    table.increments("id");
    table.integer("user_id", 11).notNullable();
    table.integer("task_id", 11).notNullable();
    table.string("message").notNullable();
    table.enum("status", ["active", "draft", "block"]).defaultTo("active");
    table.datetime("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("comments");
}

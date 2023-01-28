import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tasks", function (table) {
    table.increments("id");
    table.string("title").notNullable();
    table.string("body").nullable();
    table.integer("author_id").notNullable();
    table
      .enum("priority", ["highest", "high", "medium", "low", "lowest"])
      .defaultTo("medium");

    table.enum("status", ["active", "completed"]).defaultTo("active");
    table.datetime("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tasks");
}

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("avatar").nullable().defaultTo("https://avatar");
    table.enum("gender", ["male", "female", "other"]).defaultTo("male");
    table.enum("status", ["active", "passive", "block"]).defaultTo("active");
    table.datetime("date_of_birth").nullable();
    table.datetime("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}

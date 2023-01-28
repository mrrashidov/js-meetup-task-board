import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await Promise.all([
    knex("comments").del(),
    knex("comments").insert([
      {
        user_id: 1,
        task_id: 1,
        message: "Test Message",
      },
      {
        user_id: 2,
        task_id: 1,
        message: "Test Message 2",
      },
      {
        user_id: 1,
        task_id: 1,
        message: "Test Message 3",
      },
      {
        user_id: 2,
        task_id: 4,
        message: "Test Message 4",
      },
      {
        user_id: 2,
        task_id: 2,
        message: "Test Message 5",
      },
    ]),
  ]);
}

import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await Promise.all([
    knex("tasks").del(),
    knex("tasks").insert([
      {
        author_id: 1,
        title: "Slidelarni qayta korib chiq",
        body: "Slidelarni qayta korib chiq",
        status: "completed",
        priority: "highest",
      },
      {
        author_id: 1,
        title: "Meetupga vaqtli kel",
        body: "Meetupga vaqtli kel",
        status: "completed",
        priority: "high",
      },
      {
        author_id: 1,
        title: "Meetupdagi topicni sodda tushuntir",
        body: "Meetupdagi topicni sodda tushuntir",
        status: "active",
        priority: "medium",
      },
      {
        author_id: 1,
        title: "Savollarga toliq javob ber",
        body: "Savollarga toliq javob ber",
        status: "active",
        priority: "highest",
      },
      {
        author_id: 1,
        title: "Hamkasblar bilan tushlik",
        body: "Hamkasblar bilan tushlik",
        status: "active",
        priority: "low",
      },
      {
        author_id: 1,
        title: "Coding review qilish",
        body: "Coding review qilish",
        status: "active",
        priority: "lowest",
      },
      {
        author_id: 2,
        title: "First task",
        body: "First task body here",
        status: "active",
      },
      {
        author_id: 2,
        title: "Test Demo task",
        body: "Test Demo task body here",
        status: "active",
      },
    ]),
  ]);
}

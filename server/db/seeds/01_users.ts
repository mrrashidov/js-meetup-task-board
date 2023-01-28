import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await Promise.all([
    knex("users").del(),
    knex("users").insert([
      {
        username: "mrrashidov",
        email: "mrrashidov@hotmail.com",
        password: "password",
        first_name: "Shoxrux",
        last_name: "Rashidov",
        avatar:
          "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/17/175a457b49acf547f64af2b5d34594720a64bdfd_full.jpg",
        date_of_birth: "1999-12-12",
        gender: "male",
        status: "active",
      },
      {
        username: "john",
        email: "john@yopmail.com",
        password: "password",
        first_name: "John",
        last_name: "Doe",
        avatar:
          "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/d1/d13f17a2d05e7458a6535db1996771fab01481da_full.jpg",
        date_of_birth: "2023-12-12",
        gender: "male",
        status: "active",
      },
    ]),
  ]);
}

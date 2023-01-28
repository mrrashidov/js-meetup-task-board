import { Knex } from "knex";
import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { dateScalar } from "./scalars";
import crypto from "node:crypto";
const pubsub = new PubSub();

export const resolvers = {
  Date: dateScalar,
  Task: {
    id(obj: any, args: any, contextValue: any) {
      return obj.id;
    },
    title(obj: any, args: any, contextValue: any) {
      return obj.title;
    },
    body(obj: any, args: any, contextValue: any) {
      return obj.body;
    },
    status(obj: any, args: any, contextValue: any) {
      return obj.status;
    },
    author(obj: any, args: any, { db }: any) {
      const knex: Knex = db;
      return knex("users").where({ id: obj.author_id }).first();
    },
  },
  Author: {
    name(obj: any, args: any, contextValue: any) {
      return `${obj.first_name} ${obj.last_name}`;
    },
    tasks(obj: any, args: any, { db }: any) {
      const knex: Knex = db;
      return knex("tasks").where({ author_id: obj.id });
    },
  },
  SearchResult: {
    __resolveType(obj: any) {
      // Only Book has a title field
      if (obj.title) {
        return "Task";
      }
      // Only Author has a name field
      if (obj.username) {
        return "Author";
      }
      return null;
    },
  },
  TaskStatus: {
    ALL: "all",
    ACTIVE: "active",
    COMPLETED: "completed",
  },
  TaskPriority: {
    HIGHEST: "HIGHEST".toLowerCase(),
    HIGH: "HIGH".toLowerCase(),
    MEDIUM: "MEDIUM".toLowerCase(),
    LOW: "LOW".toLowerCase(),
    LOWEST: "LOWEST".toLowerCase(),
  },
  Query: {
    task: (parent: any, { id }: any, { db, user }: any, info: any) => {
      if (id <= 0) {
        throw new GraphQLError("Invalid argument value", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const knex: Knex = db;
      return knex("tasks")
        .where({ author_id: user.id, id })
        .first()
        .orderBy("id");
    },
    tasks: (parent: any, args: any, { db, user }: any, info: any) => {
      const knex: Knex = db;
      return knex("tasks").where({ author_id: user.id }).orderBy("id");
    },
    author: (parent: any, { id }: any, { db }: any, info: any) => {
      if (id <= 0) {
        throw new GraphQLError("Invalid argument value", {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "id",
          },
        });
      }

      const knex: Knex = db;
      return knex("users").where({ id }).first();
    },
    authors: (parent: any, args: any, { db, user }: any, info: any) => {
      const knex: Knex = db;
      return knex("users");
    },
    search: async (
      parent: any,
      { contains }: any,
      { db, user }: any,
      info: any
    ) => {
      const knex: Knex = db;
      const q = contains.trim();
      const tasks = await knex("tasks")
        .whereILike("title", `%${q}%`)
        .orWhereILike("body", `%${q}%`)
        .first();

      const users = await knex("users")
        .whereILike("username", `%${q}%`)
        .orWhereILike("first_name", `%${q}%`)
        .orWhereILike("last_name", `%${q}%`)
        .first();

      const result = { ...tasks, ...users };

      return result;

      // if (contextValue.authScope !== "ADMIN") {
      //   throw new GraphQLError("not admin!", {
      //     extensions: { code: "UNAUTHENTICATED" },
      //   });
      // }
    },
  },
  Mutation: {
    createUser(parent: any, { content }: any, { db }: any) {
      content["username"] = crypto.randomBytes(16).toString("hex");

      const knex: Knex = db;
      return knex("users")
        .insert(content)
        .returning("*")
        .then((res) => {
          pubsub.publish("USER_CREATED", {
            userCreated: res[0],
          });
          return res[0];
        });
    },
    createTask(parent: any, { content }: any, { db, user }: any) {
      const knex: Knex = db;
      content["author_id"] = user.id;

      return knex("tasks")
        .insert(content)
        .returning("*")
        .then((res) => {
          pubsub.publish("TASK_CREATED", { taskCreated: res[0] });
          return res[0];
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    updateTask(parent: any, args: any, { db, user }: any) {
      const { id, content } = args;
      const knex: Knex = db;
      return knex("tasks")
        .where({ id: parseInt(id), author_id: user.id })
        .update({
          status: content.status,
        })
        .returning("*")
        .then((res) => {
          pubsub.publish("TASK_UPDATED", { taskUpdated: res[0] });
          return res[0];
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    deleteTask(parent: any, { id }: any, { db }: any) {
      const knex: Knex = db;
      return knex("tasks")
        .where({ id })
        .del()
        .returning("*")
        .then((res) => {
          pubsub.publish("TASK_DELETED", { taskDeleted: res[0] });
          return res[0];
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(["USER_CREATED"]),
    },
    taskCreated: {
      subscribe: () => pubsub.asyncIterator(["TASK_CREATED"]),
    },
    taskUpdated: {
      subscribe: () => pubsub.asyncIterator(["TASK_UPDATED"]),
    },
    taskDeleted: {
      subscribe: () => pubsub.asyncIterator(["TASK_DELETED"]),
    },
  },
};

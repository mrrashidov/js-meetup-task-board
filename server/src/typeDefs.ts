export const typeDefs = `#graphql

scalar Date

interface MutationResponse {
  code: String!
  success: Boolean!
  message: String!
}

enum TaskStatus {
  ALL
  ACTIVE
  COMPLETED
}

enum TaskPriority {
  HIGHEST
  HIGH
  MEDIUM
  LOW
  LOWEST
}

input UserContent {
  email: String!
  password: String!
  first_name: String
  last_name: String
}

input CreateTaskContent {
  title: String!
  body: String
  priority: TaskPriority
}

input UpdateTaskContent {
  title: String
  body: String
  status: TaskStatus
  priority: TaskPriority
}

type Task {
  id: ID!
  title: String
  body: String
  status: TaskStatus
  author: Author
  created_at: Date
}

type Author {
  name: String!
  tasks: [Task]
}

union SearchResult = Author | Task


type Query {
  task(id:ID!): Task
  tasks: [Task]
  author(id:ID!): Author
  authors: [Author]
  search(contains: String): SearchResult
}

type Mutation {
  createUser(content: UserContent!): Author
  createTask(content: CreateTaskContent!): Task
  updateTask(id: ID!, content: UpdateTaskContent!): Task
  deleteTask(id: ID!): Task
}

type Subscription {
  userCreated: Author
  taskCreated: Task
  taskUpdated: Task
  taskDeleted: Task
}
`;

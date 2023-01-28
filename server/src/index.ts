import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import knex, { Knex } from "knex";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { dateScalar } from "./scalars";
import {
  restDirectiveTransformer,
  restDirectiveTypeDefs,
  upperDirectiveTransformer,
  upperDirectiveTypeDefs,
} from "./directives";
function tokenIsNotValid(a: any) {
  return false;
}

function getScope(a: any) {}
// Hand in the schema we just created and have the
// WebSocketServer start listening.
async function startServer() {
  //ApolloServerPluginLandingPageGraphQLPlayground

  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  let schema = makeExecutableSchema({
    typeDefs: [restDirectiveTypeDefs, upperDirectiveTypeDefs, typeDefs],
    resolvers: [resolvers, { Date: dateScalar }],
  });

  schema = restDirectiveTransformer(schema);
  schema = upperDirectiveTransformer(schema);

  //let subgraphSchema = buildSubgraphSchema({ typeDefs, resolvers });

  //subgraphSchema = upperDirectiveTransformer(subgraphSchema, 'upper');
  interface MyContext {
    token?: String;
    // for your contextValue
    authScope?: String;
  }

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });
  const serverCleanup = useServer(
    {
      schema,
      // As before, ctx is the graphql-ws Context where connectionParams live.
      onConnect: async (ctx) => {
        // Check authentication every time a client connects.
        if (tokenIsNotValid(ctx.connectionParams)) {
          // You can return false to close the connection  or throw an explicit error
          throw new Error("Auth token missing!");
        }
      },
      onDisconnect(ctx, code, reason) {
        console.log("Disconnected!");
      },
    },
    wsServer
  );

  // Set up ApolloServer.
  const server = new ApolloServer<MyContext>({
    schema,
    formatError: (formattedError: any, error: any) => {
      // Return a different error message

      if (formattedError.message.startsWith("Database Error: ")) {
        return { message: "Internal server error" };
      }

      if (
        formattedError.extensions.code ===
        ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      ) {
        return {
          ...formattedError,
          message:
            "Your query doesn't match the schema. Try double-checking it!",
        };
      }

      // Otherwise return the formatted error. This error can also
      // be manipulated in other ways, as long as it's returned.
      return formattedError;
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      //@ts-ignore
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: "my-graph-id@my-graph-variant",
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ApolloServerPluginLandingPageDisabled(),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        /*
          
          const user = await getUserFromReq(req);
    if (!user) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        }
      });
    }
  
     If the below throws a non-GraphQLError, the server returns
     `code: "INTERNAL_SERVER_ERROR"` with an HTTP status code 500, and
     a message starting with "Context creation failed: ".
    const db = await getDatabaseConnection();
  
    return { user, db };*/
        token: req.headers.token,
        authScope: getScope(req.headers.authorization),
        user: {
          id: 1,
        },
        db: knex({
          client: "postgresql",
          connection: {
            database: "task_board",
            user: "postgres",
            password: "postgres",
          },
          pool: {
            min: 2,
            max: 10,
          },
        }),
      }),
    })
  );
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
}

startServer().then(() => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});

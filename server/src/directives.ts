import { GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

function restDirective(directiveName: string) {
  return {
    restDirectiveTypeDefs: `directive @${directiveName}(url: String) on FIELD_DEFINITION`,
    restDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
          const restDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];
          if (restDirective) {
            const { url } = restDirective;
            fieldConfig.resolve = () => fetch(url);
            return fieldConfig;
          }
        },
      }),
  };
}

function upperDirective(directiveName: string) {
  return {
    upperDirectiveTypeDefs: `directive @${directiveName}(url: String) on FIELD_DEFINITION`,
    upperDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
          const upperDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];
          if (upperDirective) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            return {
              ...fieldConfig,
              resolve: async function (source, args, context, info) {
                const result = await resolve(source, args, context, info);
                if (typeof result === "string") {
                  return result.toUpperCase();
                }
                return result;
              },
            };
          }
        },
      }),
  };
}

function fetch(url: string) {}

export const { restDirectiveTypeDefs, restDirectiveTransformer } =
  restDirective("rest");

export const { upperDirectiveTypeDefs, upperDirectiveTransformer } =
  upperDirective("upper");

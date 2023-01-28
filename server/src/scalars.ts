import { GraphQLScalarType, Kind } from "graphql";

export const dateScalar = new GraphQLScalarType<any | undefined>({
  name: "Date",
  description: "Date custom scalar type",
  //@ts-ignore
  serialize(value: Date): any {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  //@ts-ignore
  parseValue(value: number) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

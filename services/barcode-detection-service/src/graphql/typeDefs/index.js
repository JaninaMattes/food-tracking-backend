import { gql } from "apollo-server";

const mTypeDefs = gql`
  extend type Mutation {
    """
    Accepts a username and password to authenticate
    a user and returns a JWT Token.
    """
    login(username: String!, password: String!): String
    signup(username: String!, password: String!): String
  }
`;

export default mTypeDefs;

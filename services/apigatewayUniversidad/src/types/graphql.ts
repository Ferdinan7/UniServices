export interface GraphQLContext {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
  request: any;
  response: any;
}

export interface GraphQLResolver {
  Query?: any;
  Mutation?: any;
  Subscription?: any;
}


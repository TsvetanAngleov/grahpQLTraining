const graphql = require("graphql");
const _ = require("lodash");
const axios = require ('axios');

const users = [
  { id: "0", firstName: "Bill", age: 20 },
  { id: "1", firstName: "Samantha", age: 21 },
];

const { GraphQLObjectType,
        GraphQLString,
        GraphQLInt,
        GraphQLSchema,
        GraphQLList,
        GraphQLNonNull
      } = graphql;

const CompanyType = new GraphQLObjectType({
        name: "Company",
        fields:() => ({
          id: { type: GraphQLString },
          name: {type: GraphQLString},
          description: { type: GraphQLString},
          users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
              return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
              .then(response => {
                return response.data;
              })
              .catch(function (error) {
                   console.log(error);
                 });
            }
          }

        }),
      });

const UserType = new GraphQLObjectType({
  name: "User",
  fields:() => ({
    id: { type: GraphQLString },
    firstName: {type: GraphQLString},
    age: { type: GraphQLInt},
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
     // console.log(parentValue,' args ',args);
      return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
      .then(response => {
        return response.data;
        })
      .catch(function (error) {
           console.log(error);
         });
      }

    },

  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
        resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(response => {
            return response.data;
          })
          .catch(function (error) {
               console.log(error);
             });
        }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
        resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(response => response.data)
          .catch(function (error) {
               console.log(error);
             });
        }
    }
  }
});
///--------Mutations-----
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString},
        firstName: {type: GraphQLNonNull(GraphQLString)},
        age: { type: GraphQLNonNull(GraphQLInt)},
        companyId: { type: GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args) {
          return   axios
          .post(`http://localhost:3000/users/`, args)
          .then(response => response.data)
          .catch(function (error) {
               console.log(error);
             });
        }
    },

    addCompany: {
      type: CompanyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: { type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, args) {
          return   axios
          .post(`http://localhost:3000/companies/`, args)
          .then(response => response.data)
          .catch(function (error) {
               console.log(error);
             });
        }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, args) {
          return   axios
          .delete(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data)
          .catch(function (error) {
               console.log(error);
             });
        }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString)},
        firstName: {type: GraphQLString},
        age: { type: GraphQLInt},
        companyId: { type: GraphQLString}
      },
      resolve(parentValue, args) {
          return   axios
          .patch(`http://localhost:3000/users/${args.id}`,Object.fromEntries(Object.entries(args).filter(arg=>arg!==null)))
          .then(response => {
            console.log(response.data);
            return response.data})
          .catch(function (error) {
               console.log(error);
             });
        }
    },
  }
}
)

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

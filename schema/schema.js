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
          discription: { type: GraphQLString},
          users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
              return axios.get(`https://graphql-10199.firebaseio.com/users/.json`)
              .then(response => {
                //console.log(Object.keys(response.data));
                //console.log([...response.data]);
                const userKeys=Object.keys(response.data).filter(userKey => {
                  //console.log('user : ',userKey);
                  //console.log('parentValue : ',parentValue);
                  //console.log('response.data[userKey].companyId: ',response.data[userKey].companyId);
                  return response.data[userKey].companyId===String(parentValue.id)
                });
                return userKeys.map(key=>response.data[key])
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
      return axios.get(`https://graphql-10199.firebaseio.com/companies/.json`)
      .then(response => {
        console.log('response data ',response.data);
        console.log(parentValue);
        const companyKeys=Object.keys(response.data).filter(Key => {

          return response.data[Key].id===String(parentValue.companyId)
        });
        return companyKeys.map(key=>response.data[key])
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
          return axios.get(`https://graphql-10199.firebaseio.com/users/.json`)
          .then(response => {
            return axios.get(`https://graphql-10199.firebaseio.com/users/.json`)
            .then(response => {
              //console.log(Object.keys(response.data));
              //console.log([...response.data]);
              const userKeys=Object.keys(response.data).filter(userKey => {
                //console.log('user : ',userKey);
                //console.log('parentValue : ',parentValue);
                //console.log('response.data[userKey].companyId: ',response.data[userKey].companyId);
                return response.data[userKey].id===String(args.id)
              });
              return userKeys.map(key=>response.data[key])
            })
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
          return axios.get(`https://graphql-10199.firebaseio.com/companies/.json`)
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
        id: { type: new GraphQLNonNull(GraphQLString)},
        firstName: {type: GraphQLNonNull(GraphQLString)},
        age: { type: GraphQLNonNull(GraphQLInt)},
        companyId: { type: GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args) {
          return   axios
          .post(`https://graphql-10199.firebaseio.com/users/.json`, args)
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
        name: {type: GraphQLNonNull(GraphQLString)},
        description: { type: GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, args) {
          return   axios
          .post(`https://graphql-10199.firebaseio.com/companies.json`, args)
          .then(response => response.data)
          .catch(function (error) {
               console.log(error);
             });
        }
    }
  }
}
)

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

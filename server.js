const express = require('express');
const expressGraphQL = require('express-graphql')
const { graphqlHTTP } = require('express-graphql')
const { graphql } = require('graphql');
const schema = require('./schema/schema');
const axios = require ('axios');

const app = express();

app.use('/graphql',graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000,() =>{
console.log('Listening');
// axios.post('https://graphql-10199.firebaseio.com/users.json',[
//      {"id":1,"firstName": "Bill","age":20,companyId: "0"},
//      {"id":0,"firstName": "Samantha","age":21, companyId: "1"},
//      {"id":2,"firstName": "Alex","age":40, companyId: "1"}
//   ])
// .then(function (response) {
//   console.log(response);
// })
// .catch(function (error) {
//   console.log(error);
// });

// axios.post('https://graphql-10199.firebaseio.com/companies.json',[
//      {"id":0,"name": "Apple","discription":"iphone",},
//      {"id":1,"name": "Google","discription":"search",},
//   ])
// .then(function (response) {
//   console.log(response);
// })
// .catch(function (error) {
//   console.log(error);
//  });

});
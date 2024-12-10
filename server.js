const cors = require('cors');
require('dotenv').config(); 
const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");

// const {ruruHTML} = require('ruru/server');

const app = express();
const port = process.env.PORT || 3000;
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    type Query {
        hello: String,
        user:[User],
        post:[Post]
    },
    type User {
        name: String,
        age: Int,
        phone: String,
        address: String,
    },

    type Post {
        userId: Int,
        id: Int,
        title: String,
        body: String,
    },
    
`);
// The root provides a resolver function for each API endpoint
const root = {
  hello() {
    return "Hello World";
  },
  user() {
    return [
      {
        name: "Sumit",
        age: 21,
        phone: "9999999999",
        address: "Assam, India",
      },
      {
        name: "joy",
        age: 20,
        phone: "9090909090",
        address: "Maharastra, India",
      },
    ];
  },

  async post() {
    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if(!response.ok) throw error(`HTTP Error Status: ${response.status}`);
        const content = await response.json();
        return content;
    } catch(error) {
        console.log(`Error while fetching posts`)
        return [];
    }
  }

};

// app.get("/" , (_req , res) => {
//     res.type("html")
//     res.end(ruruHTML({
//         endpoint: "/graphql"
//     }))
// })

//middlewares
app.use(cors());

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.listen(port, () => {
  console.log(`server running on: http://localhost:${port}/graphql`);
});

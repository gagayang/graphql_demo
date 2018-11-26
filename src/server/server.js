var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var path = require('path')
var spawn = require('child_process').spawn

/**
 * first

var schema = buildSchema(`
    type Query {
        hello: String
    }
`)

var root = {
    hello: () => 'hello word'
}
 * */
/**
 * second
 *
var schema = buildSchema(`
    type Query {
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
    }
`)
var root = {
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'take it easy' : 'salvation lies within'
    },
    random: () => {
        return Math.random()
    },
    rollThreeDice: () => {
        return [1,2,3].map(_ => {
            1 + Math.floor(Math.random() * 6)
        })
    }
}
 */

/**
 * third

var schema = buildSchema(`
  type Query {
    rollDice(numDice: Int, numSides: Int): [Int]
  }
`);
var root = {
    rollDice: function ({numDice = 3, numSides}) {
        var output = [];
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    }
};
 */
/**
 * fourth

var schema = buildSchema(`
    type RandomDie {
        numberSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }
    type Query {
        getDie(numSides: Int): RandomDie
    }
`)
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides
    }
    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides)
    }
    roll({numRolls}) {
        var output = []
        for(var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce())
        }
        return output
    }
}
var root = {
    getDie: function({numSideds}) {
        return new RandomDie(numSideds || 6)
    }
}
 * */

/**
 * 新增/更新记录
 *

class Message{
    constructor(id, {content, author}) {
        this.id = id
        this.content = content
        this.author = author
    }
}
var fakeDataBase = {}
var root = {
    getMessage: function({id}) {
        if(!fakeDataBase[id]) {
            throw new Error('no message exist with id ' + id)
        }
        return new Message(id, fakeDataBase[id])
    },
    createMessage: ({input}) => {
      var id = require('crypto').randomBytes(10).toString('hex')
      fakeDataBase[id] = input
      return new Message(id, input)
    },
    updateMessage: ({id, input}) => {
        if(!fakeDataBase[id]) {
            throw new Error('no message exist with id' + id)
        }
        fakeDataBase[id] = input
        return new Message(id, input)
    },
    deleteMessage: ({id}) => {
        if(!fakeDataBase[id]) {
            throw new Error('no message exist with id ' + id)
        }
        var message = new Message(id, fakeDataBase[id])
        fakeDataBase[id] = null
        return message
    }
}
var schema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }
    type Message {
        id: ID!
        content: String
        author: String
    }
    type Query {
        getMessage(id: ID!): Message
    }
    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
        deleteMessage(id: ID!): Message
        getMessage(id: ID): Message
    }
`)
 */
/***
 *
 * 使用sqlite3l实验
 */
var message = require( '../bean/message')
var db = require( '../database/DB')
var service = require( '../service/service')

const dateBase = new db()


var schema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }
    type Message {
        id: ID!
        content: String
        author: String
    }
    type Query {
        getMessage(id: ID!): Message
    }
    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
        deleteMessage(id: ID!): Message
        getMessage(id: ID): Message
    }
`)
const root = new service(dateBase)

var app = express()
app.use('/', express.static(path.join(__dirname, '../static')));
app.get('/', function (req, res) {
    res.send()
    res.end()
})
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, () => console.log('now browse to localhost:4000/grapql'))

process.on('exit', function() {
    var command = 'rm -rf ./buildTest.db'
    var cmd = spawn('/bin/sh', ['-c', command], { stdio: 'inherit' })
    cmd.stdout.on('data', function (data) {
        process.stdout.write(data)
    })
});
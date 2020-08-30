import env from 'dotenv'
env.config()
import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import mikroORMConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'

async function main() {
  const orm = await MikroORM.init(mikroORMConfig)
  await orm.getMigrator().up()

  const app = express()
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        UserResolver
      ],
      validate: false,
    }),
    context: () => ({ em: orm.em })
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server up and listen port 4000')
  })
}

main().catch((error) => {
  console.error(error)
})

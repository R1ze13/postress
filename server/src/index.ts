import env from 'dotenv'
env.config()
import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import mikroORMConfig from './mikro-orm.config'
import express, { Response, Request } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import helmet from 'helmet'
import cors from 'cors'

import { IResolverContext, ISession } from './types'

async function main() {
  const orm = await MikroORM.init(mikroORMConfig)
  await orm.getMigrator().up()

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true
    })
  )

  if (__prod__) {
    app.use(helmet())
  }

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__
      },
      saveUninitialized: false,
      secret: 'adfalksdjfwoiruqweoriuvxmxcvzxpcoviqwe',
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: (param: {
      req: Request & { session: ISession & Express.Session }
      res: Response
    }): IResolverContext => ({ em: orm.em, req: param.req, res: param.res })
  })

  apolloServer.applyMiddleware({
    app,
    cors: false
  })

  app.listen(4000, () => {
    console.log('server up and listen port 4000')
  })
}

main().catch((error) => {
  console.error(error)
})

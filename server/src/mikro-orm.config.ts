import { Post } from './entities/Post'
import { __prod__ } from './constants'
import { MikroORM } from '@mikro-orm/core'
import path from 'path'

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/
  },
  entities: [Post],
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  type: process.env.DB_TYPE,
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0]
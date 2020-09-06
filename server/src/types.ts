import { IDatabaseDriver, Connection, EntityManager } from '@mikro-orm/core'
import { Request, Response } from 'express'

export interface ISession {
  userId?: number
}

export interface IResolverContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
  req: Request & { session: ISession & Express.Session }
  res: Response
}

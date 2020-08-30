import { IDatabaseDriver, Connection, EntityManager } from '@mikro-orm/core'

export interface IResolverContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}

import { SSRExchange } from 'next-urql'
import { dedupExchange, fetchExchange } from 'urql'
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation
} from '../generated/graphql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { updateQuery } from './updateQuery'
import { isServer } from './isServer'

export const createUqrlClient = (ssrExchange: SSRExchange, ctx: any) => {
  const cookie = isServer() ? ctx.req.headers.cookie : ''

  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie ? {
        cookie
      } : undefined
    },
    exchanges: [
      dedupExchange,
      // TODO разобраться с типизацией
      cacheExchange({
        updates: {
          // TODO вероятно это надо делать немного иначе
          Mutation: {
            login: (_result, args, cache, info) => {
              updateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query
                  } else {
                    return {
                      me: result.login.user
                    }
                  }
                }
              )
            },
            register: (_result, args, cache, info) => {
              updateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query
                  } else {
                    return {
                      me: result.register.user
                    }
                  }
                }
              )
            },
            logout: (_result, args, cache, info) => {
              updateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              )
            }
          }
        }
      }) as any,
      ssrExchange,
      fetchExchange
    ]
  }
}

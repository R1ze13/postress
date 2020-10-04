import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType, Query } from 'type-graphql'
import { User } from '../entities/User'
import { IResolverContext } from '../types'
import argon2 from 'argon2'
import { SESSION_COOKIE_NAME } from '../constants'

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: Array<FieldError>

  @Field(() => User, {nullable: true})
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: IResolverContext
  ): Promise<User | null> {
    // you are not logged in
    if (!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, {id: req.session.userId})
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: IResolverContext
  ): Promise<UserResponse> {
    if (options.username.length < 3) {
      return {
        errors: [{
          field: 'username',
          message: 'username length must be greater than 2'
        }]
      }
    }

    if (options.password.length < 6) {
      return {
        errors: [{
          field: 'password',
          message: 'password length must be greater than 5'
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword
    })

    try {
      await em.persistAndFlush(user)
    } catch (e) {
      // TODO замечена проблема при выбросе ошибки https://github.com/mikro-orm/mikro-orm/issues/696
      // как будто сохраняется один и тот же контекст для разных запросов
      // один из костыльных вариантов решения делать ИЛИ форк или em.clear после получения ошибки
      // надо разобраться
      em.clear()

      // duplicate username error
      if (e.code === '23505') {
        return {
          errors: [{
            field: 'username',
            message: 'Your nickname are not unique'
          }]
        }
      }

      return {
        errors: [{
          field: 'username',
          message: 'Something went wrong. Try again later'
        }]
      }
    }

    // login user
    req.session.userId = user.id

    return {user}
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: IResolverContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {username: options.username})

    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: "that username doesn't exist"
        }]
      }
    }

    const isPasswordValid = await argon2.verify(user.password, options.password)

    if (!isPasswordValid) {
      return {
        errors: [{
          field: 'password',
          message: 'incorrect password'
        }]
      }
    }

    req.session.userId = user.id

    return {user}
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: IResolverContext
  ): Promise<boolean> {
    res.clearCookie(SESSION_COOKIE_NAME)
    return new Promise(resolve => {
      req.session.destroy((err) => {
        if (err) {
          console.error(err)
          resolve(false)
          return
        }

        resolve(true)
      })
    })
  }
}

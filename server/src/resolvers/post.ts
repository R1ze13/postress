import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql'
import { Post } from '../entities/Post'
import { IResolverContext } from '../types'

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  public posts(@Ctx() { em }: IResolverContext): Promise<Array<Post>> {
    return em.find(Post, {})
  }

  @Query(() => Post, {nullable: true})
  public post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: IResolverContext
  ): Promise<Post | null> {
    return em.findOne(Post, {id})
  }

  @Mutation(() => Post)
  public async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { em }: IResolverContext
  ): Promise<Post> {
    const post = em.create(Post, {title})
    await em.persistAndFlush(post)
    return post
  }

  @Mutation(() => Post, {nullable: true})
  public async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, {nullable: true}) title: string | undefined,
    @Ctx() { em }: IResolverContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, {id})

    if (!post) {
      return null
    }

    if (typeof title !== 'undefined') {
      post.title = title
    }

    try {
      await em.persistAndFlush(post)
    } catch (e) {
      em.clear()
    }

    return post
  }

  @Mutation(() => Post, {nullable: true})
  public async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: IResolverContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, {id})

    if (!post) {
      return null
    }

    try {
      await em.removeAndFlush(post)
    } catch (e) {
      em.clear()
    }
    return post
  }
}

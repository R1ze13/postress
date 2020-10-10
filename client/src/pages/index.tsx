import { usePostsQuery } from '../generated/graphql'

const Index = () => {
  const [{ data }] = usePostsQuery()

  return (
    <>
      <div>Hello world</div>
      {data ? (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      ) : (
        <div>loading...</div>
      )}
    </>
  )
}

export default Index

import type { NextPage } from 'next'
import Head from 'next/head'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

const Home: NextPage = ({ characterData }: any) => {
  return (
    <div className="mx-auto flex max-w-7xl justify-center pt-20">
      <Head>
        <title>Rick and Morty API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {characterData.map((cd: any) => {
          return (
            <div key={cd.id}>
              <img
                className=" w-full rounded-t-lg object-cover"
                src={cd.image}
                alt="rick variants"
              />
              <div className="rounded-b-lg bg-black p-2 text-white">
                <h1 className="text-2xl font-bold">{cd.name}</h1>
                <h2>{cd.status}</h2>
                <h2>{cd.gender}</h2>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql/',
    cache: new InMemoryCache(),
  })

  const { data } = await client.query({
    query: gql`
      {
        characters(page: 2, filter: { name: "rick" }) {
          info {
            count
          }
          results {
            name
            image
            gender
            status
          }
        }
        location(id: 1) {
          id
        }
        episodesByIds(ids: [1, 2]) {
          id
        }
      }
    `,
  })
  console.log(data)

  return {
    props: {
      characterData: data.characters.results,
    },
  }
}

export default Home

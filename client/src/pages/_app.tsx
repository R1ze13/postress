import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { Provider, createClient } from 'urql'
import { Header } from "../components/Header"

import theme from '../theme'

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  }
})

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Header/>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp

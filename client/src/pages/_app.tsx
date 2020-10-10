import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import { withUrqlClient } from 'next-urql'
import { Header } from '../components/Header'
import theme from '../theme'
import { createUqrlClient } from '../utils/createUrqlClient'

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default withUrqlClient(createUqrlClient, { ssr: true })(MyApp)

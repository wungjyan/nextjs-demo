import "../styles/globals.css"
// import type { AppProps } from "next/app"
import Layout from "../components/Layout"
import { StoreProvider } from "store/index"
import { NextPage } from "next"

interface IProps {
  initialValue: Record<any, any>
  Component: NextPage
  pageProps: any
}
function MyApp({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies || {}
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  }
}

export default MyApp

import { ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { publicRoutes } from 'routes'
import { AppProvider } from './contexts/appContext'
import { useAppContext } from 'contexts/appContext'

import { ApolloProvider } from '@apollo/client'
import client from './apollo-client'

const App = () => {
    return (
        <AppProvider>
            <Main />
        </AppProvider>
    )
}

const Main = () => {
    const { isDark } = useAppContext()
    const { defaultAlgorithm, darkAlgorithm } = theme

    return (
        <ApolloProvider client={client}>
            <ConfigProvider
                theme={{
                    algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
                }}
            >
                <RouterProvider router={publicRoutes} />
            </ConfigProvider>
        </ApolloProvider>
    )
}

export default App

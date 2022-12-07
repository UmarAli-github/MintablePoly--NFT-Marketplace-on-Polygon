import {MetamaskProvider} from '../context/MetamaskContext';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
  <MetamaskProvider>
  <Component {...pageProps} />
  </MetamaskProvider>    
  )
}

export default MyApp

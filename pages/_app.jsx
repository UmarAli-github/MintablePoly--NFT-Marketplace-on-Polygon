import {MetamaskProvider} from '../context/MetamaskContext';
import '../styles/globals.css'

import Navbar from '../components/Navigation/Navbar';

function MyApp({ Component, pageProps }) {
  return (
  <MetamaskProvider>
  <Navbar locate='/#mint-section'/>
  <Component {...pageProps} />
  </MetamaskProvider>    
  )
}

export default MyApp

import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css"; // Custom global styles
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/ImageSense-logos/ImageSense-icon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

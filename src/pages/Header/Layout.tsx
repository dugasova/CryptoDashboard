import React, {Suspense} from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader'; // Import SkeletonLoader

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<SkeletonLoader />}><Outlet /></Suspense> {/* Use SkeletonLoader as fallback */}
      </main>
      <footer>
        <p>© 2025 Crypto App</p>
        <p>Created by <a href="/">My Name</a></p>
        <p>Powered by <a href="https://www.coingecko.com/en/api">CoinGecko API</a></p>
      </footer>
    </>

  )
}

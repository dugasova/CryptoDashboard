import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import Footer from '../../components/Footer/Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<SkeletonLoader />}><Outlet /></Suspense> {/* Use SkeletonLoader as fallback */}
      </main>
      <Footer />
    </>

  )
}

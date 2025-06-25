import React from 'react';
import './SkeletonLoader.scss';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-loader__header"></div>
      <div className="skeleton-loader__line"></div>
      <div className="skeleton-loader__line"></div>
      <div className="skeleton-loader__line"></div>
    </div>
  );
};

export default SkeletonLoader;

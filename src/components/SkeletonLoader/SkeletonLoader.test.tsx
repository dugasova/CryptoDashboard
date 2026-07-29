import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SkeletonLoader from './SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container.querySelector('.skeleton-loader')).toBeInTheDocument();
  });
});

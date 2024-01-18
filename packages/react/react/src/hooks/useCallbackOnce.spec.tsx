import { render } from '@testing-library/react';
import { DependencyList, useEffect } from 'react';
import { useCallbackOnce } from './useCallbackOnce';

//렌더링 테스트 시에는 직접 테스트 컴포넌트를 만들어서 테스트를 진행합니다.
const TestComponent = <F extends (...args: any[]) => void>({
  callback,
  deps,
}: {
  callback: F;
  deps: DependencyList;
}) => {
  const onceCallback = useCallbackOnce((...args: any[]) => callback(...args), deps);

  useEffect(
    (...args: Parameters<F>) => {
      onceCallback(...args);
    },
    [onceCallback]
  );

  return <div />;
};

describe('useCallbackOnce', () => {
  it('should be called one time when mount', () => {
    const callback = jest.fn();
    render(<TestComponent callback={callback} deps={[]} />);
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not be called more than once when rerender', () => {
    const callback = jest.fn();
    const { rerender } = render(<TestComponent callback={callback} deps={[1]} />);

    expect(callback).toHaveBeenCalledTimes(1);
    // 다시 렌더링 해서 검증
    rerender(<TestComponent callback={callback} deps={[2]} />);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalledTimes(2);
  });
});

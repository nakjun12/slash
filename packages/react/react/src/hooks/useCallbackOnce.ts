import { DependencyList, useCallback, useRef } from 'react';

/** @tossdocs-ignore */
export function useCallbackOnce<F extends (...args: any[]) => void>(callback: F, deps: DependencyList) {
  const hasFired = useRef(false);
  const memoizedCallback = useCallback((...args: Parameters<F>) => {
    if (hasFired.current) {
      return;
    }

    callback(...args);
    hasFired.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return memoizedCallback;
}

//useCallback을 써준 이유는 메모이제이션을 통해 재생성을 막기 위함이고,
//deps를 준 이유는 callback을 사용하는 조건이 변함을 감지하기 위함이다

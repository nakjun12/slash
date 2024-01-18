import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';
import { usePreservedCallback } from './usePreservedCallback';
import { usePreservedReference } from './usePreservedReference';

/** @tossdocs-ignore */
export function useDebounce<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options: Parameters<typeof debounce>[2] = {}
) {
  //콜백과 옵션이 변경하는 것을 확인하기위해 usePreserved 함수 사용
  const preservedCallback = usePreservedCallback(callback);
  const preservedOptions = usePreservedReference(options);

  //이 값을 근거로 useMemo를 사용하여 debounce를 생성
  //debounce에 의해 반환되는 값(여기서는 debounced 함수)을 메모이제이션하기 위해 useMemo를 사용
  const debounced = useMemo(() => {
    return debounce(preservedCallback, wait, preservedOptions);
  }, [preservedCallback, preservedOptions, wait]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}

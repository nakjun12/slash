/** @tossdocs-ignore */
import { usePreservedCallback, useRefEffect } from '@toss/react';
import { noop } from '@toss/utils';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ImpressionAreaProps } from './ImpressionArea';

// ImpressionAreaProps 타입에서 필요한 프로퍼티만 선택하여 Options 타입을 정의합니다.
type Options = Pick<
  ImpressionAreaProps,
  'rootMargin' | 'onImpressionStart' | 'onImpressionEnd' | 'timeThreshold' | 'areaThreshold' | 'root'
>;

// useImpressionRef 훅을 정의합니다. 이 훅은 HTMLElement의 제네릭 타입을 받아들이며, Options 타입의 파라미터를 받습니다.
export function useImpressionRef<Element extends HTMLElement>({
  onImpressionStart: _onImpressionStart, // 인상 시작 시 호출될 콜백 함수
  onImpressionEnd: _onImpressionEnd, // 인상 종료 시 호출될 콜백 함수
  timeThreshold = 0, // 인상을 결정하기 위한 최소 시간 임계값
  root, // IntersectionObserver의 루트 요소
  rootMargin, // IntersectionObserver의 rootMargin 설정
  areaThreshold: intersectThreshold = 0, // 요소가 교차하는 영역의 비율 임계값
}: Options) {
  // 콜백 함수들을 저장하고, 없을 경우 noop (아무 작업도 하지 않는 함수)를 사용합니다.
  const onImpressionStart = usePreservedCallback(_onImpressionStart ?? noop);
  const onImpressionEnd = usePreservedCallback(_onImpressionEnd ?? noop);

  // 요소가 교차하는지 여부를 추적하기 위한 ref를 생성합니다.
  const isIntersectingRef = useRef(false);

  // 인상 상태를 지연시켜 설정하는 함수입니다. 지연 시간은 timeThreshold에 의해 결정됩니다.
  const setDebouncedIsImpressed = useSetDebouncedBooleanValue({
    onValueChange: isImpressed => {
      // 교차 상태가 true로 변경되면 onImpressionStart를 호출하고, false로 변경되면 onImpressionEnd를 호출합니다.
      if (isImpressed) {
        onImpressionStart();
      } else {
        onImpressionEnd();
      }
    },
    timeThreshold,
  });

  // IntersectionObserver를 사용하여 요소의 교차 상태를 감지합니다. 감지되면 setDebouncedIsImpressed를 호출합니다.
  const intersectionObserverRef = useIntersectionObserver<Element>(
    ({ isIntersecting }) => {
      // 문서가 비활성화 상태일 때는 교차 상태를 업데이트하지 않습니다.
      if (document.visibilityState === 'hidden') {
        return;
      }

      // 교차 상태를 업데이트하고, debounce를 적용하여 onImpressionStart 또는 onImpressionEnd를 호출합니다.
      isIntersectingRef.current = isIntersecting;
      setDebouncedIsImpressed(isIntersecting);
    },
    {
      root,
      rootMargin,
      threshold: intersectThreshold,
    }
  );

  // 문서의 가시성이 변경될 때마다 교차 상태를 업데이트합니다.
  useDocumentVisibilityChange(documentVisible => {
    // 현재 교차 상태가 true이고 문서가 가시적일 때만 setDebouncedIsImpressed를 호출합니다.
    if (!isIntersectingRef.current) {
      return;
    }

    setDebouncedIsImpressed(documentVisible);
  });

  // 생성된 IntersectionObserver의 참조를 반환합니다. 이 참조는 감지하려는 요소에 연결되어야 합니다.
  return intersectionObserverRef;
}

function useDocumentVisibilityChange(_callback: (isVisible: boolean) => void) {
  const callback = usePreservedCallback(_callback);

  useEffect(() => {
    const handleVisibilityChange = () => {
      callback(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback]);
}

function useIntersectionObserver<Element extends HTMLElement>(
  _callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
) {
  const callback = usePreservedCallback(_callback);
  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) {
        return;
      }

      callback(entry);
    }, options);

    return observer;
  }, [callback, options]);

  const ref = useRefEffect<Element>(
    element => {
      observer?.observe(element);

      return () => {
        observer?.unobserve(element);
      };
    },
    [callback, options]
  );

  return ref;
}

function useSetDebouncedBooleanValue(options: { onValueChange: (newValue: boolean) => void; timeThreshold: number }) {
  const { onValueChange, timeThreshold } = options;
  const handleValueChange = usePreservedCallback(onValueChange);
  const ref = useRef({ value: false, cancelPrevDebounce: () => {} });

  const setDebouncedValue = useCallback(
    (newValue: boolean) => {
      if (newValue === ref.current.value) {
        return;
      }

      const debounced = debounce(() => {
        handleValueChange(newValue);
        ref.current.value = newValue;
      }, timeThreshold);

      ref.current.cancelPrevDebounce();
      debounced();
      ref.current.cancelPrevDebounce = debounced.cancel;
    },
    [handleValueChange, timeThreshold]
  );

  useEffect(() => {
    const current = ref.current;
    return () => {
      current.cancelPrevDebounce();
    };
  }, []);

  return setDebouncedValue;
}

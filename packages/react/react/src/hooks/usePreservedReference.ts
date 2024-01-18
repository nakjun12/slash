import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
type NotNullishValue = {};

// usePreservedReference 함수는 객체나 복잡한 데이터 구조의 값 변경을 감지하고
// 렌더링을 최적화하기 위해 사용됩니다.

/** @tossdocs-ignore */
export function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual: (a: T, b: T) => boolean = areDeeplyEqual
  //위 함수를 Parameters로 만드는 이유는
  //첫째로 특정 조건을 받기 위함이다.
  //두번째는 default 함수를 넣어서 areDeeplyEqual을 참조할 수 있도록 만들어준다.
) {
  const [reference, setReference] = useState<T>(value);

  useEffect(() => {
    if (!areValuesEqual(value, reference)) {
      //value 값이 변경하는 것을 고려해서 areValuesEqual을 사용한다.
      setReference(value);
    }
  }, [areValuesEqual, reference, value]);

  return reference;
}

//내부 값이 동등한지 확인하는 함수
function areDeeplyEqual<T extends NotNullishValue>(x: T, y: T) {
  return JSON.stringify(x) === JSON.stringify(y);
}

// usePreservedReference는 참조 유형의 데이터가 변경되었는지 감지
// useMemo는 계산 비용이 높은 연산의 결과를 재사용하여 연산 성능을 최적화

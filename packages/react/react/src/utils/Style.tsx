/** @tossdocs-ignore */
/** @jsxImportSource react */
import { ReactNode } from 'react';

export default function Style({ css, children }: { css: string; children?: ReactNode }) {
  return (
    <>
      <style type="text/css">{css}</style>
      {children}
    </>
  );
}
const PREFIX = 'tossteam-react__';

// T는 Record<string, string> 형태의 객체 타입입니다.
// 이는 키와 값이 모두 문자열인 객체를 나타냅니다.
export function generateClassNames<T extends Record<string, string>>(classNames: T) {
  // Object.keys(classNames)는 classNames 객체의 모든 키(문자열)를 배열 형태로 반환합니다.
  // reduce 함수를 사용하여 이 배열을 순회하면서, 각 키에 해당하는 값을 변경합니다.
  return Object.keys(classNames).reduce(
    (acc, key) =>
      // acc는 누적된 객체입니다. 초기값은 {} 입니다.
      // 각 단계에서 새로운 객체를 생성하여 반환합니다. 이 객체는 이전의 acc 객체에
      // 새로운 키-값 쌍을 추가한 것입니다.
      // 새로운 값은 접두사(PREFIX)와 원래 classNames 객체의 값을 연결한 것입니다.
      ({ ...acc, [key]: `${PREFIX}${classNames[key]}` }),
    {}
  ) as T;
  // 최종적으로 수정된 객체를 T 타입으로 캐스팅하여 반환합니다.
}

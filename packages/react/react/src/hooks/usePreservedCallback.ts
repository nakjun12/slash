import { useCallback, useEffect, useRef } from 'react';

// usePreservedCallback 훅 정의.
// 이 훅은 콜백 함수를 받아서 그 콜백의 최신 버전을 유지하는 래퍼 함수를 반환합니다.
export function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback) {
  // useRef를 사용하여 콜백 함수의 현재 참조를 저장합니다.
  // 이 ref 객체는 컴포넌트의 라이프사이클 동안 지속적으로 유지됩니다.
  const callbackRef = useRef<Callback>(callback);

  // useEffect를 사용하여 콜백 함수가 변경될 때마다 ref를 업데이트합니다.
  // 이는 콜백 함수가 변경되더라도 동일한 참조를 유지하도록 보장합니다.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // useCallback을 사용하여 최신 콜백 함수를 호출하는 래퍼 함수를 생성합니다.
  // 이 래퍼 함수는 콜백 함수에 전달된 모든 인자들을 그대로 콜백 함수에 전달합니다.
  return useCallback(
    (...args: any[]) => {
      return callbackRef.current(...args);
    },
    [callbackRef] // callbackRef의 변화에 따라 래퍼 함수를 재생성합니다.
  ) as Callback;
}

//   // usePreservedCallback을 사용하여 fetchSearchResults 함수의 최신 버전을 유지합니다.

// Remove this commented out code.
//   const fetchSearchResults = usePreservedCallback(() => {
//     console.log('Fetching search results for:', query);
//   });

// 위 함수를 사용하는 이유는 렌더링 시마다 재생성하는 것을 막기 위함입니다.
// 기존의 useCallback은 dependencies가 변경될 때마다 재생성되기 때문에
// dependencies가 자주 되는 변경하는 경우에 쓰임새가 어렵습니다
// 그리고 dependencies가 없을 경우에는 클로저에 의해서 최신의 값을 유지하지 못합니다.
// 이를 방지 하기위해 usePreservedCallback을 사용합니다.

//args를 쓰는 이유 예시
// Remove this commented out code.
//   const buttons = [
//     { label: 'Button 1', action: 'action1' },
//     { label: 'Button 2', action: 'action2' },
//     { label: 'Button 3', action: 'action3' },
//   ];
//
//   const handleButtonClick = usePreservedCallback(action => {
//     console.log(`Button clicked with action: ${action}`);
//   });
//   return (
//     <div>
//       {buttons.map(button => (
//         <button key={button.label} onClick={() => handleButtonClick(button.action)}>
//           {button.label}
//         </button>
//       ))}
//     </div>
//   );
// }

// 빈번한 렌더링이 발생하는 경우
// 콜백 함수가 자주 변경되는 경우

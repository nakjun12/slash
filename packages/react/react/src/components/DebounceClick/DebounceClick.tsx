import { Children, cloneElement, ReactElement } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

/** @tossdocs-ignore */
interface Props {
  /**
   * @description 이벤트를 묶어서 한번에 보낼 시간으로 ms 단위
   * e.g.) 200ms 일 때, 200ms 안에 발생한 이벤트를 무시하고 마지막에 한번만 방출합니다.
   */
  wait: Parameters<typeof useDebounce>[1];
  options?: Parameters<typeof useDebounce>[2];
  children: ReactElement;
  /**
   * @default 'onClick'
   * @description 이벤트 Prop 이름으로 'onClick' 이름 외로 받을 때 사용합니다.
   * e.g. "onCTAClick", "onItemClick" ...
   */
  capture?: string;
  //디바운스를 적용할 이벤트 핸들러의 이름. 기본값은 'onClick'입니다.
}

// DebounceClick 컴포넌트 정의
export function DebounceClick({ capture = 'onClick', options, children, wait }: Props) {
  // Children.only(children)를 사용하는 주된 이유는
  //React의 children prop이 오직 단 하나의 자식 요소만 포함하고 있음을 보장하기 위해서입니다.
  // 이 함수는 children이 단일 React 요소일 때만 정상적으로 작동하고,
  //만약 children이 여러 요소를 포함하거나 비어있다면 오류를 발생시킵니다.
  const child = Children.only(children);

  // useDebounce 훅을 사용하여 디바운스된 콜백 함수를 생성합니다.
  // 이 함수는 지정된 wait 시간(밀리초) 동안 연속된 이벤트를 그룹화하여
  // 마지막 이벤트 발생 후에만 실제 이벤트 핸들러를 실행합니다.
  const debouncedCallback = useDebounce(
    (...args: any[]) => {
      // child.props[capture]가 전달받는 값을 전달받아 실행합니다
      // args는 이벤트 핸들러에 전달되는 인자들을 의미

      // 자식 요소의 capture에 해당하는 이벤트 핸들러를 호출합니다.
      if (child.props && typeof child.props[capture] === 'function') {
        return child.props[capture](...args);
      }
    },
    wait, // 디바운스 시간
    options // 디바운스 설정 옵션
  );

  // cloneElement를 사용하여 자식 요소를 복제하고,
  // capture에 해당하는 이벤트 핸들러를 debouncedCallback으로 교체합니다.
  // 이렇게 하면 기존 자식 요소의 다른 props는 그대로 유지하면서
  // 특정 이벤트 핸들러만 디바운스 기능이 적용된 새로운 함수로 변경됩니다.
  return cloneElement(child, {
    [capture]: debouncedCallback,
  });
}

import { act, renderHook } from '@testing-library/react';
import { useRef, useState } from 'react';
import { usePreservedCallback } from './usePreservedCallback';

describe('usePreservedCallback', () => {
  it('should return a preserved callback function', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => usePreservedCallback(mockCallback));

    expect(typeof result.current).toBe('function');
    result.current();
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should preserve the callback reference across re-renders', () => {
    const mockCallback = jest.fn();
    const { result, rerender } = renderHook(() => usePreservedCallback(mockCallback));

    const firstRenderCallback = result.current;

    // 콜백 함수를 변경하지 않고 컴포넌트를 다시 렌더링합니다.
    rerender();

    expect(result.current).toBe(firstRenderCallback);
  });

  it('should return the value from the latest callback', () => {
    let callbackValue = 10; // 콜백 함수가 반환할 초기 값
    const mockCallback = jest.fn(() => callbackValue); // 콜백 함수 정의
    const { result } = renderHook(() => usePreservedCallback(mockCallback));

    // 첫 번째 렌더링에서 콜백 함수 호출하고 반환값 확인
    let returnValue = result.current();
    expect(returnValue).toBe(10); // 초기 반환값 확인
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveReturnedWith(10);
    // 콜백 함수의 반환값 변경
    callbackValue = 20;

    // 변경된 반환값을 사용하는 콜백 함수 호출하고 반환값 확인
    returnValue = result.current();
    expect(returnValue).toBe(20); // 변경된 반환값 확인
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveReturnedWith(20);
  });
});

describe('usePreservedCallback with useState', () => {
  it('should reflect the latest state value in the callback', () => {
    const Component = () => {
      const [stateValue, setStateValue] = useState(0);
      const callback = usePreservedCallback(() => stateValue);

      return { callback, setStateValue };
    };

    const { result } = renderHook(() => Component());

    // 초기 상태값이 콜백에서 반영되는지 확인
    expect(result.current.callback()).toBe(0);

    // 상태 업데이트
    act(() => {
      result.current.setStateValue(1);
    });

    // 업데이트된 상태값이 콜백에서 반영되는지 확인
    expect(result.current.callback()).toBe(1);
  });
});

describe('usePreservedCallback with useRef', () => {
  it('should reflect the latest ref value in the callback', () => {
    const Component = () => {
      const refValue = useRef(0);
      const callback = usePreservedCallback(() => refValue.current);

      return { callback, refValue };
    };

    const { result } = renderHook(() => Component());

    // 초기 ref 값이 콜백에서 반영되는지 확인
    expect(result.current.callback()).toBe(0);

    // ref 업데이트
    act(() => {
      result.current.refValue.current = 1;
    });

    // 업데이트된 ref 값이 콜백에서 반영되는지 확인
    expect(result.current.callback()).toBe(1);
  });
});

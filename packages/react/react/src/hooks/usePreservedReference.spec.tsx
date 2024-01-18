import { renderHook } from '@testing-library/react';
import { usePreservedReference } from './usePreservedReference';

type TossObject = {
  toss: string;
};

describe('usePreservedReference', () => {
  //리턴 값 명시하는 모의함수
  const callbackReturnTrue = jest.fn(() => true);
  const callbackReturnFalse = jest.fn(() => false);

  describe('with Default Callback Function', () => {
    it('changed to the same value', () => {
      const tossObject: TossObject = { toss: '토스' };

      //렌더 훅
      const { result, rerender } = renderHook(({ value }) => usePreservedReference(value), {
        initialProps: { value: tossObject },
      });

      rerender({ value: { toss: '토스' } });

      expect(result.current).toBe(tossObject);
      //toBe는 값의 내용과 참조를 비교합니다.
      expect(result.current).toEqual(tossObject);
      //toEqual은 값의 내용을 비교합니다.
    });
    it('changed to a different value', () => {
      const tossObject: TossObject = { toss: '토스' };
      const { result, rerender } = renderHook(({ value }) => usePreservedReference(value), {
        initialProps: { value: tossObject },
      });

      rerender({ value: { toss: 'toss' } });

      expect(result.current).not.toBe(tossObject);
      expect(result.current).not.toEqual(tossObject);
    });
  });
  describe('with Custom Callback Function', () => {
    it('changed to the same value', () => {
      const tossObject: TossObject = { toss: '토스' };

      //areValuesEqual true 로 만듬
      const { result, rerender } = renderHook(({ value }) => usePreservedReference(value, callbackReturnTrue), {
        initialProps: { value: tossObject },
      });

      rerender({ value: { toss: '토스' } });

      expect(result.current).toBe(tossObject);
      //참조 값이 변하지 않았음을 확인
    });
    it('changed to a different value', () => {
      const tossObject: TossObject = { toss: '토스' };

      const { result, rerender } = renderHook(({ value }) => usePreservedReference(value, callbackReturnFalse), {
        initialProps: { value: tossObject },
      });

      rerender({ value: { toss: '토스' } });

      expect(result.current).not.toBe(tossObject);
      //참조 값이 변했음을 확인
    });
  });
});

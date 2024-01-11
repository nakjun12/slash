import { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import { useKey } from './hooks';

// ErrorBoundaryGroupContext를 생성합니다. 이 컨텍스트는 reset 함수와 resetKey 값을 제공합니다.
export const ErrorBoundaryGroupContext = createContext<{ reset: () => void; resetKey: number } | undefined>(undefined);

// 개발 환경에서는 컨텍스트의 이름을 설정하여 디버깅을 용이하게 합니다.
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext';
}

/**
 * ErrorBoundaryGroup 컴포넌트입니다. 여러 ErrorBoundary를 관리하는 데 사용됩니다.
 *
 * @param {boolean} blockOutside - 외부 ErrorBoundaryGroup의 resetKey에 의한 리셋을 방지합니다.
 * @param {ReactNode} children - ErrorBoundaryGroup 내부에 포함될 자식 컴포넌트들입니다.
 *
 * @example
 * <ErrorBoundaryGroup>
 *   <ErrorBoundary />
 *   <ErrorBoundary />
 * </ErrorBoundaryGroup>
 */
export const ErrorBoundaryGroup = ({
  blockOutside = false,
  children,
}: {
  blockOutside?: boolean;
  children?: ReactNode;
}) => {
  const blockOutsideRef = useRef(blockOutside); // blockOutside 값을 ref로 저장하여, 변경되지 않도록 합니다.
  const [resetKey, reset] = useKey(); // resetKey와 reset 함수를 생성합니다.

  useEffect(() => {
    // 컴포넌트가 마운트되고, blockOutside가 false인 경우 reset 함수를 호출합니다.
    if (!blockOutsideRef.current) {
      reset();
    }
  }, [reset]);

  // value에는 reset 함수와 resetKey 값을 포함합니다.
  const value = useMemo(() => ({ reset, resetKey }), [reset, resetKey]);

  // ErrorBoundaryGroupContext.Provider를 통해 value를 자식 컴포넌트에게 제공합니다.
  return <ErrorBoundaryGroupContext.Provider value={value}>{children}</ErrorBoundaryGroupContext.Provider>;
};

/**
 * useErrorBoundaryGroup 훅은 ErrorBoundaryGroup 내부에서 사용되어야 합니다.
 * ErrorBoundaryGroup가 없는 경우 오류를 발생시켜 잘못된 사용을 방지합니다.
 *
 * @returns {object} group 객체를 반환합니다. 이 객체는 ErrorBoundaryGroup의 reset 함수를 포함합니다.
 *
 * @example
 * const group = useErrorBoundaryGroup();
 * <button onClick={group.reset}>Reset ErrorBoundaries</button>
 */
export const useErrorBoundaryGroup = () => {
  const group = useContext(ErrorBoundaryGroupContext);

  if (group === undefined) {
    throw new Error('useErrorBoundaryGroup must be used within an ErrorBoundaryGroup');
  }

  // group 객체에는 reset 함수가 포함되어 있습니다.
  return useMemo(() => ({ reset: group.reset }), [group.reset]);
};

/** @tossdocs-ignore */
import { isDifferentArray } from '@toss/utils';
import {
  Component,
  ComponentPropsWithoutRef,
  ComponentType,
  ErrorInfo,
  forwardRef,
  PropsWithChildren,
  PropsWithRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ErrorBoundaryGroupContext } from './ErrorBoundaryGroup';
import { ComponentPropsWithoutChildren } from './types/index';

type RenderFallbackProps<ErrorType extends Error = Error> = {
  error: ErrorType;
  reset: () => void;
};

type RenderFallbackType = <ErrorType extends Error>(props: RenderFallbackProps<ErrorType>) => ReactNode;
type IgnoreErrorType = <ErrorType extends Error = Error>(error: ErrorType) => boolean;

type Props<ErrorType extends Error = Error> = {
  /*
   * @description 발생할 수 있는 error에 대한 기준값으로 이 값이 변경되면 error를 초기화합니다.
   */
  resetKeys?: unknown[];
  onReset?(): void;
  renderFallback: RenderFallbackType;
  onError?(error: ErrorType, info: ErrorInfo): void;
  /*
   * @description 이 ErrorBoundary Context에서 처리하지 않고 throw해줄 error의 조건을 명시할 callback
   */
  ignoreError?: IgnoreErrorType;
};

interface State<ErrorType extends Error = Error> {
  error: ErrorType | null;
}

const initialState: State = {
  error: null,
};

// BaseErrorBoundary 클래스 정의
// 이 클래스는 에러 경계의 기본 구현을 제공합니다.
class BaseErrorBoundary extends Component<PropsWithRef<PropsWithChildren<Props>>, State> {
  state = initialState; // 초기 상태 설정
  updatedWithError = false; // 에러 상태 업데이트 여부를 추적하는 플래그

  // 에러 발생시 호출되는 생명주기 메서드
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  // 에러 포착시 실행되는 메서드
  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError, ignoreError } = this.props;

    // ignoreError 함수가 제공되고, 특정 에러를 무시할 경우 에러를 다시 throw함
    if (ignoreError?.(error)) {
      throw error;
    }

    // 에러 콜백 함수 실행
    onError?.(error, info);
  }

  // 에러 경계 상태를 초기 상태로 리셋하는 메서드
  resetState() {
    this.updatedWithError = false;
    this.setState(initialState);
  }

  // 에러 경계를 리셋하는 메서드
  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.resetState();
  };

  // 컴포넌트가 업데이트될 때 호출됨
  componentDidUpdate(prevProps: Props) {
    const { error } = this.state;

    if (error == null) {
      return;
    }

    const { resetKeys } = this.props;

    // 이전 resetKeys와 현재 resetKeys가 다를 경우, 에러 경계를 리셋함
    if (!this.updatedWithError) {
      this.updatedWithError = true;
      return;
    }

    if (isDifferentArray(prevProps.resetKeys, resetKeys)) {
      this.resetErrorBoundary();
    }
  }

  // 에러가 있는 경우 대체 UI 렌더링, 없는 경우 자식 컴포넌트 렌더링
  render() {
    const { children, renderFallback } = this.props;
    const { error } = this.state;

    if (error != null) {
      return renderFallback({
        error,
        reset: this.resetErrorBoundary,
      });
    }

    return children;
  }
}

// ErrorBoundary 컴포넌트 정의.
// 이 컴포넌트는 forwardRef를 사용하여 외부에서 ref를 통해 컨트롤할 수 있게 합니다.
export const ErrorBoundary = forwardRef<{ reset(): void }, ComponentPropsWithoutRef<typeof BaseErrorBoundary>>(
  (props, resetRef) => {
    // ErrorBoundaryGroupContext를 사용하여 그룹 컨텍스트를 가져옵니다.
    // Context가 없을 경우 기본값으로 { resetKey: 0 }을 사용합니다.
    const group = useContext(ErrorBoundaryGroupContext) ?? { resetKey: 0 };

    // resetKeys 배열을 생성하고, group의 resetKey와 props의 resetKeys를 결합합니다.
    const resetKeys = [group.resetKey, ...(props.resetKeys || [])];

    // BaseErrorBoundary의 인스턴스를 관리하기 위한 ref를 생성합니다.
    const ref = useRef<BaseErrorBoundary>(null);

    // 외부에서 이 컴포넌트의 resetErrorBoundary 메서드를 호출할 수 있도록 설정합니다.
    useImperativeHandle(resetRef, () => ({
      reset: () => ref.current?.resetErrorBoundary(),
    }));

    // BaseErrorBoundary를 렌더링하고, props와 resetKeys, ref를 전달합니다.
    return <BaseErrorBoundary {...props} resetKeys={resetKeys} ref={ref} />;
  }
);

// 개발 환경에서 컴포넌트의 displayName을 설정합니다.
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundary.displayName = 'ErrorBoundary';
}

export const useErrorBoundary = <ErrorType extends Error>() => {
  const [error, setError] = useState<ErrorType | null>(null);

  if (error != null) {
    throw error;
  }

  return setError;
};

// withErrorBoundary HOC 정의.
// 이 함수는 컴포넌트와 ErrorBoundary의 props를 받아, 해당 컴포넌트를 ErrorBoundary로 감싸는 새로운 컴포넌트를 반환합니다.
export const withErrorBoundary = <Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  errorBoundaryProps: ComponentPropsWithoutChildren<typeof ErrorBoundary>
) => {
  // 반환할 컴포넌트 정의.
  // 기존 컴포넌트를 ErrorBoundary 컴포넌트로 감싸서 반환합니다.
  const Wrapped = (props: Props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  // 개발 환경에서 컴포넌트의 displayName을 설정합니다.
  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component';
    Wrapped.displayName = `withErrorBoundary(${name})`;
  }

  return Wrapped;
};

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DebounceClick } from './DebounceClick';

interface TestButtonProps {
  children: React.ReactNode;
  onCTAClick: () => void;
}

const COMPLETION_WAIT_TIME = 500;
const BEFORE_COMPLETION_TIME = 490;
const REMAINING_TIME = 10;

const TestButton = ({ children, onCTAClick }: TestButtonProps) => {
  return <button onClick={onCTAClick}>{children}</button>;
};

beforeAll(() => {
  jest.useFakeTimers();
  //setTimeout 모의 함수
});

describe('DebounceClick', () => {
  it('should debounce "onClick" event prop passed to child element by default', async () => {
    const user = userEvent.setup({ delay: null });
    //delay null은 이벤트 사이에 시간 지연을 두지 않겠다는 의미
    const mockFn = jest.fn();
    //onClick 이벤트가 호출되는 횟수를 세는 모의 함수

    render(
      <DebounceClick wait={COMPLETION_WAIT_TIME}>
        <button onClick={mockFn}>Button</button>
      </DebounceClick>
    );

    const button = screen.getByRole('button');

    await user.click(button);

    jest.advanceTimersByTime(BEFORE_COMPLETION_TIME);
    //advanceTimersByTime은 모의된 시간만큼 시간 진행하는 함수
    expect(mockFn).toBeCalledTimes(0);

    jest.advanceTimersByTime(REMAINING_TIME);
    //debounceClick의 wait 시간이 지나면 mockFn이 호출되는 것을 확인
    expect(mockFn).toBeCalledTimes(1);

    await user.click(button);

    jest.advanceTimersByTime(BEFORE_COMPLETION_TIME);
    expect(mockFn).toBeCalledTimes(1);

    jest.advanceTimersByTime(REMAINING_TIME);
    expect(mockFn).toBeCalledTimes(2);
    //시간이 지나면 mockFn이 다시 호출되는 것을 확인
  });

  it('should debounce event prop of child element with the same name as capture', async () => {
    const user = userEvent.setup({ delay: null });
    const mockFn = jest.fn();

    render(
      <DebounceClick capture="onCTAClick" wait={COMPLETION_WAIT_TIME}>
        <TestButton onCTAClick={mockFn}>Button</TestButton>
      </DebounceClick>
    );

    const button = screen.getByRole('button');

    await user.click(button);

    jest.advanceTimersByTime(BEFORE_COMPLETION_TIME);
    expect(mockFn).toBeCalledTimes(0);

    jest.advanceTimersByTime(REMAINING_TIME);
    expect(mockFn).toBeCalledTimes(1);

    await user.click(button);

    jest.advanceTimersByTime(BEFORE_COMPLETION_TIME);
    expect(mockFn).toBeCalledTimes(1);

    jest.advanceTimersByTime(REMAINING_TIME);
    expect(mockFn).toBeCalledTimes(2);
  });
});

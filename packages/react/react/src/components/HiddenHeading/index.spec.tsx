import { render } from '@testing-library/react';
import { HiddenHeading } from '.';

describe('HiddenHeading', () => {
  it('can be given an id attribute.', () => {
    render(<HiddenHeading id="test-heading">Test</HiddenHeading>);

    const heading = document.getElementById('test-heading');

    expect(heading).toBeInTheDocument();
    expect(heading?.innerHTML).toEqual('Test');
  });

  it('should have the default tag as h1.', () => {
    const { container } = render(<HiddenHeading>Test</HiddenHeading>);

    expect(container.querySelector('h1')).toBeInTheDocument();
  });

  it('should not have the default tag as h2.', () => {
    const { container } = render(<HiddenHeading>Test</HiddenHeading>);

    expect(container.querySelector('h2')).not.toBeInTheDocument();
  });

  it('should render with the provided "as" tag.', () => {
    const { container } = render(<HiddenHeading as="h3">Test</HiddenHeading>);

    expect(container.querySelector('h3')).toBeInTheDocument();
  });

  it('should accept a className through the className attribute.', () => {
    const className = 'class-name';
    const { container } = render(<HiddenHeading className={className}>Test</HiddenHeading>);

    expect(container.querySelector('h1')).toHaveClass(className);
  });

  it('should have default styles.', () => {
    const { container } = render(<HiddenHeading as="h3">Test</HiddenHeading>);

    const defaultStyle = `
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      border: 0;
      clip: rect(0, 0, 0, 0);
    `;

    expect(container.querySelector('h3')).toHaveStyle(defaultStyle);
  });
});

//querySelector는 CSS 선택자를 사용하여 DOM에서 특정 요소를 직접 선택할 수 있습니다.
//이러한 방법을 사용한 이유는 실제 DOM 요소를 선택할 수 있기 때문입니다.

//특정 DOM 구조나 CSS 클래스의 존재 여부를 확인하는 경우에는 querySelector가 더 직관적일 수 있습니다.

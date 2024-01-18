import { render } from '@testing-library/react';
import { OpenGraph } from '.';

describe('OpenGraph', () => {
  const getMeta = (metaName: string) => {
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i += 1) {
      if (metas[i].getAttribute('property') === metaName) {
        return metas[i].getAttribute('content');
      }
    }
    throw new Error('cannot find your meta tag');
  };
  it(`should render inserted title`, () => {
    const title = '토스';
    render(<OpenGraph title={title} />);
    expect(getMeta('og:title')).toEqual(title);
  });
  it(`should render inserted description`, () => {
    const description = '금융의 모든 것, 토스에서 쉽고 간편하게';
    render(<OpenGraph description={description} />);
    expect(getMeta('og:description')).toEqual(description);
  });
  it(`should render inserted imageUrl`, () => {
    const imageUrl = 'https://static.toss.im/homepage-static/newtoss/newtoss-og.jpg';
    render(<OpenGraph imageUrl={imageUrl} />);
    expect(getMeta('og:image')).toEqual(imageUrl);
  });
  it(`should throw error when no meta tag is found `, () => {
    render(<OpenGraph />);
    // 오류 확인하는 법
    //expect 문 직접 호출되면, 오류가 expect 함수에 도달하기 전에 발생하고 테스트는 실패
    expect(() => getMeta('og:title')).toThrowError();
  });
});

// () => getMeta('og:title'): 이것은 함수를 선언하고 호출하는 것입니다.
//이 경우, 함수가 정의되고 즉시 호출됩니다. 즉, 함수 내부 코드가 선언되자마자 실행됩니다.

// 그냥 getMeta('og:title'): 이것은 함수 호출입니다. 함수가 이미 정의되어 있고,
//이 호출이 코드 어딘가에서 발생할 때 함수 내부 코드가 실행됩니다. 이 때 오류가 발생하면,
//해당 코드 위치에서 오류가 발생하는 것이 아니라 함수 내부에서 발생하게 됩니다.

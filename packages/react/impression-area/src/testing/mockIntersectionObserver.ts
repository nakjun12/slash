/** @tossdocs-ignore */
const defaultIntersectionObserver = window.IntersectionObserver;
const handlersMap = new Map<HTMLElement, Array<(entries: IntersectionObserverEntry[]) => void> | null>();

export const mockIntersectionObserver = {
  setup,
  cleanup,
  intersect,
};

/**
 * 모킹된 IntersectionObserver를 설정하는 함수입니다.
 * 실제 IntersectionObserver를 오버라이드하여 테스트 목적으로 사용할 수 있습니다.
 */
function setup() {
  window.IntersectionObserver = class IntersectionObserver {
    private elements: HTMLElement[] = [];

    /**
     * IntersectionObserver의 생성자입니다.
     * @param {function} handleImpressionChange - 요소가 교차 영역에 들어갈 때 실행될 콜백 함수입니다.
     */
    constructor(private handleImpressionChange: (entries: IntersectionObserverEntry[]) => void) {}

    /**
     * 특정 요소를 교차 영역 관찰 대상으로 추가하는 함수입니다.
     * @param {HTMLElement} element - 관찰할 요소입니다.
     */
    observe(element: HTMLElement) {
      this.elements.push(element);
      handlersMap.set(element, [...(handlersMap.get(element) || []), this.handleImpressionChange]);
    }

    /**
     * 특정 요소의 교차 영역 관찰을 중단하는 함수입니다.
     * @param {HTMLElement} element - 관찰을 중단할 요소입니다.
     */
    unobserve(element: HTMLElement) {
      this.elements = this.elements.filter(e => e !== element);
      handlersMap.set(
        element,
        (handlersMap.get(element) || []).filter(h => h !== this.handleImpressionChange)
      );
      if (handlersMap.get(element)?.length === 0) {
        handlersMap.delete(element);
      }
    }

    /**
     * 모든 요소의 교차 영역 관찰을 중단하고, 내부 상태를 초기화하는 함수입니다.
     */
    disconnect() {
      this.elements.forEach(element => this.unobserve(element));
    }
  } as any;
}

/**
 * 모킹 설정을 정리하고 기본 IntersectionObserver로 복원하는 함수입니다.
 */
function cleanup() {
  window.IntersectionObserver = defaultIntersectionObserver;
  handlersMap.clear();
}

/**
 * 특정 요소가 교차 영역에 들어갔음을 시뮬레이션하는 함수입니다.
 * @param {HTMLElement} element - 교차 영역에 들어갈 요소입니다.
 * @param {object} options - 교차 영역에 대한 옵션입니다.
 * @param {number} options.ratio - 교차 비율입니다.
 */
function intersect(element: HTMLElement, { ratio }: { ratio: number }) {
  let current: HTMLElement | null = element;

  while (current != null) {
    const handlers = handlersMap.get(current);

    if (handlers != null) {
      handlers.forEach(handler =>
        handler([
          {
            isIntersecting: ratio > 0,
            intersectionRatio: ratio,
            boundingClientRect: {} as any,
            intersectionRect: {} as any,
            rootBounds: {} as any,
            target: current!,
            time: 0,
          },
        ])
      );
    }

    current = current.parentElement;
  }
}

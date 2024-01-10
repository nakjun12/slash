import { useIsMounted } from '@toss/react';
import Head from 'next/head';

// TSDoc: Props 인터페이스는 AsyncStylesheet 컴포넌트의 속성을 정의합니다.
// 이 인터페이스는 href라는 string 타입의 속성을 갖습니다.
interface Props {
  href: string;
}

// TSDoc: AsyncStylesheet 컴포넌트는 외부 스타일시트를 비동기적으로 로드하는 데 사용됩니다.
// 이 컴포넌트는 href 속성을 통해 외부 스타일시트의 URL을 받습니다.
export default function AsyncStylesheet({ href }: Props) {
  // useIsMounted 훅은 컴포넌트가 마운트되었는지 여부를 반환합니다.
  const isMounted = useIsMounted();

  return (
    // Head 컴포넌트는 HTML 문서의 <head> 섹션에 요소들을 추가하는 데 사용됩니다.
    <Head>
      {/* rel="preconnect"를 사용하여 브라우저가 href의 오리진(도메인)에 미리 연결을 수립합니다.
          이는 외부 리소스 로딩 시 성능을 개선하는 데 도움이 됩니다. */}
      <link rel="preconnect" href={new URL(href).origin} />

      {/* rel="preload"를 사용하여 브라우저에게 href의 스타일시트를 미리 로드하도록 지시합니다. */}
      <link rel="preload" as="style" href={href} />

      {/* rel="stylesheet"는 실제 스타일시트를 연결합니다.
          media 속성을 사용하여 컴포넌트가 마운트되었을 때만 'all' 미디어 유형에 스타일시트를 적용합니다.
          마운트되지 않았다면, 'print' 미디어 유형으로 설정하여 화면에는 스타일이 적용되지 않게 합니다. */}
      <link rel="stylesheet" type="text/css" href={href} media={isMounted ? 'all' : 'print'} />

      {/* noscript 태그는 자바스크립트가 비활성화된 경우를 대비하여 스타일시트를 정적으로 로드합니다. */}
      <noscript>
        <link rel="stylesheet" type="text/css" href={href} />
      </noscript>
    </Head>
  );
}

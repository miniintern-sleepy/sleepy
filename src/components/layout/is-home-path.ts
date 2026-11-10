/** 공개 메인 주소와 정확히 일치할 때만 사진 위 헤더를 표시한다. */
export function isHomePath(pathname: string | null, lang: string) {
  return pathname === `/${lang}`;
}

# 문의 메일 설정과 시험 발송 (#45)

## 환경 변수

`.env.local`과 Vercel의 해당 환경에 아래 이름으로 설정한다. 값은 대화·코드·문서·로그에 남기지 않는다.

| 이름                      | 값의 용도                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `MAIL_API_KEY`            | 인증한 도메인에서 발송 가능한 Resend API 키                                                              |
| `MAIL_FROM`               | 인증한 도메인의 발신 이메일 주소 하나                                                                    |
| `MAIL_REPLY_TO`           | 회신 받을 담당자 이메일 주소 하나                                                                        |
| `MAIL_NOTIFY_TO`          | 새 문의 알림을 받을 담당자 이메일 주소 하나                                                              |
| `MAIL_NOTIFY_TEMPLATE_ID` | Publish한 담당자 알림 템플릿 ID                                                                          |
| `MAIL_REPLY_TEMPLATE_ID`  | Publish한 문의자 답변 템플릿 ID                                                                          |
| `MAIL_SITE_URL`           | 관리자 링크를 만들 사이트 원점. HTTPS, 경로·쿼리·인증정보 없음. 로컬 시험은 `http://localhost:3000` 사용 |

주소에는 표시 이름을 붙이거나 여러 주소를 넣지 않는다. 환경 변수 변경 후 실행 서버를 재시작하고 Vercel은 재배포한다. API 키와 이메일 주소 값은 사용자만 입력한다. `MAIL_SITE_URL`은 요청 Host와 무관하며 실제 관리 화면을 열 수 있는 배포 주소로 설정한다.

## Resend 템플릿

두 템플릿의 변수를 모두 `string`으로 정의하고 아래 HTML을 본문으로 사용한 뒤 **Publish**한다. 아래 디자인 HTML은 2026-11-07 사용자가 제공하고 Publish한 버전이다. API 발송에 템플릿을 지정하면 `html`·`text`·`react` 본문을 함께 보내지 않는다.

- 서버가 이름·문의 요약·답변의 `&`, `<`, `>`, 큰따옴표·작은따옴표를 엔티티로 변환하고 줄바꿈을 `<br>`로 바꾼다. 템플릿에서 다시 HTML 이스케이프하지 않도록 본문에는 `{{{변수}}}`를 사용한다. 신뢰되지 않은 원문을 삼중 중괄호에 직접 전달하지 않는다.
- 근거: Resend [Working with Variables](https://resend.com/docs/dashboard/templates/template-variables)의 HTML 생성 예시는 `{{{PRODUCT}}}` 형태다. 편집기에서 `{{`를 입력하는 것은 변수 추가 UI를 여는 설명이다. 문서가 두 문법의 이스케이프 차이를 명시적으로 보장하지는 않으므로, 삼중 중괄호 사용은 공식 HTML 예시에 맞춘 선택이다. 최종 동작은 실제 시험 메일의 특수문자·줄바꿈·이중 이스케이프 여부로 확인한다.
- [Send Email](https://resend.com/docs/api-reference/emails/send-email)의 `template.variables.value`는 문자열 변수 하나당 최대 2,000자다. 답변은 원문 1~2,000자이면서 HTML 변환 후에도 2,000자 이하여야 한다. 초과하면 발송 전에 안내하며 자르거나 분할하지 않는다.
- 문의 요약은 원문 앞부분 최대 300자를 먼저 추리고 변환한다. 이름도 동일하게 이스케이프한다. 유형은 `제품`·`일반`, 수신 시각은 `Asia/Seoul` 기준 날짜·시각과 `(한국 시간)`으로 표시한다.
- 변수는 아래 본문의 위치에만 배치한다. 사용자 입력을 HTML 태그·스타일·스크립트·제목에 넣지 않는다. 관리자 링크 변수는 설정된 안전한 원점과 서버가 생성한 문의 UUID로만 만든다.
- 메일 제목은 코드에서 고정한다. 담당자 알림: `슬리피에 새 문의가 접수되었습니다`, 문의자 답변: `슬리피 문의에 답변드립니다`. From·Reply-To·수신자에 줄바꿈이 있으면 발송하지 않는다.

### 담당자 알림 본문

변수: `CUSTOMER_NAME`, `INQUIRY_TYPE`, `RECEIVED_AT`, `INQUIRY_PREVIEW_HTML`, `ADMIN_URL`.

```html
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background:#f7f6fa;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;"
>
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="max-width:600px;background:#ffffff;border:1px solid #dddae4;border-radius:12px;overflow:hidden;"
      >
        <tr>
          <td
            style="background:#3f2867;padding:20px 32px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;"
          >
            슬리피
          </td>
        </tr>
        <tr>
          <td
            style="padding:32px;color:#1d1b24;font-size:16px;line-height:1.6;"
          >
            <h1
              style="margin:0 0 8px;font-size:22px;line-height:1.4;color:#1d1b24;"
            >
              새 문의가 접수되었습니다
            </h1>
            <p style="margin:0 0 24px;color:#5c5a66;font-size:14px;">
              관리자 화면에서 내용을 확인하고 답변해 주세요.
            </p>
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="border-top:1px solid #dddae4;font-size:15px;"
            >
              <tr>
                <td
                  style="padding:12px 0;width:96px;color:#5c5a66;border-bottom:1px solid #dddae4;"
                >
                  이름
                </td>
                <td
                  style="padding:12px 0;border-bottom:1px solid #dddae4;word-break:break-word;"
                >
                  {{{CUSTOMER_NAME}}}
                </td>
              </tr>
              <tr>
                <td
                  style="padding:12px 0;width:96px;color:#5c5a66;border-bottom:1px solid #dddae4;"
                >
                  유형
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #dddae4;">
                  {{{INQUIRY_TYPE}}}
                </td>
              </tr>
              <tr>
                <td
                  style="padding:12px 0;width:96px;color:#5c5a66;border-bottom:1px solid #dddae4;"
                >
                  접수 시각
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #dddae4;">
                  {{{RECEIVED_AT}}}
                </td>
              </tr>
            </table>
            <p
              style="margin:28px 0 8px;font-size:14px;font-weight:700;color:#3f2867;"
            >
              문의 요약
            </p>
            <div
              style="background:#eee9f6;border-radius:8px;padding:16px;font-size:15px;line-height:1.7;word-break:break-word;"
            >
              {{{INQUIRY_PREVIEW_HTML}}}
            </div>
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin-top:28px;"
            >
              <tr>
                <td style="background:#3f2867;border-radius:8px;">
                  <a
                    href="{{{ADMIN_URL}}}"
                    style="display:inline-block;padding:14px 24px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;"
                    >관리자 화면에서 확인하기</a
                  >
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td
            style="padding:20px 32px;background:#f7f6fa;border-top:1px solid #dddae4;color:#5c5a66;font-size:12px;line-height:1.6;"
          >
            이 메일은 슬리피 홈페이지에 문의가 접수되면 자동으로 발송됩니다.<br />(주)슬리피
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### 문의자 답변 본문

변수: `CUSTOMER_NAME`, `INQUIRY_PREVIEW_HTML`, `REPLY_HTML`.

```html
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background:#f7f6fa;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;"
>
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="max-width:600px;background:#ffffff;border:1px solid #dddae4;border-radius:12px;overflow:hidden;"
      >
        <tr>
          <td
            style="background:#3f2867;padding:20px 32px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;"
          >
            슬리피
          </td>
        </tr>
        <tr>
          <td
            style="padding:32px;color:#1d1b24;font-size:16px;line-height:1.7;"
          >
            <h1
              style="margin:0 0 16px;font-size:22px;line-height:1.4;color:#1d1b24;"
            >
              문의에 답변드립니다
            </h1>
            <p style="margin:0 0 24px;">
              {{{CUSTOMER_NAME}}}님, 안녕하세요. 슬리피에 문의해 주셔서
              감사합니다.
            </p>
            <p
              style="margin:0 0 8px;font-size:14px;font-weight:700;color:#3f2867;"
            >
              답변
            </p>
            <div
              style="border-left:3px solid #6f4f9a;padding:4px 0 4px 16px;font-size:16px;line-height:1.8;word-break:break-word;"
            >
              {{{REPLY_HTML}}}
            </div>
            <p
              style="margin:32px 0 8px;font-size:13px;font-weight:700;color:#5c5a66;"
            >
              보내주신 문의
            </p>
            <div
              style="background:#f7f6fa;border:1px solid #dddae4;border-radius:8px;padding:14px 16px;color:#5c5a66;font-size:14px;line-height:1.7;word-break:break-word;"
            >
              {{{INQUIRY_PREVIEW_HTML}}}
            </div>
            <p style="margin:28px 0 0;font-size:15px;">
              추가로 궁금한 점이 있으면 이 메일에 답장해 주세요.
            </p>
          </td>
        </tr>
        <tr>
          <td
            style="padding:20px 32px;background:#f7f6fa;border-top:1px solid #dddae4;color:#5c5a66;font-size:12px;line-height:1.6;"
          >
            이 메일은 슬리피 홈페이지로 보내주신 문의에 대한 답변입니다.<br />(주)슬리피
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

## DB 적용

Supabase 대시보드 → SQL Editor → New query에서 `supabase/migrations/20261107090000_inquiry_reply.sql` 전체를 실행한다. 기존 문의는 `reply_body`, `reply_status`, `reply_email_id`가 NULL, `reply_attempt`가 0이다. 원격 적용은 사용자가 직접 한다. 기존 관리자 SELECT·UPDATE RLS를 사용하므로 정책 변경은 없다.

## 실패와 복구

- 담당자 알림은 문의 저장이 확정된 뒤 `after()`에 등록한다. 실패·설정 누락·등록 실패여도 문의 접수 성공은 유지한다. 서버 로그에는 문의 ID와 고정 실패 코드만 기록한다. 자동 재발송·영구 큐는 없다. 호스팅 실행 제한·프로세스 종료로 알림이 누락될 수 있어 관리 화면에서도 새 문의를 확인한다.
- 답변은 사용자 세션으로 `new`이고 `sending`이 아닌 행을 조건부 갱신해 선점한 뒤 보낸다. 같은 답변은 같은 attempt·키, 수정한 답변은 attempt 증가·새 키를 사용한다. Resend 성공은 발송 접수이며 받은 편지함 도착을 보장하는 상태는 아니다.
- 오류·결과 불확실은 `failed`로 합치고 원문을 유지한다. 성공 후 DB 갱신 실패도 같은 키로 복구한다. DB까지 실패하면 `sending`이 남을 수 있다.
- 멈춘 `sending`은 기존 요청이 종료됐고 Resend 대시보드를 확인했다는 확인 후 **수동 해제 한 가지 방법**으로 `failed`로 바꾼다. 해제는 발송하거나 attempt를 올리지 않는다. 재시도 전에도 대시보드 확인을 체크한다.
- [Resend 중복 방지 키](https://resend.com/docs/dashboard/emails/idempotency-keys)는 24시간만 보관된다. 앱에 시간 제한 로직은 없으며 오래된 재시도는 같은 키라도 새 메일이 될 수 있다. 같은 키의 요청 내용이 바뀌어 생기는 409 오류도 자동으로 새 키를 만들어 우회하지 않는다.

## 실제 시험 순서

1. 사용자가 마이그레이션·Publish·환경 변수 설정을 마친 뒤 정상 환경으로 다시 빌드·실행한다. 오프라인 검사에서 만든 빌드·가짜 서비스는 실제 발송 검증에 사용하지 않는다.
2. 공개 문의 폼에서 사용자가 시험 수신 주소를 직접 입력한다. 이름과 문의에 `<`, `&`, `"`, `'`와 줄바꿈을 포함해 저장한다.
3. 사용자가 Gmail에서 알림 수신, 이름·요약의 특수문자와 줄바꿈 표시, 한국 시간·유형·관리 링크를 확인한다. `&lt;`·`&amp;` 같은 엔티티 문자열이 보이면 이중 이스케이프이므로 실패다.
4. 사용자가 관리자로 로그인한다. 답변에도 같은 특수문자와 줄바꿈을 넣어 발송하고, 새 문의 개수 감소·답변 완료 이동을 확인한다.
5. 사용자가 시험 메일함에서 답변 수신·원래 문의 요약·답변 표시와 **Reply-To가 설정한 담당자 주소인지** 확인한다. 알림의 Reply-To도 확인한다. 비밀번호·키·주소 값은 대화에 보내지 않는다.
6. 로그아웃 상태와 일반 계정으로는 문의 데이터·답변 Action이 거부되는지 확인한다.

실제 발송 확인 결과는 `docs/testing.md`에 실행한 범위만 기록한다.

## 확인 대기 목록 (2026-11-07)

사용자 설정 완료 보고를 반영했다. 실제 원격 권한·메일 수신 결과는 아래 순서로 추가 확인한다.

- [x] 사용자가 원격 DB에 `20261107090000_inquiry_reply.sql` 적용 완료를 보고했다.
- [x] 실제 관리자 세션에서 시험 문의 SELECT·답변 저장 UPDATE를 확인했다. 시험 전 기존 문의가 0건이어서 기존 행의 기본값 확인 대상은 없었다. 시험 문의는 답변 전 새 문의, 답변 후 답변 완료로 표시됐다.
- [x] 사용자가 담당자 알림·문의자 답변 템플릿 Publish와 로컬 템플릿 ID 설정 완료를 보고했다.
- [x] 로컬 메일 환경 변수 7개 입력·형식과 `MAIL_SITE_URL`의 `http://localhost:3000` 일치를 값 출력 없이 확인하고 실제 설정의 개발 서버를 3000번 포트로 실행했다.
- [x] 사용자가 로컬 `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` 설정 완료를 보고했다. 두 값의 존재만 확인하고 3000번 개발 서버를 재시작했다. 공개 문의 폼의 설정 대기 안내가 사라지고 입력 폼·전송 버튼이 표시됐으며, 실제 시험 문의는 Turnstile 서버 확인을 거쳐 저장됐다.
- [x] 사용자가 시험 문의를 접수하고 담당자 알림 수신을 확인했다. 실제 선택한 유형은 일반이다. 한국어 유형·한국 시간·300자 요약·관리 링크는 사용자 확인 완료로 기록한다. 에이전트는 관리자 상세에서 문의 전문·끝의 END45 보존과 새 문의 1건을 확인했다.
- [x] 사용자가 관리자 답변 발송과 시험 메일함 수신을 확인했다. 에이전트는 새 문의 0건, 저장된 답변·발송 시각·Resend ID 표시, 새로고침 후 답변 완료 유지·재발송 버튼 제거를 확인했다.
- [x] 두 메일의 특수문자·줄바꿈·이중 이스케이프·Reply-To는 사용자 확인 완료로 기록한다. 연결된 브라우저에 해당 메일 탭이 없어 에이전트가 메일 본문·헤더를 직접 읽은 결과는 아니다.
- [x] 비로그인 HTTP 요청에서 문의 목록·상세의 데이터 비노출과 답변·수동 해제 Action의 unauthenticated 거부를 확인했다. 실제 문의 내용을 바꾸는 요청은 실행하지 않았다.
- [x] 사용자가 test-user1 계정의 관리자 로그인 거부를 확인했다. 로그인 거부 시 세션을 정리하는 구조여서 일반 계정 세션의 Action 직접 호출·원격 RLS 검증과는 구분한다.
- [ ] 일반 계정 세션으로 Action·원격 RLS를 직접 호출하는 검증은 미실행이다. 관리 Action 권한 거부는 단위 테스트, 비로그인 직접 호출, 기존 관리자 RLS SQL 검토로 확인했다.
- [ ] **추후 진행(2026-11-07 사용자 결정):** Vercel Preview에 메일 환경 변수 7개와 Turnstile 설정 2개를 입력하고 재배포한다. `MAIL_SITE_URL`은 미리보기 원점, Turnstile 허용 호스트는 해당 미리보기 호스트로 맞춘다. 키·개인 주소 값은 공유하지 않는다.
- [ ] **추후 진행:** Vercel 미리보기에서 모바일·PC 화면과 응답 후 알림 실행을 확인한다. 로컬 검증 성공과 배포 검증 완료를 구분한다.

발송 실패·동시 발송·같은 답변 재시도·수정 답변의 새 attempt·멈춘 sending의 수동 해제는 단위 테스트로 확인했다. 실제 Resend 장애·원격 DB 장애·24시간이 지난 중복 키의 동작은 실행하지 않았다.

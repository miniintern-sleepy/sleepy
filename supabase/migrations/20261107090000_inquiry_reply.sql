-- #45: 기존 관리자 SELECT·UPDATE RLS를 그대로 적용한다.
begin;

alter table public.inquiries
  add column reply_body text check (char_length(reply_body) between 1 and 2000),
  add column reply_status text check (reply_status in ('sending', 'failed', 'sent')),
  add column reply_attempt integer not null default 0 check (reply_attempt >= 0),
  add column reply_email_id text;

comment on column public.inquiries.reply_body is '정규화한 답변 원문. 메일 HTML은 서버에서 변환한다.';
comment on column public.inquiries.reply_status is 'NULL: 미발송, sending: 발송 중, failed: 실패·결과 불확실, sent: 발송 접수 완료';
comment on column public.inquiries.reply_attempt is '첫 발송은 1. 같은 답변 재시도는 유지, 답변 수정 시 증가';

commit;

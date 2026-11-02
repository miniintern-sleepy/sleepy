-- v1 테이블 6개, 관리자 확인 함수, RLS (docs/database.md, D-39)
-- 초기 데이터(FAQ, 제품 사양, 뉴스)는 별도 마이그레이션으로 넣는다.

-- 테이블

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('product', 'general')),
  name text not null check (char_length(name) between 1 and 50),
  email text not null check (char_length(email) <= 254),
  -- 길이 제한은 스팸 방어용이다(D-08).
  message text not null check (char_length(message) between 1 and 2000),
  consented_at timestamptz not null,
  status text not null default 'new' check (status in ('new', 'answered')),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.product_specs (
  id bigint generated always as identity primary key,
  label text not null,
  value text not null,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

create table public.news_articles (
  id bigint generated always as identity primary key,
  category text not null check (category in ('company', 'press', 'notice')),
  title text not null,
  summary text,
  source_name text,
  source_url text,
  thumbnail_url text,
  published_at date not null,
  is_featured boolean not null default false,
  is_published boolean not null default false
);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values ('purchase_url', null);

-- 관리자 확인 함수
-- security definer: 호출한 사람이 admins를 읽을 권한이 없어도 확인할 수 있게 한다.
-- 주의: search_path를 비워 두어야 다른 스키마의 같은 이름 객체로 바꿔치기되지 않는다.

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- RLS (D-13)
-- 문의 저장과 관리자 추가는 서버 전용 키(service_role)가 RLS를 건너뛰어 처리하므로 정책을 두지 않는다.

alter table public.inquiries enable row level security;
alter table public.faqs enable row level security;
alter table public.product_specs enable row level security;
alter table public.site_settings enable row level security;
alter table public.news_articles enable row level security;
alter table public.admins enable row level security;

create policy "관리자는 문의를 읽는다" on public.inquiries
  for select to authenticated using ((select public.is_admin()));
create policy "관리자는 문의 상태를 바꾼다" on public.inquiries
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "공개된 FAQ는 누구나 읽는다" on public.faqs
  for select to anon, authenticated using (is_published);
create policy "관리자는 FAQ를 모두 다룬다" on public.faqs
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "공개된 사양은 누구나 읽는다" on public.product_specs
  for select to anon, authenticated using (is_published);
create policy "관리자는 사양을 모두 다룬다" on public.product_specs
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "설정은 누구나 읽는다" on public.site_settings
  for select to anon, authenticated using (true);
create policy "관리자는 설정을 모두 다룬다" on public.site_settings
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "공개된 기사는 누구나 읽는다" on public.news_articles
  for select to anon, authenticated using (is_published);
create policy "관리자는 기사를 모두 다룬다" on public.news_articles
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "관리자는 자기 행만 읽는다" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

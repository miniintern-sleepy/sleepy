-- #44: 공개 뉴스 썸네일. 관리 Action과 동일하게 900KB(921,600바이트)로 제한한다.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-thumbnails', 'news-thumbnails', true, 921600,
  array['image/jpeg', 'image/png', 'image/webp']);

create policy "관리자는 뉴스 썸네일을 조회한다" on storage.objects
  for select to authenticated using (
    bucket_id = 'news-thumbnails' and (storage.foldername(name))[1] = 'news'
    and (select public.is_admin())
  );

create policy "관리자는 뉴스 썸네일을 올린다" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'news-thumbnails' and (storage.foldername(name))[1] = 'news'
    and (select public.is_admin())
  );

create policy "관리자는 뉴스 썸네일을 삭제한다" on storage.objects
  for delete to authenticated using (
    bucket_id = 'news-thumbnails' and (storage.foldername(name))[1] = 'news'
    and (select public.is_admin())
  );

commit;

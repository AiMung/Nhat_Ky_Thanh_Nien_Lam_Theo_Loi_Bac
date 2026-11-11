-- ========================================================
-- ĐỀ ÁN KÝ ỨC LỊCH SỬ - DATABASE SCHEMA & RLS MIGRATION
-- Ngày khởi tạo: 11/11/2026
-- ========================================================

-- 1. KÍCH HOẠT EXTENSIONS CẦN THIẾT
create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- 2. HÀM UNACCENT IMMUTABLE (Phục vụ Full-Text Search không dấu)
create or replace function public.f_unaccent(text)
returns text as $$
  select public.unaccent('public.unaccent', $1);
$$ language sql immutable set search_path = public;

-- 3. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Hàm Security Definer kiểm tra Admin tuyệt đối an toàn
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- 4. BẢNG DANH MỤC CHỦ ĐỀ (CATEGORIES)
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  sort_order int default 0
);

-- 5. BẢNG TỈNH THÀNH (PROVINCES)
create table if not exists public.provinces (
  code text primary key,
  name text not null,
  svg_id text not null unique,
  region text not null
);

-- 6. BẢNG CÂU CHUYỆN LỊCH SỬ (STORIES)
create table if not exists public.stories (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  narrator_name text not null,
  contributor_name text,
  summary text not null,
  body text not null,
  category_id uuid references public.categories(id) on delete restrict,
  province_code text references public.provinces(code) on delete restrict,
  event_year int,
  period text not null check (period in ('1945-truoc', '1945-1954', '1955-1975', '1975-1988', '1989-nay')),
  status text not null default 'pending' check (status in ('draft', 'pending', 'approved', 'rejected')),
  reject_reason text,
  cover_url text,
  read_minutes int default 3,
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('simple', public.f_unaccent(coalesce(title, '') || ' ' || coalesce(narrator_name, '') || ' ' || coalesce(summary, '')))
  ) stored
);

create index if not exists idx_stories_search on public.stories using gin(search_vector);
create index if not exists idx_stories_status_published on public.stories(status, published_at desc);

-- 7. BẢNG ẢNH ĐÍNH KÈM CÂU CHUYỆN (STORY_IMAGES)
create table if not exists public.story_images (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references public.stories(id) on delete cascade,
  url text not null,
  caption text,
  sort_order int default 0
);

-- 8. BẢNG BÁO CÁO VI PHẠM / GỠ BÀI (REPORTS)
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references public.stories(id) on delete cascade,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null,
  contact_email text,
  handled boolean default false,
  created_at timestamptz not null default now()
);

-- 9. VIEW THỐNG KÊ SỐ TRUYỆN THEO TỈNH (BẢN ĐỒ KÝ ỨC)
create or replace view public.story_counts_by_province as
select 
  p.code,
  p.name,
  p.svg_id,
  count(s.id)::int as approved_stories_count
from public.provinces p
left join public.stories s on p.code = s.province_code and s.status = 'approved'
group by p.code, p.name, p.svg_id;

-- 10. HÀM TÌM KIẾM RPC KHÔNG DẤU
create or replace function public.search_stories(keyword text)
returns setof public.stories as $$
  select * from public.stories
  where status = 'approved'
    and search_vector @@ plainto_tsquery('simple', public.f_unaccent(keyword))
  order by ts_rank(search_vector, plainto_tsquery('simple', public.f_unaccent(keyword))) desc;
$$ language sql stable set search_path = public;

-- 11. BẢO MẬT ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.provinces enable row level security;
alter table public.stories enable row level security;
alter table public.story_images enable row level security;
alter table public.reports enable row level security;

-- Policies Profiles
create policy "Public read profiles" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Policies Categories & Provinces (Đọc công khai)
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read provinces" on public.provinces for select using (true);

-- Policies Stories
create policy "Read approved stories" on public.stories for select
  using (status = 'approved');

create policy "Authors read own stories" on public.stories for select to authenticated
  using (author_id = auth.uid());

create policy "Authors insert stories" on public.stories for insert to authenticated
  with check (author_id = auth.uid() and status in ('draft', 'pending'));

create policy "Authors update own pending" on public.stories for update to authenticated
  using (author_id = auth.uid() and status in ('draft', 'pending'))
  with check (author_id = auth.uid() and status in ('draft', 'pending'));

create policy "Admin full access stories" on public.stories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Policies Reports
create policy "Anyone insert report" on public.reports for insert with check (true);
create policy "Admin read reports" on public.reports for select to authenticated using (public.is_admin());
create policy "Admin update reports" on public.reports for update to authenticated using (public.is_admin());

-- 12. TRIGGERS: TỰ TẠO PROFILE & GIỚI HẠN SPAM 5 BÀI/NGÀY
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.check_daily_story_limit()
returns trigger as $$
declare
  story_count int;
begin
  select count(*) into story_count
  from public.stories
  where author_id = auth.uid()
    and created_at >= now() - interval '24 hours';

  if story_count >= 5 then
    raise exception 'Bạn đã đạt giới hạn gửi tối đa 5 câu chuyện trong vòng 24 giờ.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_check_daily_limit on public.stories;
create trigger trg_check_daily_limit
  before insert on public.stories
  for each row execute function public.check_daily_story_limit();

-- 13. SEED DỮ LIỆU DANH MỤC BAN ĐẦU
insert into public.categories (name, slug, sort_order) values
  ('Anh hùng lực lượng vũ trang', 'anh-hung-llvt', 1),
  ('Cựu chiến binh', 'cuu-chien-binh', 2),
  ('Mẹ Việt Nam anh hùng', 'me-viet-nam-anh-hung', 3),
  ('Nhân chứng trực tiếp tham gia sự kiện', 'nhan-chung-su-kien', 4),
  ('Người có công giúp đỡ cách mạng', 'nguoi-co-cong', 5),
  ('Tuổi trẻ & Thanh niên xung phong', 'thanh-nien-xung-phong', 6),
  ('Ký ức thời bình & Khác', 'khac', 7)
on conflict (slug) do nothing;

-- 14. SEED TỈNH THÀNH (Đặc biệt: Đà Nẵng quản lý Hoàng Sa, Khánh Hòa quản lý Trường Sa)
insert into public.provinces (code, name, svg_id, region) values
  ('HN', 'Hà Nội', 'vn-hn', 'Bắc Bộ'),
  ('HCM', 'TP. Hồ Chí Minh', 'vn-hcm', 'Nam Bộ'),
  ('DN', 'Đà Nẵng (gồm Huyện Hoàng Sa)', 'vn-dn', 'Trung Bộ'),
  ('KH', 'Khánh Hòa (gồm Huyện Trường Sa)', 'vn-kh', 'Trung Bộ'),
  ('DB', 'Điện Biên', 'vn-db', 'Bắc Bộ'),
  ('QT', 'Quảng Trị', 'vn-qt', 'Trung Bộ'),
  ('TH', 'Thanh Hóa', 'vn-th', 'Bắc Trung Bộ'),
  ('NA', 'Nghệ An', 'vn-na', 'Bắc Trung Bộ'),
  ('TN', 'Tây Ninh', 'vn-tn', 'Nam Bộ'),
  ('BD', 'Bình Dương', 'vn-bd', 'Nam Bộ'),
  ('CT', 'Cần Thơ', 'vn-ct', 'Tây Nam Bộ')
on conflict (code) do nothing;


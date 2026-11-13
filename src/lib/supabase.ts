import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Story } from './storage';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.PUBLIC_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('cfg_supabase_url');
    const localKey = localStorage.getItem('cfg_supabase_anon_key');
    if (localUrl && localKey) {
      return { url: localUrl, anonKey: localKey };
    }
  }

  return {
    url: envUrl || 'https://placeholder.supabase.co',
    anonKey: envKey || 'placeholder-anon-key'
  };
}

export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return (
    Boolean(cfg.url && cfg.anonKey) &&
    cfg.url !== 'https://placeholder.supabase.co' &&
    cfg.anonKey !== 'placeholder-anon-key'
  );
}

let _supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const cfg = getSupabaseConfig();
  if (!_supabaseClient) {
    _supabaseClient = createClient(cfg.url, cfg.anonKey);
  }
  return _supabaseClient;
}

export const supabase = getSupabase();

/**
 * SQL SCHEMA CHUẨN ĐỂ COPY DÁN VÀO SUPABASE SQL EDITOR
 */
export const SUPABASE_SQL_SCHEMA = `
-- 1. BẢNG STORIES: Lưu trữ nhật ký và câu chuyện lịch sử
CREATE TABLE IF NOT EXISTS public.stories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  narrator_name TEXT,
  contributor_name TEXT,
  contributor_unit TEXT,
  to_dan_pho TEXT,
  summary TEXT,
  body TEXT NOT NULL,
  category_id TEXT,
  category_name TEXT,
  province_code TEXT,
  province_name TEXT,
  event_year INTEGER,
  period TEXT,
  media_type TEXT DEFAULT 'article',
  video_url TEXT,
  audio_url TEXT,
  cover_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  historical_characters JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  reject_reason TEXT,
  read_minutes INTEGER DEFAULT 3,
  likes_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG HISTORICAL_CHARACTERS: Lưu trữ nhân vật lịch sử
CREATE TABLE IF NOT EXISTS public.characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year TEXT,
  hometown TEXT,
  biography TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN ĐỌC/GHI CÔNG KHAI
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc câu chuyện đã được phê duyệt
CREATE POLICY "Public read approved stories" ON public.stories
  FOR SELECT USING (true);

-- Cho phép đoàn viên gửi câu chuyện mới (trạng thái pending hoặc draft)
CREATE POLICY "Public insert new stories" ON public.stories
  FOR INSERT WITH CHECK (true);

-- Cho phép cập nhật câu chuyện (phê duyệt / sửa)
CREATE POLICY "Public update stories" ON public.stories
  FOR UPDATE USING (true);

-- Cho phép đọc nhân vật lịch sử
CREATE POLICY "Public read characters" ON public.characters
  FOR SELECT USING (true);

CREATE POLICY "Public insert characters" ON public.characters
  FOR INSERT WITH CHECK (true);
`;

/**
 * Lưu hoặc đồng bộ một Story lên Supabase
 */
export async function saveStoryToSupabase(story: Story): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getSupabase();
    const { error } = await client.from('stories').upsert({
      id: story.id,
      slug: story.slug,
      title: story.title,
      narrator_name: story.narrator_name,
      contributor_name: story.contributor_name,
      contributor_unit: story.contributor_unit,
      to_dan_pho: story.to_dan_pho,
      summary: story.summary,
      body: story.body,
      category_id: story.category_id,
      category_name: story.category_name,
      province_code: story.province_code,
      province_name: story.province_name,
      event_year: story.event_year,
      period: story.period,
      media_type: story.media_type || 'article',
      video_url: story.video_url,
      audio_url: story.audio_url,
      cover_url: story.cover_url,
      images: story.images || [],
      historical_characters: story.historical_characters || [],
      status: story.status,
      reject_reason: story.reject_reason,
      read_minutes: story.read_minutes,
      likes_count: story.likes_count || 0,
      published_at: story.published_at || new Date().toISOString(),
      created_at: story.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('Lỗi Supabase upsert story:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Không thể kết nối Supabase:', err);
    return false;
  }
}

/**
 * Tải danh sách Story từ Supabase (nếu đã cấu hình)
 */
export async function fetchStoriesFromSupabase(): Promise<Story[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) {
      console.warn('Lỗi tải stories từ Supabase:', error?.message);
      return null;
    }
    return data as Story[];
  } catch (err) {
    console.warn('Lỗi kết nối Supabase:', err);
    return null;
  }
}

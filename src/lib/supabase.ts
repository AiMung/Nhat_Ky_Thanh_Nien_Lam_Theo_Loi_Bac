import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dữ liệu mẫu khởi đầu (Fallback Seed Stories khi chưa cấu hình Supabase thực tế)
export interface Story {
  id: string;
  slug: string;
  title: string;
  narrator_name: string;
  contributor_name: string;
  summary: string;
  body: string;
  category_id?: string;
  category_name?: string;
  province_code: string;
  province_name: string;
  event_year?: number;
  period: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  cover_url?: string;
  read_minutes: number;
  published_at?: string;
  created_at: string;
}

export const SAMPLE_STORIES: Story[] = [
  {
    id: 's-1',
    slug: 'ky-uc-dien-bien-phu-nhung-ngay-keo-phao',
    title: 'Ký ức Điện Biên Phủ: Những ngày kéo pháo qua dốc đèo hiểm trở',
    narrator_name: 'Bác Nguyễn Văn Hùng',
    contributor_name: 'Chi đoàn Thanh niên Phường Bến Nghé, Quận 1',
    summary: 'Hồi ức sống động về tinh thần thép của bộ đội pháo binh Việt Nam trong chiến dịch Điện Biên Phủ 1954, từng mét đường nhích từng bước chân qua đèo sương.',
    body: `### Tiếng hô dô ta trên đỉnh dốc Chuối\n\nNăm đó tôi mới tròn hai mươi mốt tuổi, thuộc khẩu đội pháo cao xạ 37mm. Đêm 16 tháng 1 năm 1954, lệnh kéo pháo vào trận địa bắt đầu.\n\nĐường dốc đứng, sương mù dày đặc che khuất tầm nhìn. Mỗi khẩu pháo nặng hàng tấn chỉ trông cậy vào sức người, từng sợi dây mây, dây tời móc vào hốc đá. Đồng chí Tô Vĩnh Diện, người anh em cùng tiểu đội, đã anh dũng hy sinh chèn thân mình cứu pháo khi tời đứt.\n\n> "Còn người còn pháo, dù gian khổ hy sinh đến đâu cũng phải đưa pháo vào trận địa an toàn!" - Đó là lời thề sắt son của cả đơn vị trong những đêm thức trắng.`,
    category_name: 'Cựu chiến binh',
    province_code: 'DB',
    province_name: 'Điện Biên',
    event_year: 1954,
    period: '1945-1954',
    status: 'approved',
    cover_url: '',
    read_minutes: 4,
    published_at: '2026-05-07T08:00:00Z',
    created_at: '2026-05-01T10:00:00Z'
  },
  {
    id: 's-2',
    slug: 'chuyen-chuyen-thu-vuot-tuyen-lua-truong-son',
    title: 'Những cánh thư vượt tuyến lửa Trường Sơn và lời hẹn ngày toàn thắng',
    narrator_name: 'Cô Trần Thị Mai (Cựu nữ TNXP)',
    contributor_name: 'Đoàn Trường Đại học KHXH&NV TP.HCM',
    summary: 'Chuyện về những phong thư viết vội trên vỏ bao thuốc lá, cất giữ trong túi bạt ni lông gửi về hậu phương giữa mưa bom bão đạn.',
    body: `### Cánh thư nơi Ngã ba Đồng Lộc\n\nGiữa rừng Trường Sơn những năm 1968, bom từ trường và rốc-két rải thảm suốt ngày đêm. Thứ quý giá nhất sau mỗi trận đánh là những lá thư từ hậu phương gửi vào và từ chiến trường gửi ra.\n\nMực viết hết thì dùng than củi nghiền nhỏ, giấy rách thì dán lại bằng cơm nguội. Những cánh thư ấy mang theo hơi ấm của gia đình, tình yêu đôi lứa và niềm tin bất diệt vào ngày độc lập thống nhất non sông.`,
    category_name: 'Tuổi trẻ & Thanh niên xung phong',
    province_code: 'QT',
    province_name: 'Quảng Trị',
    event_year: 1968,
    period: '1955-1975',
    status: 'approved',
    cover_url: '',
    read_minutes: 3,
    published_at: '2026-04-30T09:00:00Z',
    created_at: '2026-04-20T11:00:00Z'
  },
  {
    id: 's-3',
    slug: 'biet-dong-sai-gon-muu-tri-giua-long-do-thanh',
    title: 'Biệt động Sài Gòn: Những chiến sĩ thầm lặng giữa lòng đô thành',
    narrator_name: 'Chú Lê Tấn Phát (Nhân chứng trực tiếp)',
    contributor_name: 'Tuổi trẻ Thành Đoàn TP. Hồ Chí Minh',
    summary: 'Ký ức về mạng lưới hầm bí mật nuôi giấu cán bộ, cất giấu vũ khí chuẩn bị cho cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968.',
    body: `### Căn hầm nổi giữa lòng Sài Gòn\n\nNhà số 287/70 đường Nguyễn Đình Chiểu khi ấy là một tiệm đóng bàn ghế bình thường. Ít ai ngờ dưới sàn ván ép là một căn hầm chứa gần hai tấn thuốc nổ, súng AK và lựu đạn.\n\nNgười chiến sĩ biệt động ban ngày hòa vào dòng người buôn bán, đêm về lau chùi từng viên đạn, bảo vệ an toàn cho sở chỉ huy tiền phương.`,
    category_name: 'Anh hùng lực lượng vũ trang',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 1968,
    period: '1955-1975',
    status: 'approved',
    cover_url: '',
    read_minutes: 5,
    published_at: '2026-04-28T14:00:00Z',
    created_at: '2026-04-15T08:30:00Z'
  },
  {
    id: 's-4',
    slug: 'la-co-chu-quyen-tren-dao-truong-sa-nam-1988',
    title: 'Lá cờ Tổ quốc và ý chí kiên trung nơi đầu sóng Trường Sa',
    narrator_name: 'Bác Đỗ Đình Cường (Cựu binh Hải quân)',
    contributor_name: 'CLB Truyền thống Kháng chiến TP.HCM',
    summary: 'Khúc tráng ca Gạc Ma - Cô Lin - Len Đao năm 1988 và lời thề giữ vững từng tấc đất, ngọn sóng thiêng liêng của Tổ quốc.',
    body: `### Vòng tròn bất tử nơi ngọn sóng\n\nTháng 3 năm 1988, sóng gió Trường Sa gầm réo dữ dội. 64 cán bộ, chiến sĩ Hải quân nhân dân Việt Nam đã nắm chặt tay nhau quanh cột mốc chủ quyền tạo thành "Vòng tròn bất tử".\n\nMáu của các anh đã hòa vào lòng biển cả, để màu cờ đỏ sao vàng mãi tung bay kiêu hãnh giữa ngàn khơi Hoàng Sa và Trường Sa ruột thịt.`,
    category_name: 'Nhân chứng trực tiếp tham gia sự kiện',
    province_code: 'KH',
    province_name: 'Khánh Hòa (gồm Huyện Trường Sa)',
    event_year: 1988,
    period: '1975-1988',
    status: 'approved',
    cover_url: '',
    read_minutes: 4,
    published_at: '2026-03-14T07:30:00Z',
    created_at: '2026-03-01T09:00:00Z'
  }
];


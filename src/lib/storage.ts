/**
 * Module quản lý Dữ liệu và Trạng thái cho Dự án:
 * "NHẬT KÝ THANH NIÊN LÀM THEO LỜI BÁC" - Thành Đoàn TP. Hồ Chí Minh
 * Lưu trữ đồng bộ LocalStorage đảm bảo 100% chức năng sử dụng được ngay trên trình duyệt.
 */

export interface Story {
  id: string;
  slug: string;
  title: string;
  narrator_name: string;
  contributor_name: string;
  contributor_unit?: string;
  summary: string;
  body: string;
  category_id: string;
  category_name: string;
  province_code: string;
  province_name: string;
  event_year?: number;
  period: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  reject_reason?: string;
  cover_url: string;
  read_minutes: number;
  published_at?: string;
  created_at: string;
  likes_count?: number;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  unit: string;
  role: 'guest' | 'member' | 'admin';
  avatar: string;
}

// BỘ DỮ LIỆU GỐC ĐẶC SẮC VỚI HÌNH ẢNH CHÂN THỰC VÀ CHẤT LƯỢNG CAO
export const SEED_STORIES: Story[] = [
  {
    id: 'story-1',
    slug: 'loi-dan-cua-bac-voi-thanh-nien-sai-gon-gia-dinh',
    title: 'Lời dặn thiêng liêng của Bác Hồ và ngọn lửa đấu tranh của phong trào học sinh - sinh viên Sài Gòn',
    narrator_name: 'Bác Lê Văn Triết (Cựu cán bộ Thành Đoàn thời kỳ chống Mỹ)',
    contributor_name: 'Đoàn Trường Đại học Khoa học Xã hội và Nhân văn TP.HCM',
    contributor_unit: 'Ban Tuyên giáo Thành Đoàn TP.HCM',
    summary: 'Ký ức những đêm thắp nến đấu tranh vì hòa bình tại đô thành Sài Gòn, lấy lời dạy của Bác làm ngọn đuốc soi đường vượt qua lao tù, đòn roi mật thám.',
    body: `### Tiếng hát át tiếng bom giữa lòng đô thành\n\nNhững năm 1968 - 1970, trụ sở Tổng hội Sinh viên Sài Gòn tại số 4 đường Duy Tân (nay là Nhà Văn hóa Thanh niên TP.HCM) trở thành cái nôi của phong trào "Hát cho đồng bào tôi nghe".\n\nChúng tôi truyền tay nhau từng tờ truyền đơn in lời Bác Hồ kêu gọi: *"Không có gì quý hơn độc lập, tự do"*. Lời dạy của Bác giản dị nhưng là sức mạnh vĩ đại nhất để hàng ngàn học sinh, sinh viên xuống đường bất chấp lựu đạn cay và xe vòi rồng của cảnh sát dã chiến.\n\n> "Các đồng chí có thể giam cầm thể xác chúng tôi, nhưng không bao giờ giam cầm được tinh thần thanh niên yêu nước hướng về Bác Hồ và ngày thống nhất non sông!" - Lời tuyên bố đanh thép của anh Trần Văn Ơn vẫn mãi vang vọng trong tâm khảm thế hệ trẻ thành phố mang tên Bác.\n\n### Di sản để lại cho thế hệ trẻ hôm nay\n\nNgày nay, đứng trước tượng đài Bác Hồ tại phố đi bộ Nguyễn Huệ, tôi luôn nhắc nhở các bạn đoàn viên trẻ: Hãy sống có lý tưởng, dấn thân vì cộng đồng, học tập tư tưởng và tinh thần trách nhiệm của Bác từ những việc nhỏ bé nhất hàng ngày.`,
    category_id: 'phong-trao-doan',
    category_name: 'Ký ức Thành Đoàn & Kháng chiến',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 1968,
    period: '1955-1975',
    status: 'approved',
    cover_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    read_minutes: 4,
    published_at: '2026-05-19T07:00:00Z',
    created_at: '2026-05-15T08:30:00Z',
    likes_count: 342
  },
  {
    id: 'story-2',
    slug: 'chuyen-nhung-chiec-ao-xanh-rung-sac-can-gio',
    title: 'Hồi sinh lá phổi xanh Cần Giờ: Chiến công thầm lặng của Lực lượng Thanh niên Xung phong TP.HCM',
    narrator_name: 'Chú Nguyễn Văn Minh (Cựu chiến sĩ TNXP TP.HCM)',
    contributor_name: 'Đoàn Lực lượng TNXP Thành phố Hồ Chí Minh',
    contributor_unit: 'Lực lượng TNXP TP.HCM',
    summary: 'Hành trình hàng chục ngàn thanh niên thành phố đổ mồ hôi và cả máu để trồng lại hơn 30.000 héc-ta rừng ngập mặn Cần Giờ từng bị chất độc da cam hủy diệt.',
    body: `### Biến vùng đất chết thành Khu Dự trữ Sinh quyển Thế giới\n\nSau ngày 30 tháng 4 năm 1975, Rừng Sác Cần Giờ chỉ còn là bãi lầy trơ trụi đầy bùn đen, phèn mặn và bom mìn còn sót lại sau chiến tranh. Thực hiện lời kêu gọi của Đảng bộ và Thành Đoàn TP.HCM, hàng vạn đoàn viên thanh niên đã xung phong lên đường về vùng rừng ngập mặn.\n\nChân ngâm dưới bùn lầy, ăn cơm vắt chấm muối mè, muỗi và vắt cắn sưng chân, nhưng bàn tay thanh niên vẫn nâng niu từng trái đước, mầm bần cắm xuống lòng đất mẹ.\n\n> "Bàn tay ta làm nên tất cả. Có sức người sỏi đá cũng thành cơm. Bác dạy tuổi trẻ phải đi tiên phong vào những nơi gian khó nhất!"\n\nSau hơn 40 năm kiên trì, một kỳ tích màu xanh đã xuất hiện: Rừng ngập mặn Cần Giờ được UNESCO công nhận là Khu Dự trữ Sinh quyển Thế giới đầu tiên của Việt Nam, lá chắn xanh vững chãi che chở cho hơn 10 triệu đồng bào TP.HCM.`,
    category_id: 'thanh-nien-xung-phong',
    category_name: 'Thanh niên xung phong & Tiên phong',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 1978,
    period: '1975-1988',
    status: 'approved',
    cover_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
    read_minutes: 5,
    published_at: '2026-04-30T09:00:00Z',
    created_at: '2026-04-20T10:00:00Z',
    likes_count: 518
  },
  {
    id: 'story-3',
    slug: 'chien-dich-mua-he-xanh-30-nam-trao-yeu-thuong',
    title: '30 năm Mùa Hè Xanh: Những nhịp cầu nối nghĩa tình từ TP.HCM đến muôn nẻo đường Tổ quốc',
    narrator_name: 'Chị Đặng Thị Mai Anh (Chỉ huy phó Chiến dịch Mùa Hè Xanh TP.HCM)',
    contributor_name: 'Đoàn Trường Đại học Bách Khoa - ĐHQG-HCM',
    contributor_unit: 'Thành Đoàn TP. Hồ Chí Minh',
    summary: 'Từ chiến dịch Ánh sáng văn hóa hè 1994 đến phong trào tình nguyện quy mô toàn quốc, tinh thần "Ở dân thương, làm dân tin, đi dân nhớ" của tuổi trẻ TP.HCM.',
    body: `### Những bàn chân không mỏi trên mọi nẻo đường quê hương\n\nTừ phong trào "Ánh sáng văn hóa hè" xóa mù chữ cho đồng bào ngoại thành năm 1994, ngọn lửa tình nguyện của tuổi trẻ Sài Gòn - TP.HCM đã lan tỏa thành Chiến dịch Mùa Hè Xanh huyền thoại.\n\nCác bạn sinh viên Bách Khoa mang kiến thức về xây cầu bê tông nông thôn thay thế cầu khỉ; sinh viên Y Dược khám bệnh, phát thuốc miễn phí; sinh viên Sư phạm mở lớp học tình thương cho trẻ em nghèo từ vùng cao Tây Bắc, Tây Nguyên cho đến đồng bằng sông Cửu Long và nước bạn Lào.\n\n> "Đi để chia sẻ, đi để cống hiến, đi để rèn luyện và trưởng thành. Mỗi công trình thanh niên là một bông hoa đẹp kính dâng lên Bác Hồ muôn vàn kính yêu."`,
    category_id: 'tinh-nguyen',
    category_name: 'Tình nguyện vì cộng đồng',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 1994,
    period: '1989-nay',
    status: 'approved',
    cover_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    read_minutes: 4,
    published_at: '2026-07-27T08:00:00Z',
    created_at: '2026-07-20T14:00:00Z',
    likes_count: 789
  },
  {
    id: 'story-4',
    slug: 'la-thu-gui-tu-nha-gian-dk1-va-tinh-yeu-bien-dao',
    title: 'Lá thư từ Nhà giàn DK1: Tuổi 20 kiên trung nơi đầu sóng ngọn gió bảo vệ thềm lục địa',
    narrator_name: 'Thượng úy Hoàng Văn Tuấn (Chiến sĩ Hải quân Nhà giàn DK1)',
    contributor_name: 'Đoàn Thanh niên Bộ Tư lệnh Vùng 2 Hải quân',
    contributor_unit: 'Quận Đoàn 1 - TP.HCM kết nghĩa',
    summary: 'Câu chuyện xúc động về những người lính trẻ tuổi đôi mươi đứng chân trên cột thép giữa đại dương bao la, một lòng son sắt giữ vững chủ quyền biển đảo thiêng liêng.',
    body: `### Giữa ngàn khơi gió mặn và ánh mắt Bác Hồ soi đường\n\nNhà giàn DK1/10 sừng sững giữa thềm lục địa phía Nam. Nơi đây, khoảng cách với đất liền là hàng trăm hải lý, nguồn nước ngọt và rau xanh chắt chiu từng giọt.\n\nTrên vách sắt phòng sinh hoạt chung luôn treo trang trọng chân dung Chủ tịch Hồ Chí Minh. Mỗi lần đứng gác giữa màn đêm giông bão, ngắm lá cờ Tổ quốc phần phật tung bay, người chiến sĩ trẻ lại nhớ đến lời Bác dặn khi Người thăm Bộ đội Hải quân năm xưa:\n\n> "Ngày trước ta chỉ có đêm và rừng. Ngày nay ta có ngày, có trời, có biển. Bờ biển ta dài, tươi đẹp, ta phải biết giữ gìn lấy nó!"\n\nTuổi trẻ chúng tôi nguyện đem thanh xuân và tính mạng để giữ yên từng tấc biển, ngọn sóng của Tổ quốc.`,
    category_id: 'bien-dao',
    category_name: 'Bảo vệ chủ quyền Biển đảo',
    province_code: 'KH',
    province_name: 'Khánh Hòa (gồm Quần đảo Trường Sa & Nhà giàn DK1)',
    event_year: 2024,
    period: '1989-nay',
    status: 'approved',
    cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    read_minutes: 4,
    published_at: '2026-06-01T08:00:00Z',
    created_at: '2026-05-28T09:00:00Z',
    likes_count: 620
  },
  {
    id: 'story-5',
    slug: 'bac-si-tre-xung-phong-tam-dich-covid-tp-hcm',
    title: 'Mệnh lệnh từ trái tim: Ký ức blouse trắng tuổi trẻ kiên cường bảo vệ sinh mệnh đồng bào',
    narrator_name: 'Bác sĩ Trương Thị Thu Thảo (Bệnh viện Nhi Đồng 2)',
    contributor_name: 'Đoàn Khối Dân - Chính - Đảng TP.HCM',
    contributor_unit: 'Hội Thầy thuốc Trẻ TP.HCM',
    summary: 'Hơn 500 ngày đêm không ngủ của hàng ngàn y bác sĩ, sinh viên tình nguyện tuổi trẻ TP.HCM dốc cạn sức mình cứu người giữa đỉnh dịch.',
    body: `### Những ngày chiến đấu không tiếng súng\n\nMùa hè năm 2021, TP. Hồ Chí Minh đứng trước thử thách cam go nhất trong lịch sử y tế. Hàng vạn y bác sĩ trẻ, sinh viên ngành y đã viết đơn tình nguyện bằng máu để vào các bệnh viện dã chiến tầng 3.\n\nÁo bảo hộ ướt sũng mồ hôi 12 tiếng mỗi ca, da mặt hằn sâu vết khẩu trang N95, có những bạn trẻ hoãn cả đám cưới, có bạn chịu tang cha mẹ từ xa qua màn hình điện thoại để tiếp tục ép tim, bóp bóng hồi sức cho bệnh nhân.\n\n> "Học Bác lòng nhân ái, cứu người như cứu hỏa. Khi đồng bào cần, thanh niên y tế không cho phép mình lùi bước dù chỉ một giây!"`,
    category_id: 'hoc-tap-bac',
    category_name: 'Học tập & Làm theo lời Bác',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 2021,
    period: '1989-nay',
    status: 'approved',
    cover_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    read_minutes: 5,
    published_at: '2026-02-27T08:00:00Z',
    created_at: '2026-02-20T10:00:00Z',
    likes_count: 940
  },
  {
    id: 'story-6',
    slug: 'ban-do-so-dia-chi-do-tuoi-tre-sai-gon',
    title: 'Số hóa 100 Địa chỉ Đỏ: Công trình thanh niên chào mừng Đại hội Đoàn TP.HCM',
    narrator_name: 'Bạn Nguyễn Hoàng Nam (Kỹ sư trẻ, Bí thư Đoàn cơ sở)',
    contributor_name: 'Quận Đoàn 1 - TP. Hồ Chí Minh',
    contributor_unit: 'Ban Mặt trận - ANQP - ĐBDC Thành Đoàn',
    summary: 'Ứng dụng công nghệ VR 360 và QR Code đưa lịch sử đến gần hơn với thế hệ Gen Z tại các di tích lịch sử trọng điểm như Dinh Độc Lập, Hầm Vũ khí Biệt động Sài Gòn.',
    body: `### Đưa lịch sử cách mạng lên không gian số\n\nLịch sử không chỉ nằm trong sách giáo khoa mà phải hiện hữu sinh động trong đời sống giới trẻ. Nhóm bạn trẻ thuộc Chi đoàn Công nghệ đã tự tay lập trình và quay quét 3D toàn bộ hệ thống hầm bí mật Biệt động Sài Gòn, Khu tưởng niệm liệt sĩ Ngã Ba Giồng, và Căn cứ Núi Dinh.\n\nDu khách và đoàn viên chỉ cần quét mã QR tại hiện trường là có thể nghe audio thuyết minh tự động, tương tác 3D và tìm hiểu tiểu sử từng nhân chứng lịch sử.\n\n> "Làm theo lời Bác trong thời đại 4.0 chính là dùng tri thức, công nghệ để phụng sự Tổ quốc và gìn giữ cội nguồn dân tộc."`,
    category_id: 'cong-trinh-thanh-nien',
    category_name: 'Công trình Thanh niên thời đại số',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 2023,
    period: '1989-nay',
    status: 'approved',
    cover_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    read_minutes: 3,
    published_at: '2026-03-26T08:00:00Z',
    created_at: '2026-03-20T09:00:00Z',
    likes_count: 450
  }
];

const STORAGE_KEY_STORIES = 'dtn_hcm_stories_v2';
const STORAGE_KEY_USER = 'dtn_hcm_current_user_v2';
const STORAGE_KEY_FAVS = 'dtn_hcm_favorites_v2';

// 1. LẤY DANH SÁCH BÀI VIẾT (Tự động kết hợp Seed Data và bài do người dùng tạo)
export function getAllStories(): Story[] {
  if (typeof window === 'undefined') return SEED_STORIES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_STORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(SEED_STORIES));
      return SEED_STORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_STORIES;
  } catch {
    return SEED_STORIES;
  }
}

// 2. LẤY CÂU CHUYỆN THEO SLUG
export function getStoryBySlug(slug: string): Story | undefined {
  const list = getAllStories();
  return list.find((s) => s.slug === slug);
}

// 3. THÊM BÀI VIẾT MỚI (Người dùng đóng góp - lưu ngay vào localStorage)
export function submitNewStory(data: Omit<Story, 'id' | 'slug' | 'created_at' | 'status' | 'read_minutes'>): Story {
  const current = getAllStories();
  
  // Tạo slug sạch từ tiêu đề
  const slug = data.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

  const wordCount = (data.body || '').split(/\s+/).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

  const newStory: Story = {
    ...data,
    id: 'user-story-' + Date.now(),
    slug,
    status: 'pending', // Luôn đưa vào hàng đợi kiểm duyệt
    read_minutes: readMinutes,
    created_at: new Date().toISOString(),
    likes_count: 0
  };

  const updated = [newStory, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(updated));
  }
  return newStory;
}

// 4. DUYỆT HOẶC TỪ CHỐI BÀI VIẾT (Admin chức năng thực tế 100%)
export function updateStoryStatus(id: string, status: 'approved' | 'rejected', rejectReason?: string): boolean {
  const list = getAllStories();
  const index = list.findIndex((s) => s.id === id);
  if (index === -1) return false;

  list[index].status = status;
  if (status === 'approved') {
    list[index].published_at = new Date().toISOString();
    list[index].reject_reason = undefined;
  } else if (status === 'rejected') {
    list[index].reject_reason = rejectReason || 'Nội dung chưa đầy đủ căn cứ xác thực.';
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(list));
  }
  return true;
}

// 5. QUẢN LÝ PHIÊN ĐĂNG NHẬP (Khách, Đoàn viên, Admin Ban Biên tập)
export function getCurrentUser(): UserSession {
  if (typeof window === 'undefined') {
    return {
      id: 'guest',
      name: 'Đoàn viên Khách',
      email: 'khach@thanhdoan.tphcm.gov.vn',
      unit: 'Thành phố Hồ Chí Minh',
      role: 'guest',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Mặc định là Đoàn viên mẫu
  const defaultUser: UserSession = {
    id: 'user-1',
    name: 'Nguyễn Văn An',
    email: 'vanan.doan@tphcm.gov.vn',
    unit: 'Chi đoàn Ban Phong trào Thành Đoàn',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
  return defaultUser;
}

export function switchUserRole(role: 'guest' | 'member' | 'admin'): UserSession {
  const user: UserSession = role === 'admin' ? {
    id: 'admin-1',
    name: 'Đ/c Trần Quốc Tuấn',
    email: 'bientap@thanhdoan.tphcm.gov.vn',
    unit: 'Ban Tuyên giáo Thành Đoàn TP.HCM',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  } : role === 'member' ? {
    id: 'user-1',
    name: 'Nguyễn Văn An',
    email: 'vanan.doan@tphcm.gov.vn',
    unit: 'Chi đoàn Ban Phong trào Thành Đoàn',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  } : {
    id: 'guest',
    name: 'Đoàn viên Khách',
    email: 'khach@thanhdoan.tphcm.gov.vn',
    unit: 'Thành phố Hồ Chí Minh',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-changed'));
  }
  return user;
}

// 6. YÊU THÍCH (FAVORITES)
export function getFavoriteIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(storyId: string): boolean {
  const favs = getFavoriteIds();
  const exists = favs.includes(storyId);
  const updated = exists ? favs.filter((id) => id !== storyId) : [...favs, storyId];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(updated));
  }
  return !exists;
}

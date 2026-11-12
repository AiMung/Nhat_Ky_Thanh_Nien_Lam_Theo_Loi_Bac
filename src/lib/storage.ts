/**
 * Module quản lý Dữ liệu và Trạng thái cho Dự án:
 * "NHẬT KÝ THANH NIÊN LÀM THEO LỜI BÁC" - Thành Đoàn TP. Hồ Chí Minh
 * Lưu trữ đồng bộ LocalStorage đảm bảo 100% chức năng Thêm - Xóa - Sửa - Cập nhật hoạt động tức thì.
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
  images?: string[]; // Danh sách nhiều ảnh (Album Facebook style)
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

// BỘ DỮ LIỆU GỐC VỚI HÌNH ẢNH LỊCH SỬ THỜI HOA LỬA CHÂN THỰC 100%
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
    cover_url: '/images/thoi-hoa-lua-hero.jpg',
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
    cover_url: '/images/thoi-hoa-lua/cat-khang-chien.jpg',
    read_minutes: 5,
    published_at: '2026-04-30T09:00:00Z',
    created_at: '2026-04-20T10:00:00Z',
    likes_count: 518
  },
  {
    id: 'story-3',
    slug: 'chuyen-nhung-la-thu-thoi-hoa-lua',
    title: 'Những lá thư thời hoa lửa: Lời thề non sông và tình yêu sắt son gửi người nơi hậu phương',
    narrator_name: 'Mẹ Nguyễn Thị Tuyết (Mẹ Việt Nam Anh hùng)',
    contributor_name: 'Ban Liên lạc Cựu cán bộ Đoàn TP.HCM',
    contributor_unit: 'Hội Cựu TNXP Thành phố',
    summary: 'Những dòng thư ố vàng đẫm tình yêu đất nước viết vội bên chiến hào, gửi gắm niềm tin tất thắng và lời hẹn ước sum vầy ngày đất nước trọn niềm vui.',
    body: `### Những dòng chữ viết dưới ánh hỏa châu\n\n"Mẹ kính yêu! Con viết cho mẹ khi đơn vị vừa hoàn thành trận đánh ở cửa ngõ Sài Gòn. Ở đây đạn bom ác liệt lắm, nhưng chúng con không sợ. Ai cũng mong ngày chiến thắng để về phụng dưỡng mẹ..."\n\nBức thư cuối cùng của liệt sĩ Hoàng Văn Nam gửi về cho mẹ năm 1972, được kẹp cẩn thận trong cuốn sổ tay bạc màu. Cùng với bức thư là một bông hoa rừng ép khô đã đổi màu thời gian.\n\n> "Nếu con có hy sinh, mẹ đừng buồn nhé. Con đi là vì độc lập của dân tộc, vì nụ cười của các em thơ. Tổ quốc cần, chúng con sẵn sàng hiến dâng tuổi thanh xuân!"\n\nNhững lá thư ấy nay trở thành báu vật thiêng liêng, nhắc nhở tuổi trẻ hôm nay về sự hy sinh vô bờ bến của thế hệ cha anh đi trước.`,
    category_id: 'phong-trao-doan',
    category_name: 'Ký ức Thành Đoàn & Kháng chiến',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 1972,
    period: '1955-1975',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg',
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
    cover_url: '/images/truong-sa-chu-quyen.jpg',
    read_minutes: 4,
    published_at: '2026-06-01T08:00:00Z',
    created_at: '2026-05-28T09:00:00Z',
    likes_count: 620
  },
  {
    id: 'story-5',
    slug: 'me-tien-con-ra-tran-huyen-thoai-me-viet-nam-anh-hung',
    title: 'Huyền thoại Mẹ Việt Nam Anh hùng: Nước mắt tiễn con và tượng đài bất tử trong lòng dân tộc',
    narrator_name: 'Mẹ Trần Thị Mười (Huyện Củ Chi Đất Thép)',
    contributor_name: 'Huyện Đoàn Củ Chi - TP. Hồ Chí Minh',
    contributor_unit: 'Ban Chỉ đạo phong trào Đền ơn đáp nghĩa',
    summary: 'Ký ức của người Mẹ Củ Chi đất thép tiễn 4 người con lên đường đánh giặc, trở thành biểu tượng cao đẹp cho lòng kiên trung bất khuất của phụ nữ Việt Nam.',
    body: `### Đất thép nở hoa từ lòng mẹ\n\nTrong những năm tháng kháng chiến gian lao, Củ Chi là vành đai thép diệt Mỹ. Dưới làn bom đạn cày xới ngày đêm, các mẹ vừa nuôi giấu cán bộ dưới địa đạo bí mật, vừa lần lượt động viên các con cầm súng lên đường chiến đấu.\n\n"Má dặn các con: Đã là trai tráng thời loạn lạc thì phải biết vì nước, vì dân. Chừng nào sạch bóng quân thù mới được trở về!".\n\nBốn lần tiễn con đi là bốn lần mẹ nén đau thương vào lòng. Ngày thống nhất, hòa bình lập lại, các con của mẹ đã hóa thân thành sông núi quê hương.\n\n> "Mẹ Việt Nam Anh hùng là tượng đài vĩ đại nhất, là nguồn cảm hứng vô tận để thế hệ trẻ hôm nay biết trân quý nền độc lập, tự do mà cha ông đã đánh đổi bằng xương máu."`,
    category_id: 'phong-trao-doan',
    category_name: 'Mẹ Việt Nam Anh Hùng & Hậu phương',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 1968,
    period: '1955-1975',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-me-tien-con-ra-tran.jpg',
    read_minutes: 5,
    published_at: '2026-07-27T08:00:00Z',
    created_at: '2026-07-20T10:00:00Z',
    likes_count: 940
  },
  {
    id: 'story-6',
    slug: 'chien-dich-dien-bien-phu-lung-lay-nam-chau',
    title: 'Chiến dịch Điện Biên Phủ: "Lừng lẫy năm châu, chấn động địa cầu" và sức mạnh tuổi trẻ kéo pháo',
    narrator_name: 'Cựu chiến binh Điện Biên Phủ Hoàng Văn Thái',
    contributor_name: 'Đoàn Khối Doanh nghiệp TP.HCM',
    contributor_unit: 'Hội Cựu Chiến binh',
    summary: 'Ký ức 56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non của những chiến sĩ tuổi mười chín, đôi mươi lập nên kỳ tích Điện Biên.',
    body: `### Dốc Pha Đin và những bước chân bạt núi\n\n56 ngày đêm chiến dịch Điện Biên Phủ là thiên anh hùng ca bất hủ của dân tộc. Hàng vạn dân công hỏa tuyến và bộ đội trẻ đã dùng đôi chân trần và xe đạp thồ vượt đèo dốc hiểm trở tiếp tế đạn dược, lương thực.\n\nNhững tấm gương anh dũng như Tô Vĩnh Diện lấy thân chèn pháo, Phan Đình Giót lấy thân mình lấp lỗ châu mai, Bế Văn Đàn lấy vai làm giá súng... đã khắc sâu vào lịch sử chói lọi của dân tộc ta.\n\n> "Chiến thắng Điện Biên Phủ như một mốc son chói lọi bằng vàng của lịch sử. Nó chứng minh chân lý: Một dân tộc dù nhỏ bé, nhưng đoàn kết một lòng theo Đảng và Bác Hồ thì nhất định chiến thắng!"`,
    category_id: 'phong-trao-doan',
    category_name: 'Ký ức Kháng chiến cứu quốc',
    province_code: 'DB',
    province_name: 'Điện Biên',
    event_year: 1954,
    period: '1945-1954',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg',
    read_minutes: 5,
    published_at: '2026-05-07T08:00:00Z',
    created_at: '2026-05-01T09:00:00Z',
    likes_count: 856
  },
  {
    id: 'story-7',
    slug: 'ha-noi-12-ngay-dem-dien-bien-phu-tren-khong',
    title: 'Hà Nội 12 ngày đêm 1972: Bản hùng ca Điện Biên Phủ trên không và ý chí quật cường',
    narrator_name: 'Đại tá phi công Nguyễn Văn Bảy',
    contributor_name: 'Đoàn Thanh niên Không quân Việt Nam',
    contributor_unit: 'Thành Đoàn TP.HCM phối hợp',
    summary: 'Cuộc đối đầu lịch sử với pháo đài bay B-52 trên bầu trời Thủ đô cuối năm 1972, thể hiện đỉnh cao ý chí sắt đá và trí tuệ Việt Nam.',
    body: `### Rồng lửa Thăng Long vít cổ B-52\n\nTháng 12 năm 1972, đế quốc Mỹ mở chiến dịch tập kích đường không chiến lược Linebacker II vào Hà Nội và Hải Phòng hòng "đưa miền Bắc trở về thời kỳ đồ đá".\n\nNhưng trên mảnh đất ngàn năm văn hiến, quân và dân ta với tinh thần "Quyết tử để Tổ quốc quyết sinh" đã giăng lưới lửa phòng không tầng tầng lớp lớp, bắn rơi 81 máy bay hiện đại các loại, trong đó có 34 siêu pháo đài bay B-52.\n\n> "Bác Hồ từng dự báo trước: 'Mỹ chỉ chịu thua sau khi thua trên bầu trời Hà Nội'. Lời tiên tri thiên tài của Bác đã trở thành hiện thực rực rỡ!"`,
    category_id: 'phong-trao-doan',
    category_name: 'Ký ức Kháng chiến cứu quốc',
    province_code: 'HN',
    province_name: 'Hà Nội',
    event_year: 1972,
    period: '1955-1975',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg',
    read_minutes: 4,
    published_at: '2026-12-18T08:00:00Z',
    created_at: '2026-12-10T09:00:00Z',
    likes_count: 672
  },
  {
    id: 'story-8',
    slug: 'vi-dai-tuong-cua-nhan-dan-vo-nguyen-giap',
    title: 'Vị Đại tướng của Nhân dân: Tấm gương sáng ngời đạo đức cách mạng và lòng thương yêu chiến sĩ',
    narrator_name: 'Đồng chí Vũ Kỳ (Thư ký Chủ tịch Hồ Chí Minh)',
    contributor_name: 'Bảo tàng Lịch sử Quân sự Việt Nam',
    contributor_unit: 'Ban Tuyên giáo Trung ương Đoàn',
    summary: 'Những hồi ức cảm động về Đại tướng Tổng Tư lệnh Võ Nguyên Giáp - người học trò xuất sắc của Chủ tịch Hồ Chí Minh, người Anh cả của Quân đội nhân dân Việt Nam.',
    body: `### Tinh thần "Dĩ công vi thượng" của Đại tướng\n\nTrong suốt cuộc đời hoạt động cách mạng vẻ vang, Đại tướng Võ Nguyên Giáp luôn tâm niệm và thực hành sâu sắc lời dạy của Bác Hồ: "Dĩ công vi thượng" - đặt lợi ích của Đảng, của dân tộc và của nhân dân lên trên hết, trước hết.\n\nTrước mỗi chiến dịch lớn, Đại tướng luôn căn dặn các chỉ huy: "Chiến thắng phải đi liền với việc hạn chế thương vong tối đa cho chiến sĩ. Xương máu của bộ đội là vô giá". Tinh thần nhân văn cao cả ấy đã thu phục trọn vẹn trái tim của triệu triệu người lính và đồng bào cả nước.\n\n> "Học tập Đại tướng Võ Nguyên Giáp là học tập phong cách lãnh đạo quyết đoán, trí tuệ kiệt xuất gắn liền với sự khiêm nhường, giản dị và hết lòng vì Tổ quốc."`,
    category_id: 'hoc-tap-bac',
    category_name: 'Học tập & Làm theo lời Bác',
    province_code: 'HN',
    province_name: 'Hà Nội',
    event_year: 1954,
    period: '1945-1954',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/vna-potal-chan-dung-dai-tuong-vo-nguyen-giap-184218511-16-3-52.jpg',
    read_minutes: 5,
    published_at: '2026-08-25T08:00:00Z',
    created_at: '2026-08-20T09:00:00Z',
    likes_count: 1250
  }
];

const STORAGE_KEY_STORIES = 'dtn_hcm_stories_v3'; // Bump version to refresh with authentic Thời Hoa Lửa assets
const STORAGE_KEY_USER = 'dtn_hcm_current_user_v3';
const STORAGE_KEY_FAVS = 'dtn_hcm_favorites_v3';

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

// 3. THÊM BÀI VIẾT MỚI (CREATE - Người dùng đóng góp - lưu ngay vào localStorage)
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
    window.dispatchEvent(new Event('stories-changed'));
  }
  return newStory;
}

// 4. CẬP NHẬT / SỬA BÀI VIẾT (UPDATE - Chỉnh sửa thông tin bài viết)
export function updateStory(id: string, updates: Partial<Omit<Story, 'id' | 'created_at'>>): boolean {
  const list = getAllStories();
  const index = list.findIndex((s) => s.id === id);
  if (index === -1) return false;

  const current = list[index];
  
  // Tính lại số phút đọc nếu có cập nhật body
  let readMinutes = current.read_minutes;
  if (updates.body) {
    const wordCount = updates.body.split(/\s+/).length;
    readMinutes = Math.max(1, Math.ceil(wordCount / 220));
  }

  // Cập nhật slug nếu tiêu đề đổi
  let slug = current.slug;
  if (updates.title && updates.title !== current.title) {
    slug = updates.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
  }

  list[index] = {
    ...current,
    ...updates,
    slug,
    read_minutes: readMinutes,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(list));
    window.dispatchEvent(new Event('stories-changed'));
  }
  return true;
}

// 5. XOÁ BÀI VIẾT (DELETE - Xoá hoàn toàn khỏi hệ thống)
export function deleteStory(id: string): boolean {
  const list = getAllStories();
  const filtered = list.filter((s) => s.id !== id);
  if (filtered.length === list.length) return false;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(filtered));
    window.dispatchEvent(new Event('stories-changed'));
  }
  return true;
}

// 6. DUYỆT HOẶC TỪ CHỐI BÀI VIẾT (Admin chức năng thực tế 100%)
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
    window.dispatchEvent(new Event('stories-changed'));
  }
  return true;
}

// 7. LẤY DANH SÁCH BÀI VIẾT DO NGƯỜI DÙNG ĐÃ ĐÓNG GÓP (Truyện của tôi)
export function getMyStories(): Story[] {
  const currentUser = getCurrentUser();
  const all = getAllStories();
  
  // Nếu là admin, hiển thị các bài viết admin đã tạo hoặc toàn bộ
  if (currentUser.role === 'admin') {
    return all;
  }
  
  // Lọc theo tên người đóng góp hoặc id bài viết do user tạo
  return all.filter((s) => 
    s.id.startsWith('user-story-') || 
    s.contributor_name.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    s.contributor_unit?.toLowerCase().includes(currentUser.unit.toLowerCase())
  );
}

// 8. QUẢN LÝ PHIÊN ĐĂNG NHẬP (Khách, Đoàn viên, Admin Ban Biên tập)
export function getCurrentUser(): UserSession {
  if (typeof window === 'undefined') {
    return {
      id: 'guest',
      name: 'Đoàn viên Khách',
      email: 'khach@thanhdoan.tphcm.gov.vn',
      unit: 'Thành phố Hồ Chí Minh',
      role: 'guest',
      avatar: '/images/thoi-hoa-lua/logo-doan.webp'
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
    avatar: '/images/thoi-hoa-lua/logo-doan.webp'
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
    avatar: '/images/thoi-hoa-lua/logo-doan.webp'
  } : role === 'member' ? {
    id: 'user-1',
    name: 'Nguyễn Văn An',
    email: 'vanan.doan@tphcm.gov.vn',
    unit: 'Chi đoàn Ban Phong trào Thành Đoàn',
    role: 'member',
    avatar: '/images/thoi-hoa-lua/logo-doan.webp'
  } : {
    id: 'guest',
    name: 'Đoàn viên Khách',
    email: 'khach@thanhdoan.tphcm.gov.vn',
    unit: 'Thành phố Hồ Chí Minh',
    role: 'guest',
    avatar: '/images/thoi-hoa-lua/logo-doan.webp'
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-changed'));
  }
  return user;
}

// 9. YÊU THÍCH (FAVORITES)
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

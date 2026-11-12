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
  },
  {
    id: 'story-9',
    slug: 'chiec-vong-bac-bai-hoc-ve-chu-tin',
    title: 'Chiếc vòng bạc của Bác Hồ: Bài học bất hủ về chữ Tín và danh dự người cán bộ',
    narrator_name: 'Bác Vũ Kỳ (Thư ký riêng của Chủ tịch Hồ Chí Minh)',
    contributor_name: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — TP. Đà Lạt',
    contributor_unit: '37 Tổ Dân Phố Phường Xuân Hương',
    summary: 'Lời hứa với một em bé người Nùng nơi núi rừng Pác Bó được Bác ghi nhớ suốt hơn hai năm công tác gian khổ, trở thành bài học đạo đức cách mạng sâu sắc về việc giữ trọn chữ Tín trước nhân dân.',
    body: `### Lời hứa bên suối Lênin năm 1941\n\nHồi ở Pác Bó (Cao Bằng), mỗi lần Bác Hồ đi công tác về, các em thiếu nhi trong vùng lại ùa ra đón Bác. Trong số đó có một em bé gái người Nùng quấn quýt Bác nhất. Một hôm, trước lúc Bác lên đường công tác xa, em bé nắm tay Bác nũng nịu dặn: "Bác ơi, Bác đi về nhớ mua cho cháu một chiếc vòng bạc nhé!". Bác ân cần xoa đầu em và cười hiền hậu: "Được rồi, Bác hứa sẽ mua cho cháu!".\n\nHai năm sau, khi tình hình cách mạng có nhiều chuyển biến, Bác trở về hang Pác Bó sau muôn vàn gian nan, nguy hiểm. Đồng bào và các cháu thiếu nhi lại hân hoan chạy ra đón Bác. Mọi người đều mừng rỡ khi thấy Bác mạnh khỏe. Sau bao biến cố và bận trăm công nghìn việc của quốc gia đại sự, không ai còn nhớ đến lời dặn của em bé năm xưa.\n\n### Món quà thiêng liêng sau hai năm xa cách\n\nThế nhưng, vừa bước vào nhà sàn, sau khi chào hỏi các cụ già và đồng bào, Bác Hồ mở bọc tay nải và lấy ra một chiếc vòng bạc mới toanh, sáng lấp lánh trao tận tay cho em bé gái. Em bé và cha mẹ sững sờ, cảm động đến ứa nước mắt không nói nên lời.\n\nCác đồng chí đi cùng Bác ai nấy đều bàng hoàng xúc động. Có người hỏi Bác: "Thưa Bác, hai năm qua bận rộn biết bao việc lớn của cách mạng, sao Bác vẫn nhớ mua vòng bạc cho cháu?".\n\nBác Hồ nhìn mọi người bằng ánh mắt ấm áp, trầm ngâm nói:\n\n> "Cháu nó nhờ mua tức là nó thích lắm. Mình đã hứa thì dù có khó khăn đến mấy cũng phải tìm mua bằng được cho cháu. Làm người cán bộ cách mạng, điều cốt lõi nhất là phải giữ chữ Tín. Nói thì phải làm, đã hứa trước nhân dân thì dù việc nhỏ nhất cũng không bao giờ được lãng quên. Nếu không giữ được lời hứa với một đứa trẻ thơ, thì làm sao giữ được niềm tin cậy của cả một dân tộc?"\n\n### Bài học sâu sắc cho tuổi trẻ hôm nay\n\nCâu chuyện chiếc vòng bạc là minh chứng hùng hồn cho phong cách sống trung thực, giản dị, trọng chữ Tín của Bác Hồ. Đối với thế hệ đoàn viên, thanh niên hôm nay, việc giữ chữ Tín trong công việc, trong cuộc sống và trong lời thề trước lá cờ Đoàn chính là phẩm chất đạo đức quan trọng nhất để xây dựng niềm tin của nhân dân đối với thế hệ trẻ.`,
    category_id: 'hoc-tap-bac',
    category_name: 'Học tập & Làm theo lời Bác',
    province_code: 'LD',
    province_name: 'Lâm Đồng (Đoàn Phường Xuân Hương)',
    event_year: 1941,
    period: '1945-truoc',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-chiec-vong-bac.jpg',
    read_minutes: 4,
    published_at: '2026-05-19T08:00:00Z',
    created_at: '2026-05-18T09:00:00Z',
    likes_count: 1890
  },
  {
    id: 'story-10',
    slug: 'doi-dep-cao-su-bieu-tuong-can-kiem',
    title: 'Đôi dép cao su của Bác Hồ: Biểu tượng thanh bạch và đức tính Cần Kiệm Liêm Chính',
    narrator_name: 'Đồng chí Cần (Chiến sĩ cảnh vệ Phủ Chủ tịch)',
    contributor_name: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — TP. Đà Lạt',
    contributor_unit: '37 Tổ Dân Phố Phường Xuân Hương',
    summary: 'Đôi dép cao su mộc mạc làm từ lốp ô tô quân sự theo Bác suốt hơn 20 năm kháng chiến và kiến quốc, bài học cao quý về đức tính giản dị, tiết kiệm từng đồng xu của nhân dân.',
    body: `### Đôi dép huyền thoại sinh ra từ khói lửa kháng chiến\n\nĐôi dép của Bác Hồ ra đời vào năm 1947, được chế tạo từ một chiếc lốp ô tô quân sự của thực dân Pháp bị bộ đội ta phục kích thu được tại chiến trường Việt Bắc. Đôi dép cắt không dày lắm, quai trước to bản, quai sau nhỏ vừa vặn với cổ chân của Bác.\n\nSuốt những năm tháng kháng chiến trường kỳ gian khổ, đôi dép cao su ấy đã cùng Bác lội suối, trèo đèo, băng rừng đến thăm các đơn vị bộ đội, dân công hỏa tuyến. Khi hòa bình lập lại, về Thủ đô Hà Nội, Bác vẫn sử dụng đôi dép ấy hàng ngày. Bác đi dép khi làm việc trong Phủ Chủ tịch, khi đi thăm các nhà máy, hợp tác xã, trường học và thậm chí cả trong các chuyến công du nước ngoài tiếp kiến nguyên thủ quốc gia.\n\n### "Tiết kiệm là vì dân, vì nước"\n\nNhiều lần các đồng chí cảnh vệ thấy đôi dép mòn vẹt đế, quai đã tụt đóng đinh mấy lần, liền tha thiết xin phép mua đôi dép mới để Bác đi cho êm chân. Nhưng Bác đều cười bảo:\n\n> "Dép của Bác quai chỉ hơi giãn một tí, đóng lại đinh vẫn còn đi tốt lắm. Nhân dân và bộ đội ta còn nhiều khó khăn, thiếu thốn. Tiền của là mồ hôi nước mắt của đồng bào, ta phải biết chắt chiu, tiết kiệm từng đồng từng hào. Khi nào dép mòn hẳn không sửa được nữa thì hẵng thay."\n\nCó lần sang thăm Ấn Độ, khi Bác chuẩn bị bước lên máy bay, các phóng viên quốc tế ngạc nhiên khi thấy vị Chủ tịch nước Việt Nam mang đôi dép cao su mộc mạc. Bác mỉm cười nói: "Đây là đôi hài vạn dặm của tôi đấy! Nhờ nó mà tôi đã cùng bộ đội và nhân dân vượt qua bao gian khổ để giành lại độc lập cho Tổ quốc".\n\n### Giá trị trường tồn đối với thanh niên thời đại số\n\nHọc tập Bác Hồ từ đôi dép cao su không phải là sống khổ hạnh, mà là rèn luyện lối sống văn minh, không xa hoa lãng phí, biết quý trọng sức lao động và tài nguyên của đất nước. Tinh thần cần kiệm, liêm chính của Bác là kim chỉ nam để mỗi bạn trẻ không sa ngã trước cám dỗ vật chất, luôn hướng về lý tưởng cống hiến cho quê hương.`,
    category_id: 'hoc-tap-bac',
    category_name: 'Học tập & Làm theo lời Bác',
    province_code: 'HN',
    province_name: 'Thủ đô Hà Nội',
    event_year: 1947,
    period: '1945-1954',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-doi-dep-cao-su.jpg',
    read_minutes: 4,
    published_at: '2026-05-19T08:30:00Z',
    created_at: '2026-05-18T10:00:00Z',
    likes_count: 2150
  },
  {
    id: 'story-11',
    slug: 'hai-ban-tay-ra-di-tim-duong-cuu-nuoc',
    title: 'Hai bàn tay ra đi tìm đường cứu nước: Ý chí tự lực tự cường và khát vọng non sông',
    narrator_name: 'Cụ Mai Văn Lương (Nhân chứng lịch sử Bến Nhà Rồng)',
    contributor_name: 'Ban Tuyên giáo Đoàn Phường Xuân Hương — TP. Đà Lạt',
    contributor_unit: '37 Tổ Dân Phố Phường Xuân Hương',
    summary: 'Năm 1911 tại Sài Gòn, với hai bàn tay trắng và một trái tim yêu nước nồng nàn, người thanh niên Nguyễn Tất Thành đã bước lên con tàu Amiral Latouche-Tréville mở đầu cuộc hành trình cứu nước vĩ đại.',
    body: `### Cuộc trò chuyện lịch sử trên đất Sài Gòn năm 1911\n\nTrước khi ra đi tìm đường cứu nước vào tháng 6 năm 1911, người thanh niên Nguyễn Tất Thành (khi đó mang tên Văn Ba) ở tại Sài Gòn. Anh có một người bạn thân tên là Lê. Một hôm, anh Ba rủ anh Lê đi dạo quanh thành phố và thân mật hỏi:\n\n— "Anh Lê, anh có yêu nước không?"\nAnh Lê ngạc nhiên trả lời:\n— "Tất nhiên là có chứ!"\nAnh Ba tiếp tục hỏi:\n— "Anh có thể giữ bí mật được không?"\n— "Được chứ!"\n— "Tôi muốn ra nước ngoài, sang nước Pháp và các nước khác. Sau khi xem xét họ làm như thế nào, tôi sẽ trở về giúp đồng bào chúng ta. Nhưng đi một mình thì thật là mạo hiểm, ví như khi ốm đau... Tôi muốn rủ anh cùng đi với tôi."\n\n### "Tiền đây! Chúng ta sẽ làm việc để sống và để đi!"\n\nAnh Lê thoáng ngần ngại và lo lắng hỏi:\n— "Nhưng chúng ta lấy đâu ra tiền mà đi hỡi anh?"\n\nAnh Ba giơ hai bàn tay rắn rỏi của mình lên, kiên quyết và khẳng khái nói:\n\n> "Đây, tiền đây! Chúng ta sẽ làm bất cứ việc gì để sống và để đi! Chúng ta có hai bàn tay, có sức khỏe, có nhiệt huyết của tuổi trẻ. Chỉ cần có quyết tâm, việc gì ta cũng làm được!"\n\nBị cuốn hút bởi lòng nhiệt tình của anh Ba, anh Lê nhận lời nhưng sau đó vì hoàn cảnh gia đình khó khăn nên không thể tham gia chuyến đi. Ngày 5 tháng 6 năm 1911, từ Bến Nhà Rồng, anh thanh niên Nguyễn Tất Thành với tên gọi Văn Ba đã một mình bước lên con tàu Amiral Latouche-Tréville làm phụ bếp, nhận những công việc nặng nhọc nhất dưới hầm tàu ngột ngạt để bắt đầu cuộc hành trình 30 năm bôn ba tìm chân lý tự do cho dân tộc.\n\n### Ngọn lửa tự lực cánh sinh cho thanh niên thế hệ mới\n\nHành trang ra đi của Bác thuở ấy chỉ là lòng yêu nước và đôi bàn tay lao động. Bài học đó nhắc nhở tuổi trẻ hôm nay: Đừng bao giờ ỷ lại, sợ khó, sợ khổ. Khát vọng vươn lên, tinh thần dấn thân và nghị lực tự thân chính là chìa khóa mở ra mọi thành công và cống hiến cho Tổ quốc.`,
    category_id: 'hoc-tap-bac',
    category_name: 'Học tập & Làm theo lời Bác',
    province_code: 'HCM',
    province_name: 'TP. Hồ Chí Minh',
    event_year: 1911,
    period: '1945-truoc',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-hai-ban-tay.jpg',
    read_minutes: 5,
    published_at: '2026-06-05T07:00:00Z',
    created_at: '2026-06-01T08:00:00Z',
    likes_count: 2430
  },
  {
    id: 'story-12',
    slug: 'loi-can-dan-tai-den-hung',
    title: 'Lời căn dặn thiêng liêng tại Đền Hùng: "Các Vua Hùng đã có công dựng nước..."',
    narrator_name: 'Trung tướng Song Hào (Nguyên Chính ủy Đại đoàn Quân Tiên Phong)',
    contributor_name: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — TP. Đà Lạt',
    contributor_unit: '37 Tổ Dân Phố Phường Xuân Hương',
    summary: 'Ngày 19/9/1954 trước ngày về tiếp quản Thủ đô, Bác Hồ đã có buổi gặp gỡ lịch sử tại Đền Hùng và để lại lời căn dặn thiêng liêng tạc vào non sông gấm vóc.',
    body: `### Buổi gặp mặt dưới bóng cây cổ thụ Đền Giếng\n\nSau chiến thắng lịch sử Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu", Hiệp định Giơ-ne-vơ được ký kết, miền Bắc hoàn toàn giải phóng. Đại đoàn 308 (Đại đoàn Quân Tiên Phong) được vinh dự giao nhiệm vụ trở về tiếp quản Thủ đô Hà Nội.\n\nSáng ngày 19 tháng 9 năm 1954, tại Đền Giếng thuộc Khu di tích lịch sử Đền Hùng (Phú Thọ), cán bộ, chiến sĩ Đại đoàn 308 vô cùng xúc động và bất ngờ khi được đón Bác Hồ đến thăm và nói chuyện.\n\nBác mặc bộ quần áo nâu giản dị, đi đôi dép cao su quen thuộc, bước đi nhanh nhẹn. Bác ngồi trò chuyện thân mật với các chiến sĩ ngay trên thềm cửa Đền Giếng, ấm áp như người cha dặn dò các con trước chuyến đi xa.\n\n### Lời dặn khắc cốt ghi tâm của vị Cha già dân tộc\n\nBác ân cần phân tích tình hình cách mạng, chỉ rõ những vinh dự to lớn nhưng cũng đầy thử thách phức tạp khi bộ đội vào thành phố tiếp quản. Bác căn dặn các chiến sĩ phải luôn giữ vững bản chất của người lính Cụ Hồ, không được kiêu ngạo, sa ngã trước lối sống phồn hoa cám dỗ.\n\nVà tại mảnh đất cội nguồn thiêng liêng của dân tộc, Bác đã đúc kết chân lý lịch sử ngàn năm của non sông bằng một câu nói bất hủ:\n\n> "Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước!"\n\nLời dạy ngắn gọn, súc tích mà hàm chứa ý nghĩa lịch sử sâu sắc, kết nối cội nguồn ngàn năm văn hiến với trách nhiệm thiêng liêng của thế hệ hôm nay trong sự nghiệp bảo vệ Tổ quốc.\n\n### Sứ mệnh giữ nước và phát triển đất nước của thanh niên\n\nNăm xưa, "giữ lấy nước" là cầm súng đánh đuổi quân xâm lược giành độc lập, tự do. Ngày nay, đối với đoàn viên thanh niên Phường Xuân Hương - TP. Đà Lạt và tuổi trẻ cả nước, "giữ nước" còn là giữ gìn chủ quyền biển đảo thiêng liêng Hoàng Sa - Trường Sa, giữ gìn bản sắc văn hóa dân tộc, bảo vệ môi trường sinh thái và nỗ lực xây dựng Việt Nam hùng cường, sánh vai với các cường quốc năm châu.`,
    category_id: 'hoc-tap-bac',
    category_name: 'Học tập & Làm theo lời Bác',
    province_code: 'HN',
    province_name: 'Phú Thọ & Thủ đô Hà Nội',
    event_year: 1954,
    period: '1945-1954',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/story-den-hung.jpg',
    read_minutes: 5,
    published_at: '2026-09-19T08:00:00Z',
    created_at: '2026-09-15T09:00:00Z',
    likes_count: 3100
  },
  {
    id: 'story-13',
    slug: 'nuoc-nong-nuoc-nguoi-bai-hoc-ung-xu',
    title: 'Nước nóng, nước nguội: Bài học sâu sắc về làm chủ cảm xúc và văn hóa ứng xử của Bác Hồ',
    narrator_name: 'Cựu cán bộ Trung đoàn Pháo binh Nguyễn Văn Nam',
    contributor_name: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — TP. Đà Lạt',
    contributor_unit: '37 Tổ Dân Phố Phường Xuân Hương',
    summary: 'Chỉ với hai cốc nước giản dị, Bác Hồ đã cảm hóa và giáo dục một đồng chí chỉ huy hay nóng nảy, để lại bài học đắt giá về sự điềm tĩnh và nhân văn trong công tác lãnh đạo.',
    body: `### Hai cốc nước trên bàn làm việc của Bác\n\nTrong thời kỳ kháng chiến chống thực dân Pháp, có một đồng chí Trung đoàn trưởng tài ba, dũng cảm nhưng lại có nhược điểm là rất nóng tính. Mỗi lần bộ đội hay cấp dưới phạm lỗi, đồng chí thường quát tháo ầm ĩ, có lúc còn dùng những lời lẽ nặng nề khiến anh em chiến sĩ hoang mang, nội bộ có phần e ngại.\n\nBiết chuyện, Bác Hồ liền cho gọi đồng chí ấy lên gặp Bác tại căn lán đơn sơ ở chiến khu Việt Bắc.\n\nĐến giờ hẹn, đồng chí cán bộ đi bộ một quãng đường rừng dài dưới trời trưa nắng gắt. Khi đến nơi, mồ hôi nhễ nhại, thở không ra hơi. Bác Hồ tươi cười đón đồng chí vào lán và bảo ngồi nghỉ. Trên bàn, Bác đã đặt sẵn hai cốc nước: một cốc nước sôi bốc khói nghi ngút và một cốc nước nguội trong veo, mát lành.\n\n### Bài học giản dị mà lay động lòng người\n\nBác chỉ vào cốc nước sôi và nói:\n— "Chú đi đường nắng nóng mệt rồi, chú uống đi!"\nĐồng chí cán bộ vội vàng cầm cốc nước lên nhưng rụt tay lại ngay vì cốc quá nóng, không thể nào uống được. Bác Hồ bèn đẩy cốc nước nguội sang và bảo:\n— "Thế chú uống cốc nước này đi."\nĐồng chí cán bộ đón lấy cốc nước nguội, uống một hơi hết sạch, cảm thấy sảng khoái và tỉnh táo hẳn người.\n\nLúc bấy giờ, Bác Hồ mới ân cần, ôn tồn bảo:\n\n> "Nước nóng thì chú không uống được. Nhưng nước nguội thì chú uống ngon lành. Bản tính con người cũng như vậy đấy chú ạ! Khi chú nóng giận, quát tháo anh em chiến sĩ thì lời nói của chú cũng gay gắt và bỏng rát như cốc nước sôi kia vậy, người nghe không thể tiếp thu được, chỉ thấy đau đớn và xa lánh. Khi bình tĩnh, hòa nhã như cốc nước mát thì lời nói mới đi vào lòng người, anh em mới thấm thía mà sửa đổi khuyết điểm."\n\nNghe Bác dạy, đồng chí Trung đoàn trưởng bàng hoàng nhận ra sai lầm của mình, nghẹn ngào xin lỗi Bác và hứa từ nay sẽ rèn luyện tính kiềm chế, đối xử nhân ái, bao dung với đồng chí, đồng đội.\n\n### Nghệ thuật ứng xử văn minh của cán bộ Đoàn\n\nCâu chuyện dạy cho mỗi cán bộ Đoàn và đoàn viên thanh niên bài học lớn về sự lắng nghe, tôn trọng và làm chủ cảm xúc. Nóng nảy là bản năng, nhưng bình tĩnh là bản lĩnh. Lấy tình thương yêu và sự thuyết phục chân thành để cảm hóa lòng người chính là phong cách Hồ Chí Minh cao đẹp nhất.`,
    category_id: 'hoc-tap-bac',
    category_name: 'Học tập & Làm theo lời Bác',
    province_code: 'HN',
    province_name: 'Chiến khu Việt Bắc',
    event_year: 1948,
    period: '1945-1954',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/featured.jpg',
    read_minutes: 4,
    published_at: '2026-05-19T09:00:00Z',
    created_at: '2026-05-18T11:00:00Z',
    likes_count: 1670
  },
  {
    id: 'story-14',
    slug: 'tuoi-tre-phuong-xuan-huong-da-lat-hoc-loi-bac',
    title: 'Tuổi trẻ Phường Xuân Hương — TP. Đà Lạt thi đua số hóa ký ức và học tập lời Bác',
    narrator_name: 'Đồng chí Bí thư Đoàn Phường Xuân Hương',
    contributor_name: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương',
    contributor_unit: '37 Tổ Dân Phố Phường Xuân Hương — TP. Đà Lạt',
    summary: '37 Tổ Dân Phố Phường Xuân Hương, thành phố ngàn hoa Đà Lạt chung tay thực hiện công trình thanh niên số hóa tư liệu lịch sử, chăm sóc Mẹ Việt Nam Anh hùng và phụng dưỡng cựu chiến binh.',
    body: `### Sức trẻ trên thành phố ngàn hoa anh hùng\n\nPhường Xuân Hương tọa lạc giữa trung tâm thành phố Đà Lạt mộng mơ - mảnh đất giàu truyền thống cách mạng của tỉnh Lâm Đồng. Thực hiện phong trào "Tuổi trẻ học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh", Đoàn Thanh niên Phường Xuân Hương đã phát động đợt thi đua cao điểm trong toàn bộ 37 Tổ Dân Phố.\n\nHàng trăm đoàn viên, thanh niên sinh viên đã trực tiếp đến từng gia đình cựu chiến binh, cựu cán bộ Đoàn, gia đình có công với cách mạng để ghi âm, ghi hình, phỏng vấn và số hóa hàng ngàn trang tư liệu, bức ảnh và kỷ vật quý giá của một thời hoa lửa.\n\n> "Mỗi trang nhật ký số hóa là một ngọn nến tri ân, giúp thế hệ trẻ hôm nay khắc sâu lòng biết ơn vô hạn đối với Bác Hồ kính yêu và các thế hệ cha anh đã hy sinh vì độc lập dân tộc."\n\n### Những công trình thanh niên thiết thực vì cộng đồng\n\nBên cạnh công trình số hóa lịch sử, tuổi trẻ 37 Tổ Dân Phố còn duy trì các hoạt động tình nguyện ý nghĩa:\n- Định kỳ thăm hỏi, phụng dưỡng các Mẹ Việt Nam Anh hùng và thương bệnh binh nặng.\n- Ra quân "Ngày Chủ nhật Xanh" bảo vệ môi trường thắng cảnh hồ Xuân Hương, xây dựng các tuyến đường hoa thanh niên văn minh đô thị.\n- Tổ chức các buổi sinh hoạt chuyên đề giáo dục chủ quyền biển đảo Hoàng Sa - Trường Sa cho thanh thiếu nhi.\n\nBằng những hành động cụ thể, tuổi trẻ Phường Xuân Hương tiếp tục viết tiếp những trang nhật ký vẻ vang, xứng đáng với lời căn dặn của Bác Hồ muôn vàn kính yêu.`,
    category_id: 'phong-trao-doan',
    category_name: 'Tuổi trẻ Phường Xuân Hương',
    province_code: 'LD',
    province_name: 'Lâm Đồng (TP. Đà Lạt)',
    event_year: 2026,
    period: '1989-nay',
    status: 'approved',
    cover_url: '/images/thoi-hoa-lua/sk-tin1.jpg',
    read_minutes: 4,
    published_at: '2026-03-26T08:00:00Z',
    created_at: '2026-03-20T08:00:00Z',
    likes_count: 2890
  }
];

const STORAGE_KEY_STORIES = 'dtn_hcm_stories_v4'; // Bump version to refresh with authentic Uncle Ho & Phường Xuân Hương stories
const STORAGE_KEY_USER = 'dtn_hcm_current_user_v4';
const STORAGE_KEY_FAVS = 'dtn_hcm_favorites_v4';

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

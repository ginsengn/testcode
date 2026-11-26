/* =========================================================================
 * hoangtuyen.js — MODULE NÚT NỔI: BA TẦNG HOÀNG TUYỀN (THIÊN - NHÂN - ĐỊA)
 * -------------------------------------------------------------------------
 * - Gắn nút nổi vào #floatingModuleRoot + Popup Modal + Công tắc ON/OFF.
 * - Hệ thống lý luận & phương pháp tính Ba Tầng Hoàng Tuyền (Thầy NHQ):
 *   + Tầng 1: Hoàng Tuyền Thiên (Tứ Lộ Hoàng Tuyền - 8 Can -> 4 góc Tứ Duy).
 *   + Tầng 2: Hoàng Tuyền Nhân (Bộ Binh - Tam Hợp Cục & Đối ứng 4 Duy/Can).
 *   + Tầng 3: Hoàng Tuyền Địa Chi (Thủy Binh - Chia cung 90° & Cổ pháp).
 * - Hỗ trợ 2 chế độ trục cho Hoàng Tuyền Địa Chi:
 *   + Hậu Thiên (Mặc định chuẩn thực chiến)
 *   + Tiên Thiên (Tham khảo theo ví dụ sách giấy: Khôn->Tốn, Tốn->Đoài...)
 * - Thống nhất logic Chế Hóa:
 *   + Hạ Quái (Thể = Chủ): Phương vị phạm Hoàng Tuyền (bất khả động).
 *   + Thượng Quái (Dụng = Khách): Quẻ đơn tạo Ngũ Quỷ với Hạ Thể.
 *   + Quẻ Chế: Đưa Dụng Thượng xuống Hạ, phối Quẻ Đơn Chế Hóa đạt Bát San
 *     tốt với Dụng Thượng + hài hòa Thiên Can chủ thể để "kéo Dụng đi".
 *   + Phương vị chế: Phương của Dụng Thượng (theo tính chất Quẻ Chế).
 * ========================================================================= */

(function () {
  "use strict";

  // ===================== 1. HẰNG SỐ & DỮ LIỆU THUẬT TOÁN =====================
  const CAN_LIST = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const CHI_LIST = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  const QUAI = {
    Càn:  { h: "Kim",  p: "Tây Bắc",  tinhChat: "Càn Kim (Trời, kim loại tròn quý, đồng hồ, ngọc bích, vật tượng màu vàng/trắng ánh kim)" },
    Đoài: { h: "Kim",  p: "Tây",      tinhChat: "Đoài Kim (Đầm nước, chuông đồng, nhạc cụ kim loại, gương soi, màu trắng/ánh bạc)" },
    Ly:   { h: "Hỏa",  p: "Nam",      tinhChat: "Ly Hỏa (Lửa, ánh sáng, đèn chiếu sáng, tranh mặt trời/phượng hoàng, màu đỏ/tím)" },
    Chấn: { h: "Mộc",  p: "Đông",     tinhChat: "Chấn Mộc (Sấm, cây xanh vươn cao, trúc, trống gỗ, màu xanh lục đậm)" },
    Tốn:  { h: "Mộc",  p: "Đông Nam", tinhChat: "Tốn Mộc (Gió, giỏ phong lan, cây thân mềm lá rủ, chuông gió gỗ, màu xanh bích)" },
    Khảm: { h: "Thủy", p: "Bắc",      tinhChat: "Khảm Thủy (Nước, bể cá, thác nước tĩnh, tranh thủy mặc, màu đen/xanh nước biển)" },
    Cấn:  { h: "Thổ",  p: "Đông Bắc", tinhChat: "Cấn Thổ (Núi, hòn non bộ, đá phong thủy, gốm sứ dày, màu vàng đất/nâu)" },
    Khôn: { h: "Thổ",  p: "Tây Nam",  tinhChat: "Khôn Thổ (Đất, bình gốm vuông, đá thạch anh vàng, vật phẩm vuông màu vàng sậm)" }
  };

  const HEX = {
    Càn:  { Càn: "Bát Thuần Càn", Đoài: "Thiên Trạch Lý", Ly: "Thiên Hỏa Đồng Nhân", Chấn: "Thiên Lôi Vô Vọng", Tốn: "Thiên Phong Cấu", Khảm: "Thiên Thủy Tụng", Cấn: "Thiên Sơn Độn", Khôn: "Thiên Địa Bĩ" },
    Đoài: { Càn: "Trạch Thiên Quải", Đoài: "Bát Thuần Đoài", Ly: "Trạch Hỏa Cách", Chấn: "Trạch Lôi Tùy", Tốn: "Trạch Phong Đại Quá", Khảm: "Trạch Thủy Khốn", Cấn: "Trạch Sơn Hàm", Khôn: "Trạch Địa Tụy" },
    Ly:   { Càn: "Hỏa Thiên Đại Hữu", Đoài: "Hỏa Trạch Khuê", Ly: "Bát Thuần Ly", Chấn: "Hỏa Lôi Phệ Hạp", Tốn: "Hỏa Phong Đỉnh", Khảm: "Hỏa Thủy Vị Tế", Cấn: "Hỏa Sơn Lữ", Khôn: "Hỏa Địa Tấn" },
    Chấn: { Càn: "Lôi Thiên Đại Tráng", Đoài: "Lôi Trạch Quy Muội", Ly: "Lôi Hỏa Phong", Chấn: "Bát Thuần Chấn", Tốn: "Lôi Phong Hằng", Khảm: "Lôi Thủy Giải", Cấn: "Lôi Sơn Tiểu Quá", Khôn: "Lôi Địa Dự" },
    Tốn:  { Càn: "Phong Thiên Tiểu Súc", Đoài: "Phong Trạch Trung Phu", Ly: "Phong Hỏa Gia Nhân", Chấn: "Phong Lôi Ích", Tốn: "Bát Thuần Tốn", Khảm: "Phong Thủy Hoán", Cấn: "Phong Sơn Tiệm", Khôn: "Phong Địa Quan" },
    Khảm: { Càn: "Thủy Thiên Nhu", Đoài: "Thủy Trạch Tiết", Ly: "Thủy Hỏa Ký Tế", Chấn: "Thủy Lôi Truân", Tốn: "Thủy Phong Tỉnh", Khảm: "Bát Thuần Khảm", Cấn: "Thủy Sơn Kiển", Khôn: "Thủy Địa Tỷ" },
    Cấn:  { Càn: "Sơn Thiên Đại Súc", Đoài: "Sơn Trạch Tổn", Ly: "Sơn Hỏa Bí", Chấn: "Sơn Lôi Di", Tốn: "Sơn Phong Cổ", Khảm: "Sơn Thủy Mông", Cấn: "Bát Thuần Cấn", Khôn: "Sơn Địa Bác" },
    Khôn: { Càn: "Địa Thiên Thái", Đoài: "Địa Trạch Lâm", Ly: "Địa Hỏa Minh Di", Chấn: "Địa Lôi Phục", Tốn: "Địa Phong Thăng", Khảm: "Địa Thủy Sư", Cấn: "Địa Sơn Khiêm", Khôn: "Bát Thuần Khôn" }
  };

  // Bát Du Niên (Bát San)
  const DU = {
    Càn:  { Càn: "Phục Vị", Đoài: "Sinh Khí", Ly: "Tuyệt Mệnh", Chấn: "Ngũ Quỷ", Tốn: "Họa Hại", Khảm: "Lục Sát", Cấn: "Thiên Y", Khôn: "Diên Niên" },
    Đoài: { Càn: "Sinh Khí", Đoài: "Phục Vị", Ly: "Ngũ Quỷ", Chấn: "Tuyệt Mệnh", Tốn: "Lục Sát", Khảm: "Họa Hại", Cấn: "Diên Niên", Khôn: "Thiên Y" },
    Ly:   { Càn: "Tuyệt Mệnh", Đoài: "Ngũ Quỷ", Ly: "Phục Vị", Chấn: "Sinh Khí", Tốn: "Thiên Y", Khảm: "Diên Niên", Cấn: "Họa Hại", Khôn: "Lục Sát" },
    Chấn: { Càn: "Ngũ Quỷ", Đoài: "Tuyệt Mệnh", Ly: "Sinh Khí", Chấn: "Phục Vị", Tốn: "Diên Niên", Khảm: "Thiên Y", Cấn: "Lục Sát", Khôn: "Họa Hại" },
    Tốn:  { Càn: "Họa Hại", Đoài: "Lục Sát", Ly: "Thiên Y", Chấn: "Diên Niên", Tốn: "Phục Vị", Khảm: "Sinh Khí", Cấn: "Tuyệt Mệnh", Khôn: "Ngũ Quỷ" },
    Khảm: { Càn: "Lục Sát", Đoài: "Họa Hại", Ly: "Diên Niên", Chấn: "Thiên Y", Tốn: "Sinh Khí", Khảm: "Phục Vị", Cấn: "Ngũ Quỷ", Khôn: "Tuyệt Mệnh" },
    Cấn:  { Càn: "Thiên Y", Đoài: "Diên Niên", Ly: "Họa Hại", Chấn: "Lục Sát", Tốn: "Tuyệt Mệnh", Khảm: "Ngũ Quỷ", Cấn: "Phục Vị", Khôn: "Sinh Khí" },
    Khôn: { Càn: "Diên Niên", Đoài: "Thiên Y", Ly: "Lục Sát", Chấn: "Họa Hại", Tốn: "Ngũ Quỷ", Khảm: "Tuyệt Mệnh", Cấn: "Sinh Khí", Khôn: "Phục Vị" }
  };

  // Quy đổi 24 Sơn -> Cung Bát Quái Hậu Thiên
  const SON2QUAI = {
    Nhâm: "Khảm", Tý: "Khảm", Quý: "Khảm",
    Sửu: "Cấn", Cấn: "Cấn", Dần: "Cấn",
    Giáp: "Chấn", Mão: "Chấn", Ất: "Chấn",
    Thìn: "Tốn", Tốn: "Tốn", Tỵ: "Tốn",
    Bính: "Ly", Ngọ: "Ly", Đinh: "Ly",
    Mùi: "Khôn", Khôn: "Khôn", Thân: "Khôn",
    Canh: "Đoài", Dậu: "Đoài", Tân: "Đoài",
    Tuất: "Càn", Càn: "Càn", Hợi: "Càn"
  };

  const QUAI2SONS = {
    Khảm: ["Nhâm", "Tý", "Quý"],
    Cấn:  ["Sửu", "Cấn", "Dần"],
    Chấn: ["Giáp", "Mão", "Ất"],
    Tốn:  ["Thìn", "Tốn", "Tỵ"],
    Ly:   ["Bính", "Ngọ", "Đinh"],
    Khôn: ["Mùi", "Khôn", "Thân"],
    Đoài: ["Canh", "Dậu", "Tân"],
    Càn:  ["Tuất", "Càn", "Hợi"]
  };

  const PHUONG_TO_SON_DEFAULT = {
    "Bắc": "Tý", "Đông Bắc": "Cấn", "Đông": "Mão", "Đông Nam": "Tốn",
    "Nam": "Ngọ", "Tây Nam": "Khôn", "Tây": "Dậu", "Tây Bắc": "Càn"
  };

  // Bảng chuyển trục Hậu Thiên -> Tiên Thiên tại cùng phương vị không gian
  const HAU_THIEN_TO_TIEN_THIEN = {
    Khôn: "Tốn",  // Tây Nam
    Tốn:  "Đoài", // Đông Nam
    Chấn: "Ly",   // Đông
    Cấn:  "Chấn", // Đông Bắc
    Càn:  "Cấn",  // Tây Bắc
    Đoài: "Khảm", // Tây
    Khảm: "Khôn", // Bắc
    Ly:   "Càn"   // Nam
  };

  // --- DỮ LIỆU TẦNG 1: HOÀNG TUYỀN THIÊN (TỨ LỘ HOÀNG TUYỀN) ---
  const HT_THIEN_CAN = {
    Canh: { quai: "Khôn", note: "Mặt tiền Canh -> Hoàng Tuyền Thiên đóng tại cung Khôn (Tây Nam)." },
    Đinh: { quai: "Khôn", note: "Mặt tiền Đinh -> Hoàng Tuyền Thiên đóng tại cung Khôn (Tây Nam)." },
    Ất:   { quai: "Tốn",  note: "Mặt tiền Ất -> Hoàng Tuyền Thiên đóng tại cung Tốn (Đông Nam)." },
    Bính: { quai: "Tốn",  note: "Mặt tiền Bính -> Hoàng Tuyền Thiên đóng tại cung Tốn (Đông Nam)." },
    Giáp: { quai: "Cấn",  note: "Mặt tiền Giáp -> Hoàng Tuyền Thiên đóng tại cung Cấn (Đông Bắc)." },
    Quý:  { quai: "Cấn",  note: "Mặt tiền Quý -> Hoàng Tuyền Thiên đóng tại cung Cấn (Đông Bắc)." },
    Tân:  { quai: "Càn",  note: "Mặt tiền Tân -> Hoàng Tuyền Thiên đóng tại cung Càn (Tây Bắc)." },
    Nhâm: { quai: "Càn",  note: "Mặt tiền Nhâm -> Hoàng Tuyền Thiên đóng tại cung Càn (Tây Bắc)." }
  };

  // --- DỮ LIỆU TẦNG 2: HOÀNG TUYỀN NHÂN (BỘ BINH / BẠCH HỔ HOÀNG TUYỀN) ---
  const HT_NHAN_MAP = {
    // Nhóm 1: Tam Hợp Cục (12 Địa Chi)
    Hợi:  [{ son: "Thân", quai: "Khôn", lyDo: "Cục Mộc (Hợi-Mão-Mùi) tuyệt tại Thân -> Nhân HT đóng tại Thân (cung Khôn)." }],
    Mão:  [{ son: "Thân", quai: "Khôn", lyDo: "Cục Mộc (Hợi-Mão-Mùi) tuyệt tại Thân -> Nhân HT đóng tại Thân (cung Khôn)." }],
    Mùi:  [{ son: "Thân", quai: "Khôn", lyDo: "Cục Mộc (Hợi-Mão-Mùi) tuyệt tại Thân -> Nhân HT đóng tại Thân (cung Khôn)." }],

    Dần:  [{ son: "Hợi",  quai: "Càn",  lyDo: "Cục Hỏa (Dần-Ngọ-Tuất) tuyệt tại Hợi -> Nhân HT đóng tại Hợi (cung Càn)." }],
    Ngọ:  [{ son: "Hợi",  quai: "Càn",  lyDo: "Cục Hỏa (Dần-Ngọ-Tuất) tuyệt tại Hợi -> Nhân HT đóng tại Hợi (cung Càn)." }],
    Tuất: [{ son: "Hợi",  quai: "Càn",  lyDo: "Cục Hỏa (Dần-Ngọ-Tuất) tuyệt tại Hợi -> Nhân HT đóng tại Hợi (cung Càn)." }],

    Tỵ:   [
      { son: "Thìn", quai: "Tốn", lyDo: "Cục Kim (Tỵ-Dậu-Sửu) tụ mộ tại Thìn & Tuất -> Điểm 1: Thìn (cung Tốn)." },
      { son: "Tuất", quai: "Càn", lyDo: "Cục Kim (Tỵ-Dậu-Sửu) tụ mộ tại Thìn & Tuất -> Điểm 2: Tuất (cung Càn)." }
    ],
    Dậu:  [
      { son: "Thìn", quai: "Tốn", lyDo: "Cục Kim (Tỵ-Dậu-Sửu) tụ mộ tại Thìn & Tuất -> Điểm 1: Thìn (cung Tốn)." },
      { son: "Tuất", quai: "Càn", lyDo: "Cục Kim (Tỵ-Dậu-Sửu) tụ mộ tại Thìn & Tuất -> Điểm 2: Tuất (cung Càn)." }
    ],
    Sửu:  [
      { son: "Thìn", quai: "Tốn", lyDo: "Cục Kim (Tỵ-Dậu-Sửu) tụ mộ tại Thìn & Tuất -> Điểm 1: Thìn (cung Tốn)." },
      { son: "Tuất", quai: "Càn", lyDo: "Cục Kim (Tỵ-Dậu-Sửu) tụ mộ tại Thìn & Tuất -> Điểm 2: Tuất (cung Càn)." }
    ],

    Thân: [
      { son: "Mùi",  quai: "Khôn", lyDo: "Cục Thủy (Thân-Tý-Thìn) tụ sát góc Tây Nam -> Điểm 1: Mùi (cung Khôn)." },
      { son: "Đinh", quai: "Ly",   lyDo: "Cục Thủy (Thân-Tý-Thìn) tụ sát góc Tây Nam -> Điểm 2: Đinh (cung Ly)." }
    ],
    Tý:   [
      { son: "Mùi",  quai: "Khôn", lyDo: "Cục Thủy (Thân-Tý-Thìn) tụ sát góc Tây Nam -> Điểm 1: Mùi (cung Khôn)." },
      { son: "Đinh", quai: "Ly",   lyDo: "Cục Thủy (Thân-Tý-Thìn) tụ sát góc Tây Nam -> Điểm 2: Đinh (cung Ly)." }
    ],
    Thìn: [
      { son: "Mùi",  quai: "Khôn", lyDo: "Cục Thủy (Thân-Tý-Thìn) tụ sát góc Tây Nam -> Điểm 1: Mùi (cung Khôn)." },
      { son: "Đinh", quai: "Ly",   lyDo: "Cục Thủy (Thân-Tý-Thìn) tụ sát góc Tây Nam -> Điểm 2: Đinh (cung Ly)." }
    ],

    // Nhóm 2: Đối ứng Tứ Duy và Thiên Can (8 sơn còn lại)
    Tân:  [{ son: "Tý",  quai: "Khảm", lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Tân/Tốn -> Tý) -> Nhân HT đóng tại Tý (cung Khảm)." }],
    Tốn:  [{ son: "Tý",  quai: "Khảm", lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Tân/Tốn -> Tý) -> Nhân HT đóng tại Tý (cung Khảm)." }],

    Bính: [{ son: "Ngọ", quai: "Ly",   lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Bính/Cấn -> Ngọ) -> Nhân HT đóng tại Ngọ (cung Ly)." }],
    Cấn:  [{ son: "Ngọ", quai: "Ly",   lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Bính/Cấn -> Ngọ) -> Nhân HT đóng tại Ngọ (cung Ly)." }],

    Ất:   [{ son: "Sửu", quai: "Cấn",  lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Ất/Khôn -> Sửu) -> Nhân HT đóng tại Sửu (cung Cấn)." }],
    Khôn: [{ son: "Sửu", quai: "Cấn",  lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Ất/Khôn -> Sửu) -> Nhân HT đóng tại Sửu (cung Cấn)." }],

    Giáp: [{ son: "Mùi", quai: "Khôn", lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Giáp/Càn -> Mùi) -> Nhân HT đóng tại Mùi (cung Khôn)." }],
    Càn:  [{ son: "Mùi", quai: "Khôn", lyDo: "Khẩu quyết đối ứng Tứ Duy/Can (Giáp/Càn -> Mùi) -> Nhân HT đóng tại Mùi (cung Khôn)." }]
  };

  // --- DỮ LIỆU TẦNG 3: HOÀNG TUYỀN ĐỊA CHI (THỦY BINH) ---
  // Cách 1: Chia cung góc Tứ Duy 90 độ theo sổ tay thầy NHQ
  const HT_DIA_90DEG = {
    Sửu:  [{ quai: "Cấn",  lyDo: "Góc Đông Bắc (Tý-Sửu-Dần-Mão) -> Thủy Binh tụ tại cung Cấn." }],
    Dần:  [{ quai: "Cấn",  lyDo: "Góc Đông Bắc (Tý-Sửu-Dần-Mão) -> Thủy Binh tụ tại cung Cấn." }],
    Cấn:  [{ quai: "Cấn",  lyDo: "Góc Đông Bắc (Tý-Sửu-Dần-Mão) -> Thủy Binh tụ tại cung Cấn." }],
    Quý:  [{ quai: "Cấn",  lyDo: "Góc Đông Bắc (giáp ranh Tý-Sửu-Dần) -> Thủy Binh tụ tại cung Cấn." }],
    Giáp: [{ quai: "Cấn",  lyDo: "Góc Đông Bắc (giáp ranh Dần-Mão) -> Thủy Binh tụ tại cung Cấn." }],

    Thìn: [{ quai: "Tốn",  lyDo: "Góc Đông Nam (Mão-Thìn-Tỵ-Ngọ) -> Thủy Binh tụ tại cung Tốn." }],
    Tỵ:   [{ quai: "Tốn",  lyDo: "Góc Đông Nam (Mão-Thìn-Tỵ-Ngọ) -> Thủy Binh tụ tại cung Tốn." }],
    Tốn:  [{ quai: "Tốn",  lyDo: "Góc Đông Nam (Mão-Thìn-Tỵ-Ngọ) -> Thủy Binh tụ tại cung Tốn." }],
    Ất:   [{ quai: "Tốn",  lyDo: "Góc Đông Nam (giáp ranh Mão-Thìn) -> Thủy Binh tụ tại cung Tốn." }],
    Bính: [{ quai: "Tốn",  lyDo: "Góc Đông Nam (giáp ranh Tỵ-Ngọ) -> Thủy Binh tụ tại cung Tốn." }],

    Mùi:  [{ quai: "Khôn", lyDo: "Góc Tây Nam (Ngọ-Mùi-Thân-Dậu) -> Thủy Binh tụ tại cung Khôn (khớp ví dụ mặt tiền Mùi trong sách)." }],
    Thân: [{ quai: "Khôn", lyDo: "Góc Tây Nam (Ngọ-Mùi-Thân-Dậu) -> Thủy Binh tụ tại cung Khôn." }],
    Khôn: [{ quai: "Khôn", lyDo: "Góc Tây Nam (Ngọ-Mùi-Thân-Dậu) -> Thủy Binh tụ tại cung Khôn." }],
    Đinh: [{ quai: "Khôn", lyDo: "Góc Tây Nam (giáp ranh Ngọ-Mùi) -> Thủy Binh tụ tại cung Khôn." }],
    Canh: [{ quai: "Khôn", lyDo: "Góc Tây Nam (giáp ranh Thân-Dậu) -> Thủy Binh tụ tại cung Khôn." }],

    Tuất: [{ quai: "Càn",  lyDo: "Góc Tây Bắc (Dậu-Tuất-Hợi-Tý) -> Thủy Binh tụ tại cung Càn." }],
    Hợi:  [{ quai: "Càn",  lyDo: "Góc Tây Bắc (Dậu-Tuất-Hợi-Tý) -> Thủy Binh tụ tại cung Càn." }],
    Càn:  [{ quai: "Càn",  lyDo: "Góc Tây Bắc (Dậu-Tuất-Hợi-Tý) -> Thủy Binh tụ tại cung Càn." }],
    Tân:  [{ quai: "Càn",  lyDo: "Góc Tây Bắc (giáp ranh Dậu-Tuất) -> Thủy Binh tụ tại cung Càn." }],
    Nhâm: [{ quai: "Càn",  lyDo: "Góc Tây Bắc (giáp ranh Hợi-Tý) -> Thủy Binh tụ tại cung Càn." }],

    // 4 chi Tứ Chính nằm ngay ranh giới 2 cung Tứ Duy liền kề
    Tý:   [
      { quai: "Càn", lyDo: "Ranh giới Bắc (Tý lệch Tây Bắc/Nhâm) -> Thủy Binh tụ tại cung Càn." },
      { quai: "Cấn", lyDo: "Ranh giới Bắc (Tý lệch Đông Bắc/Quý) -> Thủy Binh tụ tại cung Cấn." }
    ],
    Mão:  [
      { quai: "Cấn", lyDo: "Ranh giới Đông (Mão lệch Đông Bắc/Giáp) -> Thủy Binh tụ tại cung Cấn." },
      { quai: "Tốn", lyDo: "Ranh giới Đông (Mão lệch Đông Nam/Ất) -> Thủy Binh tụ tại cung Tốn." }
    ],
    Ngọ:  [
      { quai: "Tốn",  lyDo: "Ranh giới Nam (Ngọ lệch Đông Nam/Bính) -> Thủy Binh tụ tại cung Tốn." },
      { quai: "Khôn", lyDo: "Ranh giới Nam (Ngọ lệch Tây Nam/Đinh) -> Thủy Binh tụ tại cung Khôn." }
    ],
    Dậu:  [
      { quai: "Khôn", lyDo: "Ranh giới Tây (Dậu lệch Tây Nam/Canh) -> Thủy Binh tụ tại cung Khôn." },
      { quai: "Càn",  lyDo: "Ranh giới Tây (Dậu lệch Tây Bắc/Tân) -> Thủy Binh tụ tại cung Càn." }
    ]
  };

  // Cách 2 (Tham chiếu bổ sung): Cặp đôi Địa Chi Xung - Tuyệt cổ pháp
  const HT_DIA_CO_PHAP_REF = {
    Tý: "Mùi, Thân (cung Khôn)", Sửu: "Mùi, Thân (cung Khôn)",
    Dần: "Dậu, Tuất (cung Đoài / Càn)", Mão: "Dậu, Tuất (cung Đoài / Càn)",
    Thìn: "Hợi, Tý (cung Càn / Khảm)", Tỵ: "Hợi, Tý (cung Càn / Khảm)",
    Ngọ: "Sửu, Khôn (cung Cấn / Khôn)", Mùi: "Sửu, Khôn (cung Cấn / Khôn)",
    Thân: "Mão, Thìn (cung Chấn / Tốn)", Dậu: "Mão, Thìn (cung Chấn / Tốn)",
    Tuất: "Tỵ, Ngọ (cung Tốn / Ly)", Hợi: "Tỵ, Ngọ (cung Tốn / Ly)"
  };

  const DO_THIEN_CAN = {
    Giáp: ["Thìn", "Tỵ"], Kỷ:   ["Thìn", "Tỵ"],
    Ất:   ["Dần", "Mão"], Canh: ["Dần", "Mão"],
    Bính: ["Tuất", "Hợi"], Tân: ["Tuất", "Hợi"],
    Đinh: ["Thân", "Dậu"], Nhâm: ["Thân", "Dậu"],
    Mậu:  ["Ngọ", "Mùi"], Quý:  ["Ngọ", "Mùi"]
  };

  const TAM_SAT_HIEP_KY = {
    Dần: ["Hợi", "Tý", "Sửu"], Ngọ: ["Hợi", "Tý", "Sửu"], Tuất: ["Hợi", "Tý", "Sửu"],
    Hợi: ["Thân", "Dậu", "Tuất"], Mão: ["Thân", "Dậu", "Tuất"], Mùi: ["Thân", "Dậu", "Tuất"],
    Tỵ: ["Dần", "Mão", "Thìn"], Dậu: ["Dần", "Mão", "Thìn"], Sửu: ["Dần", "Mão", "Thìn"],
    Thân: ["Tỵ", "Ngọ", "Mùi"], Tý: ["Tỵ", "Ngọ", "Mùi"], Thìn: ["Tỵ", "Ngọ", "Mùi"]
  };

  const CAN_HANH = { Giáp: "Mộc", Ất: "Mộc", Bính: "Hỏa", Đinh: "Hỏa", Mậu: "Thổ", Kỷ: "Thổ", Canh: "Kim", Tân: "Kim", Nhâm: "Thủy", Quý: "Thủy" };
  const SINH = { Thủy: "Mộc", Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy" };
  const KHAC = { Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc", Mộc: "Thổ", Thổ: "Thủy" };

  // ===================== 2. HÀM LÕI THUẬT TOÁN =====================
  function findThuong(ha, targetDN) {
    const keys = Object.keys(QUAI);
    for (let i = 0; i < keys.length; i++) {
      if (DU[ha][keys[i]] === targetDN) return keys[i];
    }
    return null;
  }

  function getQue(thuong, ha) {
    return (HEX[thuong] && HEX[thuong][ha]) ? HEX[thuong][ha] : "?";
  }

  function getYearDataSafe() {
    if (window.TraCuuApp && typeof window.TraCuuApp.getYearData === "function") {
      return window.TraCuuApp.getYearData() || {};
    }
    return window.NIENBIEU || {};
  }

  function findNienBieuByCanChi(canChiName) {
    const yd = getYearDataSafe();
    const keys = Object.keys(yd);
    for (let i = 0; i < keys.length; i++) {
      const item = yd[keys[i]];
      if (item && item.name === canChiName && item.status !== "input here") {
        return item;
      }
    }
    return null;
  }

  // Bắt mạch Hư / Thực Chứng
  function chanDoanHoangTuyen(thuongDung, haThe) {
    const hDung = QUAI[thuongDung].h;
    const hThe = QUAI[haThe].h;
    if (KHAC[hDung] === hThe) {
      return {
        loai: "Hư Chứng (Cần Bổ)",
        moTa: `Dụng Thượng (${thuongDung} - ${hDung}) khắc Hạ Thể (${haThe} - ${hThe}): tiêu hao sinh lực tại phương vị phạm sát.`
      };
    }
    if (KHAC[hThe] === hDung) {
      return {
        loai: "Hư Chứng (Xung Khắc Nội Tại)",
        moTa: `Hạ Thể (${haThe} - ${hThe}) khắc Dụng Thượng (${thuongDung} - ${hDung}): nội khí giằng co, hao tổn lực.`
      };
    }
    if (SINH[hDung] === hThe) {
      return {
        loai: "Thực Chứng (Cần Tả)",
        moTa: `Dụng Thượng (${thuongDung} - ${hDung}) sinh Hạ Thể (${haThe} - ${hThe}): khí Ngũ Quỷ dồn ứ quá tải xuống phương vị.`
      };
    }
    if (SINH[hThe] === hDung) {
      return {
        loai: "Thực Chứng (Tiết Khí Nuôi Sát)",
        moTa: `Hạ Thể (${haThe} - ${hThe}) sinh Dụng Thượng (${thuongDung} - ${hDung}): phương vị bị rút khí để nuôi lớn Ngũ Quỷ.`
      };
    }
    return {
      loai: "Tỷ Hòa Cộng Hưởng",
      moTa: `Đồng hành ${hThe}: trường khí Ngũ Quỷ cộng hưởng.`
    };
  }

  // Tìm Quẻ Giải ("Kéo Dụng Thượng đi khỏi Hạ Thể") theo đúng logic thống nhất:
  // - Hạ Quái (Thể = Chủ): Phương vị phạm Hoàng Tuyền (bất khả động).
  // - Thượng Quái (Dụng = Khách): Quẻ đơn tạo Ngũ Quỷ với Hạ Thể.
  // - Quẻ Chế: Đưa Dụng Thượng xuống làm Hạ nền, phối Quẻ Đơn Chế Hóa ở Thượng
  //   sao cho đạt Bát San tốt với Dụng Thượng (Sinh Khí / Thiên Y / Diên Niên)
  //   và hài hòa với Thiên Can chủ thể.
  // - Phương vị chế: Phương của Dụng Thượng (theo tính chất Quẻ Đơn Chế Hóa).
  function timQueCheHoangTuyen(dungThuongQuai, canChu) {
    const hCan = CAN_HANH[canChu];
    const candidates = [];

    Object.keys(QUAI).forEach(qChe => {
      if (qChe === dungThuongQuai) return;
      const dn = DU[dungThuongQuai][qChe]; // Dụng Thượng làm Hạ, qChe làm Thượng
      if (["Sinh Khí", "Thiên Y", "Diên Niên"].indexOf(dn) === -1) return;

      let score = 0;
      const lyDo = [];

      // 1. Bát San tốt với Dụng Thượng (ưu tiên Thiên Y / Sinh Khí / Diên Niên)
      if (dn === "Thiên Y") {
        score += 48;
        lyDo.push(`<strong>${qChe}</strong> phối với Dụng Thượng <strong>${dungThuongQuai}</strong> tạo Bát San <strong>Thiên Y</strong> (chuyển hóa hung tính Ngũ Quỷ thành cát khí).`);
      } else if (dn === "Sinh Khí") {
        score += 46;
        lyDo.push(`<strong>${qChe}</strong> phối với Dụng Thượng <strong>${dungThuongQuai}</strong> tạo Bát San <strong>Sinh Khí</strong> (lực hút mạnh nhất kéo Dụng Thượng rời khỏi Hạ Thể).`);
      } else {
        score += 38;
        lyDo.push(`<strong>${qChe}</strong> phối với Dụng Thượng <strong>${dungThuongQuai}</strong> tạo Bát San <strong>Diên Niên</strong> (điều hòa và ổn định Dụng Thượng).`);
      }

      // 2. Tương quan ngũ hành giữa Quẻ Đơn Chế Hóa (qChe) và Thiên Can chủ thể (canChu)
      const hChe = QUAI[qChe].h;
      if (hChe === hCan) {
        score += 40;
        lyDo.push(`Quẻ đơn chế hóa <strong>${qChe} (${hChe})</strong> <strong>Tỷ Hòa</strong> đồng khí với Thiên Can chủ thể <strong>${canChu} (${hCan})</strong> → <strong>Đại Cát</strong>.`);
      } else if (SINH[hChe] === hCan) {
        score += 36;
        lyDo.push(`Quẻ đơn chế hóa <strong>${qChe} (${hChe})</strong> <strong>Tương Sinh</strong> trợ lực cho Thiên Can chủ thể <strong>${canChu} (${hCan})</strong> → <strong>Đại Cát</strong>.`);
      } else if (KHAC[hCan] === hChe) {
        score += 22;
        lyDo.push(`Thiên Can chủ thể <strong>${canChu} (${hCan})</strong> khắc chế được quẻ đơn chế hóa <strong>${qChe} (${hChe})</strong> (tuy không sinh/tỷ hòa nhưng chủ kiểm soát được công cụ, tốt hơn nhiều so với bị khắc ngược) → <strong>Tiểu Cát</strong>.`);
      } else if (SINH[hCan] === hChe) {
        score -= 12;
        lyDo.push(`Lưu ý: Thiên Can ${canChu} (${hCan}) phải sinh xuất cho ${qChe} (${hChe}) (hơi hao lực chủ thể).`);
      } else if (KHAC[hChe] === hCan) {
        score -= 45;
        lyDo.push(`Cảnh báo: Quẻ đơn ${qChe} (${hChe}) khắc ngược Thiên Can ${canChu} (${hCan}) (bất lợi cho chủ thể).`);
      }

      candidates.push({
        score: score,
        thuongChe: qChe,
        haDung: dungThuongQuai,
        tenQueChe: getQue(qChe, dungThuongQuai),
        dn: dn,
        lyDo: lyDo,
        phuongViChe: `${QUAI[dungThuongQuai].p} (cung ${dungThuongQuai} — phương của Dụng Thượng)`,
        tinhChatChe: `Dùng tính chất của quẻ đơn <strong>${qChe}</strong>: ${QUAI[qChe].tinhChat}.`
      });
    });

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }

  // Kiểm tra chéo phương vị chế với Năm Lưu Niên
  function checkYearCollision(quaiTarget, activeCan, activeChi) {
    const conflicts = [];
    const sons = QUAI2SONS[quaiTarget] || [];

    if (activeCan && DO_THIEN_CAN[activeCan]) {
      const dt = DO_THIEN_CAN[activeCan];
      const hit = dt.filter(c => SON2QUAI[c] === quaiTarget || sons.indexOf(c) !== -1);
      if (hit.length > 0) conflicts.push(`Trùng Đô Thiên lưu niên Can ${activeCan} (${hit.join(", ")})`);
    }
    if (activeChi && TAM_SAT_HIEP_KY[activeChi]) {
      const ts = TAM_SAT_HIEP_KY[activeChi];
      const hit = ts.filter(c => SON2QUAI[c] === quaiTarget || sons.indexOf(c) !== -1);
      if (hit.length > 0) conflicts.push(`Trùng Tam Sát lưu niên Chi ${activeChi} (${hit.join(", ")})`);
    }
    return conflicts;
  }

  // ===================== 3. CSS & GIAO DIỆN NÚT NỔI + ON/OFF =====================
  const STORAGE_KEY_ON = "tc_hoangtuyen_module_on";
  let isModuleOn = true;
  let lastReportText = "";

  function injectStyles() {
    if (document.getElementById("ht-floating-styles")) return;
    const style = document.createElement("style");
    style.id = "ht-floating-styles";
    style.textContent = `
      .ht-fab-btn {
        display: inline-flex; align-items: center; gap: 6px;
        background: linear-gradient(135deg, #0f766e, #115e59);
        color: #fff; border: 1px solid rgba(255,255,255,0.25);
        border-radius: 999px; padding: 9px 14px;
        font-size: 13px; font-weight: 700; cursor: pointer;
        box-shadow: 0 4px 12px rgba(15, 118, 110, 0.35);
        transition: transform 0.15s, box-shadow 0.15s;
      }
      .ht-fab-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15, 118, 110, 0.45); }

      #ht_modalOverlay {
        display: none; position: fixed; inset: 0; z-index: 99999;
        background: rgba(15, 23, 42, 0.72); backdrop-filter: blur(3px);
        overflow-y: auto; padding: 14px;
      }
      .ht-modal-box {
        max-width: 820px; margin: 12px auto; background: #ffffff; color: #1e293b;
        border-radius: 14px; border-top: 4px solid #0f766e;
        box-shadow: 0 20px 45px rgba(0,0,0,0.4); overflow: hidden;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .ht-modal-head {
        display: flex; justify-content: space-between; align-items: center; gap: 10px;
        padding: 13px 16px; background: #f0fdfa; border-bottom: 1px solid #99f6e4;
      }
      .ht-modal-head h3 { margin: 0; font-size: 15.5px; color: #115e59; }
      .ht-head-actions { display: flex; align-items: center; gap: 10px; }

      /* Công tắc ON / OFF quản lý không gian page */
      .ht-switch-label {
        display: inline-flex; align-items: center; gap: 6px;
        background: #ffffff; border: 1px solid #cbd5e1; border-radius: 999px;
        padding: 4px 10px; font-size: 12px; font-weight: 700; cursor: pointer; color: #0f172a;
      }
      .ht-switch-label input { accent-color: #0f766e; width: 15px; height: 15px; cursor: pointer; }
      .ht-badge-on { color: #0f766e; }
      .ht-badge-off { color: #64748b; }

      .ht-close-btn {
        background: #ccfbf1; color: #115e59; border: none; border-radius: 8px;
        width: 32px; height: 32px; font-size: 18px; font-weight: 700; cursor: pointer;
      }
      .ht-modal-body { padding: 14px 16px; }
      .ht-off-notice {
        padding: 20px; text-align: center; color: #64748b; font-size: 13.5px;
        background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px;
      }
      .ht-sub-note {
        font-size: 12.5px; color: #334155; background: #f0fdfa;
        border-left: 3px solid #0f766e; padding: 8px 11px; border-radius: 6px; margin-bottom: 12px; line-height: 1.5;
      }
      .ht-axis-box {
        background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 9px 11px; margin-bottom: 10px;
      }
      .ht-axis-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: #334155; margin-bottom: 7px; }
      .ht-radio-group { display: flex; flex-wrap: wrap; gap: 8px; }
      .ht-radio-pill {
        flex: 1 1 220px; display: flex; align-items: center; justify-content: center; gap: 6px;
        border: 1px solid #cbd5e1; background: #fff; border-radius: 8px;
        padding: 7px 10px; cursor: pointer; font-size: 13px; font-weight: 600; color: #1e293b;
      }
      .ht-radio-pill input { display: none; }
      .ht-radio-pill:has(input:checked) { background: #0f766e; color: #fff; border-color: #0f766e; }

      .ht-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 10px; margin-bottom: 10px; }
      .ht-field label { display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px; }
      .ht-field select {
        width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px;
        font-size: 13.5px; background: #fff; color: #0f172a;
      }
      .ht-principle {
        background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a;
        border-radius: 10px; padding: 10px 12px; font-size: 12.5px; line-height: 1.55; margin: 10px 0;
      }
      .ht-btn-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
      .ht-btn-primary {
        flex: 1 1 230px; background: #0f766e; color: #fff; border: none; border-radius: 8px;
        padding: 10px 14px; font-size: 13.5px; font-weight: 700; cursor: pointer;
      }
      .ht-btn-sync {
        flex: 1 1 200px; background: #475569; color: #fff; border: none; border-radius: 8px;
        padding: 10px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
      }
      .ht-summary-bar {
        background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px;
        padding: 10px 12px; margin: 12px 0; font-size: 13px;
        display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between;
      }
      .ht-layer-title {
        font-size: 13.5px; font-weight: 800; color: #115e59; text-transform: uppercase;
        margin: 14px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #99f6e4;
      }
      .ht-case {
        background: #fff; border: 1px solid #e2e8f0; border-left: 5px solid #0f766e;
        border-radius: 10px; padding: 12px; margin-bottom: 12px;
      }
      .ht-case.good { border-left-color: #16a34a; background: #f0fdf4; }
      .ht-case-head {
        font-weight: 700; font-size: 14px; color: #0f172a;
        display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
        gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #cbd5e1;
      }
      .ht-tag { display: inline-block; padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 700; }
      .ht-tag-info { background: #e0f2fe; color: #0369a1; }
      .ht-tag-hung { background: #fee2e2; color: #b91c1c; }
      .ht-tag-cat  { background: #dcfce7; color: #15803d; }
      .ht-steps { list-style: none; padding: 0; margin: 0; font-size: 13px; }
      .ht-steps li { padding: 5px 0; border-bottom: 1px dashed #f1f5f9; }
      .ht-steps li:last-child { border-bottom: none; }
      .ht-lbl { font-weight: 700; color: #334155; display: inline-block; min-width: 185px; }
      .ht-que-bad { color: #dc2626; font-weight: 700; }
      .ht-que-ok { color: #0f766e; font-weight: 700; }
      .ht-explain { margin-top: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 11px; font-size: 12.5px; line-height: 1.55; }
      .ht-warn { margin-top: 8px; background: #fff1f2; border: 1px solid #fecdd3; color: #881337; border-radius: 8px; padding: 9px 11px; font-size: 12.5px; line-height: 1.5; }
      .ht-collision-ok { margin-top: 8px; background: #f0fdf4; border: 1px solid #86efac; color: #14532d; border-radius: 8px; padding: 8px 11px; font-size: 12.5px; font-weight: 600; }
      .ht-collision-block { margin-top: 8px; background: #fef2f2; border: 2px solid #dc2626; color: #7f1d1d; border-radius: 8px; padding: 9px 11px; font-size: 12.5px; line-height: 1.5; }
    `;
    document.head.appendChild(style);
  }

  function buildModalHtml() {
    const canOpts = CAN_LIST.map(c => `<option value="${c}" ${c === "Đinh" ? "selected" : ""}>${c}</option>`).join("");
    const yearCanOpts = CAN_LIST.map(c => `<option value="${c}">${c}</option>`).join("");
    const yearChiOpts = CHI_LIST.map(c => `<option value="${c}">${c}</option>`).join("");

    return `
      <div class="ht-modal-box">
        <div class="ht-modal-head">
          <h3>🌊 Module Ba Tầng Hoàng Tuyền (Thiên - Nhân - Địa)</h3>
          <div class="ht-head-actions">
            <label class="ht-switch-label" title="Bật/Tắt nội dung module để quản lý không gian trang">
              <input type="checkbox" id="ht_toggleOnOff" checked>
              <span id="ht_toggleBadge" class="ht-badge-on">ON</span>
            </label>
            <button type="button" class="ht-close-btn" id="ht_btnCloseModal" title="Đóng">✕</button>
          </div>
        </div>

        <div class="ht-modal-body">
          <div id="ht_offPlaceholder" class="ht-off-notice" style="display:none;">
            💤 <strong>Module Ba Tầng Hoàng Tuyền đang ở trạng thái OFF</strong> để tiết kiệm không gian hiển thị.<br>
            Gạt công tắc sang <strong>ON</strong> ở góc trên bên phải để mở công cụ phân tích.
          </div>

          <div id="ht_activeContent">
            <div class="ht-sub-note">
              <strong>Hệ thống Thực Chiến Thầy Nguyễn Hồng Quang:</strong> Quy nạp sát khí Hoàng Tuyền từ 24 sơn mặt tiền về 3 tầng năng lượng: <strong>Tầng 1 Thiên (Tứ Lộ - 8 Can)</strong> · <strong>Tầng 2 Nhân (Bộ Binh - Tam Hợp &amp; Đối Ứng)</strong> · <strong>Tầng 3 Địa Chi (Thủy Binh - Góc Tứ Duy 90°)</strong>.
            </div>

            <div class="ht-axis-box">
              <div class="ht-axis-title">⚙️ Chế độ trục cho Tầng 3 — Hoàng Tuyền Địa Chi (Thủy Binh)</div>
              <div class="ht-radio-group">
                <label class="ht-radio-pill">
                  <input type="radio" name="ht_dia_axis" value="HAU_THIEN" checked>
                  <span>🧭 Case 1: Hậu Thiên (Mặc định chuẩn)</span>
                </label>
                <label class="ht-radio-pill">
                  <input type="radio" name="ht_dia_axis" value="TIEN_THIEN">
                  <span>☯️ Case 2: Tiên Thiên (Tham khảo sách giấy)</span>
                </label>
              </div>
            </div>

            <div class="ht-grid">
              <div class="ht-field">
                <label for="ht_selMatTien">Mặt Tiền / Hướng Khí Chính (24 Sơn):</label>
                <select id="ht_selMatTien">
                  <optgroup label="Phương Bắc — Cung Khảm">
                    <option value="Nhâm">Nhâm (Can)</option>
                    <option value="Tý">Tý (Chi)</option>
                    <option value="Quý">Quý (Can)</option>
                  </optgroup>
                  <optgroup label="Phương Đông Bắc — Cung Cấn">
                    <option value="Sửu">Sửu (Chi)</option>
                    <option value="Cấn">Cấn (Duy)</option>
                    <option value="Dần">Dần (Chi)</option>
                  </optgroup>
                  <optgroup label="Phương Đông — Cung Chấn">
                    <option value="Giáp">Giáp (Can)</option>
                    <option value="Mão">Mão (Chi)</option>
                    <option value="Ất">Ất (Can)</option>
                  </optgroup>
                  <optgroup label="Phương Đông Nam — Cung Tốn">
                    <option value="Thìn">Thìn (Chi)</option>
                    <option value="Tốn">Tốn (Duy)</option>
                    <option value="Tỵ">Tỵ (Chi)</option>
                  </optgroup>
                  <optgroup label="Phương Nam — Cung Ly">
                    <option value="Bính">Bính (Can)</option>
                    <option value="Ngọ">Ngọ (Chi)</option>
                    <option value="Đinh">Đinh (Can)</option>
                  </optgroup>
                  <optgroup label="Phương Tây Nam — Cung Khôn">
                    <option value="Mùi">Mùi (Chi)</option>
                    <option value="Khôn" selected>Khôn (Duy - Ví dụ 1 sách)</option>
                    <option value="Thân">Thân (Chi)</option>
                  </optgroup>
                  <optgroup label="Phương Tây — Cung Đoài">
                    <option value="Canh">Canh (Can)</option>
                    <option value="Dậu">Dậu (Chi)</option>
                    <option value="Tân">Tân (Can)</option>
                  </optgroup>
                  <optgroup label="Phương Tây Bắc — Cung Càn">
                    <option value="Tuất">Tuất (Chi)</option>
                    <option value="Càn">Càn (Duy)</option>
                    <option value="Hợi">Hợi (Chi)</option>
                  </optgroup>
                </select>
              </div>

              <div class="ht-field">
                <label for="ht_selCanChu">Thiên Can Chủ Thể (Gia chủ / Tòa nhà):</label>
                <select id="ht_selCanChu">${canOpts}</select>
              </div>

              <div class="ht-field">
                <label for="ht_yearCan">Can Năm Lưu Niên (Kiểm tra chéo):</label>
                <select id="ht_yearCan">${yearCanOpts}</select>
              </div>

              <div class="ht-field">
                <label for="ht_yearChi">Chi Năm Lưu Niên (Kiểm tra chéo):</label>
                <select id="ht_yearChi">${yearChiOpts}</select>
              </div>
            </div>

            <div class="ht-principle">
              <strong>Logic Thống Nhất Chế Hóa Ba Tầng Hoàng Tuyền:</strong><br>
              • <strong>Hạ Quái (Thể = Chủ):</strong> Phương vị phạm Hoàng Tuyền — <strong>tuyệt đối không động chạm</strong>.<br>
              • <strong>Thượng Quái (Dụng = Khách):</strong> Quẻ đơn phối Hạ Thể tạo bản khí <strong>Ngũ Quỷ</strong>.<br>
              • <strong>Quẻ Chế ("Kéo Dụng Thượng"):</strong> Đưa <strong>Dụng Thượng</strong> xuống Hạ nền, phối Quẻ Đơn Chế Hóa ở Thượng đạt <strong>Bát San tốt với Dụng Thượng</strong> (Thiên Y / Sinh Khí / Diên Niên) và hài hòa với Thiên Can chủ thể để kéo Dụng Thượng rời khỏi Hạ Thể.<br>
              • <strong>Phương vị chế:</strong> Đặt/kích hoạt theo tính chất của <strong>Quẻ Đơn Chế Hóa</strong> tại <strong>phương của Dụng Thượng</strong>.
            </div>

            <div class="ht-btn-row">
              <button type="button" id="ht_btnRun" class="ht-btn-primary">⚡ Phân Tích 3 Tầng Hoàng Tuyền &amp; Quẻ Chế</button>
              <button type="button" id="ht_btnSync" class="ht-btn-sync">📥 Đồng Bộ Hướng &amp; Năm Từ Trang Chính</button>
            </div>

            <div id="ht_outputArea" style="display:none; margin-top:14px;">
              <div class="ht-summary-bar" id="ht_summaryBar"></div>
              <div id="ht_resultsContainer"></div>
              <button type="button" id="ht_btnCopy" class="ht-btn-sync" style="width:100%; margin-top:6px;">📋 Sao Chép Báo Cáo Ba Tầng Hoàng Tuyền</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ===================== 4. ĐỒNG BỘ DỮ LIỆU TỪ TRANG CHÍNH =====================
  function syncFromMainForm(silent) {
    const mainYearSel = document.getElementById("yearSelect") || document.getElementById("selYear");
    const mainHuongSel = document.getElementById("huongSelect") || document.getElementById("selHuong");
    const yd = getYearDataSafe();

    if (mainYearSel && mainYearSel.value && yd[mainYearSel.value]) {
      const yName = yd[mainYearSel.value].name || "";
      const parts = yName.trim().split(/\s+/);
      if (parts.length === 2) {
        const yCanEl = document.getElementById("ht_yearCan");
        const yChiEl = document.getElementById("ht_yearChi");
        if (yCanEl && CAN_LIST.indexOf(parts[0]) !== -1) yCanEl.value = parts[0];
        if (yChiEl && CHI_LIST.indexOf(parts[1]) !== -1) yChiEl.value = parts[1];
      }
    } else if (window.TraCuuApp && typeof window.TraCuuApp.getYearCanChi === "function") {
      const cc = window.TraCuuApp.getYearCanChi(new Date().getFullYear()).split(/\s+/);
      if (cc.length === 2) {
        document.getElementById("ht_yearCan").value = cc[0];
        document.getElementById("ht_yearChi").value = cc[1];
      }
    }

    if (mainHuongSel && mainHuongSel.value) {
      const hVal = mainHuongSel.value;
      const mappedSon = PHUONG_TO_SON_DEFAULT[hVal] || hVal;
      const mtEl = document.getElementById("ht_selMatTien");
      if (mtEl && SON2QUAI[mappedSon]) {
        mtEl.value = mappedSon;
      }
    }

    if (!silent) {
      const btn = document.getElementById("ht_btnSync");
      if (btn) {
        const old = btn.textContent;
        btn.textContent = "✅ Đã đồng bộ Hướng & Năm!";
        setTimeout(() => { btn.textContent = old; }, 1600);
      }
    }
  }

  // ===================== 5. RENDER TỪNG CASE HOÀNG TUYỀN =====================
  function renderSingleHtCard(opts) {
    const {
      indexLabel, layerTag, toaDoPhamStr, haHauThien, haThe,
      isTienThienMode, lyDoXacDinh, extraRefNote,
      canChu, activeYearName, activeCan, activeChi, linesOut
    } = opts;

    const dungThuong = findThuong(haThe, "Ngũ Quỷ");
    const tenQueBenh = getQue(dungThuong, haThe);
    const chanDoan = chanDoanHoangTuyen(dungThuong, haThe);
    const che = timQueCheHoangTuyen(dungThuong, canChu);

    let collisionHtml = "";
    let collisionTxt = "";
    if (che) {
      const conflicts = checkYearCollision(che.haDung, activeCan, activeChi);
      if (conflicts.length > 0) {
        collisionHtml = `<div class="ht-collision-block">
          <strong>🚫 CẢNH BÁO NĂM ${activeYearName.toUpperCase()} — KHÔNG THỂ CHẾ TẠI PHƯƠNG ${QUAI[che.haDung].p.toUpperCase()} (${che.haDung}):</strong><br>
          Phương của Dụng Thượng (<strong>${che.phuongViChe}</strong>) đang trùng sát khí năm:<br>
          ${conflicts.map(c => `• ${c}`).join("<br>")}<br>
          <em>→ Khuyến nghị: Án binh bất động tại phương này trong năm ${activeYearName}.</em>
        </div>`;
        collisionTxt = `CẢNH BÁO NĂM ${activeYearName}: Phương Dụng Thượng ${che.phuongViChe} trùng sát khí năm (${conflicts.join("; ")}) -> KHÔNG LÀM.`;
      } else {
        collisionHtml = `<div class="ht-collision-ok">
          ✅ <strong>Kiểm tra chéo năm ${activeYearName}:</strong> Phương của Dụng Thượng <strong>${che.phuongViChe}</strong> không trùng Đô Thiên / Tam Sát lưu niên — an toàn để chọn ngày giờ Ngũ Linh Dịch kích hoạt nhẹ.
        </div>`;
        collisionTxt = `Kiểm tra chéo năm ${activeYearName}: Phương Dụng Thượng ${che.phuongViChe} AN TOÀN.`;
      }
    }

    const haExplain = isTienThienMode
      ? `<strong>${haThe}</strong> (Vị trí phạm tại cung <strong>${haHauThien} Hậu Thiên</strong> → chiếu xuyên trục sang <strong>${haThe} Tiên Thiên</strong>)`
      : `<strong>${haThe}</strong> (Lấy trực tiếp cung <strong>${haHauThien} Hậu Thiên</strong> tại tọa độ phạm)`;

    linesOut.push(`--- ${indexLabel} [${layerTag}] ---`);
    linesOut.push(`Tọa độ phạm: ${toaDoPhamStr} | Lý do: ${lyDoXacDinh}`);
    linesOut.push(`Hạ (Thể = Chủ): ${haThe} | Thượng (Dụng = Khách): ${dungThuong} (Ngũ Quỷ) | Quẻ Chính: ${tenQueBenh}`);
    linesOut.push(`Chẩn đoán: ${chanDoan.loai} — ${chanDoan.moTa}`);
    if (che) {
      linesOut.push(`Quẻ Chế: ${che.tenQueChe} (${che.thuongChe} trên / ${che.haDung} dưới — Bát San ${che.dn} với Dụng Thượng)`);
      linesOut.push(`Phương vị chế: ${che.phuongViChe}`);
      linesOut.push(`Tính chất quẻ chế: ${che.tinhChatChe.replace(/<[^>]+>/g, "")}`);
      linesOut.push(collisionTxt);
    }
    linesOut.push("");

    return `
      <div class="ht-case">
        <div class="ht-case-head">
          <span>${indexLabel} — Phạm tại ${toaDoPhamStr}</span>
          <span class="ht-tag ht-tag-info">${layerTag}</span>
        </div>
        <div style="font-size:12.5px;color:#475569;margin-bottom:6px;">
          • <strong>Định vị:</strong> ${lyDoXacDinh}<br>
          ${extraRefNote ? `• <strong>Đối chiếu bổ sung:</strong> ${extraRefNote}<br>` : ""}
        </div>
        <ul class="ht-steps">
          <li><span class="ht-lbl">1. Hạ Quái (Thể = Chủ):</span> ${haExplain}</li>
          <li><span class="ht-lbl">2. Thượng Quái (Dụng = Khách):</span> <strong>${dungThuong}</strong> (${QUAI[dungThuong].h} — phối ${haThe} ra <strong>Ngũ Quỷ</strong>)</li>
          <li><span class="ht-lbl">3. Quẻ Chính (Quẻ Bệnh):</span> <span class="ht-que-bad">${tenQueBenh}</span> (${dungThuong} trên / ${haThe} dưới)</li>
          <li><span class="ht-lbl">4. Chẩn đoán Hư / Thực:</span> <strong>${chanDoan.loai}</strong> — ${chanDoan.moTa}</li>
          <li><span class="ht-lbl">5. Quẻ Chế ("Kéo Dụng"):</span> <span class="ht-que-ok">${che ? che.tenQueChe : "?"}</span>
            ${che ? `(${che.thuongChe} trên / ${che.haDung} dưới — đạt Bát San <strong>${che.dn}</strong> với Dụng Thượng)` : ""}</li>
          <li><span class="ht-lbl">6. Phương Vị Chế:</span> <strong>${che ? che.phuongViChe : "?"}</strong></li>
        </ul>
        ${che ? `<div class="ht-explain">
          <strong>🔍 Giải mã cơ chế Chế Hóa &amp; Phương Vị Chế:</strong><br>
          • <strong>Kéo Dụng Thượng rời khỏi Hạ Thể:</strong> Đưa <strong>Dụng Thượng (${dungThuong})</strong> xuống làm Hạ nền, phối với quẻ đơn chế hóa <strong>${che.thuongChe}</strong> ở Thượng để tạo quan hệ cát lành <strong>${che.dn}</strong>, làm gián đoạn xung lực Ngũ Quỷ đang dồn xuống Hạ Thể (<strong>${haThe}</strong>).<br>
          ${che.lyDo.map(r => `• ${r}`).join("<br>")}<br>
          • <strong>Cách thức &amp; Phương vị thực hiện:</strong> Thực hiện tại <strong>${che.phuongViChe}</strong>. ${che.tinhChatChe}
        </div>` : ""}
        ${collisionHtml}
        <div class="ht-warn">
          <strong>⛔ BẤT KHẢ ĐỘNG HẠ THỂ:</strong> Phương vị phạm Hoàng Tuyền <strong>${toaDoPhamStr} (${QUAI[haHauThien].p})</strong> là Hạ Thể, tuyệt đối không đào bới, khoan cắt hay treo đồ trấn trực tiếp tại phương này.
        </div>
      </div>
    `;
  }

  // ===================== 6. CHẠY PHÂN TÍCH TỔNG HỢP 3 TẦNG =====================
  function runHoangTuyenAnalysis() {
    const matTien = document.getElementById("ht_selMatTien").value;
    const canChu = document.getElementById("ht_selCanChu").value;
    const activeCan = document.getElementById("ht_yearCan").value;
    const activeChi = document.getElementById("ht_yearChi").value;
    const activeYearName = activeCan + " " + activeChi;
    const activeYearRecord = findNienBieuByCanChi(activeYearName);

    const diaAxisRadio = document.querySelector('input[name="ht_dia_axis"]:checked');
    const isDiaTienThien = diaAxisRadio && diaAxisRadio.value === "TIEN_THIEN";
    const diaModeLabel = isDiaTienThien
      ? "Case 2: Tiên Thiên Bát Quái (Tham khảo sách giấy)"
      : "Case 1: Hậu Thiên Bát Quái (Mặc định chuẩn)";

    const quaiMatTien = SON2QUAI[matTien];
    let html = "";
    const lines = [];

    document.getElementById("ht_summaryBar").innerHTML = `
      <span>Mặt tiền: <strong>${matTien}</strong> (cung ${quaiMatTien} - ${QUAI[quaiMatTien].p})</span>
      <span>Can chủ thể: <strong>${canChu}</strong> (${CAN_HANH[canChu]})</span>
      <span>Trục HT Địa Chi: <strong>${isDiaTienThien ? "Tiên Thiên (Tham khảo)" : "Hậu Thiên (Mặc định)"}</strong></span>
      <span>Năm đối chiếu: <strong>${activeYearName}</strong> ${activeYearRecord ? '<span class="ht-tag ht-tag-cat">Có Data NB</span>' : '<span class="ht-tag ht-tag-info">Tra quy luật</span>'}</span>
    `;

    lines.push("=====================================================================");
    lines.push("BÁO CÁO PHÂN TÍCH BA TẦNG HOÀNG TUYỀN (THIÊN - NHÂN - ĐỊA) — THẦY NHQ");
    lines.push("=====================================================================");
    lines.push(`Mặt tiền: ${matTien} (${quaiMatTien}) | Can chủ thể: ${canChu} (${CAN_HANH[canChu]}) | Trục HT Địa: ${diaModeLabel}`);
    lines.push("");

    // ---------------- TẦNG 1: HOÀNG TUYỀN THIÊN ----------------
    html += `<div class="ht-layer-title">1. TẦNG 1: HOÀNG TUYỀN THIÊN (TỨ LỘ HOÀNG TUYỀN — KHÍ TRỜI)</div>`;
    lines.push("=== TẦNG 1: HOÀNG TUYỀN THIÊN (TỨ LỘ HOÀNG TUYỀN) ===");
    const thienHit = HT_THIEN_CAN[matTien];
    if (thienHit) {
      html += renderSingleHtCard({
        indexLabel: "Hoàng Tuyền Thiên",
        layerTag: "Tầng Thiên · Hậu Thiên Tứ Duy",
        toaDoPhamStr: `Cung ${thienHit.quai} (${QUAI[thienHit.quai].p})`,
        haHauThien: thienHit.quai,
        haThe: thienHit.quai,
        isTienThienMode: false,
        lyDoXacDinh: thienHit.note,
        extraRefNote: "Chỉ kích hoạt tại 4 góc Tứ Duy (Càn, Khôn, Cấn, Tốn) khi mặt tiền thuộc 8 Thiên Can.",
        canChu, activeYearName, activeCan, activeChi, linesOut: lines
      });
    } else {
      html += `<div class="ht-case good">
        <div class="ht-case-head"><span>✅ Không kích hoạt Hoàng Tuyền Thiên</span></div>
        <p style="margin:4px 0;font-size:13px;">Mặt tiền <strong>${matTien}</strong> không thuộc 8 Thiên Can kích hoạt Tứ Lộ Hoàng Tuyền (4 phương Tứ Chính Tý/Ngọ/Mão/Dậu và 4 cung Tứ Duy bỏ qua lớp Hoàng Tuyền Thiên).</p>
      </div>`;
      lines.push(`Mặt tiền ${matTien}: Không kích hoạt Hoàng Tuyền Thiên.\n`);
    }

    // ---------------- TẦNG 2: HOÀNG TUYỀN NHÂN ----------------
    html += `<div class="ht-layer-title">2. TẦNG 2: HOÀNG TUYỀN NHÂN (BỘ BINH / BẠCH HỔ HOÀNG TUYỀN)</div>`;
    lines.push("=== TẦNG 2: HOÀNG TUYỀN NHÂN (BỘ BINH — HẬU THIÊN) ===");
    const nhanList = HT_NHAN_MAP[matTien] || [];
    if (nhanList.length > 0) {
      nhanList.forEach((item, idx) => {
        const label = nhanList.length > 1 ? `Hoàng Tuyền Nhân (Điểm ${idx + 1})` : "Hoàng Tuyền Nhân";
        html += renderSingleHtCard({
          indexLabel: label,
          layerTag: "Tầng Nhân · Bộ Binh (Hậu Thiên)",
          toaDoPhamStr: `Sơn ${item.son} (cung ${item.quai} — ${QUAI[item.quai].p})`,
          haHauThien: item.quai,
          haThe: item.quai,
          isTienThienMode: false,
          lyDoXacDinh: item.lyDo,
          extraRefNote: "Bộ Binh tác động trực tiếp trên mặt đất (cổng ngõ, lối đi, nhân sự) nên lấy thẳng cung Hậu Thiên.",
          canChu, activeYearName, activeCan, activeChi, linesOut: lines
        });
      });
    }

    // ---------------- TẦNG 3: HOÀNG TUYỀN ĐỊA CHI ----------------
    html += `<div class="ht-layer-title">3. TẦNG 3: HOÀNG TUYỀN ĐỊA CHI (THỦY BINH — MẠCH NGẦM)</div>`;
    lines.push("=== TẦNG 3: HOÀNG TUYỀN ĐỊA CHI (THỦY BINH) ===");
    const diaList = HT_DIA_90DEG[matTien] || [];
    const coPhapRef = HT_DIA_CO_PHAP_REF[matTien]
      ? `Đối chiếu cặp đôi Địa Chi Xung-Tuyệt Cổ Pháp cho ${matTien}: Thủy khí tụ tại <strong>${HT_DIA_CO_PHAP_REF[matTien]}</strong>.`
      : null;

    diaList.forEach((item, idx) => {
      const haHauThien = item.quai;
      const haThe = isDiaTienThien ? HAU_THIEN_TO_TIEN_THIEN[haHauThien] : haHauThien;
      const label = diaList.length > 1 ? `Hoàng Tuyền Địa Chi (Nhánh ${idx + 1})` : "Hoàng Tuyền Địa Chi";
      const tag = isDiaTienThien
        ? `Tầng Địa · Tiên Thiên (${haHauThien} → ${haThe})`
        : "Tầng Địa · Hậu Thiên (Mặc định)";

      html += renderSingleHtCard({
        indexLabel: label,
        layerTag: tag,
        toaDoPhamStr: `Cung ${haHauThien} (${QUAI[haHauThien].p})`,
        haHauThien: haHauThien,
        haThe: haThe,
        isTienThienMode: isDiaTienThien,
        lyDoXacDinh: item.lyDo,
        extraRefNote: coPhapRef,
        canChu, activeYearName, activeCan, activeChi, linesOut: lines
      });
    });

    document.getElementById("ht_resultsContainer").innerHTML = html;
    lastReportText = lines.join("\n");
    document.getElementById("ht_outputArea").style.display = "block";
  }

  // ===================== 7. QUẢN LÝ ON/OFF & GẮN VÀO #floatingModuleRoot =====================
  function setToggleState(on) {
    isModuleOn = !!on;
    const cb = document.getElementById("ht_toggleOnOff");
    const badge = document.getElementById("ht_toggleBadge");
    const activeBox = document.getElementById("ht_activeContent");
    const offBox = document.getElementById("ht_offPlaceholder");

    if (cb) cb.checked = isModuleOn;
    if (badge) {
      badge.textContent = isModuleOn ? "ON" : "OFF";
      badge.className = isModuleOn ? "ht-badge-on" : "ht-badge-off";
    }
    if (activeBox) activeBox.style.display = isModuleOn ? "block" : "none";
    if (offBox) offBox.style.display = isModuleOn ? "none" : "block";

    try { localStorage.setItem(STORAGE_KEY_ON, isModuleOn ? "1" : "0"); } catch (e) {}
  }

  function openModal() {
    const overlay = document.getElementById("ht_modalOverlay");
    if (overlay) {
      syncFromMainForm(true);
      overlay.style.display = "block";
    }
  }

  function closeModal() {
    const overlay = document.getElementById("ht_modalOverlay");
    if (overlay) overlay.style.display = "none";
  }

  function mountHoangTuyenModule() {
    if (document.getElementById("ht_fabBtn")) return;
    injectStyles();

    // 1. Tạo nút nổi và gắn vào #floatingModuleRoot
    const fabBtn = document.createElement("button");
    fabBtn.type = "button";
    fabBtn.id = "ht_fabBtn";
    fabBtn.className = "ht-fab-btn";
    fabBtn.innerHTML = "🌊 Hoàng Tuyền";
    fabBtn.title = "Mở Module Ba Tầng Hoàng Tuyền (Thiên - Nhân - Địa)";
    fabBtn.addEventListener("click", openModal);

    const floatingRoot = document.getElementById("floatingModuleRoot");
    if (floatingRoot) {
      floatingRoot.appendChild(fabBtn);
    } else {
      fabBtn.style.position = "fixed";
      fabBtn.style.bottom = "62px";
      fabBtn.style.right = "16px";
      fabBtn.style.zIndex = "9999";
      document.body.appendChild(fabBtn);
    }

    // 2. Tạo Popup Modal gắn vào body
    const overlay = document.createElement("div");
    overlay.id = "ht_modalOverlay";
    overlay.innerHTML = buildModalHtml();
    document.body.appendChild(overlay);

    // Sự kiện đóng Modal
    document.getElementById("ht_btnCloseModal").addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    // Sự kiện công tắc ON / OFF quản lý không gian
    document.getElementById("ht_toggleOnOff").addEventListener("change", function () {
      setToggleState(this.checked);
    });

    // Chuyển đổi nhanh giữa Case 1 (Hậu Thiên) & Case 2 (Tiên Thiên) cho Hoàng Tuyền Địa Chi
    document.querySelectorAll('input[name="ht_dia_axis"]').forEach(radio => {
      radio.addEventListener("change", function () {
        if (document.getElementById("ht_outputArea").style.display === "block") {
          runHoangTuyenAnalysis();
        }
      });
    });

    // Nút tính toán, đồng bộ & sao chép
    document.getElementById("ht_btnRun").addEventListener("click", runHoangTuyenAnalysis);
    document.getElementById("ht_btnSync").addEventListener("click", function () {
      syncFromMainForm(false);
    });

    document.getElementById("ht_btnCopy").addEventListener("click", function () {
      if (!lastReportText) return;
      const btn = this;
      const done = () => {
        btn.textContent = "✅ Đã sao chép báo cáo Hoàng Tuyền!";
        setTimeout(() => { btn.textContent = "📋 Sao Chép Báo Cáo Ba Tầng Hoàng Tuyền"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastReportText).then(done).catch(() => {});
      }
    });

    // Khôi phục trạng thái ON / OFF đã lưu (mặc định ON khi mở lần đầu)
    let savedOn = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ON);
      if (raw !== null) savedOn = (raw === "1");
    } catch (e) {}
    setToggleState(savedOn);

    // Expose API cho các module sau tham chiếu
    window.HoangTuyenModule = {
      open: openModal,
      close: closeModal,
      toggle: setToggleState,
      run: runHoangTuyenAnalysis,
      getLastReport: function () { return lastReportText; }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHoangTuyenModule);
  } else {
    mountHoangTuyenModule();
  }
})();

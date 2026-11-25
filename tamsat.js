hggg/* =========================================================================
 * tamsat.js — MODULE CHẾ HÓA PHƯƠNG VỊ TAM SÁT (TIỂU - TRUNG DỤNG SỰ)
 * -------------------------------------------------------------------------
 * - Nguồn định vị phương vị Tam Sát: Chuẩn Hiệp Kỷ Biện Phương Thư
 *   (ưu tiên trích xuất trực tiếp từ Niên Biểu 60 Hoa Giáp; nếu niên biểu
 *   chưa nạp dữ liệu thì tự động tính theo 4 cục Tam Hợp Địa Chi của Hiệp Kỷ:
 *   Dần Ngọ Tuất -> Hợi Tý Sửu; Hợi Mão Mùi -> Thân Dậu Tuất;
 *   Tỵ Dậu Sửu -> Dần Mão Thìn; Thân Tý Thìn -> Tỵ Ngọ Mùi).
 * - Nguồn thuật toán chế hóa: Phương pháp của thầy NHQ (Thể là Chủ ở Hạ
 *   Quái - bất khả động; Dụng là Khách ở Thượng Quái mang bản khí Lục Sát;
 *   dùng Quẻ Đơn Chế Hóa đạt Bát San tốt với Khách để "kéo" Khách rời khỏi
 *   Chủ, đặt vật phẩm mang tượng ý Quẻ Giải tại phương của Khách).
 * - Hỗ trợ 2 trục quy đổi: Hậu Thiên (mặc định) & Tiên Thiên (tham khảo).
 * - Tích hợp kiểm tra chéo (Collision Gate) phương đặt vật phẩm với Năm
 *   Lưu Niên hiện hành trong Niên Biểu + công tắc ON / OFF.
 * ========================================================================= */

(function () {
  "use strict";

  // ===================== 1. HẰNG SỐ & DỮ LIỆU THUẬT TOÁN =====================
  const CAN_LIST = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const CHI_LIST = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  const QUAI = {
    Càn:  { h: "Kim",  p: "Tây Bắc",  tuong: "Trời, đồ kim loại tròn quý, đồng hồ, ngọc bích, vật tượng màu vàng/trắng ánh kim" },
    Đoài: { h: "Kim",  p: "Tây",      tuong: "Đầm nước nhỏ, chuông đồng, nhạc cụ kim loại, gương soi, vật phẩm màu trắng/ánh bạc" },
    Ly:   { h: "Hỏa",  p: "Nam",      tuong: "Lửa, ánh sáng, đèn chiếu sáng, tranh mặt trời/phượng hoàng, vật phẩm màu đỏ/tím" },
    Chấn: { h: "Mộc",  p: "Đông",     tuong: "Sấm, cây xanh vươn cao, trúc, trống gỗ, vật phẩm màu xanh lục đậm" },
    Tốn:  { h: "Mộc",  p: "Đông Nam", tuong: "Gió, giỏ phong lan, cây thân mềm lá rủ, chuông gió gỗ, vật phẩm màu xanh bích" },
    Khảm: { h: "Thủy", p: "Bắc",      tuong: "Nước, bể cá, thác nước tĩnh, tranh thủy mặc, vật phẩm màu đen/xanh nước biển" },
    Cấn:  { h: "Thổ",  p: "Đông Bắc", tuong: "Núi, hòn non bộ, đá phong thủy, gốm sứ dày, vật phẩm màu vàng đất/nâu" },
    Khôn: { h: "Thổ",  p: "Tây Nam",  tuong: "Đất, bình gốm vuông, đá thạch anh vàng, thảm/vật phẩm vuông vức màu vàng sậm" }
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

  const CHI2QUAI = {
    Tý: "Khảm", Sửu: "Cấn", Dần: "Cấn", Mão: "Chấn",
    Thìn: "Tốn", Tỵ: "Tốn", Ngọ: "Ly", Mùi: "Khôn",
    Thân: "Khôn", Dậu: "Đoài", Tuất: "Càn", Hợi: "Càn"
  };

  const HAU_TO_TIEN = {
    Khảm: "Khôn", // Bắc
    Cấn:  "Chấn", // Đông Bắc
    Chấn: "Ly",   // Đông
    Tốn:  "Đoài", // Đông Nam
    Ly:   "Càn",  // Nam
    Khôn: "Tốn",  // Tây Nam
    Đoài: "Khảm", // Tây
    Càn:  "Cấn"   // Tây Bắc
  };

  // Bảng Tam Sát chuẩn Hiệp Kỷ Biện Phương Thư (theo Tam Hợp Địa Chi)
  // Thứ tự 3 chi lần lượt là: [Kiếp Sát, Tai Sát, Tuế Sát]
  const TAM_SAT_HIEP_KY = {
    Dần:  ["Hợi", "Tý", "Sửu"],
    Ngọ:  ["Hợi", "Tý", "Sửu"],
    Tuất: ["Hợi", "Tý", "Sửu"],

    Hợi:  ["Thân", "Dậu", "Tuất"],
    Mão:  ["Thân", "Dậu", "Tuất"],
    Mùi:  ["Thân", "Dậu", "Tuất"],

    Tỵ:   ["Dần", "Mão", "Thìn"],
    Dậu:  ["Dần", "Mão", "Thìn"],
    Sửu:  ["Dần", "Mão", "Thìn"],

    Thân: ["Tỵ", "Ngọ", "Mùi"],
    Tý:   ["Tỵ", "Ngọ", "Mùi"],
    Thìn: ["Tỵ", "Ngọ", "Mùi"]
  };

  const TAM_SAT_ROLES = ["Kiếp Sát (đầu sát - xung phá mạnh)", "Tai Sát (trung sát - trở ngại, hao tổn)", "Tuế Sát (mạt sát - trì trệ, dây dưa)"];

  // Bảng Đô Thiên theo Thiên Can (dùng bổ sung kiểm tra chéo năm lưu niên)
  const DO_THIEN_CAN = {
    Giáp: ["Thìn", "Tỵ"], Kỷ:   ["Thìn", "Tỵ"],
    Ất:   ["Dần", "Mão"], Canh: ["Dần", "Mão"],
    Bính: ["Tuất", "Hợi"], Tân: ["Tuất", "Hợi"],
    Đinh: ["Thân", "Dậu"], Nhâm: ["Thân", "Dậu"],
    Mậu:  ["Ngọ", "Mùi"], Quý:  ["Ngọ", "Mùi"]
  };

  const CAN_HANH = { Giáp: "Mộc", Ất: "Mộc", Bính: "Hỏa", Đinh: "Hỏa", Mậu: "Thổ", Kỷ: "Thổ", Canh: "Kim", Tân: "Kim", Nhâm: "Thủy", Quý: "Thủy" };
  const SINH = { Thủy: "Mộc", Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy" };
  const KHAC = { Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc", Mộc: "Thổ", Thổ: "Thủy" };

  // ===================== 2. HÀM HỖ TRỢ LÕI & NỐI NIÊN BIỂU =====================
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

  function matchSonSafe(dataStr, targetSon) {
    if (window.TraCuuApp && typeof window.TraCuuApp.matchSon === "function") {
      return window.TraCuuApp.matchSon(dataStr, targetSon);
    }
    if (!dataStr || !targetSon) return false;
    const tokens = String(dataStr).split(/[\s,]+/).map(t => t.trim()).filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === targetSon) return true;
      if (QUAI2SONS[tokens[i]] && QUAI2SONS[tokens[i]].indexOf(targetSon) !== -1) return true;
    }
    return false;
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

  // Trích xuất phương vị Tam Sát từ Niên Biểu Hiệp Kỷ; nếu chưa có thì tính theo Tam Hợp Hiệp Kỷ
  function resolveTamSatHiepKy(can, chi) {
    const canChi = can + " " + chi;
    const record = findNienBieuByCanChi(canChi);
    let foundFromNB = [];

    if (record && record.hung) {
      const pools = [record.hung.chung, record.hung.tuPhuongHung, record.hung.khaiSonHung, record.hung.lapHuongHung];
      pools.forEach(group => {
        if (!group) return;
        Object.keys(group).forEach(k => {
          if (k.toLowerCase().indexOf("tam sát") !== -1) {
            const valStr = String(group[k]);
            CHI_LIST.forEach(c => {
              if (matchSonSafe(valStr, c) && foundFromNB.indexOf(c) === -1) {
                foundFromNB.push(c);
              }
            });
          }
        });
      });
    }

    const fallbackList = TAM_SAT_HIEP_KY[chi] || [];
    if (foundFromNB.length === 3) {
      // Sắp xếp lại đúng thứ tự Kiếp - Tai - Tuế theo bảng chuẩn
      const ordered = fallbackList.filter(c => foundFromNB.indexOf(c) !== -1);
      return {
        positions: ordered.length === 3 ? ordered : foundFromNB,
        source: "Trích xuất trực tiếp từ Niên Biểu 60 Hoa Giáp (" + canChi + " — Hiệp Kỷ Biện Phương Thư)",
        isFromBook: true
      };
    }

    return {
      positions: fallbackList,
      source: "Quy luật Tam Hợp Địa Chi chuẩn Hiệp Kỷ Biện Phương Thư (Chi " + chi + ")",
      isFromBook: false
    };
  }

  // Kiểm tra chéo 1 cung Bát Quái (phương đặt vật trấn Khách) với Niên Biểu năm hiện hành
  function checkCollisionWithActiveYear(quaiTarget, activeYearRecord, activeCan, activeChi) {
    const sonsOfQuai = QUAI2SONS[quaiTarget] || [];
    const conflicts = [];

    if (activeYearRecord && activeYearRecord.hung) {
      const h = activeYearRecord.hung;
      const scanGroup = (groupObj, label) => {
        if (!groupObj) return;
        Object.keys(groupObj).forEach(satName => {
          const val = groupObj[satName];
          const hitSons = sonsOfQuai.filter(s => matchSonSafe(val, s));
          if (hitSons.length > 0) {
            conflicts.push(`[${label}] ${satName} (${val}) — chạm sơn ${hitSons.join(", ")}`);
          }
        });
      };
      scanGroup(h.chung, "Hung chung năm");
      scanGroup(h.tuPhuongHung, "Tu phương hung năm");
      scanGroup(h.khaiSonHung, "Khai sơn hung năm");
      scanGroup(h.lapHuongHung, "Lập hướng hung năm");
    }

    if (activeCan && DO_THIEN_CAN[activeCan]) {
      const dtYear = DO_THIEN_CAN[activeCan];
      const hitDt = dtYear.filter(c => CHI2QUAI[c] === quaiTarget || sonsOfQuai.indexOf(c) !== -1);
      if (hitDt.length > 0) {
        const msg = `[Lưu niên Can ${activeCan}] Đô Thiên năm tại ${hitDt.join(", ")}`;
        if (!conflicts.some(x => x.indexOf("Đô Thiên") !== -1)) conflicts.push(msg);
      }
    }

    if (activeChi && TAM_SAT_HIEP_KY[activeChi]) {
      const tsYear = TAM_SAT_HIEP_KY[activeChi];
      const hitTs = tsYear.filter(c => CHI2QUAI[c] === quaiTarget || sonsOfQuai.indexOf(c) !== -1);
      if (hitTs.length > 0) {
        const msg = `[Lưu niên Chi ${activeChi}] Tam Sát năm tại ${hitTs.join(", ")}`;
        if (!conflicts.some(x => x.indexOf("Tam Sát") !== -1)) conflicts.push(msg);
      }
    }

    return conflicts;
  }

  // ===================== 3. CHẨN ĐOÁN & TÌM QUẺ CHẾ KÉO KHÁCH (THẦY NHQ) =====================
  function chanDoanTamSat(thuongKhach, haChu) {
    const hKhach = QUAI[thuongKhach].h;
    const hChu = QUAI[haChu].h;
    if (KHAC[hKhach] === hChu) return { loai: "Hư Chứng", moTa: `Khách (${thuongKhach}-${hKhach}) khắc Chủ (${haChu}-${hChu}): sát khí xung phá, rút kiệt sinh khí của Chủ.` };
    if (KHAC[hChu] === hKhach) return { loai: "Hư Chứng", moTa: `Chủ (${haChu}-${hChu}) khắc Khách (${thuongKhach}-${hKhach}): xung khắc đối đầu trực diện.` };
    if (SINH[hChu] === hKhach) return { loai: "Thực Chứng", moTa: `Chủ (${haChu}-${hChu}) sinh Khách (${thuongKhach}-${hKhach}): Chủ bị tiết khí nuôi lớn hung thần Lục Sát.` };
    if (SINH[hKhach] === hChu) return { loai: "Thực Chứng", moTa: `Khách (${thuongKhach}-${hKhach}) sinh Chủ (${haChu}-${hChu}): sát khí dồn ép quá tải lên Chủ.` };
    return { loai: "Tỷ Hòa", moTa: `Đồng hành ${hChu}: khí Lục Sát cộng hưởng.` };
  }

  // Nguyên tắc "Kéo Khách": Đưa Khách (Thượng Dụng) xuống Hạ nền, phối Quẻ Đơn Chế Hóa có Bát San tốt với Khách
  // để Khách "vui vẻ" quay sang tương tác với Quẻ Chế mà rời sự chú ý khỏi Chủ.
  function timQueKeoKhach(khachQuai, canChu) {
    const hCan = CAN_HANH[canChu];
    const candidates = [];

    Object.keys(QUAI).forEach(qChe => {
      if (qChe === khachQuai) return;
      const dn = DU[khachQuai][qChe]; // Khách làm Hạ, qChe làm Thượng
      if (["Sinh Khí", "Thiên Y", "Diên Niên"].indexOf(dn) === -1) return;

      let score = 0;
      const lyDo = [];

      if (dn === "Sinh Khí") {
        score += 50;
        lyDo.push(`Phối với Khách <strong>${khachQuai}</strong> tạo thành <strong>Sinh Khí</strong> (lực hút cát tinh mạnh nhất để kéo Khách rời khỏi Chủ).`);
      } else if (dn === "Thiên Y") {
        score += 40;
        lyDo.push(`Phối với Khách <strong>${khachQuai}</strong> tạo thành <strong>Thiên Y</strong> (làm dịu và chuyển hóa hung tính của Khách).`);
      } else {
        score += 30;
        lyDo.push(`Phối với Khách <strong>${khachQuai}</strong> tạo thành <strong>Diên Niên</strong> (ổn định và dẫn dụ Khách hòa hoãn).`);
      }

      const hChe = QUAI[qChe].h;
      if (hChe === hCan) {
        score += 35;
        lyDo.push(`Quẻ chế <strong>${qChe} (${hChe})</strong> tỷ hòa đồng khí với Can chủ thể <strong>${canChu} (${hCan})</strong> (Đại Cát).`);
      } else if (SINH[hChe] === hCan) {
        score += 32;
        lyDo.push(`Quẻ chế <strong>${qChe} (${hChe})</strong> sinh trợ cho Can chủ thể <strong>${canChu} (${hCan})</strong> (Đại Cát).`);
      } else if (KHAC[hCan] === hChe) {
        score += 18;
        lyDo.push(`Can chủ thể <strong>${canChu} (${hCan})</strong> chế ngự được quẻ chế <strong>${qChe} (${hChe})</strong> (Tiểu Cát - chủ kiểm soát được công cụ).`);
      } else if (SINH[hCan] === hChe) {
        score -= 10;
        lyDo.push(`Lưu ý: Can ${canChu} (${hCan}) sinh xuất cho ${qChe} (${hChe}) (hơi tiết khí chủ thể).`);
      } else if (KHAC[hChe] === hCan) {
        score -= 40;
        lyDo.push(`Cảnh báo: Quẻ ${qChe} (${hChe}) khắc ngược Can ${canChu} (${hCan}) (bất lợi cho chủ thể).`);
      }

      candidates.push({
        score: score,
        thuongChe: qChe,
        haKhach: khachQuai,
        ten: getQue(qChe, khachQuai),
        dn: dn,
        lyDo: lyDo,
        phuongDungQueChe: `${QUAI[khachQuai].p} (cung ${khachQuai} — phương của Khách)`,
        vatPham: `Vật phẩm mang hàm nghĩa/tượng ý của quẻ <strong>${qChe} (${QUAI[qChe].h})</strong>: ${QUAI[qChe].tuong}.`
      });
    });

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }

  // ===================== 4. CSS & GIAO DIỆN MODULE (ON / OFF) =====================
  const STORAGE_KEY_ON = "tc_tamsat_module_on";
  let isModuleOn = false;
  let lastReportText = "";

  function injectStyles() {
    if (document.getElementById("ts-module-styles")) return;
    const style = document.createElement("style");
    style.id = "ts-module-styles";
    style.textContent = `
      .ts-card { border-top: 3px solid var(--primary); }
      .ts-sub-note { font-size: .83rem; color: var(--muted); background: rgba(59,63,216,.07); border-left: 3px solid var(--primary); padding: 7px 11px; border-radius: 6px; margin-bottom: 12px; }
      .ts-axis-box { background: rgba(59,63,216,.05); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; margin-bottom: 12px; }
      .ts-axis-title { font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; color: var(--navy); margin-bottom: 8px; }
      .ts-radio-group { display: flex; flex-wrap: wrap; gap: 8px; }
      .ts-radio-pill { flex: 1 1 210px; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid var(--border); background: #fff; border-radius: 8px; padding: 8px 10px; cursor: pointer; font-size: .85rem; font-weight: 600; color: var(--ink); transition: all .15s; margin: 0; }
      .ts-radio-pill input { display: none; }
      .ts-radio-pill:has(input:checked) { background: var(--primary); color: #fff; border-color: var(--primary); }
      .ts-principle { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; border-radius: 10px; padding: 10px 12px; font-size: .84rem; line-height: 1.55; margin: 12px 0; }
      .ts-btn-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
      .ts-btn-sync { background: #475569; box-shadow: none; }
      .ts-summary-bar { background: linear-gradient(135deg,#f6f5ff,#eef2ff); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; margin: 12px 0; font-size: .86rem; display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; }
      .ts-case { background: #fff; border: 1px solid var(--border); border-left: 5px solid var(--primary); border-radius: 12px; padding: 13px; margin-bottom: 12px; }
      .ts-case.danger { border-left-color: var(--hung); }
      .ts-case.good { border-left-color: var(--cat); }
      .ts-case-head { font-weight: 700; font-size: .98rem; color: var(--navy); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed var(--border); }
      .ts-steps { list-style: none; padding: 0; margin: 0; font-size: .88rem; }
      .ts-steps li { padding: 5px 0; border-bottom: 1px dashed rgba(0,0,0,.07); }
      .ts-steps li:last-child { border-bottom: none; }
      .ts-lbl { font-weight: 700; color: var(--navy); display: inline-block; min-width: 185px; }
      .ts-que-bad { color: var(--hung); font-weight: 700; }
      .ts-que-ok { color: var(--cat); font-weight: 700; }
      .ts-explain { margin-top: 9px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: .85rem; line-height: 1.6; }
      .ts-warn { margin-top: 9px; background: #fff1f2; border: 1px solid #fecdd3; color: #881337; border-radius: 8px; padding: 10px 12px; font-size: .84rem; line-height: 1.55; }
      .ts-collision-ok { margin-top: 9px; background: #f0fdf4; border: 1px solid #86efac; color: #14532d; border-radius: 8px; padding: 9px 12px; font-size: .84rem; font-weight: 600; }
      .ts-collision-block { margin-top: 9px; background: #fef2f2; border: 2px solid #dc2626; color: #7f1d1d; border-radius: 8px; padding: 10px 12px; font-size: .85rem; line-height: 1.55; }
      @media (prefers-color-scheme:dark) {
        .ts-axis-title, .ts-case-head, .ts-lbl { color: #e7e5ff; }
        .ts-radio-pill { background: #262950; color: var(--ink); }
        .ts-radio-pill:has(input:checked) { background: var(--primary); color: #fff; border-color: var(--primary); }
        .ts-principle { background: #172554; border-color: #1e40af; color: #bfdbfe; }
        .ts-summary-bar { background: #2a2b52; }
        .ts-case { background: #23264d; }
        .ts-explain { background: #1b1e3d; border-color: #34376b; color: #dcdaf0; }
        .ts-warn { background: #3b1824; border-color: #6b2137; color: #fda4af; }
        .ts-collision-ok { background: #143024; border-color: #1f4d3a; color: #86efac; }
        .ts-collision-block { background: #45121b; border-color: #f43f5e; color: #fecdd3; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildModuleHtml() {
    const canOpts = CAN_LIST.map(c => `<option value="${c}" ${c === "Mậu" ? "selected" : ""}>${c}</option>`).join("");
    const chiOpts = CHI_LIST.map(c => `<option value="${c}" ${c === "Dần" ? "selected" : ""}>${c}</option>`).join("");
    const yearCanOpts = CAN_LIST.map(c => `<option value="${c}">${c}</option>`).join("");
    const yearChiOpts = CHI_LIST.map(c => `<option value="${c}">${c}</option>`).join("");

    return `
      <div class="nb-header-bar">
        <h2>🛡️ Module Tam Sát (Hiệp Kỷ + Chế Hóa NHQ)</h2>
        <label class="nb-toggle-wrap" title="Bật/Tắt module Chế Hóa Tam Sát để tiết kiệm không gian trang">
          <span>Chế Hóa Tam Sát</span>
          <input type="checkbox" id="ts_toggleOnOff">
          <span class="nb-switch"></span>
          <span class="nb-state-badge" id="ts_toggleBadge">OFF</span>
        </label>
      </div>
      <div class="ts-sub-note">
        <strong>Ghi chú nguồn:</strong> Xác định phương vị Tam Sát từ data <strong>Niên Biểu (Hiệp Kỷ Biện Phương Thư)</strong> (Tam Hợp Địa Chi: <em>Dần Ngọ Tuất → Hợi Tý Sửu</em>; <em>Hợi Mão Mùi → Thân Dậu Tuất</em>; <em>Tỵ Dậu Sửu → Dần Mão Thìn</em>; <em>Thân Tý Thìn → Tỵ Ngọ Mùi</em>). <strong>Chế Hóa phương vị Tam Sát tiểu - trung dụng sự theo phương pháp của thầy NHQ.</strong>
      </div>

      <div id="ts_bodyContainer" style="display:none;">
        <div class="ts-axis-box">
          <div class="ts-axis-title">⚙️ Trục quy đổi Tam Sát (Bật / Tắt tham chiếu)</div>
          <div class="ts-radio-group">
            <label class="ts-radio-pill">
              <input type="radio" name="ts_axis" value="HAU_THIEN" checked>
              <span>🧭 Tam Sát Hậu Thiên (Mặc định chuẩn)</span>
            </label>
            <label class="ts-radio-pill">
              <input type="radio" name="ts_axis" value="TIEN_THIEN">
              <span>☯️ Tam Sát Tiên Thiên (Tham khảo)</span>
            </label>
          </div>
        </div>

        <div class="ts-axis-box">
          <div class="ts-axis-title">🏛️ Đối tượng xét Tam Sát</div>
          <div class="ts-radio-group">
            <label class="ts-radio-pill">
              <input type="radio" name="ts_htype" value="private" checked>
              <span>Tư nhân (Can + Chi tuổi gia chủ)</span>
            </label>
            <label class="ts-radio-pill">
              <input type="radio" name="ts_htype" value="public">
              <span>Cộng đồng (Can + Chi tòa nhà)</span>
            </label>
          </div>
        </div>

        <div class="row">
          <div class="form-group">
            <label for="ts_selCan">Thiên Can chủ thể (Để xét hòa hợp Quẻ Chế):</label>
            <select id="ts_selCan">${canOpts}</select>
          </div>
          <div class="form-group">
            <label for="ts_selChi">Địa Chi chủ thể (Xác định Tam Sát Hiệp Kỷ):</label>
            <select id="ts_selChi">${chiOpts}</select>
          </div>
          <div class="form-group">
            <label for="ts_selSon">Sơn / Hướng đang kiểm tra (24 Sơn):</label>
            <select id="ts_selSon">
              <optgroup label="Cung Khảm (Bắc)">
                <option value="Nhâm">Nhâm</option><option value="Tý">Tý</option><option value="Quý">Quý</option>
              </optgroup>
              <optgroup label="Cung Cấn (Đông Bắc)">
                <option value="Sửu">Sửu</option><option value="Cấn">Cấn</option><option value="Dần">Dần</option>
              </optgroup>
              <optgroup label="Cung Chấn (Đông)">
                <option value="Giáp">Giáp</option><option value="Mão">Mão</option><option value="Ất">Ất</option>
              </optgroup>
              <optgroup label="Cung Tốn (Đông Nam)">
                <option value="Thìn">Thìn</option><option value="Tốn">Tốn</option><option value="Tỵ">Tỵ</option>
              </optgroup>
              <optgroup label="Cung Ly (Nam)">
                <option value="Bính">Bính</option><option value="Ngọ">Ngọ</option><option value="Đinh">Đinh</option>
              </optgroup>
              <optgroup label="Cung Khôn (Tây Nam)">
                <option value="Mùi">Mùi</option><option value="Khôn">Khôn</option><option value="Thân">Thân</option>
              </optgroup>
              <optgroup label="Cung Đoài (Tây)">
                <option value="Canh">Canh</option><option value="Dậu">Dậu</option><option value="Tân">Tân</option>
              </optgroup>
              <optgroup label="Cung Càn (Tây Bắc)">
                <option value="Tuất">Tuất</option><option value="Càn">Càn</option><option value="Hợi" selected>Hợi</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div class="row" style="margin-top:10px;">
          <div class="form-group">
            <label for="ts_yearCan">Thiên Can Năm Lưu Niên (Kiểm tra chéo):</label>
            <select id="ts_yearCan">${yearCanOpts}</select>
          </div>
          <div class="form-group">
            <label for="ts_yearChi">Địa Chi Năm Lưu Niên (Kiểm tra chéo):</label>
            <select id="ts_yearChi">${yearChiOpts}</select>
          </div>
        </div>

        <div class="ts-principle">
          <strong>Nguyên tắc "Kéo Khách đi khỏi Chủ" (Phương pháp thầy NHQ cho Tam Sát):</strong><br>
          1. <strong>Hạ quái (Thể = Chủ):</strong> Phương vị phạm Tam Sát (tra theo Niên Biểu / Tam Hợp Hiệp Kỷ) — <strong>tuyệt đối không động chạm</strong>.<br>
          2. <strong>Thượng quái (Dụng = Khách):</strong> Quẻ đơn phối với Hạ Chủ tạo thành <strong>Lục Sát</strong> (bản khí Tam Sát theo tài liệu thầy NHQ).<br>
          3. <strong>Quẻ Chế ("Kéo Khách"):</strong> Đưa <strong>Khách (Thượng Dụng)</strong> xuống làm Hạ nền, phối với <strong>Quẻ Đơn Chế Hóa</strong> ở Thượng sao cho tạo thành <strong>Bát San tốt với Khách</strong> (Sinh Khí / Thiên Y / Diên Niên) và hòa thuận với Thiên Can chủ thể. Khách vì "vui vẻ" tương tác cát lành với Quẻ Chế mà rời sự chú ý khỏi Chủ.<br>
          4. <strong>Phương dùng Quẻ Chế:</strong> Đặt vật phẩm mang tượng ý <strong>Quẻ Đơn Chế Hóa</strong> tại đúng <strong>phương của Khách</strong> (sau khi đã kiểm tra chéo không trùng sát khí của Năm hiện hành).
        </div>

        <div class="ts-btn-row">
          <button type="button" id="ts_btnRun">⚡ Phân Tích Tam Sát &amp; Chế Hóa</button>
          <button type="button" id="ts_btnSync" class="ts-btn-sync">📥 Lấy Năm &amp; Sơn từ Bảng Tra Cứu Trên</button>
        </div>

        <div id="ts_outputArea" style="display:none; margin-top:14px;">
          <div class="ts-summary-bar" id="ts_summaryBar"></div>
          <div id="ts_resultsContainer"></div>
          <button type="button" id="ts_btnCopy" class="secondary" style="width:100%; margin-top:6px;">📋 Sao Chép Báo Cáo Tam Sát</button>
        </div>
      </div>
    `;
  }

  // ===================== 5. ĐỒNG BỘ DỮ LIỆU TỪ TRANG CHÍNH =====================
  function syncFromMainForm(silent) {
    const mainYearSel = document.getElementById("yearSelect");
    const mainHuongSel = document.getElementById("huongSelect");
    const yd = getYearDataSafe();

    if (mainYearSel && mainYearSel.value && yd[mainYearSel.value]) {
      const yName = yd[mainYearSel.value].name || "";
      const parts = yName.trim().split(/\s+/);
      if (parts.length === 2) {
        const yCanEl = document.getElementById("ts_yearCan");
        const yChiEl = document.getElementById("ts_yearChi");
        if (yCanEl && CAN_LIST.indexOf(parts[0]) !== -1) yCanEl.value = parts[0];
        if (yChiEl && CHI_LIST.indexOf(parts[1]) !== -1) yChiEl.value = parts[1];
      }
    } else {
      const curY = new Date().getFullYear();
      if (window.TraCuuApp && typeof window.TraCuuApp.getYearCanChi === "function") {
        const cc = window.TraCuuApp.getYearCanChi(curY).split(/\s+/);
        if (cc.length === 2) {
          document.getElementById("ts_yearCan").value = cc[0];
          document.getElementById("ts_yearChi").value = cc[1];
        }
      }
    }

    if (mainHuongSel && mainHuongSel.value) {
      const hVal = mainHuongSel.value;
      const mappedSon = PHUONG_TO_SON_DEFAULT[hVal] || hVal;
      const tsSonEl = document.getElementById("ts_selSon");
      if (tsSonEl && SON2QUAI[mappedSon]) {
        tsSonEl.value = mappedSon;
      }
    }

    if (!silent) {
      const btn = document.getElementById("ts_btnSync");
      if (btn) {
        const old = btn.textContent;
        btn.textContent = "✅ Đã đồng bộ Năm Lưu Niên & Sơn!";
        setTimeout(() => { btn.textContent = old; }, 1600);
      }
    }
  }

  // ===================== 6. CHẠY PHÂN TÍCH CHÍNH CỦA MODULE =====================
  function runTamSatAnalysis() {
    const can = document.getElementById("ts_selCan").value;
    const chi = document.getElementById("ts_selChi").value;
    const son = document.getElementById("ts_selSon").value;
    const activeCan = document.getElementById("ts_yearCan").value;
    const activeChi = document.getElementById("ts_yearChi").value;
    const activeYearName = activeCan + " " + activeChi;
    const activeYearRecord = findNienBieuByCanChi(activeYearName);

    const axisRadio = document.querySelector('input[name="ts_axis"]:checked');
    const isTienThien = axisRadio && axisRadio.value === "TIEN_THIEN";
    const htypeRadio = document.querySelector('input[name="ts_htype"]:checked');
    const htypeLabel = (htypeRadio && htypeRadio.value === "public") ? "Cộng đồng (Tòa nhà)" : "Tư nhân (Gia chủ)";

    const quaiSon = SON2QUAI[son];
    const tsResolved = resolveTamSatHiepKy(can, chi);
    const tsList = tsResolved.positions;

    const axisLabel = isTienThien ? "Tiên Thiên Bát Quái (Tham khảo)" : "Hậu Thiên Bát Quái (Mặc định chuẩn)";
    const matchedDetails = [];
    let html = "";
    const lines = [];

    document.getElementById("ts_summaryBar").innerHTML = `
      <span>Chủ thể (${htypeLabel}): <strong>${can} ${chi}</strong> (${CAN_HANH[can]})</span>
      <span>Sơn kiểm tra: <strong>${son} → ${quaiSon}</strong></span>
      <span>Trục: <strong>${axisLabel}</strong></span>
      <span>Tam Sát Hiệp Kỷ: <strong>${tsList.join(", ")}</strong></span>
      <span>Năm đối chiếu: <strong>${activeYearName}</strong> ${activeYearRecord ? '<span class="tag tag-cat">Có Data NB</span>' : '<span class="tag tag-neutral">Chưa có Data NB</span>'}</span>
    `;

    lines.push("==============================================================");
    lines.push(`BÁO CÁO CHẾ HÓA TAM SÁT (HIỆP KỶ + PHƯƠNG PHÁP THẦY NHQ) — ${axisLabel.toUpperCase()}`);
    lines.push("==============================================================");
    lines.push(`Chủ thể: ${can} ${chi} (${CAN_HANH[can]}) | Sơn: ${son} (${quaiSon}) | Năm đối chiếu: ${activeYearName}`);
    lines.push(`Nguồn Tam Sát: ${tsResolved.source}`);
    lines.push(`3 Phương Tam Sát: ${tsList.join(" - ")}`);
    lines.push("");

    tsList.forEach((p, idx) => {
      const roleName = TAM_SAT_ROLES[idx] || "Tam Sát";
      const haHauThien = CHI2QUAI[p];
      const haChu = isTienThien ? HAU_TO_TIEN[haHauThien] : haHauThien; // Hạ = Thể = Chủ
      const thuongKhach = findThuong(haChu, "Lục Sát"); // Thượng = Dụng = Khách
      const tenBenh = getQue(thuongKhach, haChu);
      const chung = chanDoanTamSat(thuongKhach, haChu);
      const che = timQueKeoKhach(thuongKhach, can); // Đưa Khách xuống Hạ, tìm Quẻ Đơn Chế kéo Khách đi

      const isHere = (p === son || haHauThien === quaiSon || SON2QUAI[p] === quaiSon);
      if (isHere) matchedDetails.push(`${p} (${roleName.split("(")[0].trim()})`);

      // Kiểm tra chéo phương dùng Quẻ Chế (phương của Khách = che.haKhach) với Năm Lưu Niên
      let collisionHtml = "";
      let collisionText = "";
      if (che) {
        const conflicts = checkCollisionWithActiveYear(che.haKhach, activeYearRecord, activeCan, activeChi);
        if (conflicts.length > 0) {
          collisionHtml = `<div class="ts-collision-block">
            <strong>🚫 CẢNH BÁO KIỂM TRA CHÉO NĂM ${activeYearName.toUpperCase()} — KHÔNG THỂ DÙNG QUẺ CHẾ TẠI PHƯƠNG ${QUAI[che.haKhach].p.toUpperCase()} (${che.haKhach}):</strong><br>
            Phương của Khách (<strong>${che.phuongDungQueChe}</strong>) đang trùng sát khí của năm hiện hành:<br>
            ${conflicts.map(c => `• ${c}`).join("<br>")}<br>
            <em>→ Khuyến nghị cổ pháp: Án binh bất động, tuyệt đối không treo/đặt vật phẩm tại phương này trong năm ${activeYearName}.</em>
          </div>`;
          collisionText = `CẢNH BÁO NĂM ${activeYearName}: Phương Khách ${che.phuongDungQueChe} bị trùng sát khí năm (${conflicts.join("; ")}) -> KHÔNG THỂ LÀM.`;
        } else {
          collisionHtml = `<div class="ts-collision-ok">
            ✅ <strong>Kiểm tra chéo năm ${activeYearName}:</strong> Phương của Khách <strong>${che.phuongDungQueChe}</strong> không phạm Đô Thiên / Tam Sát / Hung thần lưu niên — có thể chọn ngày giờ thuần khí (Sửu – Hợi) để đặt/treo vật phẩm nhẹ nhàng (không khoan đục).
          </div>`;
          collisionText = `Kiểm tra chéo năm ${activeYearName}: Phương Khách ${che.phuongDungQueChe} AN TOÀN.`;
        }
      }

      const quyDoiText = isTienThien
        ? `<strong>${haChu}</strong> (Chi ${p} tại cung ${haHauThien} Hậu Thiên → chiếu sang <strong>${haChu} Tiên Thiên</strong>)`
        : `<strong>${haChu}</strong> (Chi ${p} đóng tại cung <strong>${haChu} Hậu Thiên</strong>)`;

      html += `<div class="ts-case ${isHere ? "danger" : ""}">
        <div class="ts-case-head">
          <span>${idx + 1}. TAM SÁT tại phương ${p} (${QUAI[haHauThien].p}) — ${roleName.split("(")[0].trim()}</span>
          <span>
            <span class="tag tag-info">${isTienThien ? "Trục Tiên Thiên" : "Trục Hậu Thiên"}</span>
            ${isHere ? '<span class="tag tag-hung">PHẠM TẠI SƠN ĐANG XEM</span>' : ""}
          </span>
        </div>
        <div class="note" style="margin-bottom:6px;">Vai trò sát khí: <strong>${roleName}</strong> · Nguồn: ${tsResolved.source}</div>
        <ul class="ts-steps">
          <li><span class="ts-lbl">1. Hạ quái (Thể = Chủ):</span> ${quyDoiText}</li>
          <li><span class="ts-lbl">2. Thượng quái (Dụng = Khách):</span> <strong>${thuongKhach}</strong> (${QUAI[thuongKhach].h} — phối ${haChu} ra <strong>Lục Sát</strong>)</li>
          <li><span class="ts-lbl">3. Quẻ Chính (Tương tác sát):</span> <span class="ts-que-bad">${tenBenh}</span> (${thuongKhach} trên / ${haChu} dưới)</li>
          <li><span class="ts-lbl">4. Chẩn đoán khí bệnh:</span> <strong>${chung.loai}</strong> — ${chung.moTa}</li>
          <li><span class="ts-lbl">5. Quẻ Chế ("Kéo Khách"):</span> <span class="ts-que-ok">${che ? che.ten : "?"}</span>
            ${che ? `(${che.thuongChe} trên / ${che.haKhach} dưới — đạt cung <strong>${che.dn}</strong> với Khách)` : ""}</li>
          <li><span class="ts-lbl">6. Phương dùng Quẻ Chế:</span> <strong>${che ? che.phuongDungQueChe : "?"}</strong></li>
        </ul>
        ${che ? `<div class="ts-explain">
          <strong>🔍 Cơ chế "Kéo Khách rời khỏi Chủ" &amp; An Vị Vật Phẩm (Thầy NHQ):</strong><br>
          • <strong>Phân tâm Khách:</strong> Giữ nguyên <strong>Khách (${thuongKhach})</strong> làm nền (Hạ), phối với quẻ đơn <strong>${che.thuongChe}</strong> (Thượng) tạo thành <strong>${che.dn}</strong>. Khách vì tương tác cát lành với <strong>${che.thuongChe}</strong> mà vui vẻ rời đi, cắt/giảm xung lực Lục Sát với Chủ (<strong>${haChu}</strong>).<br>
          ${che.lyDo.map(r => `• ${r}`).join("<br>")}<br>
          • <strong>Vật phẩm chế hóa:</strong> Đặt tại <strong>${che.phuongDungQueChe}</strong>. ${che.vatPham}
        </div>` : ""}
        ${collisionHtml}
        <div class="ts-warn">
          <strong>⛔ NGUYÊN TẮC BẤT KHẢ ĐỘNG CHỦ:</strong><br>
          • Phương vị <strong>${p} (cung ${haHauThien} — ${QUAI[haHauThien].p})</strong> là phương Chủ đang lâm Tam Sát, <strong>tuyệt đối không động chạm</strong> (không khoan đục, đào bới, sửa chữa hay treo vật phẩm trấn ngay tại phương Chủ này).
        </div>
      </div>`;

      lines.push(`--- ${idx + 1}. TAM SÁT TẠI PHƯƠNG ${p} (${QUAI[haHauThien].p}) — ${roleName} ${isHere ? "[CÓ MẶT]" : ""} ---`);
      lines.push(`Hạ (Chủ): ${haChu} | Thượng (Khách): ${thuongKhach} (Lục Sát) | Quẻ Chính: ${tenBenh}`);
      lines.push(`Chẩn đoán: ${chung.loai} — ${chung.moTa}`);
      if (che) {
        lines.push(`Quẻ Chế: ${che.ten} (${che.thuongChe} trên / ${che.haKhach} dưới — ${che.dn})`);
        lines.push(`Phương dùng Quẻ Chế: ${che.phuongDungQueChe}`);
        lines.push(`Vật phẩm: ${che.vatPham.replace(/<[^>]+>/g, "")}`);
        lines.push(collisionText);
      }
      lines.push(`CẤM KỴ: Tuyệt đối không động chạm vào phương Chủ ${p} (${QUAI[haHauThien].p}).`);
      lines.push("");
    });

    // ---------- TỔNG KẾT ----------
    if (matchedDetails.length > 0) {
      html = `<div class="ts-case danger">
        <div class="ts-case-head"><span>⚠️ TỔNG KẾT TAM SÁT TẠI SƠN ${son.toUpperCase()} (${QUAI[quaiSon].p})</span></div>
        <p style="margin:4px 0;">Sơn/Cung đang xem phạm vào: ${matchedDetails.map(s => `<span class="tag tag-hung">⛔ ${s}</span>`).join(" ")}</p>
        <p style="font-size:.86rem;margin:6px 0 0;">• <strong>Tuyệt đối tránh manh động:</strong> Không đào bới, khoan đục, sửa chữa tại phương này.<br>• <strong>Nếu cần tiểu chế:</strong> Chỉ đặt vật phẩm mang tượng ý Quẻ Chế tại <strong>phương của Khách</strong> (khi đã xác nhận không trùng sát khí của Năm ${activeYearName}).</p>
      </div>` + html;
      lines.unshift(`*** TẠI SƠN ${son}: PHẠM ${matchedDetails.join(", ")} ***\n`);
    } else {
      html = `<div class="ts-case good">
        <div class="ts-case-head"><span>✅ TỔNG KẾT TAM SÁT TẠI SƠN ${son.toUpperCase()} (${QUAI[quaiSon].p})</span></div>
        <p style="margin:4px 0;font-size:.86rem;">Sơn <strong>${son}</strong> không nằm trong 3 phương Tam Sát (<strong>${tsList.join(", ")}</strong>) của chủ thể (${can} ${chi}) theo chuẩn <em>Hiệp Kỷ Biện Phương Thư</em>. Vẫn cần lưu ý kiêng động thổ, tu tạo tại 3 phương Tam Sát nói trên.</p>
      </div>` + html;
    }

    document.getElementById("ts_resultsContainer").innerHTML = html;
    lastReportText = lines.join("\n");
    const outEl = document.getElementById("ts_outputArea");
    outEl.style.display = "block";
    outEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ===================== 7. KHỞI TẠO & GẮN VÀO TRANG CHÍNH =====================
  function setToggleState(on) {
    isModuleOn = !!on;
    const cb = document.getElementById("ts_toggleOnOff");
    const badge = document.getElementById("ts_toggleBadge");
    const body = document.getElementById("ts_bodyContainer");
    if (cb) cb.checked = isModuleOn;
    if (badge) badge.textContent = isModuleOn ? "ON" : "OFF";
    if (body) body.style.display = isModuleOn ? "block" : "none";
    try { localStorage.setItem(STORAGE_KEY_ON, isModuleOn ? "1" : "0"); } catch (e) {}
    if (isModuleOn) syncFromMainForm(true);
  }

  function mountModule() {
    if (document.getElementById("ts_moduleCard")) return;
    injectStyles();

    const card = document.createElement("div");
    card.id = "ts_moduleCard";
    card.className = "card ts-card";
    card.innerHTML = buildModuleHtml();

    // Chèn ngay sau module Đô Thiên (nếu có) hoặc ngay phía trên khối "Dữ Liệu Gốc Năm"
    const dtCard = document.getElementById("dt_moduleCard");
    const detailEl = document.getElementById("detailDataContainer");
    const detailCard = detailEl ? detailEl.closest(".card") : null;
    const fabDock = document.querySelector(".fab-dock");

    if (dtCard && dtCard.parentNode) {
      dtCard.parentNode.insertBefore(card, dtCard.nextSibling);
    } else if (detailCard && detailCard.parentNode) {
      detailCard.parentNode.insertBefore(card, detailCard);
    } else if (fabDock && fabDock.parentNode) {
      fabDock.parentNode.insertBefore(card, fabDock);
    } else {
      document.body.appendChild(card);
    }

    // Gắn sự kiện
    document.getElementById("ts_toggleOnOff").addEventListener("change", function () {
      setToggleState(this.checked);
    });

    document.querySelectorAll('input[name="ts_axis"]').forEach(radio => {
      radio.addEventListener("change", function () {
        if (document.getElementById("ts_outputArea").style.display === "block") {
          runTamSatAnalysis();
        }
      });
    });

    document.getElementById("ts_btnRun").addEventListener("click", runTamSatAnalysis);
    document.getElementById("ts_btnSync").addEventListener("click", function () {
      syncFromMainForm(false);
    });

    document.getElementById("ts_btnCopy").addEventListener("click", function () {
      if (!lastReportText) return;
      const btn = this;
      const done = () => {
        btn.textContent = "✅ Đã sao chép báo cáo!";
        setTimeout(() => { btn.textContent = "📋 Sao Chép Báo Cáo Tam Sát"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastReportText).then(done).catch(() => {});
      }
    });

    // Khôi phục trạng thái ON / OFF đã lưu
    let savedOn = false;
    try { savedOn = localStorage.getItem(STORAGE_KEY_ON) === "1"; } catch (e) {}
    setToggleState(savedOn);

    // Expose API nhỏ để các module sau tham chiếu
    window.TamSatModule = {
      run: runTamSatAnalysis,
      toggle: setToggleState,
      getLastReport: function () { return lastReportText; }
    };
  }

  // Lắng nghe sự kiện nienbieu:ready từ code nền hoặc chạy ngay nếu đã sẵn sàng
  if (window.TraCuuApp && window.TraCuuApp.ready) {
    mountModule();
  } else {
    document.addEventListener("nienbieu:ready", mountModule);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountModule);
    } else {
      mountModule();
    }
  }
})();

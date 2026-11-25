/* =========================================================================
 * dothien.js — MODULE CHẾ HÓA PHƯƠNG VỊ ĐÔ THIÊN (TIỂU - TRUNG DỤNG SỰ)
 * -------------------------------------------------------------------------
 * - Nguồn định vị sát khí nền: Trích xuất từ Niên Biểu 60 Hoa Giáp
 *   (Hiệp Kỷ Biện Phương Thư); nếu niên biểu chưa có dữ liệu thì tự động
 *   fallback về quy tắc Ngũ Hổ Độn theo Thiên Can của thầy NHQ.
 * - Nguồn thuật toán chế hóa: Phương pháp của thầy NHQ (giữ trọn 2 trục
 *   quy đổi Hậu Thiên Bát Quái mặc định & Tiên Thiên Bát Quái tham khảo).
 * - Tích hợp kiểm tra chéo (Collision Gate) phương vị đặt vật phẩm trấn với
 *   sát khí của Năm Lưu Niên hiện hành trong Niên Biểu.
 * - Tích hợp công tắc ON / OFF để tiết kiệm không gian trang chính.
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

  // Bảng Đô Thiên theo Thiên Can (Ngũ Hổ Độn tìm Mậu - Kỷ theo thầy NHQ)
  const DO_THIEN_NHQ = {
    Giáp: ["Thìn", "Tỵ"], Kỷ:   ["Thìn", "Tỵ"],
    Ất:   ["Dần", "Mão"], Canh: ["Dần", "Mão"],
    Bính: ["Tuất", "Hợi"], Tân: ["Tuất", "Hợi"],
    Đinh: ["Thân", "Dậu"], Nhâm: ["Thân", "Dậu"],
    Mậu:  ["Ngọ", "Mùi"], Quý:  ["Ngọ", "Mùi"]
  };

  const CHI2QUAI = {
    Tý: "Khảm", Sửu: "Cấn", Dần: "Cấn", Mão: "Chấn",
    Thìn: "Tốn", Tỵ: "Tốn", Ngọ: "Ly", Mùi: "Khôn",
    Thân: "Khôn", Dậu: "Đoài", Tuất: "Càn", Hợi: "Càn"
  };

  // Ánh xạ Hậu Thiên -> Tiên Thiên tại cùng phương vị địa lý trên La Kinh
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

  const DO_THIEN_THUY_KHAU = {
    "Giáp-Kỷ": "Phương Thìn - Tỵ (cung Tốn - Đông Nam) và giáp ranh Tốn - Bính. Kỵ mở thủy khẩu, cống thoát nước, ao hồ động thủy, cổng lớn ra vào trực diện.",
    "Ất-Canh": "Phương Dần - Mão (cung Cấn - Đông Bắc và cung Chấn - Chính Đông) cùng sơn Giáp. Kỵ mở cổng chính, lối đi lớn, dòng nước chảy xiết hay đào ao giếng.",
    "Bính-Tân": "Phương Tuất - Hợi (cung Càn - Tây Bắc) và giáp ranh Càn - Nhâm. Kỵ đặt thủy khẩu xả nước, mở cổng ngõ xung động hay khơi thông mương rãnh.",
    "Đinh-Nhâm": "Phương Thân - Dậu (cung Khôn - Tây Nam và cung Đoài - Chính Tây) cùng sơn Canh. Kỵ mở thủy khẩu, cửa thoát nước, cổng lớn hoặc lối đi động khí.",
    "Mậu-Quý": "Phương Ngọ - Mùi (cung Ly - Chính Nam và cung Khôn - Tây Nam) cùng sơn Đinh. Kỵ đặt thủy khẩu, bể nước động, cổng chính hay trổ cửa lớn."
  };

  const BAT_SAT = { Tốn: "Dậu", Ly: "Hợi", Khôn: "Mão", Đoài: "Tỵ", Càn: "Ngọ", Khảm: "Thìn", Cấn: "Dần", Chấn: "Thân" };
  const TAM_SAT = {
    Dần: ["Thân", "Dậu", "Tuất"], Ngọ: ["Thân", "Dậu", "Tuất"], Tuất: ["Thân", "Dậu", "Tuất"],
    Hợi: ["Tỵ", "Ngọ", "Mùi"], Mão: ["Tỵ", "Ngọ", "Mùi"], Mùi: ["Tỵ", "Ngọ", "Mùi"],
    Tỵ: ["Hợi", "Tý", "Sửu"], Dậu: ["Hợi", "Tý", "Sửu"], Sửu: ["Hợi", "Tý", "Sửu"],
    Thân: ["Dần", "Mão", "Thìn"], Tý: ["Dần", "Mão", "Thìn"], Thìn: ["Dần", "Mão", "Thìn"]
  };

  const CAN_HANH = { Giáp: "Mộc", Ất: "Mộc", Bính: "Hỏa", Đinh: "Hỏa", Mậu: "Thổ", Kỷ: "Thổ", Canh: "Kim", Tân: "Kim", Nhâm: "Thủy", Quý: "Thủy" };
  const SINH = { Thủy: "Mộc", Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy" };
  const KHAC = { Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc", Mộc: "Thổ", Thổ: "Thủy" };

  // ===================== 2. HÀM HỖ TRỢ LÕI & NỐI NIÊN BIỂU =====================
  function getCanPairKey(can) {
    if (can === "Giáp" || can === "Kỷ") return "Giáp-Kỷ";
    if (can === "Ất" || can === "Canh") return "Ất-Canh";
    if (can === "Bính" || can === "Tân") return "Bính-Tân";
    if (can === "Đinh" || can === "Nhâm") return "Đinh-Nhâm";
    return "Mậu-Quý";
  }

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

  // Tìm record Niên Biểu theo tên Can Chi (ví dụ "Bính Ngọ")
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

  // Trích xuất phương vị Đô Thiên từ Niên Biểu; nếu không có thì fallback về logic NHQ
  function resolveDoThienPositions(can, chi) {
    const canChi = can + " " + chi;
    const record = findNienBieuByCanChi(canChi);
    let foundFromNB = [];

    if (record && record.hung) {
      const pools = [record.hung.chung, record.hung.tuPhuongHung, record.hung.khaiSonHung, record.hung.lapHuongHung];
      pools.forEach(group => {
        if (!group) return;
        Object.keys(group).forEach(k => {
          const kl = k.toLowerCase();
          if (kl.indexOf("đô thiên") !== -1 || kl.indexOf("mậu kỷ") !== -1) {
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

    if (foundFromNB.length > 0) {
      return {
        positions: foundFromNB,
        source: "Niên Biểu 60 Hoa Giáp (" + canChi + " — Hiệp Kỷ Biện Phương Thư)",
        isFallback: false
      };
    }

    return {
      positions: DO_THIEN_NHQ[can] || [],
      source: "Logic Thiên Can thầy NHQ (Ngũ Hổ Độn Mậu/Kỷ — do Niên Biểu chưa ghi mục riêng)",
      isFallback: true
    };
  }

  // Kiểm tra chéo 1 cung Bát Quái (phương đặt vật trấn P) với Niên Biểu năm hiện hành
  function checkCollisionWithActiveYear(quaiTarget, activeYearRecord, activeCan, activeChi) {
    const sonsOfQuai = QUAI2SONS[quaiTarget] || [];
    const conflicts = [];

    // 1. Kiểm tra trực tiếp trong data Niên Biểu của Năm Lưu Niên (nếu đã nạp)
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

    // 2. Bổ sung kiểm tra Đô Thiên & Tam Sát lưu niên theo Can Chi năm (kể cả khi năm chưa nạp đủ sách)
    if (activeCan && DO_THIEN_NHQ[activeCan]) {
      const dtYear = DO_THIEN_NHQ[activeCan];
      const hitDt = dtYear.filter(c => CHI2QUAI[c] === quaiTarget || sonsOfQuai.indexOf(c) !== -1);
      if (hitDt.length > 0) {
        const msg = `[Lưu niên Can ${activeCan}] Đô Thiên năm tại ${hitDt.join(", ")}`;
        if (!conflicts.some(x => x.indexOf("Đô Thiên") !== -1)) conflicts.push(msg);
      }
    }

    if (activeChi && TAM_SAT[activeChi]) {
      const tsYear = TAM_SAT[activeChi];
      const hitTs = tsYear.filter(c => CHI2QUAI[c] === quaiTarget || sonsOfQuai.indexOf(c) !== -1);
      if (hitTs.length > 0) {
        const msg = `[Lưu niên Chi ${activeChi}] Tam Sát năm tại ${hitTs.join(", ")}`;
        if (!conflicts.some(x => x.indexOf("Tam Sát") !== -1)) conflicts.push(msg);
      }
    }

    return conflicts;
  }

  // ===================== 3. CHẨN ĐOÁN & TÌM QUẺ HÓA (THẦY NHQ) =====================
  function chanDoan(thuong, ha) {
    const hDung = QUAI[thuong].h;
    const hThe = QUAI[ha].h;
    if (KHAC[hDung] === hThe) return { loai: "Hư Chứng", moTa: `Dụng (${thuong}-${hDung}) khắc Thể (${ha}-${hThe}): khí bệnh đè nén, rút cạn sinh lực nền.` };
    if (KHAC[hThe] === hDung) return { loai: "Hư Chứng", moTa: `Thể (${ha}-${hThe}) khắc Dụng (${thuong}-${hDung}): xung khắc trực diện.` };
    if (SINH[hThe] === hDung) return { loai: "Thực Chứng", moTa: `Thể (${ha}-${hThe}) sinh Dụng (${thuong}-${hDung}): khí bệnh được nuôi dưỡng, ứ đọng.` };
    if (SINH[hDung] === hThe) return { loai: "Thực Chứng", moTa: `Dụng (${thuong}-${hDung}) sinh Thể (${ha}-${hThe}): khí bệnh bồi đắp thêm cho nền.` };
    return { loai: "Tỷ Hòa", moTa: `Đồng hành ${hThe}: sát khí cộng hưởng.` };
  }

  function timQueHoa(dungQuai, canChu) {
    const hCan = CAN_HANH[canChu];
    const candidates = [];

    Object.keys(QUAI).forEach(qHoa => {
      if (qHoa === dungQuai) return;
      const dn = DU[dungQuai][qHoa]; // Đưa Dụng xuống Hạ, qHoa làm Thượng
      if (["Sinh Khí", "Thiên Y", "Diên Niên"].indexOf(dn) === -1) return;

      let score = 0;
      const lyDo = [];

      if (dn === "Sinh Khí") {
        score += 50;
        lyDo.push(`Phối với Dụng ${dungQuai} tạo thành <strong>Sinh Khí</strong> (cát tinh bậc nhất).`);
      } else if (dn === "Thiên Y") {
        score += 40;
        lyDo.push(`Phối với Dụng ${dungQuai} tạo thành <strong>Thiên Y</strong>.`);
      } else {
        score += 30;
        lyDo.push(`Phối với Dụng ${dungQuai} tạo thành <strong>Diên Niên</strong>.`);
      }

      const hHoa = QUAI[qHoa].h;
      if (hHoa === hCan) {
        score += 35;
        lyDo.push(`Quẻ giải <strong>${qHoa} (${hHoa})</strong> tỷ hòa đồng khí với Can <strong>${canChu} (${hCan})</strong> (Đại Cát).`);
      } else if (SINH[hHoa] === hCan) {
        score += 32;
        lyDo.push(`Quẻ giải <strong>${qHoa} (${hHoa})</strong> sinh trợ cho Can <strong>${canChu} (${hCan})</strong> (Đại Cát).`);
      } else if (KHAC[hCan] === hHoa) {
        score += 18;
        lyDo.push(`Can <strong>${canChu} (${hCan})</strong> chế ngự được quẻ giải <strong>${qHoa} (${hHoa})</strong> (Tiểu Cát - chủ kiểm soát được công cụ trấn).`);
      } else if (SINH[hCan] === hHoa) {
        score -= 10;
        lyDo.push(`Lưu ý: Can ${canChu} (${hCan}) sinh xuất cho ${qHoa} (${hHoa}) (hơi tiết khí chủ thể).`);
      } else if (KHAC[hHoa] === hCan) {
        score -= 40;
        lyDo.push(`Cảnh báo: Quẻ ${qHoa} (${hHoa}) khắc ngược Can ${canChu} (${hCan}) (bất lợi cho chủ thể).`);
      }

      candidates.push({
        score: score,
        thuongHoa: qHoa,
        haDung: dungQuai,
        ten: getQue(qHoa, dungQuai),
        dn: dn,
        lyDo: lyDo,
        phuongTran: `${QUAI[dungQuai].p} (cung ${dungQuai} — phương của Quẻ Dụng)`,
        vatPham: `Vật phẩm mang hàm nghĩa/tượng ý của quẻ <strong>${qHoa} (${QUAI[qHoa].h})</strong>: ${QUAI[qHoa].tuong}.`
      });
    });

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }

  // ===================== 4. CSS & GIAO DIỆN MODULE (ON / OFF) =====================
  const STORAGE_KEY_ON = "tc_dothien_module_on";
  let isModuleOn = false;
  let lastReportText = "";

  function injectStyles() {
    if (document.getElementById("dt-module-styles")) return;
    const style = document.createElement("style");
    style.id = "dt-module-styles";
    style.textContent = `
      .dt-card { border-top: 3px solid var(--gold); }
      .dt-sub-note { font-size: .83rem; color: var(--muted); background: rgba(201,151,43,.09); border-left: 3px solid var(--gold); padding: 7px 11px; border-radius: 6px; margin-bottom: 12px; }
      .dt-axis-box { background: rgba(59,63,216,.06); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; margin-bottom: 12px; }
      .dt-axis-title { font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; color: var(--navy); margin-bottom: 8px; }
      .dt-radio-group { display: flex; flex-wrap: wrap; gap: 8px; }
      .dt-radio-pill { flex: 1 1 210px; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid var(--border); background: #fff; border-radius: 8px; padding: 8px 10px; cursor: pointer; font-size: .85rem; font-weight: 600; color: var(--ink); transition: all .15s; margin: 0; }
      .dt-radio-pill input { display: none; }
      .dt-radio-pill:has(input:checked) { background: var(--navy); color: #fff; border-color: var(--navy); }
      .dt-principle { background: #f0fdf4; border: 1px solid #bbf7d0; color: #14532d; border-radius: 10px; padding: 10px 12px; font-size: .84rem; line-height: 1.55; margin: 12px 0; }
      .dt-btn-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
      .dt-btn-sync { background: #475569; box-shadow: none; }
      .dt-summary-bar { background: linear-gradient(135deg,#f6f5ff,#fffaf0); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; margin: 12px 0; font-size: .86rem; display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; }
      .dt-case { background: #fff; border: 1px solid var(--border); border-left: 5px solid var(--gold); border-radius: 12px; padding: 13px; margin-bottom: 12px; }
      .dt-case.danger { border-left-color: var(--hung); }
      .dt-case.good { border-left-color: var(--cat); }
      .dt-case-head { font-weight: 700; font-size: .98rem; color: var(--navy); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed var(--border); }
      .dt-steps { list-style: none; padding: 0; margin: 0; font-size: .88rem; }
      .dt-steps li { padding: 5px 0; border-bottom: 1px dashed rgba(0,0,0,.07); }
      .dt-steps li:last-child { border-bottom: none; }
      .dt-lbl { font-weight: 700; color: var(--navy); display: inline-block; min-width: 175px; }
      .dt-que-bad { color: var(--hung); font-weight: 700; }
      .dt-que-ok { color: var(--cat); font-weight: 700; }
      .dt-explain { margin-top: 9px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: .85rem; line-height: 1.6; }
      .dt-warn { margin-top: 9px; background: #fff1f2; border: 1px solid #fecdd3; color: #881337; border-radius: 8px; padding: 10px 12px; font-size: .84rem; line-height: 1.55; }
      .dt-collision-ok { margin-top: 9px; background: #f0fdf4; border: 1px solid #86efac; color: #14532d; border-radius: 8px; padding: 9px 12px; font-size: .84rem; font-weight: 600; }
      .dt-collision-block { margin-top: 9px; background: #fef2f2; border: 2px solid #dc2626; color: #7f1d1d; border-radius: 8px; padding: 10px 12px; font-size: .85rem; line-height: 1.55; }
      @media (prefers-color-scheme:dark) {
        .dt-axis-title, .dt-case-head, .dt-lbl { color: #e7e5ff; }
        .dt-radio-pill { background: #262950; color: var(--ink); }
        .dt-radio-pill:has(input:checked) { background: var(--primary); color: #fff; border-color: var(--primary); }
        .dt-principle { background: #143024; border-color: #1f4d3a; color: #a7f3d0; }
        .dt-summary-bar { background: #2a2b52; }
        .dt-case { background: #23264d; }
        .dt-explain { background: #1b1e3d; border-color: #34376b; color: #dcdaf0; }
        .dt-warn { background: #3b1824; border-color: #6b2137; color: #fda4af; }
        .dt-collision-ok { background: #143024; border-color: #1f4d3a; color: #86efac; }
        .dt-collision-block { background: #45121b; border-color: #f43f5e; color: #fecdd3; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildModuleHtml() {
    const canOpts = CAN_LIST.map(c => `<option value="${c}" ${c === "Đinh" ? "selected" : ""}>${c}</option>`).join("");
    const chiOpts = CHI_LIST.map(c => `<option value="${c}" ${c === "Mùi" ? "selected" : ""}>${c}</option>`).join("");
    const yearCanOpts = CAN_LIST.map(c => `<option value="${c}">${c}</option>`).join("");
    const yearChiOpts = CHI_LIST.map(c => `<option value="${c}">${c}</option>`).join("");

    return `
      <div class="nb-header-bar">
        <h2>☯️ Module Đô Thiên Đồng Nhất</h2>
        <label class="nb-toggle-wrap" title="Bật/Tắt module Chế Hóa Đô Thiên để tiết kiệm không gian trang">
          <span>Chế Hóa Đô Thiên</span>
          <input type="checkbox" id="dt_toggleOnOff">
          <span class="nb-switch"></span>
          <span class="nb-state-badge" id="dt_toggleBadge">OFF</span>
        </label>
      </div>
      <div class="dt-sub-note">
        <strong>Ghi chú nguồn:</strong> Xác định phương vị Đô Thiên từ data <strong>Niên Biểu (Hiệp Kỷ Biện Phương Thư)</strong> (tự động fallback Ngũ Hổ Độn nếu niên biểu chưa có mục riêng). <strong>Chế Hóa phương vị Đô Thiên tiểu - trung dụng sự theo phương pháp của thầy NHQ.</strong>
      </div>

      <div id="dt_bodyContainer" style="display:none;">
        <div class="dt-axis-box">
          <div class="dt-axis-title">⚙️ Trục quy đổi Đô Thiên (Bật / Tắt tham chiếu)</div>
          <div class="dt-radio-group">
            <label class="dt-radio-pill">
              <input type="radio" name="dt_axis" value="HAU_THIEN" checked>
              <span>🧭 Đô Thiên Hậu Thiên (Mặc định)</span>
            </label>
            <label class="dt-radio-pill">
              <input type="radio" name="dt_axis" value="TIEN_THIEN">
              <span>☯️ Đô Thiên Tiên Thiên (Tham khảo)</span>
            </label>
          </div>
        </div>

        <div class="dt-axis-box">
          <div class="dt-axis-title">🏛️ Loại công trình (Xác định Chủ Thể)</div>
          <div class="dt-radio-group">
            <label class="dt-radio-pill">
              <input type="radio" name="dt_htype" value="private" checked>
              <span>Tư nhân (Can + Chi tuổi gia chủ)</span>
            </label>
            <label class="dt-radio-pill">
              <input type="radio" name="dt_htype" value="public">
              <span>Cộng đồng (Can + Chi tòa nhà)</span>
            </label>
          </div>
        </div>

        <div class="row">
          <div class="form-group">
            <label for="dt_selCan">Thiên Can chủ thể (Tuổi / Tòa nhà):</label>
            <select id="dt_selCan">${canOpts}</select>
          </div>
          <div class="form-group">
            <label for="dt_selChi">Địa Chi chủ thể (Tính Tam Sát):</label>
            <select id="dt_selChi">${chiOpts}</select>
          </div>
          <div class="form-group">
            <label for="dt_selSon">Sơn / Hướng đang kiểm tra (24 Sơn):</label>
            <select id="dt_selSon">
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
                <option value="Mùi">Mùi</option><option value="Khôn" selected>Khôn</option><option value="Thân">Thân</option>
              </optgroup>
              <optgroup label="Cung Đoài (Tây)">
                <option value="Canh">Canh</option><option value="Dậu">Dậu</option><option value="Tân">Tân</option>
              </optgroup>
              <optgroup label="Cung Càn (Tây Bắc)">
                <option value="Tuất">Tuất</option><option value="Càn">Càn</option><option value="Hợi">Hợi</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div class="row" style="margin-top:10px;">
          <div class="form-group">
            <label for="dt_yearCan">Thiên Can Năm Lưu Niên (Kiểm tra chéo):</label>
            <select id="dt_yearCan">${yearCanOpts}</select>
          </div>
          <div class="form-group">
            <label for="dt_yearChi">Địa Chi Năm Lưu Niên (Kiểm tra chéo):</label>
            <select id="dt_yearChi">${yearChiOpts}</select>
          </div>
        </div>

        <div class="dt-principle">
          <strong>Quy tắc bất biến Đô Thiên (Phương pháp thầy NHQ):</strong><br>
          1. <strong>Hạ quái (Thể):</strong> Phương vị Đô Thiên (theo trục Hậu Thiên mặc định hoặc Tiên Thiên tham khảo).<br>
          2. <strong>Thượng quái (Dụng):</strong> Quẻ phối với Hạ quái tạo thành <strong>Họa Hại</strong> (bản khí Đô Thiên).<br>
          3. <strong>Quẻ Hóa (Chế hóa):</strong> Đưa <strong>Dụng (Thượng quái)</strong> xuống làm Hạ quái nền, phối với <strong>Quẻ Đơn Hóa Giải</strong> ở Thượng quái tạo thành <strong>Bát San tốt</strong> (Sinh Khí / Thiên Y / Diên Niên) và hòa thuận với Thiên Can chủ thể.<br>
          4. <strong>Phương vị & Vật phẩm trấn:</strong> Đặt vật phẩm mang hàm nghĩa <strong>Quẻ Đơn Hóa Giải</strong> tại đúng <strong>phương của Quẻ Dụng</strong> (sau khi đã kiểm tra chéo không trùng sát khí của Năm hiện hành). Tuyệt đối <strong>không động chạm</strong> vào phương vị Đô Thiên.
        </div>

        <div class="dt-btn-row">
          <button type="button" id="dt_btnRun">⚡ Phân Tích Đô Thiên &amp; Chế Hóa</button>
          <button type="button" id="dt_btnSync" class="dt-btn-sync">📥 Lấy Năm &amp; Sơn từ Bảng Tra Cứu Trên</button>
        </div>

        <div id="dt_outputArea" style="display:none; margin-top:14px;">
          <div class="dt-summary-bar" id="dt_summaryBar"></div>
          <div id="dt_resultsContainer"></div>
          <button type="button" id="dt_btnCopy" class="secondary" style="width:100%; margin-top:6px;">📋 Sao Chép Báo Cáo Đô Thiên</button>
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
        const yCanEl = document.getElementById("dt_yearCan");
        const yChiEl = document.getElementById("dt_yearChi");
        if (yCanEl && CAN_LIST.indexOf(parts[0]) !== -1) yCanEl.value = parts[0];
        if (yChiEl && CHI_LIST.indexOf(parts[1]) !== -1) yChiEl.value = parts[1];
      }
    } else {
      // Mặc định lấy Can Chi năm hiện tại
      const curY = new Date().getFullYear();
      if (window.TraCuuApp && typeof window.TraCuuApp.getYearCanChi === "function") {
        const cc = window.TraCuuApp.getYearCanChi(curY).split(/\s+/);
        if (cc.length === 2) {
          document.getElementById("dt_yearCan").value = cc[0];
          document.getElementById("dt_yearChi").value = cc[1];
        }
      }
    }

    if (mainHuongSel && mainHuongSel.value) {
      const hVal = mainHuongSel.value;
      const mappedSon = PHUONG_TO_SON_DEFAULT[hVal] || hVal;
      const dtSonEl = document.getElementById("dt_selSon");
      if (dtSonEl && SON2QUAI[mappedSon]) {
        dtSonEl.value = mappedSon;
      }
    }

    if (!silent) {
      const btn = document.getElementById("dt_btnSync");
      if (btn) {
        const old = btn.textContent;
        btn.textContent = "✅ Đã đồng bộ Năm Lưu Niên & Sơn!";
        setTimeout(() => { btn.textContent = old; }, 1600);
      }
    }
  }

  // ===================== 6. CHẠY PHÂN TÍCH CHÍNH CỦA MODULE =====================
  function runDoThienAnalysis() {
    const can = document.getElementById("dt_selCan").value;
    const chi = document.getElementById("dt_selChi").value;
    const son = document.getElementById("dt_selSon").value;
    const activeCan = document.getElementById("dt_yearCan").value;
    const activeChi = document.getElementById("dt_yearChi").value;
    const activeYearName = activeCan + " " + activeChi;
    const activeYearRecord = findNienBieuByCanChi(activeYearName);

    const axisRadio = document.querySelector('input[name="dt_axis"]:checked');
    const isTienThien = axisRadio && axisRadio.value === "TIEN_THIEN";
    const htypeRadio = document.querySelector('input[name="dt_htype"]:checked');
    const htypeLabel = (htypeRadio && htypeRadio.value === "public") ? "Cộng đồng (Tòa nhà)" : "Tư nhân (Gia chủ)";

    const quaiSon = SON2QUAI[son];
    const dtResolved = resolveDoThienPositions(can, chi);
    const dtList = dtResolved.positions;
    const tsList = TAM_SAT[chi] || [];
    const bsPhuong = BAT_SAT[quaiSon];
    const thuyKhauNote = DO_THIEN_THUY_KHAU[getCanPairKey(can)];

    const axisLabel = isTienThien ? "Tiên Thiên Bát Quái (Tham khảo)" : "Hậu Thiên Bát Quái (Mặc định chuẩn)";
    const satsHere = [];
    let html = "";
    const lines = [];

    document.getElementById("dt_summaryBar").innerHTML = `
      <span>Chủ thể (${htypeLabel}): <strong>${can} ${chi}</strong> (${CAN_HANH[can]})</span>
      <span>Sơn kiểm tra: <strong>${son} → ${quaiSon}</strong></span>
      <span>Trục: <strong>${axisLabel}</strong></span>
      <span>Đô Thiên: <strong>${dtList.join(", ")}</strong></span>
      <span>Năm đối chiếu: <strong>${activeYearName}</strong> ${activeYearRecord ? '<span class="tag tag-cat">Có Data NB</span>' : '<span class="tag tag-neutral">Chưa có Data NB</span>'}</span>
    `;

    lines.push("==============================================================");
    lines.push(`BÁO CÁO CHẾ HÓA ĐÔ THIÊN (PHƯƠNG PHÁP THẦY NHQ) — ${axisLabel.toUpperCase()}`);
    lines.push("==============================================================");
    lines.push(`Chủ thể: ${can} ${chi} (${CAN_HANH[can]}) | Sơn: ${son} (${quaiSon}) | Năm đối chiếu: ${activeYearName}`);
    lines.push(`Nguồn Đô Thiên: ${dtResolved.source}`);
    lines.push(`Phương Đô Thiên: ${dtList.join(", ")} | Tam Sát chủ thể: ${tsList.join(", ")}`);
    lines.push("");

    // ---------- I. ĐÔ THIÊN ----------
    dtList.forEach((p, idx) => {
      const haHauThien = CHI2QUAI[p];
      const ha = isTienThien ? HAU_TO_TIEN[haHauThien] : haHauThien;
      const thuong = findThuong(ha, "Họa Hại");
      const tenBenh = getQue(thuong, ha);
      const chung = chanDoan(thuong, ha);
      const hoa = timQueHoa(thuong, can);

      const isHere = (p === son || haHauThien === quaiSon || SON2QUAI[p] === quaiSon);
      if (isHere) satsHere.push("Đô Thiên");

      // Kiểm tra chéo phương đặt vật phẩm trấn (thuong = quẻ Dụng) với Năm Lưu Niên
      let collisionHtml = "";
      let collisionText = "";
      if (hoa) {
        const conflicts = checkCollisionWithActiveYear(hoa.haDung, activeYearRecord, activeCan, activeChi);
        if (conflicts.length > 0) {
          collisionHtml = `<div class="dt-collision-block">
            <strong>🚫 CẢNH BÁO KIỂM TRA CHÉO NĂM ${activeYearName.toUpperCase()} — KHÔNG THỂ THI CÔNG TẠI PHƯƠNG ${QUAI[hoa.haDung].p.toUpperCase()} (${hoa.haDung}):</strong><br>
            Phương đặt vật phẩm trấn (<strong>${hoa.phuongTran}</strong>) đang trùng sát khí của năm hiện hành:<br>
            ${conflicts.map(c => `• ${c}`).join("<br>")}<br>
            <em>→ Khuyến nghị cổ pháp: Án binh bất động, tuyệt đối không treo/đặt vật phẩm tại phương này trong năm ${activeYearName}.</em>
          </div>`;
          collisionText = `CẢNH BÁO NĂM ${activeYearName}: Phương trấn ${hoa.phuongTran} bị trùng sát khí năm (${conflicts.join("; ")}) -> KHÔNG THỂ LÀM.`;
        } else {
          collisionHtml = `<div class="dt-collision-ok">
            ✅ <strong>Kiểm tra chéo năm ${activeYearName}:</strong> Phương đặt vật phẩm trấn <strong>${hoa.phuongTran}</strong> không phạm Đô Thiên / Tam Sát / Hung thần lưu niên — có thể chọn ngày giờ thuần khí (Sửu – Hợi) để an vị nhẹ nhàng (không khoan đục).
          </div>`;
          collisionText = `Kiểm tra chéo năm ${activeYearName}: Phương trấn ${hoa.phuongTran} AN TOÀN.`;
        }
      }

      const quyDoiText = isTienThien
        ? `<strong>${ha}</strong> (Chi ${p} tại cung ${haHauThien} Hậu Thiên → chiếu sang <strong>${ha} Tiên Thiên</strong>)`
        : `<strong>${ha}</strong> (Chi ${p} đóng tại cung <strong>${ha} Hậu Thiên</strong>)`;

      html += `<div class="dt-case ${isHere ? "danger" : ""}">
        <div class="dt-case-head">
          <span>I.${idx + 1}. ĐÔ THIÊN tại phương ${p} (${QUAI[haHauThien].p})</span>
          <span>
            <span class="tag tag-warn">${isTienThien ? "Trục Tiên Thiên" : "Trục Hậu Thiên"}</span>
            ${isHere ? '<span class="tag tag-hung">PHẠM TẠI SƠN ĐANG XEM</span>' : ""}
          </span>
        </div>
        <div class="note" style="margin-bottom:6px;">Nguồn định vị: ${dtResolved.source}</div>
        <ul class="dt-steps">
          <li><span class="dt-lbl">1. Hạ quái (Thể):</span> ${quyDoiText}</li>
          <li><span class="dt-lbl">2. Thượng quái (Dụng):</span> <strong>${thuong}</strong> (${QUAI[thuong].h} — phối ${ha} ra <strong>Họa Hại</strong>)</li>
          <li><span class="dt-lbl">3. Quẻ Bệnh (Chính):</span> <span class="dt-que-bad">${tenBenh}</span> (${thuong} trên / ${ha} dưới)</li>
          <li><span class="dt-lbl">4. Chẩn đoán:</span> <strong>${chung.loai}</strong> — ${chung.moTa}</li>
          <li><span class="dt-lbl">5. Quẻ Hóa (Chế hóa NHQ):</span> <span class="dt-que-ok">${hoa ? hoa.ten : "?"}</span>
            ${hoa ? `(${hoa.thuongHoa} trên / ${hoa.haDung} dưới — đạt cung <strong>${hoa.dn}</strong>)` : ""}</li>
          <li><span class="dt-lbl">6. Phương đặt vật trấn:</span> <strong>${hoa ? hoa.phuongTran : "?"}</strong></li>
        </ul>
        ${hoa ? `<div class="dt-explain">
          <strong>🔍 Chi tiết quy trình Chế Hóa &amp; An Vị Vật Phẩm (Thầy NHQ):</strong><br>
          • <strong>Chế hóa Dụng:</strong> Giữ nguyên <strong>Dụng (${thuong})</strong> đưa xuống Hạ quái, dùng quẻ đơn <strong>${hoa.thuongHoa}</strong> làm Thượng quái để hóa giải.<br>
          ${hoa.lyDo.map(r => `• ${r}`).join("<br>")}<br>
          • <strong>Vật phẩm trấn:</strong> Đặt tại <strong>${hoa.phuongTran}</strong>. ${hoa.vatPham}
        </div>` : ""}
        ${collisionHtml}
        <div class="dt-warn">
          <strong>⛔ CẤM KỴ ĐÔ THIÊN BẤT KHẢ ĐỘNG:</strong><br>
          • Phương vị <strong>${p} (cung ${haHauThien} — ${QUAI[haHauThien].p})</strong> là tọa độ Đô Thiên, <strong>tuyệt đối không động vào</strong> (không đặt vật phẩm trấn tại đây, không đào bới, khoan đục, sửa chữa).<br>
          • <strong>Kiêng kỵ Thủy Khẩu theo Cổ Pháp:</strong> ${thuyKhauNote}
        </div>
      </div>`;

      lines.push(`--- I.${idx + 1}. ĐÔ THIÊN TẠI PHƯƠNG ${p} (${QUAI[haHauThien].p}) ${isHere ? "[CÓ MẶT]" : ""} ---`);
      lines.push(`Hạ quái (Thể): ${ha} | Thượng quái (Dụng): ${thuong} (Họa Hại) | Quẻ Bệnh: ${tenBenh}`);
      lines.push(`Chẩn đoán: ${chung.loai} — ${chung.moTa}`);
      if (hoa) {
        lines.push(`Quẻ Hóa: ${hoa.ten} (${hoa.thuongHoa} trên / ${hoa.haDung} dưới — ${hoa.dn})`);
        lines.push(`Phương trấn: ${hoa.phuongTran}`);
        lines.push(`Vật phẩm: ${hoa.vatPham.replace(/<[^>]+>/g, "")}`);
        lines.push(collisionText);
      }
      lines.push(`CẤM KỴ: Phương ${p} (${QUAI[haHauThien].p}) là Đô Thiên, bất khả động. Thủy khẩu: ${thuyKhauNote}`);
      lines.push("");
    });

    // ---------- II. BÁT SÁT ----------
    if (bsPhuong) {
      const ha = CHI2QUAI[bsPhuong] || quaiSon;
      const thuong = findThuong(ha, "Lục Sát");
      const tenBenh = getQue(thuong, ha);
      const chung = chanDoan(thuong, ha);
      const hoa = timQueHoa(thuong, can);
      const isHere = (bsPhuong === son || ha === quaiSon);
      if (isHere) satsHere.push("Bát Sát");

      html += `<div class="dt-case ${isHere ? "danger" : "good"}">
        <div class="dt-case-head">
          <span>II. BÁT SÁT theo Sơn ${son} → tại phương ${bsPhuong} (${QUAI[ha].p})</span>
          ${isHere ? '<span class="tag tag-hung">CÓ MẶT</span>' : ""}
        </div>
        <ul class="dt-steps">
          <li><span class="dt-lbl">Hạ (Thể) / Thượng (Dụng):</span> ${ha} / ${thuong} (Lục Sát)</li>
          <li><span class="dt-lbl">Quẻ Bệnh / Chẩn đoán:</span> <span class="dt-que-bad">${tenBenh}</span> (${chung.loai})</li>
          <li><span class="dt-lbl">Quẻ Hóa / Phương trấn:</span> <span class="dt-que-ok">${hoa ? hoa.ten : "?"}</span> (${hoa ? hoa.dn : ""}) → <strong>${hoa ? hoa.phuongTran : "?"}</strong></li>
        </ul>
      </div>`;
      lines.push(`--- II. BÁT SÁT ${bsPhuong} ${isHere ? "[CÓ MẶT]" : ""} --- Bệnh: ${tenBenh} | Hóa: ${hoa ? hoa.ten : "?"} | Trấn: ${hoa ? hoa.phuongTran : "?"}`);
    }

    // ---------- III. TAM SÁT CHỦ THỂ ----------
    tsList.forEach(p => {
      const ha = CHI2QUAI[p];
      const thuong = findThuong(ha, "Lục Sát");
      const tenBenh = getQue(thuong, ha);
      const chung = chanDoan(thuong, ha);
      const hoa = timQueHoa(thuong, can);
      const isHere = (p === son || ha === quaiSon);
      if (isHere) satsHere.push("Tam Sát");

      html += `<div class="dt-case ${isHere ? "danger" : ""}">
        <div class="dt-case-head">
          <span>III. TAM SÁT chủ thể (${chi}) tại phương ${p} (${QUAI[ha].p})</span>
          ${isHere ? '<span class="tag tag-hung">CÓ MẶT</span>' : ""}
        </div>
        <ul class="dt-steps">
          <li><span class="dt-lbl">Hạ (Thể) / Thượng (Dụng):</span> ${ha} / ${thuong} (Lục Sát)</li>
          <li><span class="dt-lbl">Quẻ Bệnh / Chẩn đoán:</span> <span class="dt-que-bad">${tenBenh}</span> (${chung.loai})</li>
          <li><span class="dt-lbl">Quẻ Hóa / Phương trấn:</span> <span class="dt-que-ok">${hoa ? hoa.ten : "?"}</span> (${hoa ? hoa.dn : ""}) → <strong>${hoa ? hoa.phuongTran : "?"}</strong></li>
        </ul>
      </div>`;
      lines.push(`--- III. TAM SÁT ${p} ${isHere ? "[CÓ MẶT]" : ""} --- Bệnh: ${tenBenh} | Hóa: ${hoa ? hoa.ten : "?"} | Trấn: ${hoa ? hoa.phuongTran : "?"}`);
    });

    // ---------- TỔNG KẾT ----------
    if (satsHere.length) {
      html = `<div class="dt-case danger">
        <div class="dt-case-head"><span>⚠️ TỔNG KẾT TẠI SƠN ${son.toUpperCase()} (${QUAI[quaiSon].p})</span></div>
        <p style="margin:4px 0;">Các sát khí đang hội tụ: ${satsHere.map(s => `<span class="tag tag-hung">⛔ ${s}</span>`).join(" ")}</p>
        <p style="font-size:.86rem;margin:6px 0 0;">• <strong>Nguyên tắc hành sự:</strong> Hóa chính Dụng · Đặt vật phẩm mang tượng ý Quẻ Giải tại phương của Dụng (nếu phương đó không phạm sát của Năm ${activeYearName}).<br>• <strong>Cấm kỵ Đô Thiên:</strong> Tuyệt đối không động thổ, sửa chữa hay mở thủy khẩu/cổng ngõ tại phương Đô Thiên (${dtList.join(", ")}).</p>
      </div>` + html;
      lines.unshift(`*** TẠI SƠN ${son}: ${satsHere.join(", ")} ***\n`);
    } else {
      html = `<div class="dt-case good">
        <div class="dt-case-head"><span>✅ TỔNG KẾT TẠI SƠN ${son.toUpperCase()} (${QUAI[quaiSon].p})</span></div>
        <p style="margin:4px 0;font-size:.86rem;">Sơn <strong>${son}</strong> không bị trùng trực tiếp Đô Thiên / Bát Sát / Tam Sát của chủ thể (${can} ${chi}). Tuy nhiên vẫn cần kiêng động thổ và tránh mở thủy khẩu, cổng lớn tại phương Đô Thiên (<strong>${dtList.join(", ")}</strong>) của Can <strong>${can}</strong>.</p>
      </div>` + html;
    }

    document.getElementById("dt_resultsContainer").innerHTML = html;
    lastReportText = lines.join("\n");
    const outEl = document.getElementById("dt_outputArea");
    outEl.style.display = "block";
    outEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ===================== 7. KHỞI TẠO & GẮN VÀO TRANG CHÍNH =====================
  function setToggleState(on) {
    isModuleOn = !!on;
    const cb = document.getElementById("dt_toggleOnOff");
    const badge = document.getElementById("dt_toggleBadge");
    const body = document.getElementById("dt_bodyContainer");
    if (cb) cb.checked = isModuleOn;
    if (badge) badge.textContent = isModuleOn ? "ON" : "OFF";
    if (body) body.style.display = isModuleOn ? "block" : "none";
    try { localStorage.setItem(STORAGE_KEY_ON, isModuleOn ? "1" : "0"); } catch (e) {}
    if (isModuleOn) syncFromMainForm(true);
  }

  function mountModule() {
    if (document.getElementById("dt_moduleCard")) return;
    injectStyles();

    const card = document.createElement("div");
    card.id = "dt_moduleCard";
    card.className = "card dt-card";
    card.innerHTML = buildModuleHtml();

    // Chèn ngay phía trên khối "Dữ Liệu Gốc Năm" (hoặc trước .fab-dock) để bố cục cân đối
    const detailEl = document.getElementById("detailDataContainer");
    const detailCard = detailEl ? detailEl.closest(".card") : null;
    const fabDock = document.querySelector(".fab-dock");

    if (detailCard && detailCard.parentNode) {
      detailCard.parentNode.insertBefore(card, detailCard);
    } else if (fabDock && fabDock.parentNode) {
      fabDock.parentNode.insertBefore(card, fabDock);
    } else {
      document.body.appendChild(card);
    }

    // Gắn sự kiện
    document.getElementById("dt_toggleOnOff").addEventListener("change", function () {
      setToggleState(this.checked);
    });

    document.querySelectorAll('input[name="dt_axis"]').forEach(radio => {
      radio.addEventListener("change", function () {
        if (document.getElementById("dt_outputArea").style.display === "block") {
          runDoThienAnalysis();
        }
      });
    });

    document.getElementById("dt_btnRun").addEventListener("click", runDoThienAnalysis);
    document.getElementById("dt_btnSync").addEventListener("click", function () {
      syncFromMainForm(false);
    });

    document.getElementById("dt_btnCopy").addEventListener("click", function () {
      if (!lastReportText) return;
      const btn = this;
      const done = () => {
        btn.textContent = "✅ Đã sao chép báo cáo!";
        setTimeout(() => { btn.textContent = "📋 Sao Chép Báo Cáo Đô Thiên"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastReportText).then(done).catch(() => {});
      }
    });

    // Khôi phục trạng thái ON / OFF đã lưu
    let savedOn = false;
    try { savedOn = localStorage.getItem(STORAGE_KEY_ON) === "1"; } catch (e) {}
    setToggleState(savedOn);

    // Expose API nhỏ để các module sau tham chiếu nếu cần
    window.DoThienModule = {
      run: runDoThienAnalysis,
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

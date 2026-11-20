// =========================================================
//  MTRACHCAT.JS v4 — Mộ Long Biến Vận (engine thuần, không giao diện)
//  Giữ nguyên logic v3 (Hiệp Kỷ Biện Phương Thư): bảng Hồng Phạm, Mộ khố, nạp âm,
//  Đông Chí trùng biến cho Kim sơn, Đặc biệt cát (Mộ vận khắc Thái tuế), 3 chọi 1.
//  Thay đổi v4: bỏ calendar-core.js và nút nổi; Tiết Khí đọc từ getTietKhi() của tietkhi_core.js.
//  Nạp SAU tietkhi_core.js. API: window.TrachCat
//    danhGiaThoiDiem(son, date, chiGio)  -> đủ 4 trụ Niên/Tháng/Ngày/Giờ
//    danhGiaNienThang(son, canChiNam, thang, tenTiet) -> cấp chặng Tiết Khí (Niên + Tháng)
//    changCuaNam(namDuongLich) -> các chặng Tiết Khí của năm (từ Lập Xuân)
// =========================================================
(function (root) {
    'use strict';
    // ---------- DỮ LIỆU GỐC ----------
    const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
    const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
    // Tên quái dùng thay cho 4 sơn chính vị
    const QUAI_RA_CHI = { 'Khảm':'Tý', 'Ly':'Ngọ', 'Chấn':'Mão', 'Đoài':'Dậu' };
    // Bảng Hồng Phạm Ngũ Hành (Chính vận 24 sơn)
    const SON_HANH = {
        'Giáp':'Thủy','Dần':'Thủy','Thìn':'Thủy','Tốn':'Thủy','Tuất':'Thủy','Tý':'Thủy','Tân':'Thủy','Thân':'Thủy',
        'Sửu':'Thổ','Quý':'Thổ','Khôn':'Thổ','Canh':'Thổ','Mùi':'Thổ',
        'Ngọ':'Hỏa','Nhâm':'Hỏa','Bính':'Hỏa','Ất':'Hỏa',
        'Mão':'Mộc','Cấn':'Mộc','Tỵ':'Mộc',
        'Càn':'Kim','Hợi':'Kim','Dậu':'Kim','Đinh':'Kim'
    };
    // Cục tam hợp -> chi Mộ khố (Thủy & Thổ cùng mộ tại Thìn)
    const HANH_RA_MO = { 'Thủy':'Thìn','Thổ':'Thìn','Hỏa':'Tuất','Kim':'Sửu','Mộc':'Mùi' };
    // Ngũ hành khắc Mộ vận (Hành kỵ dùng cho Năm, Tháng, Ngày, Giờ)
    const HANH_BI_KHAC_BOI = { 'Mộc':'Kim', 'Kim':'Hỏa', 'Hỏa':'Thủy', 'Thủy':'Thổ', 'Thổ':'Mộc' };
    // 30 cặp nạp âm, bắt đầu từ Giáp Tý/Ất Sửu
    const NAP_AM = [
        ['Hải trung kim','Kim'],['Lư trung hỏa','Hỏa'],['Đại lâm mộc','Mộc'],['Lộ bàng thổ','Thổ'],['Kiếm phong kim','Kim'],
        ['Sơn đầu hỏa','Hỏa'],['Giản hạ thủy','Thủy'],['Thành đầu thổ','Thổ'],['Bạch lạp kim','Kim'],['Dương liễu mộc','Mộc'],
        ['Tuyền trung thủy','Thủy'],['Ốc thượng thổ','Thổ'],['Tích lịch hỏa','Hỏa'],['Tùng bách mộc','Mộc'],['Trường lưu thủy','Thủy'],
        ['Sa trung kim','Kim'],['Sơn hạ hỏa','Hỏa'],['Bình địa mộc','Mộc'],['Bích thượng thổ','Thổ'],['Kim bạch kim','Kim'],
        ['Phú đăng hỏa','Hỏa'],['Thiên hà thủy','Thủy'],['Đại dịch thổ','Thổ'],['Thoa xuyến kim','Kim'],['Tang đố mộc','Mộc'],
        ['Đại khê thủy','Thủy'],['Sa trung thổ','Thổ'],['Thiên thượng hỏa','Hỏa'],['Thạch lựu mộc','Mộc'],['Đại hải thủy','Thủy']
    ];
    const SINH = { 'Mộc':'Hỏa','Hỏa':'Thổ','Thổ':'Kim','Kim':'Thủy','Thủy':'Mộc' };
    const KHAC = { 'Mộc':'Thổ','Thổ':'Thủy','Thủy':'Hỏa','Hỏa':'Kim','Kim':'Mộc' };
    // ---------- QUY ƯỚC CHỈNH ĐƯỢC ----------
    const CONFIG = {
        mucTheoQuanHe: {
            dongHanh:        'CAT',
            sinhMoLong:      'DAI_CAT',
            biMoLongKhac:    'CAT',          // Riêng trụ Niên sẽ nâng lên DAC_BIET_CAT
            biMoLongKhacNien:'DAC_BIET_CAT', // Hiệp Kỷ: "Mộ vận nạp âm khắc Thái tuế nạp âm là đặc biệt cát"
            moLongSinh:      'TIEU_HUNG',
            khacMoLong:      'DAI_HUNG'
        },
        // Kết luận chung: Niên + 3 trụ (Tháng, Ngày, Giờ) — "3 chọi 1"
        xepLoai: function (nienMuc, ba) {
            const tot = m => m === 'CAT' || m === 'DAI_CAT' || m === 'DAC_BIET_CAT';
            const soCat = ba.filter(tot).length;
            const coDaiHung = ba.indexOf('DAI_HUNG') !== -1;
            if (tot(nienMuc)) {
                if (soCat === 3) return 'DAI_CAT';
                if (soCat === 2 && !coDaiHung) return 'CAT';
                return 'NEN_TRANH';
            }
            if (nienMuc === 'TIEU_HUNG') return soCat === 3 ? 'TRUNG_SACH' : 'NEN_TRANH';
            if (nienMuc === 'DAI_HUNG')  return soCat === 3 ? 'HA_SACH'    : 'NEN_TRANH';
            return 'NEN_TRANH';
        }
    };
    const NHAN_MUC = {
        DAC_BIET_CAT:'Đặc biệt cát (Chế Thái Tuế)',
        DAI_CAT:'Đại cát',
        CAT:'Cát',
        TIEU_HUNG:'Tiểu hung (Tiết khí)',
        DAI_HUNG:'Đại hung (Khắc Mộ vận)'
    };
    const NHAN_LOAI = {
        DAI_CAT:'Đại cát',
        CAT:'Cát',
        TRUNG_SACH:'Trung sách (3 chọi 1)',
        HA_SACH:'Hạ sách — nên hoãn nếu được',
        NEN_TRANH:'Nên tránh'
    };
    // ---------- HÀM CƠ BẢN ----------
    function chuanHoaSon(son) {
        let s = String(son || '').trim();
        s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        if (s === 'Tị') s = 'Tỵ';
        if (QUAI_RA_CHI[s]) s = QUAI_RA_CHI[s];
        return SON_HANH[s] ? s : null;
    }
    function parseCanChi(text) {
        const p = String(text || '').trim().split(/\s+/);
        if (p.length < 2) return null;
        const chi = p[1] === 'Tị' ? 'Tỵ' : p[1];
        const c = CAN.indexOf(p[0]), h = CHI.indexOf(chi);
        if (c < 0 || h < 0 || (c % 2) !== (h % 2)) return null;
        let n = -1;
        for (let t = 0; t < 6; t++) { if ((c + 10 * t) % 12 === h) { n = c + 10 * t; break; } }
        return n < 0 ? null : { can: p[0], chi: chi, idx60: n };
    }
    function napAm(canChiText) {
        const cc = parseCanChi(canChiText);
        if (!cc) return null;
        const e = NAP_AM[Math.floor(cc.idx60 / 2)];
        return { canChi: cc.can + ' ' + cc.chi, ten: e[0], hanh: e[1] };
    }
    // Kiểm tra xem ngày có rơi vào khoảng Sau Đông Chí (từ ~21/12 Dương lịch) đến trước Lập Xuân (tháng 1 Dương lịch) không
    function kiemTraSauDongChiTruocLapXuan(y, m, d, ctx) {
        // Nếu calendar-core.js có trả về tên tiết khí hiện hành (VD: "Đông chí", "Tiểu hàn", "Đại hàn")
        if (ctx && ctx.tietKhi && ctx.tietKhi.ten) {
            const tenTK = ctx.tietKhi.ten.toLowerCase();
            if (tenTK.includes('đông chí') || tenTK.includes('tiểu hàn') || tenTK.includes('đại hàn')) {
                return true;
            }
        }
        // Fallback an toàn theo Dương lịch: từ 22/12 đến 31/12 luôn nằm sau Đông Chí và trước Lập Xuân
        if (m === 12 && d >= 22) return true;
        return false;
    }
    // Ngũ Tý Nguyên Độn tính Mộ Long Biến Vận (Có xét Đông Chí trùng biến cho 4 sơn Kim)
    function moLong(son, canNam, laSauDongChi) {
        const s = chuanHoaSon(son);
        let canIdx = CAN.indexOf(canNam);
        if (!s || canIdx < 0) return null;
        const hanhSon = SON_HANH[s];
        let daTrungBien = false;
        // Quy tắc Hiệp Kỷ: "Bốn sơn Càn, Hợi, Đoài, Đinh chính vận thuộc Kim... Sau Đông chí lại trùng biến"
        if (hanhSon === 'Kim' && laSauDongChi) {
            canIdx = (canIdx + 1) % 10;
            daTrungBien = true;
        }
        const chiMo = HANH_RA_MO[hanhSon];
        const stemTy = (2 * (canIdx % 5)) % 10;
        const canMo = CAN[(stemTy + CHI.indexOf(chiMo)) % 10];
        const na = napAm(canMo + ' ' + chiMo);
        const hanhKy = HANH_BI_KHAC_BOI[na.hanh];
        return {
            son: s,
            hanhSon: hanhSon,
            chiMo: chiMo,
            canChi: na.canChi,
            napAm: na.ten,
            hanh: na.hanh,
            hanhKy: hanhKy,
            daTrungBien: daTrungBien,
            canDungTinh: CAN[canIdx]
        };
    }
    function quanHe(hanhMo, hanhX, laTruNien) {
        const m = CONFIG.mucTheoQuanHe;
        if (hanhX === hanhMo)       return { quanHe:'Đồng hành mộ long',        muc: m.dongHanh };
        if (SINH[hanhX] === hanhMo) return { quanHe:'Sinh mộ long (Tiếp khí)',  muc: m.sinhMoLong };
        if (KHAC[hanhMo] === hanhX) {
            return {
                quanHe: laTruNien ? 'Mộ vận khắc Thái tuế (Đặc biệt cát)' : 'Bị mộ long khắc',
                muc: laTruNien ? m.biMoLongKhacNien : m.biMoLongKhac
            };
        }
        if (SINH[hanhMo] === hanhX) return { quanHe:'Mộ long sinh ra (Tiết khí)', muc: m.moLongSinh };
        return                             { quanHe:'Khắc mộ long (Phạm kỵ)',  muc: m.khacMoLong };
    }
    function danhGiaTru(tenTru, canChiText, mo) {
        const na = napAm(canChiText);
        if (!na) return { tru: tenTru, canChi: canChiText || '?', loi: true, muc: null };
        const q = quanHe(mo.hanh, na.hanh, tenTru === 'Niên');
        return {
            tru: tenTru, canChi: na.canChi, napAm: na.ten, hanh: na.hanh,
            quanHe: q.quanHe, muc: q.muc, nhanMuc: NHAN_MUC[q.muc]
        };
    }

    // =========================================================
    //  v4 — TRỤ THỜI GIAN TỪ TIẾT KHÍ (tietkhi_core.js)
    // =========================================================
    const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '');
    // Tháng theo Tiết (tháng 1 = tháng Dần, bắt đầu từ Lập Xuân)
    const THANG_TIET = { lapxuan:1, vuthuy:1, kinhtrap:2, xuanphan:2, thanhminh:3, cocvu:3, lapha:4, tieuman:4, mangchung:5, hachi:5, tieuthu:6, daithu:6,
        lapthu:7, xuthu:7, bachlo:8, thuphan:8, hanlo:9, suonggiang:9, lapdong:10, tieutuyet:10, daituyet:11, dongchi:11, tieuhan:12, daihan:12 };
    const SAU_DONG_CHI = ['dongchi', 'tieuhan', 'daihan'];
    function tenTietKhi(date) {
        try {
            if (typeof getTietKhi !== 'function') return null;
            const tk = getTietKhi(date);
            return typeof tk === 'string' ? tk : (tk && (tk.name || tk.ten || tk.tietKhi)) || null;
        } catch (e) { return null; }
    }
    function canChiNgay(dt) {
        let y = dt.getFullYear(), m = dt.getMonth() + 1; const d = dt.getDate();
        if (m <= 2) { y--; m += 12; }
        const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
        const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
        return CAN[(Math.floor(JD + 9.5) % 10 + 10) % 10] + ' ' + CHI[(Math.floor(JD + 1.5) % 12 + 12) % 12];
    }
    function canChiNam(y) { const i = ((y - 4) % 60 + 60) % 60; return CAN[i % 10] + ' ' + CHI[i % 12]; }
    // Ngũ Hổ độn: can tháng Dần theo can năm
    function canChiThang(cnNam, th) {
        const canDan = (2 * (CAN.indexOf(cnNam.split(' ')[0]) % 5) + 2) % 10;
        return CAN[(canDan + th - 1) % 10] + ' ' + CHI[(th + 1) % 12];
    }
    function truCot(dt, chiGio) {
        const ten = tenTietKhi(dt);
        if (!ten) return { loi: 'Không đọc được Tiết Khí (kiểm tra hàm getTietKhi() trong tietkhi_core.js).' };
        const n = norm(ten), th = THANG_TIET[n];
        if (!th) return { loi: 'Tiết khí không nhận dạng được: ' + ten };
        const hi = CHI.indexOf(chiGio);
        if (hi < 0) return { loi: 'Chi giờ không hợp lệ: ' + chiGio };
        const nam = canChiNam(dt.getFullYear() - (dt.getMonth() < 2 && th >= 11 ? 1 : 0));   // năm đổi tại Lập Xuân
        const ngay = canChiNgay(dt);
        const gio = CAN[(2 * (CAN.indexOf(ngay.split(' ')[0]) % 5) + hi) % 10] + ' ' + chiGio;   // Ngũ Thử độn
        return { tiet: ten, thang: th, nam: nam, canChiThang: canChiThang(nam, th), ngay: ngay, gio: gio, sauDongChi: SAU_DONG_CHI.indexOf(n) !== -1 };
    }
    // Đánh giá đủ 4 trụ tại một thời điểm (Date + chi giờ)
    function danhGiaThoiDiem(son, dt, chiGio) {
        const s = chuanHoaSon(son);
        if (!s) return { loi: 'Sơn không hợp lệ: ' + son };
        const t = truCot(dt, chiGio);
        if (t.loi) return t;
        const mo = moLong(s, t.nam.split(' ')[0], t.sauDongChi);
        const nien = danhGiaTru('Niên', t.nam, mo), thang = danhGiaTru('Tháng', t.canChiThang, mo),
              ngay = danhGiaTru('Ngày', t.ngay, mo), gio = danhGiaTru('Giờ', t.gio, mo);
        if ([nien, thang, ngay, gio].some(x => x.loi)) return { loi: 'Lỗi tra nạp âm.' };
        const loai = CONFIG.xepLoai(nien.muc, [thang.muc, ngay.muc, gio.muc]);
        return { son: s, hanhSon: mo.hanhSon, moLong: mo, nien: nien, thang: thang, ngay: ngay, gio: gio, loai: loai, nhanLoai: NHAN_LOAI[loai], tiet: t.tiet };
    }
    // Cấp chặng Tiết Khí: chỉ Niên + Tháng (ngày giờ còn để mở)
    function danhGiaNienThang(son, canChiNamText, th, tenTiet) {
        const s = chuanHoaSon(son);
        if (!s) return null;
        const mo = moLong(s, canChiNamText.split(' ')[0], SAU_DONG_CHI.indexOf(norm(tenTiet)) !== -1);
        return { son: s, moLong: mo, nien: danhGiaTru('Niên', canChiNamText, mo), thang: danhGiaTru('Tháng', canChiThang(canChiNamText, th), mo) };
    }
    // Liệt kê các chặng Tiết Khí của một năm (từ Lập Xuân năm Y đến trước Lập Xuân năm Y+1)
    function changCuaNam(Y) {
        const out = [];
        let batDau = false, last = null;
        const end = new Date(Y + 1, 1, 8, 12);
        for (const t = new Date(Y, 1, 1, 12); t <= end; t.setDate(t.getDate() + 1)) {
            const ten = tenTietKhi(t); if (!ten) continue;
            const n = norm(ten);
            if (!batDau) { if (n !== 'lapxuan') continue; batDau = true; }
            else if (n === 'lapxuan' && last !== 'lapxuan') break;
            if (!THANG_TIET[n]) continue;
            if (n !== last) { out.push({ ten: ten, thang: THANG_TIET[n], tu: new Date(t), den: new Date(t) }); last = n; }
            else out[out.length - 1].den = new Date(t);
        }
        return out;
    }
    const API = {
        moLong: moLong, napAm: napAm, quanHe: quanHe, chuanHoaSon: chuanHoaSon,
        truCot: truCot, danhGiaThoiDiem: danhGiaThoiDiem, danhGiaNienThang: danhGiaNienThang, changCuaNam: changCuaNam,
        CONFIG: CONFIG, NHAN_LOAI: NHAN_LOAI, NHAN_MUC: NHAN_MUC,
        _data: { SON_HANH: SON_HANH, HANH_RA_MO: HANH_RA_MO, HANH_BI_KHAC_BOI: HANH_BI_KHAC_BOI, NAP_AM: NAP_AM }
    };
    root.TrachCat = API;
    if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);

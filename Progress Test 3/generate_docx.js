const fs = require('fs');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TableOfContents,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  ShadingType
} = require('docx');

// Helper to create regular paragraph in Times New Roman, size 13pt (26 half-points)
function p(text, options = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({ text: text || '', font: 'Times New Roman', size: 26, color: '000000', bold: !!options.bold, italics: !!options.italics })];

  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: { before: options.before !== undefined ? options.before : 80, after: options.after !== undefined ? options.after : 80, line: 300 },
    bullet: options.bullet,
    children: runs,
  });
}

// Helper for bullet item
function bullet(boldPrefix, content) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 280 },
    indent: { left: 360, hanging: 240 },
    children: [
      new TextRun({ text: '•  ', font: 'Times New Roman', size: 26, color: '000000', bold: true }),
      new TextRun({ text: boldPrefix ? boldPrefix + ' ' : '', font: 'Times New Roman', size: 26, color: '000000', bold: true }),
      new TextRun({ text: content, font: 'Times New Roman', size: 26, color: '000000' }),
    ],
  });
}

// Helper for sub-bullet item
function subBullet(boldPrefix, content) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 260 },
    indent: { left: 720, hanging: 240 },
    children: [
      new TextRun({ text: '-  ', font: 'Times New Roman', size: 24, color: '000000' }),
      new TextRun({ text: boldPrefix ? boldPrefix + ' ' : '', font: 'Times New Roman', size: 24, color: '000000', bold: true }),
      new TextRun({ text: content, font: 'Times New Roman', size: 24, color: '000000' }),
    ],
  });
}

// Helper for Headings (all 13pt Times New Roman, bold, black)
function h1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 26, // 13pt
        bold: true,
        color: '000000',
      }),
    ],
  });
}

function h2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 100 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 26, // 13pt
        bold: true,
        color: '000000',
      }),
    ],
  });
}

function h3(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 26, // 13pt
        bold: true,
        italics: true,
        color: '000000',
      }),
    ],
  });
}

// Table cell helper (B&W only)
function cell(text, isHeader = false, widthPct = null) {
  const runs = Array.isArray(text)
    ? text
    : [
        new TextRun({
          text: text || '',
          font: 'Times New Roman',
          size: 24, // 12pt for clean table fitting
          bold: isHeader,
          color: '000000',
        }),
      ];

  const borders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  const cellObj = {
    children: [
      new Paragraph({
        alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 60, after: 60, line: 260 },
        children: runs,
      }),
    ],
    borders: borders,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
  };

  if (isHeader) {
    cellObj.shading = { fill: 'EFEFEF', type: ShadingType.CLEAR, color: 'auto' };
  } else {
    cellObj.shading = { fill: 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' };
  }

  if (widthPct) {
    cellObj.width = { size: widthPct, type: WidthType.PERCENTAGE };
  }

  return new TableCell(cellObj);
}

// Code block paragraph helper (Monochrome)
function codeLine(text) {
  return new Paragraph({
    spacing: { before: 20, after: 20, line: 240 },
    indent: { left: 240 },
    children: [
      new TextRun({
        text: text,
        font: 'Consolas',
        size: 20, // 10pt
        color: '000000',
      }),
    ],
  });
}

async function buildDoc() {
  const children = [];

  // ==================== COVER / HEADER ====================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: 'TRƯỜNG ĐẠI HỌC FPT — BỘ MÔN KỸ THUẬT PHẦN MỀM',
          font: 'Times New Roman',
          size: 24,
          bold: true,
          color: '000000',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 200 },
      children: [
        new TextRun({
          text: 'HỌC PHẦN: KIỂM THỬ PHẦN MỀM (SWT301)',
          font: 'Times New Roman',
          size: 22,
          italics: true,
          color: '000000',
        }),
      ],
    })
  );

  // Border box for Title
  const titleTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
            },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            shading: { fill: 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 80 },
                children: [
                  new TextRun({
                    text: 'BÁO CÁO BÀI LÀM PROGRESS TEST 3',
                    font: 'Times New Roman',
                    size: 32, // 16pt
                    bold: true,
                    color: '000000',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 80 },
                children: [
                  new TextRun({
                    text: 'CHUYÊN ĐỀ: STATIC TESTING (REVIEW & CODE REVIEW)',
                    font: 'Times New Roman',
                    size: 26, // 13pt
                    bold: true,
                    color: '000000',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: 'Bối cảnh dự án: Hệ thống đặt vé xem phim trực tuyến CineFU',
                    font: 'Times New Roman',
                    size: 24,
                    italics: true,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
  children.push(titleTable);

  children.push(
    new Paragraph({
      spacing: { before: 160, after: 140 },
      children: [
        new TextRun({ text: 'Thông tin kiểm tra:', font: 'Times New Roman', size: 24, bold: true, color: '000000' }),
      ],
    })
  );

  children.push(bullet('Đối tượng kiểm thử:', 'Tài liệu SRS Mục 4 (v0.5) và Lớp mã nguồn payment_service (Java).'));
  children.push(bullet('Kỹ thuật áp dụng:', 'Technical Review (Tài liệu đặc tả) và Inspection (Mã nguồn).'));
  children.push(bullet('Thời gian làm bài:', '60 phút · Thang điểm: 10 điểm (Bài 1: 4 điểm, Bài 2: 6 điểm).'));
  children.push(bullet('Quy cách định dạng:', 'Đơn sắc trắng đen (Black & White), phông chữ Times New Roman, Headings 13pt.'));

  // ==================== MỤC LỤC TỰ ĐỘNG ====================
  children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 150 },
      children: [
        new TextRun({
          text: 'MỤC LỤC TỰ ĐỘNG',
          font: 'Times New Roman',
          size: 26,
          bold: true,
          color: '000000',
        }),
      ],
    })
  );

  children.push(
    new TableOfContents('Mục lục', {
      hyperlink: true,
      headingStyleRange: '1-3',
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: '(Lưu ý: Mục lục trên được cấu hình trường tự động (Field TOC). Khi mở tài liệu bằng Microsoft Word, nhấn tổ hợp Ctrl + A rồi nhấn F9 hoặc nhấp chuột phải chọn "Update Field" để cập nhật số trang tự động).',
          font: 'Times New Roman',
          size: 22,
          italics: true,
          color: '000000',
        }),
      ],
    })
  );

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ==================== BÀI 1 ====================
  children.push(h1('1. BÀI 1 — REVIEW TÀI LIỆU SRS CHỨC NĂNG ĐẶT VÉ XEM PHIM (4 ĐIỂM)'));

  children.push(h2('1.1. Mục tiêu và Phương pháp Review'));
  children.push(
    p(
      'Trong vai trò là Reviewer (dưới góc nhìn của Kỹ sư Kiểm thử - Tester) tham gia buổi Technical Review tài liệu đặc tả yêu cầu phần mềm (SRS Mục 4: Đặt vé xem phim v0.5), mục tiêu là phát hiện sớm các khiếm khuyết trong yêu cầu (Requirement Defects) trước khi chuyển giao sang giai đoạn thiết kế và lập trình. Việc áp dụng Static Testing tại giai đoạn này giúp loại bỏ nguy cơ phát triển sai nghiệp vụ, giảm thiểu chi phí khắc phục lỗi và nâng cao khả năng kiểm thử (Testability) của hệ thống CineFU.'
    )
  );

  children.push(
    p('Quá trình rà soát tập trung phân loại các lỗi yêu cầu theo đúng 6 nhóm tiêu chuẩn kỹ thuật kiểm thử:')
  );
  children.push(bullet('Mâu thuẫn (Contradictory / Inconsistent):', 'Các yêu cầu trái ngược nhau, gây xung đột logic xử lý.'));
  children.push(bullet('Mơ hồ (Ambiguous):', 'Các câu từ đa nghĩa, tối nghĩa, có thể hiểu theo nhiều cách khác nhau.'));
  children.push(bullet('Thiếu (Missing / Incomplete):', 'Bỏ sót trường hợp biên, thiếu luồng ngoại lệ hoặc thiếu điều kiện cần.'));
  children.push(bullet('Không kiểm thử được (Untestable):', 'Yêu cầu định tính, không có tiêu chí định lượng để viết Test Case xác định Pass/Fail.'));
  children.push(bullet('Phi thực tế / Không chính xác (Incorrect / Unrealistic):', 'Yêu cầu bất khả thi về mặt kỹ thuật, công nghệ hoặc nghiệp vụ thực tế.'));
  children.push(bullet('Dư thừa / Trùng lặp (Redundant):', 'Nội dung trùng lặp hoàn toàn với yêu cầu đã nêu trước đó.'));

  children.push(h2('1.2. Bảng tổng hợp Requirement Defect trong tài liệu SRS'));
  children.push(
    p(
      'Dưới đây là bảng phân tích chi tiết toàn bộ các Requirement Defect tìm được (gồm 12 defect chi tiết, vượt mức yêu cầu tối thiểu 10 defect của đề bài), được trình bày theo đúng định dạng chuẩn: ID Requirement – Loại defect – Mô tả – Đề xuất sửa.'
    )
  );

  // Table for Bai 1
  const srsRows = [
    new TableRow({
      children: [
        cell('STT', true, 6),
        cell('ID Requirement', true, 16),
        cell('Loại Defect', true, 18),
        cell('Mô tả Defect', true, 30),
        cell('Đề xuất sửa', true, 30),
      ],
    }),
    new TableRow({
      children: [
        cell('1'),
        cell('REQ-4.2 vs REQ-4.8'),
        cell('Mâu thuẫn\n(Contradictory)'),
        cell('REQ-4.2 quy định mỗi lần đặt tối đa 8 ghế, nhưng REQ-4.8 lại quy định tối đa 10 ghế cho mỗi giao dịch. Hai yêu cầu này xung đột trực tiếp về giới hạn số ghế.'),
        cell('Thống nhất 1 giới hạn duy nhất theo quy định rạp chiếu (tối đa 8 ghế/giao dịch) và hủy bỏ hoàn toàn REQ-4.8.'),
      ],
    }),
    new TableRow({
      children: [
        cell('2'),
        cell('REQ-4.10 vs REQ-4.12'),
        cell('Mâu thuẫn\n(Contradictory)'),
        cell('REQ-4.10 cho phép hủy vé và hoàn tiền 100% "bất cứ lúc nào". Tuy nhiên REQ-4.12 lại cấm hủy vé trong vòng 2 giờ trước giờ chiếu.'),
        cell('Sửa REQ-4.10: "Người dùng được hủy vé và hoàn 100% tiền nếu thực hiện trước giờ chiếu ít nhất 2 giờ. Trong vòng 2 giờ trước giờ chiếu, không được phép hủy vé." Gộp REQ-4.12 vào chính sách này.'),
      ],
    }),
    new TableRow({
      children: [
        cell('3'),
        cell('REQ-4.3 vs REQ-4.13'),
        cell('Dư thừa / Trùng lặp\n(Redundant)'),
        cell('REQ-4.3 đã nêu ghế người khác giữ/đã bán hiển thị màu xám và không thể chọn. REQ-4.13 lại lặp lại: "Ghế đã có người khác giữ thì không được chọn".'),
        cell('Xóa bỏ REQ-4.13 nhằm tránh dư thừa tài liệu đặc tả. Giữ lại và hoàn thiện quy chuẩn trạng thái ghế tại REQ-4.3.'),
      ],
    }),
    new TableRow({
      children: [
        cell('4'),
        cell('REQ-4.5'),
        cell('Mơ hồ & Thiếu\n(Ambiguous & Missing)'),
        cell('"Không cho phép để trống một ghế lẻ giữa các ghế đã chọn": Chưa định nghĩa rõ thế nào là ghế lẻ (giữa 2 ghế vừa chọn, hay giữa ghế chọn với ghế đã bán, hay sát vách/lối đi?).'),
        cell('Định nghĩa cụ thể: "Không cho phép xác nhận đặt vé nếu thao tác chọn tạo ra một ghế trống đơn độc kẹp giữa hai ghế đã chọn, hoặc giữa ghế chọn với ghế đã bán, hoặc giữa ghế chọn với đầu dãy."'),
      ],
    }),
    new TableRow({
      children: [
        cell('5'),
        cell('REQ-4.6'),
        cell('Mơ hồ & Thiếu\n(Ambiguous & Missing)'),
        cell('"Giá vé vào cuối tuần cao hơn ngày thường" nhưng không ghi rõ cao hơn bao nhiêu (số tiền hay tỷ lệ %) và cuối tuần bao gồm những ngày/khung giờ nào.'),
        cell('Quy định rõ ràng: "Giá vé ngày thường (Thứ 2 - Thứ 6): Thường 90.000đ, VIP 120.000đ, Đôi 200.000đ. Cuối tuần (Thứ 7, Chủ nhật) áp dụng phụ thu 10% trên giá từng loại ghế."'),
      ],
    }),
    new TableRow({
      children: [
        cell('6'),
        cell('REQ-4.7 (kết hợp Ghi chú Mục 2)'),
        cell('Thiếu & Phi thực tế\n(Missing & Unrealistic)'),
        cell('Phim nhãn T18 chỉ bán cho khách từ 18 tuổi trở lên. Nhưng theo Mục 2, đăng ký tài khoản chỉ có email, SĐT, mật khẩu, không hề có Ngày sinh hay CCCD để hệ thống kiểm tra tuổi.'),
        cell('Bổ sung trường "Ngày tháng năm sinh" khi đăng ký tài khoản, hoặc hiển thị Popup cam kết độ tuổi và yêu cầu xuất trình CCCD/VNeID khi nhận vé tại quầy soát vé.'),
      ],
    }),
    new TableRow({
      children: [
        cell('7'),
        cell('REQ-4.9'),
        cell('Không kiểm thử được\n(Untestable)'),
        cell('Gửi vé qua email "ngay lập tức" là cảm tính, không thể kiểm thử chính xác do phụ thuộc độ trễ mạng Internet và hàng đợi của mail server.'),
        cell('Chuyển thành chỉ số định lượng đo lường được (SLA): "Hệ thống phải tạo mã QR và gửi email vé điện tử thành công trong vòng tối đa 30 giây kể từ khi thanh toán thành công."'),
      ],
    }),
    new TableRow({
      children: [
        cell('8'),
        cell('REQ-4.11'),
        cell('Phi thực tế & Không test được\n(Unrealistic & Untestable)'),
        cell('"Phục vụ không giới hạn số người dùng đặt vé đồng thời mà không bị chậm" là bất khả thi về mặt vật lý/kỹ thuật. Cụm từ "không bị chậm" không có tiêu chí đo lường.'),
        cell('Đặc tả tiêu chí NFR đo được: "Hệ thống đáp ứng đồng thời tối thiểu 5.000 người dùng đặt vé cùng lúc với thời gian phản hồi trung bình <= 2 giây và tỷ lệ lỗi giao dịch < 0.1%."'),
      ],
    }),
    new TableRow({
      children: [
        cell('9'),
        cell('REQ-4.14'),
        cell('Không kiểm thử được\n(Untestable)'),
        cell('"Giao diện sơ đồ chọn ghế phải trực quan, dễ sử dụng" là đánh giá định tính, phụ thuộc cảm xúc cá nhân, Tester không thể kết luận Pass hay Fail.'),
        cell('Thay bằng tiêu chí đo kiểm Usability: "Sơ đồ phòng chiếu phải thể hiện trực quan theo lưới tọa độ hàng/cột; người dùng có thể hoàn thành việc chọn ghế trong tối đa 3 thao tác nhấp chuột."'),
      ],
    }),
    new TableRow({
      children: [
        cell('10'),
        cell('REQ-4.4'),
        cell('Thiếu\n(Missing / Incomplete)'),
        cell('Giữ ghế 10 phút nhưng không nêu rõ thời điểm bắt đầu đếm ngược (từ lúc chọn ghế đầu hay khi bấm thanh toán?), không có quy định cảnh báo sắp hết giờ và cơ chế giải phóng ghế.'),
        cell('Bổ sung: "Đồng hồ đếm ngược 10 phút kích hoạt khi chuyển sang bước thanh toán. Hiển thị thông báo cảnh báo khi còn 2 phút. Hết 10 phút, hệ thống tự động giải phóng ghế về Available."'),
      ],
    }),
    new TableRow({
      children: [
        cell('11'),
        cell('REQ-4.3'),
        cell('Mơ hồ\n(Ambiguous)'),
        cell('Quy định ghế "đang giữ" và "đã bán" đều hiển thị màu xám khiến người dùng không biết ghế nào có khả năng được nhả ra sau 10 phút để canh mua.'),
        cell('Phân biệt rõ: "Ghế đã bán hiển thị màu xám đậm (khóa vĩnh viễn); ghế đang được người khác giữ hiển thị màu cam kèm biểu tượng đồng hồ (tạm khóa trong 10 phút)."'),
      ],
    }),
    new TableRow({
      children: [
        cell('12'),
        cell('REQ-4.1'),
        cell('Thiếu\n(Missing / Incomplete)'),
        cell('Chỉ mô tả luồng chính (Happy path), thiếu hoàn toàn quy trình xử lý ngoại lệ (suất chiếu bị hủy, lỗi cổng thanh toán, người dùng chủ động bấm hủy giữa chừng).'),
        cell('Bổ sung các luồng ngoại lệ: Thông báo lỗi khi suất chiếu bị đổi/hủy; cơ chế giữ ghế tối đa 3 phút để thanh toán lại nếu cổng thanh toán gặp sự cố kỹ thuật.'),
      ],
    }),
  ];

  const table1 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: srsRows,
  });
  children.push(table1);

  children.push(h2('1.3. Đánh giá chất lượng tài liệu SRS và Khuyến nghị'));
  children.push(
    p(
      'Qua đợt rà soát tài liệu SRS CineFU Mục 4 (v0.5), nhóm kiểm thử nhận thấy tài liệu còn nhiều thiếu sót nghiêm trọng về tính nhất quán, tính khả thi và khả năng kiểm thử:'
    )
  );
  children.push(
    bullet('Về tính nhất quán (Consistency):', 'Tồn tại xung đột trực tiếp giữa các quy định cốt lõi (số ghế tối đa 8 vs 10; chính sách hủy vé bất cứ lúc nào vs chặn trước 2 giờ).')
  );
  children.push(
    bullet('Về khả năng kiểm thử (Testability):', 'Xuất hiện nhiều thuật ngữ định tính như "ngay lập tức", "không bị chậm", "trực quan, dễ sử dụng", gây khó khăn cho việc nghiệm thu phần mềm.')
  );
  children.push(
    bullet('Về tính đầy đủ (Completeness):', 'Chưa có mối liên kết giữa dữ liệu đăng ký người dùng ở Mục 2 với điều kiện kiểm tra tuổi phim T18 ở Mục 4.')
  );
  children.push(
    bullet('Khuyến nghị:', 'Cần tổ chức phiên họp Formal Review với Business Analyst (BA) và Product Owner (PO) để phê duyệt lại bản đặc tả SRS v1.0 hoàn chỉnh trước khi tiến hành viết Test Scenarios.')
  );

  // ==================== BÀI 2 ====================
  children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(h1('2. BÀI 2 — CODE REVIEW MODULE THANH TOÁN HÓA ĐƠN ĐẶT VÉ (6 ĐIỂM)'));

  children.push(h2('2.1. Đối chiếu Business Rules (BR1 - BR10) và Coding Convention'));
  children.push(
    p(
      'Thực hiện buổi Inspection mã nguồn cho lớp payment_service (Java) của hệ thống CineFU. Quá trình kiểm thử tĩnh được thực hiện bằng cách đối chiếu từng dòng mã nguồn với 10 Business Rules đã được phê duyệt và Quy chuẩn lập trình (Coding Convention) của dự án.'
    )
  );

  children.push(h3('Tóm tắt 10 Business Rules (BR) làm căn cứ đối chiếu:'));
  children.push(bullet('BR1:', 'Tiền vé = Tổng giá từng ghế. Giá ghế phải lấy từ bảng giá động (priceTableRepo) theo loại STANDARD, VIP, COUPLE; không được hardcode.'));
  children.push(bullet('BR2:', 'Mỗi hóa đơn phải có từ 1 đến 8 ghế. Vi phạm phải ném InvalidBookingException.'));
  children.push(bullet('BR3:', 'Chỉ thanh toán khi booking ở trạng thái HOLDING VÀ thời gian giữ chưa quá 10 phút; vi phạm phải ném BookingExpiredException.'));
  children.push(bullet('BR4:', 'Suất chiếu vào Thứ 7 hoặc Chủ nhật: Phụ thu 10% tính trên tổng tiền vé.'));
  children.push(bullet('BR5:', 'Giảm giá thành viên trên tiền vé sau phụ thu: GOLD giảm 10%, PLATINUM giảm 15%, NONE không giảm. Không áp dụng giảm giá cho combo bắp nước.'));
  children.push(bullet('BR6:', 'Cộng tiền combo bắp nước (comboPrice) sau khi đã tính xong giảm giá thành viên.'));
  children.push(bullet('BR7:', 'Voucher: Mã không phân biệt hoa/thường, tự động cắt khoảng trắng đầu cuối; mã sai hoặc hết hạn phải báo lỗi; mỗi voucher giảm tối đa 50.000đ.'));
  children.push(bullet('BR8:', 'Tổng thanh toán không được âm (< 0) và phải được làm tròn đến hàng nghìn (1.000đ, quy tắc >= 500đ làm tròn lên).'));
  children.push(bullet('BR9:', 'Số điện thoại nhận vé: Phải đúng 10 chữ số, bắt đầu bằng chữ số 0; không hợp lệ phải ném IllegalArgumentException TRƯỚC KHI tính tiền.'));
  children.push(bullet('BR10:', 'Mã hóa đơn chuẩn có dạng INV-yyyyMMdd-<bookingId> (ví dụ INV-20261021-1503).'));

  children.push(h3('Tóm tắt Quy chuẩn Coding Convention của Team:'));
  children.push(bullet('Đặt tên:', 'Class dùng PascalCase; Method/biến dùng camelCase có ý nghĩa; Hằng số dùng UPPER_SNAKE_CASE.'));
  children.push(bullet('Kiểu tiền tệ:', 'Bắt buộc dùng BigDecimal, tuyệt đối không dùng float/double để tránh sai số dấu phẩy động.'));
  children.push(bullet('Magic Number / Secret:', 'Không hardcode giá trị nghiệp vụ và mã khóa bí mật (API Key) trong mã nguồn.'));
  children.push(bullet('Cấu trúc lệnh:', 'Luôn sử dụng cặp ngoặc nhọn { } cho if/else/for, kể cả khi chỉ có 1 dòng lệnh.'));
  children.push(bullet('Ghi log:', 'Sử dụng thư viện Logger chuyên dụng, không dùng System.out.println.'));
  children.push(bullet('Thiết kế phương thức:', 'Mỗi phương thức không vượt quá 30 dòng, tuân thủ nguyên lý Đơn trách nhiệm (Single Responsibility).'));

  children.push(h2('2.2. Bảng tổng hợp Code Defect (Theo form đề bài)'));
  children.push(
    p(
      'Dưới đây là bảng phân tích chi tiết toàn bộ các Defect phát hiện được trong file mã nguồn payment_service (gồm 18 defect chi tiết, bao phủ đầy đủ cả 8 nhóm checklist C1 - C8, vượt xa yêu cầu tối thiểu 10 defect thuộc 5 nhóm của đề bài). Mỗi defect được ghi theo đúng định dạng: Số dòng – Nhóm lỗi – Mô tả – Hậu quả – Cách sửa.'
    )
  );

  // Table for Bai 2
  const codeRows = [
    new TableRow({
      children: [
        cell('Dòng', true, 6),
        cell('Nhóm', true, 10),
        cell('Mô tả Defect', true, 26),
        cell('Hậu quả (Impact)', true, 28),
        cell('Cách sửa (Resolution)', true, 30),
      ],
    }),
    new TableRow({
      children: [
        cell('1'),
        cell('C1\nNaming'),
        cell('Tên class payment_service viết bằng snake_case.'),
        cell('Vi phạm coding convention ("Class: PascalCase"), không đồng bộ với chuẩn lập trình Java.'),
        cell('Đổi tên class thành PaymentService (PascalCase).'),
      ],
    }),
    new TableRow({
      children: [
        cell('3'),
        cell('C8 / C5\nSecurity'),
        cell('Hardcode API_KEY bí mật: "sk_live_cinefu_8f2a91c7".'),
        cell('Lỗ hổng bảo mật nghiêm trọng. Khi đưa code lên Git, secret bị lộ ra ngoài, hacker có thể chiếm quyền cổng thanh toán.'),
        cell('Xóa hardcode. Đọc API Key từ Environment Variable hoặc Secret Vault: System.getenv("CINEFU_API_KEY").'),
      ],
    }),
    new TableRow({
      children: [
        cell('4'),
        cell('C1\nNaming'),
        cell('Tên biến Discount_Rate dùng chữ hoa và gạch dưới.'),
        cell('Vi phạm quy chuẩn đặt tên biến (phải là camelCase). Biến này cũng không được dùng đến (dead field).'),
        cell('Đổi thành discountRate hoặc xóa nếu không sử dụng.'),
      ],
    }),
    new TableRow({
      children: [
        cell('6'),
        cell('C1 / C2\nDesign'),
        cell('Tên method CalcInvoice viết PascalCase; hàm dài 49 dòng (> 30 dòng), ôm đồm quá nhiều việc (vi phạm SRP).'),
        cell('Khó đọc, khó viết Unit Test, vi phạm convention giới hạn độ dài hàm và nguyên lý Single Responsibility.'),
        cell('Đổi tên thành calcInvoice. Tách thành các hàm con: validate(), calculateSeats(), applyDiscounts()...'),
      ],
    }),
    new TableRow({
      children: [
        cell('6, 7'),
        cell('C7\nData Type'),
        cell('Dùng kiểu dữ liệu double (double t = 0) cho tiền tệ.'),
        cell('Vi phạm convention cấm dùng double/float. Kiểu dấu phẩy động gây sai số làm tròn khi tính toán tiền tệ.'),
        cell('Chuyển toàn bộ biến tiền và kiểu trả về sang BigDecimal.'),
      ],
    }),
    new TableRow({
      children: [
        cell('8'),
        cell('C3\nLogic'),
        cell('Vòng lặp tính tiền ghế bắt đầu từ i = 1 thay vì i = 0: for (int i = 1; i < b.getSeats().size(); i++).'),
        cell('BỎ SÓT GHẾ ĐẦU TIÊN (index 0). Khách đặt 1 ghế thì tiền vé = 0; khách đặt nhiều ghế bị tính thiếu 1 ghế, thất thoát lớn.'),
        cell('Sửa vòng lặp bắt đầu từ i = 0: for (int i = 0; i < b.getSeats().size(); i++) hoặc dùng foreach for (Seat s : b.getSeats()).'),
      ],
    }),
    new TableRow({
      children: [
        cell('10'),
        cell('C6\nString'),
        cell('So sánh chuỗi bằng toán tử tham chiếu ==: s.getType() == "VIP".'),
        cell('Trong Java, == so sánh địa chỉ ô nhớ. Chuỗi nạp từ DB sẽ trả về false, khiến ghế VIP bị tính nhầm thành giá ghế thường.'),
        cell('Dùng phương thức equals(): "VIP".equalsIgnoreCase(s.getType()).'),
      ],
    }),
    new TableRow({
      children: [
        cell('10-12'),
        cell('C5\nHardcode'),
        cell('Hardcode giá vé trực tiếp: 120000, 200000, 90000.'),
        cell('Vi phạm BR1 ("Giá ghế lấy từ bảng giá priceTableRepo..."). Khi rạp điều chỉnh giá vé sẽ phải sửa code và compile lại.'),
        cell('Lấy giá từ repository: priceTableRepo.getPriceByType(s.getType()).'),
      ],
    }),
    new TableRow({
      children: [
        cell('10-12'),
        cell('C2\nStyling'),
        cell('Các nhánh rẽ if, else if, else không có khối ngoặc { }.'),
        cell('Vi phạm convention ("Luôn dùng { } cho if/else/for"), dễ gây ra bug khi thêm dòng lệnh mới bên dưới.'),
        cell('Bao bọc các khối lệnh trong cặp ngoặc nhọn { }.'),
      ],
    }),
    new TableRow({
      children: [
        cell('15'),
        cell('C3 / C4\nValidation'),
        cell('Chỉ kiểm tra size() > 8, không kiểm tra seats == null hoặc size() < 1.'),
        cell('Vi phạm BR2 (hóa đơn có từ 1 đến 8 ghế). Đơn hàng 0 ghế vẫn được xử lý, hoặc gây lỗi NullPointerException.'),
        cell('Kiểm tra: if (b.getSeats() == null || b.getSeats().size() < 1 || b.getSeats().size() > 8) throw new InvalidBookingException(...).'),
      ],
    }),
    new TableRow({
      children: [
        cell('19'),
        cell('C3\nLogic'),
        cell('Dùng toán tử HOẶC (||) giữa trạng thái HOLDING và thời gian giữ ghế: getStatus().equals("HOLDING") || getHoldMinutes() <= 10.'),
        cell('Vi phạm nghiêm trọng BR3 (phải là VÀ). Đơn đã quá hạn nhưng status vẫn HOLDING, hoặc đơn CANCELLED vẫn cho thanh toán!'),
        cell('Sửa toán tử thành VÀ (&&), đồng thời kiểm tra null trước khi gọi equals().'),
      ],
    }),
    new TableRow({
      children: [
        cell('22'),
        cell('C7\nException'),
        cell('Trả về số ma "return 0;" khi booking không hợp lệ.'),
        cell('Vi phạm BR3 (phải ném BookingExpiredException). Khiến hệ thống tưởng vé 0 đồng và xuất vé miễn phí cho khách.'),
        cell('Ném ngoại lệ: throw new BookingExpiredException("Phiên đặt vé đã hết hạn hoặc không hợp lệ.");'),
      ],
    }),
    new TableRow({
      children: [
        cell('25'),
        cell('C3\nLogic'),
        cell('Chỉ kiểm tra phụ thu vào Thứ 7: DayOfWeek.SATURDAY.'),
        cell('Vi phạm BR4 (Thứ 7 hoặc Chủ nhật phụ thu 10%). Bỏ quên hoàn toàn ngày CHỦ NHẬT, gây thất thoát 10% doanh thu Chủ nhật.'),
        cell('Bổ sung kiểm tra cả Chủ nhật: if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY).'),
      ],
    }),
    new TableRow({
      children: [
        cell('31-33'),
        cell('C3\nLogic'),
        cell('Thành viên PLATINUM bị tính giảm giá 10% giống GOLD: t = t - t * 10 / 100.'),
        cell('Vi phạm BR5 (PLATINUM giảm 15%). Khách hàng VIP bị tính sai quyền lợi giảm giá, gây khiếu nại chất lượng dịch vụ.'),
        cell('Sửa tỷ lệ giảm giá cho PLATINUM thành 15%: total = total.multiply(new BigDecimal("0.85"));.'),
      ],
    }),
    new TableRow({
      children: [
        cell('37-40'),
        cell('C3/C6/C4\nVoucher'),
        cell('Không trim(), không hoa/thường mã voucher; không check tồn tại/hết hạn; không giới hạn mức giảm tối đa 50.000đ.'),
        cell('Vi phạm BR7. Nhập chữ thường bị lỗi; crash app nếu voucher không tồn tại; rạp bị thất thoát nếu voucher giảm > 50k.'),
        cell('Chuẩn hóa code.trim().toUpperCase(), kiểm tra tồn tại/hạn dùng, áp trần discount = v.getAmount().min(50000).'),
      ],
    }),
    new TableRow({
      children: [
        cell('42-44'),
        cell('C3 / C4\nValidation'),
        cell('Kiểm tra SĐT dùng &&: length != 10 && !startsWith("0"); check SĐT sau khi tính tiền; chỉ in log không ném Exception.'),
        cell('Vi phạm BR9. SĐT sai định dạng vẫn lọt qua; tính tiền xong mới báo lỗi; không chặn được dữ liệu rác vào DB.'),
        cell('Đưa check SĐT lên đầu hàm, dùng regex ^0[0-9]{9}$, nếu sai ném throw new IllegalArgumentException(...).'),
      ],
    }),
    new TableRow({
      children: [
        cell('46'),
        cell('C7 / C3\nLàm tròn'),
        cell('Làm tròn bằng ép kiểu t = (long) t / 1000 * 1000; không kiểm tra tổng tiền âm.'),
        cell('Vi phạm BR8. Đây là làm tròn xuống (truncate), biến 950đ thành 0đ (sai quy tắc >=500đ làm tròn lên); tiền có thể bị âm.'),
        cell('Đảm bảo max(0, total); dùng BigDecimal.setScale(-3, RoundingMode.HALF_UP) để làm tròn chuẩn.'),
      ],
    }),
    new TableRow({
      children: [
        cell('47-52'),
        cell('C6 / C2\nLogging'),
        cell('Dùng new Date().getYear() bị deprecated; cộng chuỗi trong vòng lặp; dùng System.out.println in log.'),
        cell('Vi phạm BR10 (mã sai định dạng INV-126... thay vì INV-yyyyMMdd); tốn bộ nhớ; vi phạm convention ghi log.'),
        cell('Dùng LocalDate với DateTimeFormatter("yyyyMMdd"); dùng StringBuilder / String.join; dùng Logger.info().'),
      ],
    }),
  ];

  const table2 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: codeRows,
  });
  children.push(table2);

  children.push(h2('2.3. Bảng phân loại Defect theo 8 nhóm Checklist'));
  children.push(
    p(
      'Theo yêu cầu của đề bài, các defect tìm được phải thuộc ít nhất 5 nhóm lỗi khác nhau. Kết quả review thực tế đã bao phủ đầy đủ toàn bộ 8/8 nhóm lỗi trong checklist:'
    )
  );

  const checklistRows = [
    new TableRow({
      children: [
        cell('Mã Nhóm', true, 12),
        cell('Tên Nhóm Lỗi', true, 28),
        cell('Số lượng phát hiện', true, 20),
        cell('Các dòng vi phạm tiêu biểu', true, 40),
      ],
    }),
    new TableRow({
      children: [
        cell('C1'),
        cell('Name convention'),
        cell('3 lỗi'),
        cell('Dòng 1 (tên class), Dòng 4 (tên biến), Dòng 6 (tên method).'),
      ],
    }),
    new TableRow({
      children: [
        cell('C2'),
        cell('Code styling / Clean code'),
        cell('4 lỗi'),
        cell('Dòng 6 (method quá dài/vi phạm SRP), Dòng 10-12 (thiếu ngoặc {}), Dòng 43, 52 (System.out.println).'),
      ],
    }),
    new TableRow({
      children: [
        cell('C3'),
        cell('Logic / Business Rules'),
        cell('8 lỗi'),
        cell('Dòng 8 (bỏ sót ghế 0), Dòng 15 (số lượng ghế), Dòng 19 (toán tử ||), Dòng 25 (quên Chủ nhật), Dòng 31 (giảm giá Platinum), Dòng 39 (trần voucher), Dòng 42 (logic SĐT), Dòng 46 (làm tròn).'),
      ],
    }),
    new TableRow({
      children: [
        cell('C4'),
        cell('Validation input'),
        cell('3 lỗi'),
        cell('Dòng 15 (không check null/empty ghế), Dòng 38 (không validate voucher), Dòng 42 (check SĐT trễ).'),
      ],
    }),
    new TableRow({
      children: [
        cell('C5'),
        cell('Hardcode / Magic number'),
        cell('2 lỗi'),
        cell('Dòng 3 (hardcode API Key), Dòng 10-12 (hardcode giá vé ghế).'),
      ],
    }),
    new TableRow({
      children: [
        cell('C6'),
        cell('Xử lý String'),
        cell('4 lỗi'),
        cell('Dòng 10 (so sánh bằng ==), Dòng 38 (quên trim/uppercase), Dòng 47 (getYear lỗi thời), Dòng 50 (cộng chuỗi vòng lặp).'),
      ],
    }),
    new TableRow({
      children: [
        cell('C7'),
        cell('Kiểu dữ liệu / Exception'),
        cell('4 lỗi'),
        cell('Dòng 6, 7 (dùng double tính tiền), Dòng 22 (return 0 thay vì ném Exception), Dòng 43 (không ném Exception khi SĐT sai), Dòng 46 (ép kiểu long làm tròn sai).'),
      ],
    }),
    new TableRow({
      children: [
        cell('C8'),
        cell('Security'),
        cell('1 lỗi nghiêm trọng'),
        cell('Dòng 3 (lộ API Key bí mật trên mã nguồn).'),
      ],
    }),
  ];

  const tableChecklist = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: checklistRows,
  });
  children.push(tableChecklist);

  children.push(h2('2.4. Mã nguồn hoàn chỉnh sau khi Refactor (Clean Code chuẩn Java)'));
  children.push(
    p(
      'Dưới đây là mã nguồn của lớp PaymentService đã được sửa chữa toàn diện: khắc phục toàn bộ 18 defect, áp dụng đúng 10 Business Rules, tuân thủ 100% coding convention của dự án (sử dụng BigDecimal, Logging bằng SLF4J, quản lý Secret qua biến môi trường, chia tách các hàm con đơn trách nhiệm, xử lý ngoại lệ chuẩn mực):'
    )
  );

  // Clean code lines
  const cleanCode = [
    'package com.cinefu.service;',
    '',
    'import com.cinefu.exception.BookingExpiredException;',
    'import com.cinefu.exception.InvalidBookingException;',
    'import com.cinefu.exception.InvalidVoucherException;',
    'import com.cinefu.model.Booking;',
    'import com.cinefu.model.Seat;',
    'import com.cinefu.model.Voucher;',
    'import com.cinefu.repository.PriceTableRepository;',
    'import com.cinefu.repository.VoucherRepository;',
    'import org.slf4j.Logger;',
    'import org.slf4j.LoggerFactory;',
    'import java.math.BigDecimal;',
    'import java.math.RoundingMode;',
    'import java.time.DayOfWeek;',
    'import java.time.LocalDate;',
    'import java.time.format.DateTimeFormatter;',
    'import java.util.stream.Collectors;',
    '',
    'public class PaymentService {',
    '',
    '    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);',
    '    private static final BigDecimal MAX_VOUCHER_DISCOUNT = new BigDecimal("50000");',
    '    private static final BigDecimal WEEKEND_SURCHARGE_RATE = new BigDecimal("1.10"); // +10%',
    '    private static final BigDecimal GOLD_DISCOUNT_RATE = new BigDecimal("0.90");      // Giảm 10%',
    '    private static final BigDecimal PLATINUM_DISCOUNT_RATE = new BigDecimal("0.85");  // Giảm 15%',
    '',
    '    private final PriceTableRepository priceTableRepo;',
    '    private final VoucherRepository voucherRepo;',
    '    private final String apiKey;',
    '',
    '    public PaymentService(PriceTableRepository priceTableRepo, VoucherRepository voucherRepo) {',
    '        this.priceTableRepo = priceTableRepo;',
    '        this.voucherRepo = voucherRepo;',
    '        this.apiKey = System.getenv("CINEFU_API_KEY"); // Lấy secret từ biến môi trường',
    '    }',
    '',
    '    public BigDecimal calcInvoice(Booking b, String voucherCode, String memberLevel, String phone) {',
    '        // BR9: Kiểm tra số điện thoại TRƯỚC KHI tính tiền',
    '        validatePhone(phone);',
    '',
    '        // BR2: Kiểm tra số lượng ghế (1 đến 8 ghế)',
    '        validateSeats(b);',
    '',
    '        // BR3: Kiểm tra trạng thái HOLDING và thời gian giữ chỗ <= 10 phút',
    '        validateBookingStatus(b);',
    '',
    '        // BR1: Tính tổng giá vé gốc từ repository theo từng ghế (bắt đầu từ index 0)',
    '        BigDecimal seatTotal = calculateBaseSeatPrice(b);',
    '',
    '        // BR4: Phụ thu 10% nếu suất chiếu rơi vào Thứ 7 hoặc Chủ nhật',
    '        seatTotal = applyWeekendSurcharge(seatTotal, b.getShowDate().getDayOfWeek());',
    '',
    '        // BR5: Giảm giá thành viên trên tiền vé (sau phụ thu)',
    '        BigDecimal ticketTotalAfterMember = applyMemberDiscount(seatTotal, memberLevel);',
    '',
    '        // BR6: Cộng giá combo bắp nước sau khi đã giảm giá thành viên',
    '        BigDecimal currentTotal = ticketTotalAfterMember.add(b.getComboPrice() != null ? b.getComboPrice() : BigDecimal.ZERO);',
    '',
    '        // BR7: Áp dụng voucher giảm giá (tối đa 50.000đ)',
    '        currentTotal = applyVoucherDiscount(currentTotal, voucherCode);',
    '',
    '        // BR8: Đảm bảo tổng tiền không âm và làm tròn đến 1.000đ (>= 500đ làm tròn lên)',
    '        BigDecimal finalTotal = roundFinalAmount(currentTotal);',
    '',
    '        // BR10 & Ghi Log theo chuẩn',
    '        logInvoiceDetails(b);',
    '',
    '        return finalTotal;',
    '    }',
    '',
    '    private void validatePhone(String phone) {',
    '        if (phone == null || !phone.matches("^0[0-9]{9}$")) {',
    '            throw new IllegalArgumentException("Số điện thoại không hợp lệ. Phải có 10 chữ số và bắt đầu bằng số 0.");',
    '        }',
    '    }',
    '',
    '    private void validateSeats(Booking b) {',
    '        if (b == null || b.getSeats() == null || b.getSeats().isEmpty() || b.getSeats().size() > 8) {',
    '            throw new InvalidBookingException("Hóa đơn phải có từ 1 đến 8 ghế.");',
    '        }',
    '    }',
    '',
    '    private void validateBookingStatus(Booking b) {',
    '        if (!"HOLDING".equalsIgnoreCase(b.getStatus()) || b.getHoldMinutes() > 10) {',
    '            throw new BookingExpiredException("Phiên giữ vé đã hết hạn hoặc không ở trạng thái HOLDING.");',
    '        }',
    '    }',
    '',
    '    private BigDecimal calculateBaseSeatPrice(Booking b) {',
    '        BigDecimal sum = BigDecimal.ZERO;',
    '        for (Seat s : b.getSeats()) {',
    '            BigDecimal price = priceTableRepo.getPriceByType(s.getType());',
    '            sum = sum.add(price);',
    '        }',
    '        return sum;',
    '    }',
    '',
    '    private BigDecimal applyWeekendSurcharge(BigDecimal amount, DayOfWeek day) {',
    '        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {',
    '            return amount.multiply(WEEKEND_SURCHARGE_RATE);',
    '        }',
    '        return amount;',
    '    }',
    '',
    '    private BigDecimal applyMemberDiscount(BigDecimal amount, String memberLevel) {',
    '        if ("GOLD".equalsIgnoreCase(memberLevel)) {',
    '            return amount.multiply(GOLD_DISCOUNT_RATE);',
    '        } else if ("PLATINUM".equalsIgnoreCase(memberLevel)) {',
    '            return amount.multiply(PLATINUM_DISCOUNT_RATE);',
    '        }',
    '        return amount; // Khách thường (NONE) không giảm giá',
    '    }',
    '',
    '    private BigDecimal applyVoucherDiscount(BigDecimal amount, String voucherCode) {',
    '        if (voucherCode == null || voucherCode.trim().isEmpty()) {',
    '            return amount;',
    '        }',
    '        String cleanCode = voucherCode.trim().toUpperCase();',
    '        Voucher v = voucherRepo.findByCode(cleanCode);',
    '        if (v == null || v.isExpired()) {',
    '            throw new InvalidVoucherException("Mã voucher không tồn tại hoặc đã hết hạn.");',
    '        }',
    '        BigDecimal discount = v.getAmount().min(MAX_VOUCHER_DISCOUNT);',
    '        return amount.subtract(discount);',
    '    }',
    '',
    '    private BigDecimal roundFinalAmount(BigDecimal amount) {',
    '        if (amount.compareTo(BigDecimal.ZERO) < 0) {',
    '            amount = BigDecimal.ZERO;',
    '        }',
    '        // Làm tròn đến 1.000đ (>= 500đ làm tròn lên)',
    '        return amount.divide(new BigDecimal("1000"), 0, RoundingMode.HALF_UP).multiply(new BigDecimal("1000"));',
    '    }',
    '',
    '    private void logInvoiceDetails(Booking b) {',
    '        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));',
    '        String invoiceNo = String.format("INV-%s-%s", dateStr, b.getId());',
    '        String seatList = b.getSeats().stream().map(Seat::getCode).collect(Collectors.joining(", "));',
    '        logger.info("Invoice {} generated for seats: {}", invoiceNo, seatList);',
    '    }',
    '}',
  ];

  for (const line of cleanCode) {
    children.push(codeLine(line));
  }

  // ==================== TỔNG KẾT ====================
  children.push(h1('3. TỔNG KẾT VÀ BÀI HỌC KINH NGHIỆM'));
  children.push(
    p(
      'Qua bài kiểm tra Progress Test 3 về chuyên đề Static Testing (Review & Code Review), nhóm kiểm thử đã rút ra những kinh nghiệm và kết luận quan trọng sau:'
    )
  );

  children.push(
    bullet(
      'Tầm quan trọng của Static Testing:',
      'Static Testing giúp phát hiện tới 60-70% lỗi phần mềm ngay từ giai đoạn đặc tả yêu cầu và xây dựng mã nguồn. Việc khắc phục lỗi ở giai đoạn này tốn ít chi phí hơn gấp hàng chục lần so với khi lỗi đã lọt qua môi trường Production.'
    )
  );

  children.push(
    bullet(
      'Kỹ năng Review tài liệu (SRS Review):',
      'Đòi hỏi Tester phải luôn đối chiếu chéo (cross-check) giữa các điều khoản yêu cầu để tìm ra sự mâu thuẫn; đặt ra các câu hỏi biên (Boundary condition) và luồng ngoại lệ (Alternative flows) thay vì chỉ nhìn vào luồng chính; kiên quyết loại bỏ các câu từ định tính, mơ hồ không kiểm thử được.'
    )
  );

  children.push(
    bullet(
      'Kỹ năng Code Review / Inspection:',
      'Phải bám sát Checklist và Business Rules, không bỏ sót bất kỳ chi tiết biên nào (như toán tử so sánh, vòng lặp bắt đầu từ 0 hay 1, so sánh chuỗi bằng equals thay vì ==). Đặc biệt lưu ý các vấn đề sống còn trong ứng dụng thực tế như: An toàn bảo mật (Security - tránh lộ secret), Tính toán tài chính (dùng BigDecimal tránh sai số tiền tệ), và Thiết kế mã nguồn sạch (Clean Code - Single Responsibility).'
    )
  );

  // Section configuration
  const doc = new Document({
    features: { updateFields: true },
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
            color: '000000',
          },
          paragraph: {
            spacing: { line: 300 }, // 1.25 line spacing
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: { before: 280, after: 140 },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: { before: 220, after: 100 },
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
            bold: true,
            italics: true,
            color: '000000',
          },
          paragraph: {
            spacing: { before: 180, after: 80 },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'CineFU — Progress Test 3 (Static Testing)',
                    font: 'Times New Roman',
                    size: 18,
                    italics: true,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Trang ',
                    font: 'Times New Roman',
                    size: 20,
                    color: '000000',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 20,
                    color: '000000',
                  }),
                  new TextRun({
                    text: ' / ',
                    font: 'Times New Roman',
                    size: 20,
                    color: '000000',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Times New Roman',
                    size: 20,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        },
        children: children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = 'ProgressTest3_BaiLam.docx';
  fs.writeFileSync(outPath, buffer);
  console.log('Successfully generated ' + outPath + ' (size: ' + buffer.length + ' bytes)');
}

buildDoc().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});

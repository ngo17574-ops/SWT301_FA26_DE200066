const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  TableOfContents,
  Footer,
  Header,
  PageNumber,
  PageBreak,
  ShadingType,
  LevelFormat
} = require("docx");

// Helpers for Black & White formatting with Times New Roman
const FONT_NAME = "Times New Roman";
const COLOR_BLACK = "000000";
const COLOR_GRAY_BG = "F2F2F2"; // Very light grayscale for table headers only

function pText(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      before: options.spacingBefore ?? 60,
      after: options.spacingAfter ?? 60,
      line: options.lineSpacing ?? 276 // ~1.15 line spacing
    },
    children: [
      new TextRun({
        text: text,
        font: FONT_NAME,
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        italics: options.italics || false,
        color: COLOR_BLACK
      })
    ]
  });
}

function pMulti(runs, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      before: options.spacingBefore ?? 60,
      after: options.spacingAfter ?? 60,
      line: options.lineSpacing ?? 276
    },
    children: runs.map(r => new TextRun({
      text: r.text,
      font: FONT_NAME,
      size: r.size || options.size || 24,
      bold: r.bold || false,
      italics: r.italics || false,
      color: COLOR_BLACK
    }))
  });
}

function pBullet(runs, level = 0) {
  const runArray = typeof runs === "string" ? [{ text: runs }] : runs;
  return new Paragraph({
    bullet: { level: level },
    spacing: { before: 40, after: 40, line: 276 },
    children: runArray.map(r => new TextRun({
      text: r.text,
      font: FONT_NAME,
      size: r.size || 24,
      bold: r.bold || false,
      italics: r.italics || false,
      color: COLOR_BLACK
    }))
  });
}

// Heading 1 with Automatic Multilevel Numbering (%1.)
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    numbering: {
      reference: "heading-numbering",
      level: 0
    },
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text: text,
        font: FONT_NAME,
        size: 28, // 14pt
        bold: true,
        color: COLOR_BLACK
      })
    ]
  });
}

// Heading 2 with Automatic Multilevel Numbering (%1.%2.)
function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    numbering: {
      reference: "heading-numbering",
      level: 1
    },
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text: text,
        font: FONT_NAME,
        size: 26, // 13pt
        bold: true,
        color: COLOR_BLACK
      })
    ]
  });
}

// Heading 3 with Automatic Multilevel Numbering (%1.%2.%3.)
function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    numbering: {
      reference: "heading-numbering",
      level: 2
    },
    spacing: { before: 140, after: 60 },
    children: [
      new TextRun({
        text: text,
        font: FONT_NAME,
        size: 24, // 12pt
        bold: true,
        italics: true,
        color: COLOR_BLACK
      })
    ]
  });
}

const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 4, // 0.5 pt
  color: COLOR_BLACK
};

const tableBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
  insideHorizontal: thinBorder,
  insideVertical: thinBorder
};

function createTableCell(content, options = {}) {
  let paragraphs = [];
  if (typeof content === "string") {
    paragraphs = [new Paragraph({
      alignment: options.alignment || AlignmentType.LEFT,
      spacing: { before: 40, after: 40, line: 240 },
      children: [
        new TextRun({
          text: content,
          font: FONT_NAME,
          size: options.size || 22, // 11pt
          bold: options.bold || false,
          italics: options.italics || false,
          color: COLOR_BLACK
        })
      ]
    })];
  } else if (Array.isArray(content)) {
    paragraphs = content;
  }

  return new TableCell({
    width: options.width ? { size: options.width, type: WidthType.DXA } : undefined,
    shading: options.header ? { fill: COLOR_GRAY_BG, type: ShadingType.CLEAR } : undefined,
    margins: {
      top: 100,
      bottom: 100,
      left: 120,
      right: 120
    },
    children: paragraphs
  });
}

function buildDocument() {
  const doc = new Document({
    features: {
      updateFields: true
    },
    numbering: {
      config: [
        {
          reference: "heading-numbering",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
              style: {
                run: {
                  font: FONT_NAME,
                  bold: true,
                  color: COLOR_BLACK
                }
              }
            },
            {
              level: 1,
              format: LevelFormat.DECIMAL,
              text: "%1.%2.",
              alignment: AlignmentType.START,
              style: {
                run: {
                  font: FONT_NAME,
                  bold: true,
                  color: COLOR_BLACK
                }
              }
            },
            {
              level: 2,
              format: LevelFormat.DECIMAL,
              text: "%1.%2.%3.",
              alignment: AlignmentType.START,
              style: {
                run: {
                  font: FONT_NAME,
                  bold: true,
                  italics: true,
                  color: COLOR_BLACK
                }
              }
            }
          ]
        }
      ]
    },
    styles: {
      default: {
        document: {
          run: {
            font: FONT_NAME,
            color: COLOR_BLACK,
            size: 24
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 2cm
              bottom: 1134, // 2cm
              left: 1701, // 3cm
              right: 1134 // 2cm
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: "BÀI TẬP STATIC TESTING — CHUYÊN ĐỀ CHAPTER 3 (SWT301)",
                    font: FONT_NAME,
                    size: 18,
                    italics: true,
                    color: "555555"
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120 },
                children: [
                  new TextRun({
                    text: "Trang ",
                    font: FONT_NAME,
                    size: 20
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_NAME,
                    size: 20
                  }),
                  new TextRun({
                    text: " / ",
                    font: FONT_NAME,
                    size: 20
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_NAME,
                    size: 20
                  })
                ]
              })
            ]
          })
        },
        children: [
          // TRANG BÌA
          new Paragraph({ spacing: { before: 400, after: 100 }, alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "TRƯỜNG ĐẠI HỌC FPT", font: FONT_NAME, size: 28, bold: true })
          ]}),
          new Paragraph({ spacing: { before: 0, after: 600 }, alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "KHOA CÔNG NGHỆ THÔNG TIN — BỘ MÔN KỸ THUẬT PHẦN MỀM", font: FONT_NAME, size: 24, bold: true })
          ]}),
          new Paragraph({ spacing: { before: 800, after: 200 }, alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "BÁO CÁO BÀI TẬP THỰC HÀNH", font: FONT_NAME, size: 36, bold: true })
          ]}),
          new Paragraph({ spacing: { before: 100, after: 200 }, alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "MÔN HỌC: SOFTWARE TESTING (SWT301)", font: FONT_NAME, size: 30, bold: true })
          ]}),
          new Paragraph({ spacing: { before: 100, after: 800 }, alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "CHUYÊN ĐỀ CHAPTER 3: STATIC TESTING (KIỂM THỬ TĨNH)\nDỰ ÁN THỰC NGHIỆM: SHOPFU", font: FONT_NAME, size: 26, bold: true })
          ]}),

          new Paragraph({ spacing: { before: 600, after: 60 }, alignment: AlignmentType.LEFT, children: [
            new TextRun({ text: "Sinh viên thực hiện: ", font: FONT_NAME, size: 24, bold: true }),
            new TextRun({ text: "Sinh viên Kỹ thuật phần mềm (FPT University)", font: FONT_NAME, size: 24 })
          ]}),
          new Paragraph({ spacing: { before: 60, after: 60 }, alignment: AlignmentType.LEFT, children: [
            new TextRun({ text: "Học phần: ", font: FONT_NAME, size: 24, bold: true }),
            new TextRun({ text: "Software Testing (SWT301) — Học kỳ Fall / Spring", font: FONT_NAME, size: 24 })
          ]}),
          new Paragraph({ spacing: { before: 60, after: 60 }, alignment: AlignmentType.LEFT, children: [
            new TextRun({ text: "Chủ đề: ", font: FONT_NAME, size: 24, bold: true }),
            new TextRun({ text: "Static vs Dynamic Testing, Review SRS, Code Inspection theo Checklist", font: FONT_NAME, size: 24 })
          ]}),
          new Paragraph({ spacing: { before: 60, after: 800 }, alignment: AlignmentType.LEFT, children: [
            new TextRun({ text: "Ngày hoàn thành: ", font: FONT_NAME, size: 24, bold: true }),
            new TextRun({ text: "Năm học 2026", font: FONT_NAME, size: 24 })
          ]}),

          new Paragraph({ children: [new PageBreak()] }),

          // MỤC LỤC TỰ ĐỘNG
          new Paragraph({ spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "MỤC LỤC", font: FONT_NAME, size: 32, bold: true })
          ]}),
          new TableOfContents("Mục lục tài liệu", {
            stylesWithLevels: [
              { styleName: "Heading 1", level: 1 },
              { styleName: "Heading 2", level: 2 },
              { styleName: "Heading 3", level: 3 }
            ]
          }),
          pText("(Lưu ý: Bấm chuột phải vào bảng mục lục trên Microsoft Word và chọn 'Update Field' -> 'Update entire table' để đồng bộ số trang và các mục tự động).", { italics: true, size: 20, alignment: AlignmentType.CENTER }),

          new Paragraph({ children: [new PageBreak()] }),

          // CHƯƠNG 1 (Đánh số tự động qua numbering level 0, 1)
          heading1("TỔNG QUAN VỀ KIỂM THỬ TĨNH VÀ DỰ ÁN SHOPFU"),
          heading2("Bối cảnh dự án ShopFU"),
          pText("ShopFU là một hệ sinh thái website thương mại điện tử chuyên cung cấp trải nghiệm mua sắm trực tuyến toàn diện cho người dùng. Các chức năng cốt lõi của hệ thống bao gồm:"),
          pBullet([
            { text: "Phân hệ Người dùng: ", bold: true },
            { text: "Đăng ký tài khoản, Đăng nhập, Quản lý hồ sơ cá nhân, Đổi mật khẩu và Xác thực OTP qua điện thoại." }
          ]),
          pBullet([
            { text: "Phân hệ Tìm kiếm & Sản phẩm: ", bold: true },
            { text: "Tìm kiếm sản phẩm theo từ khóa, lọc theo danh mục, hiển thị chi tiết giá và số lượng tồn kho." }
          ]),
          pBullet([
            { text: "Phân hệ Giỏ hàng & Đơn hàng: ", bold: true },
            { text: "Thêm sản phẩm vào giỏ, áp dụng mã giảm giá (coupon), tính toán tổng tiền, tính phí vận chuyển và hủy đơn hàng." }
          ]),
          pBullet([
            { text: "Phân hệ Thanh toán & Quản trị: ", bold: true },
            { text: "Tích hợp cổng thanh toán trực tuyến, hoàn tiền và xuất báo cáo doanh thu quản trị viên." }
          ]),

          heading2("Khái niệm và vị trí của Static Testing theo chuẩn ISTQB"),
          pText("Theo chuẩn kiểm thử phần mềm quốc tế ISTQB (International Software Testing Qualifications Board), Static Testing (Kiểm thử tĩnh) là hình thức kiểm thử các sản phẩm công việc phần mềm (work products) như tài liệu đặc tả yêu cầu (SRS), tài liệu thiết kế kiến trúc, mã nguồn (source code), kịch bản test... mà KHÔNG CẦN THỰC THI CHƯƠNG TRÌNH."),
          pText("Static Testing bao gồm hai hình thức chính:"),
          pBullet([
            { text: "Review (Đánh giá thủ công): ", bold: true },
            { text: "Bao gồm Informal Review, Walkthrough, Technical Review và Formal Inspection do con người trực tiếp đọc, rà soát và đối chiếu." }
          ]),
          pBullet([
            { text: "Static Analysis (Phân tích tĩnh tự động): ", bold: true },
            { text: "Sử dụng các công cụ chuyên dụng (SAST, Linters, Metric Analyzers như SonarQube, Checkstyle) để đo lường độ phức tạp (Cyclomatic Complexity), phát hiện code smell, biến chưa sử dụng, cú pháp lỗi và các lỗ hổng bảo mật." }
          ]),

          heading2("So sánh cốt lõi giữa Static Testing và Dynamic Testing"),
          pText("Bảng so sánh đối sánh hai phương pháp kiểm thử cốt lõi:"),

          // TABLE SO SÁNH
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableCell("Tiêu chí so sánh", { bold: true, header: true, width: 2200 }),
                  createTableCell("Static Testing (Kiểm thử tĩnh)", { bold: true, header: true, width: 3800 }),
                  createTableCell("Dynamic Testing (Kiểm thử động)", { bold: true, header: true, width: 3800 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Thực thi mã nguồn"),
                  createTableCell("Không chạy mã nguồn (Without executing code)"),
                  createTableCell("Bắt buộc phải chạy phần mềm (Requires execution)")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Đối tượng kiểm thử"),
                  createTableCell("Tài liệu SRS, Architecture Design, Source Code, Test Cases, DDL Script"),
                  createTableCell("Phần mềm đang chạy, API endpoints, Giao diện Web/App, Cơ sở dữ liệu sống")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Mục tiêu phát hiện"),
                  createTableCell("Phát hiện trực tiếp DEFECT (lỗi trong tài liệu, code thừa, vi phạm chuẩn, lỗ hổng)"),
                  createTableCell("Quan sát FAILURE (hành vi sai lệch, crash, tràn bộ nhớ, phản hồi chậm)")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Thời điểm áp dụng"),
                  createTableCell("Ngay từ đầu dự án (Shift-Left: Requirement, Design, Coding)"),
                  createTableCell("Sau khi đã có bản build chạy được (Unit run, Integration, System, UAT)")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Chi phí khắc phục"),
                  createTableCell("Rất thấp (sửa lỗi ngay trên tài liệu hoặc dòng code vừa viết)"),
                  createTableCell("Cao hơn từ 10 đến 100 lần (do lỗi đã lan truyền qua nhiều công đoạn)")
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // CHƯƠNG 2
          heading1("BÀI 1 — PHÂN BIỆT STATIC / DYNAMIC TESTING VÀ PHÂN LOẠI DEFECT"),
          heading2("Yêu cầu bài tập"),
          pText("Dự án ShopFU ghi nhận 12 tình huống thực tế phát sinh vấn đề. Với mỗi tình huống, thực hiện xác định:"),
          pBullet([
            { text: "(a) Kỹ thuật phát hiện hiệu quả nhất: ", bold: true },
            { text: "Static Testing (Review / Static Analysis) hay Dynamic Testing (Test chạy thực tế)?" }
          ]),
          pBullet([
            { text: "(b) Phân loại loại defect: ", bold: true },
            { text: "Chọn chính xác trong các danh mục chuẩn: Requirement defect, Design defect, Coding defect, Vi phạm chuẩn (standard), Interface defect, Security vulnerability, Thiếu traceability/coverage của test basis, Code khó bảo trì, Failure khi chạy (performance / memory / hành vi sai)." }
          ]),
          pBullet([
            { text: "Giải thích lý do: ", bold: true },
            { text: "Cơ sở kỹ thuật và lập luận vì sao lựa chọn phương pháp và loại lỗi đó." }
          ]),

          heading2("Bảng phân tích chi tiết 12 tình huống trong dự án ShopFU"),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableCell("#", { bold: true, header: true, width: 500 }),
                  createTableCell("Tình huống thực tế", { bold: true, header: true, width: 2600 }),
                  createTableCell("(a) Kỹ thuật", { bold: true, header: true, width: 1700 }),
                  createTableCell("(b) Loại defect", { bold: true, header: true, width: 2300 }),
                  createTableCell("Giải thích chi tiết", { bold: true, header: true, width: 2900 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("1"),
                  createTableCell("Tài liệu SRS ghi 'Trang chủ phải tải nhanh', không có con số cụ thể."),
                  createTableCell("Static testing\n(Review SRS)"),
                  createTableCell("Requirement defect\n(Mơ hồ, không kiểm thử được)"),
                  createTableCell("Từ 'nhanh' là cảm tính, phi định lượng. Đọc tài liệu là nhận ra ngay mà không cần viết code hay chạy chương trình. Tester không thể thiết kế test case vì thiếu Expected Result cụ thể.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("2"),
                  createTableCell("Khi 2.000 người dùng cùng truy cập trong đợt sale 11/11, trang thanh toán mất 15 giây mới phản hồi."),
                  createTableCell("Dynamic testing\n(Performance / Load Testing)"),
                  createTableCell("Failure khi chạy\n(Hiệu năng / Performance bottleneck)"),
                  createTableCell("Vấn đề thời gian trễ (15s) chỉ quan sát và đo lường được khi hệ thống đang vận hành thực tế dưới tải lớn đồng thời (2.000 concurrent users). Static testing không thể đo lường chính xác con số này.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("3"),
                  createTableCell("Tài liệu design API: Giỏ hàng gửi price theo đơn vị 'nghìn đồng', module Payment nhận price theo đơn vị 'đồng'."),
                  createTableCell("Static testing\n(API Specification Review)"),
                  createTableCell("Interface defect /\nDesign defect"),
                  createTableCell("So sánh và đối chiếu chéo (cross-check) giữa 2 bản tài liệu thiết kế giao tiếp API trước khi code sẽ phát hiện ngay sự lệch pha về đơn vị dữ liệu (lệch 1.000 lần), ngăn chặn trừ sai tiền nghiêm trọng.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("4"),
                  createTableCell("Trong code có hàm oldCalculateTax() không được gọi ở bất kỳ đâu."),
                  createTableCell("Static testing\n(Static Code Analysis / Linter)"),
                  createTableCell("Code khó bảo trì\n(Dead code / Unused code)"),
                  createTableCell("Công cụ phân tích tĩnh hoặc IDE compiler dựng đồ thị gọi hàm (Call Graph) và chỉ ra ngay hàm không bao giờ được gọi. Mã chết làm phình kích thước file, gây hoang mang và tốn công bảo trì.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("5"),
                  createTableCell("Server ShopFU bị tràn bộ nhớ (Out Of Memory - OOM) sau 3 ngày chạy liên tục."),
                  createTableCell("Dynamic testing\n(Endurance Testing / Soak Testing)"),
                  createTableCell("Failure khi chạy\n(Rò rỉ bộ nhớ / Memory leak)"),
                  createTableCell("Hiện tượng rò rỉ bộ nhớ tích tụ chậm qua thời gian vận hành thực tế. Sự cố sập server (OOM) chỉ được kiểm chứng và tái hiện bằng việc cho hệ thống chạy liên tục kết hợp công cụ Memory Profiler.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("6"),
                  createTableCell("Code có câu lệnh:\n\"SELECT * FROM products WHERE name LIKE '%\" + keyword + \"%'\";"),
                  createTableCell("Static testing\n(SAST / Security Code Review)"),
                  createTableCell("Security vulnerability\n(Lỗ hổng SQL Injection)"),
                  createTableCell("Ghép chuỗi trực tiếp tham số người dùng vào câu lệnh SQL là pattern lỗ hổng kinh điển. Review bằng mắt hoặc quét bằng công cụ SAST phát hiện ngay lập tức mà không cần gửi payload khai thác.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("7"),
                  createTableCell("Requirement 'Hoàn tiền khi khách hủy đơn' không có test case nào được viết cho nó."),
                  createTableCell("Static testing\n(Review RTM - Traceability Matrix)"),
                  createTableCell("Thiếu traceability / coverage của test basis"),
                  createTableCell("Đối chiếu giữa ma trận yêu cầu (SRS) và danh sách kịch bản kiểm thử (Test Cases) phát hiện ngay vùng nghiệp vụ bị bỏ sót (Gap). Đây là hoạt động rà soát tài liệu tĩnh hoàn toàn.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("8"),
                  createTableCell("Hàm processOrder() dài 750 dòng, có Cyclomatic Complexity = 52."),
                  createTableCell("Static testing\n(Static Code Metric Analysis)"),
                  createTableCell("Code khó bảo trì\n(High Complexity / God Method)"),
                  createTableCell("Độ phức tạp xoay vòng (CC=52) và độ dài (750 LOC) được tính toán tự động dựa trên đồ thị dòng điều khiển (CFG) của mã nguồn mà không cần chạy chương trình. Hàm quá phức tạp cực kỳ dễ sinh lỗi.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("9"),
                  createTableCell("Tên biến trong module Báo cáo đặt kiểu a, b, x1, tmp2, trái với coding convention của team."),
                  createTableCell("Static testing\n(Code Review / Linter)"),
                  createTableCell("Vi phạm chuẩn\n(Coding convention violation)"),
                  createTableCell("Quy tắc đặt tên biến có ý nghĩa được phát hiện trực quan bằng Code Review hoặc cấu hình Rule trong Linter (SonarLint, Checkstyle). Lỗi không làm sai kết quả chạy nhưng phá vỡ tiêu chuẩn kỹ thuật.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("10"),
                  createTableCell("Thiết kế database lưu tên, SĐT, địa chỉ khách hàng lặp lại trong mỗi bản ghi đơn hàng."),
                  createTableCell("Static testing\n(Database Schema Review)"),
                  createTableCell("Design defect\n(Thiết kế DB dư thừa, vi phạm chuẩn hóa)"),
                  createTableCell("Xem xét lược đồ quan hệ ERD hoặc file DDL tạo bảng sẽ thấy ngay vi phạm dạng chuẩn hóa (2NF/3NF). Gây lãng phí lưu trữ và nguy cơ dị thường dữ liệu (Update Anomaly) khi khách đổi địa chỉ.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("11"),
                  createTableCell("Khách bấm nút 'Đặt hàng' 2 lần liên tiếp thì tạo 2 đơn hàng giống hệt nhau và trừ tiền 2 lần."),
                  createTableCell("Dynamic testing\n(Functional / Concurrency Testing)"),
                  createTableCell("Failure khi chạy\n(Lỗi logic giao dịch / Thiếu Idempotency)"),
                  createTableCell("Lỗi phát sinh do tương tác gửi 2 request liên tiếp trong thời gian ngắn (race condition, double-click). Phải chạy ứng dụng thực tế để kiểm tra frontend có disable nút và backend có khóa giao dịch hay không.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("12"),
                  createTableCell("User story 'Đổi mật khẩu' không có acceptance criteria nào mô tả trường hợp mật khẩu mới trùng mật khẩu cũ."),
                  createTableCell("Static testing\n(Review User Story / Backlog)"),
                  createTableCell("Requirement defect\n(Thiếu Acceptance Criteria)"),
                  createTableCell("Đọc tài liệu User Story trong buổi Backlog Refinement sẽ phát hiện thiếu tiêu chí nghiệm thu cho trường hợp biên/ngoại lệ. Phát hiện sớm giúp PO/BA bổ sung trước khi tiến hành code.")
                ]
              })
            ]
          }),

          heading2("Nhận xét tổng kết và phân tích chuyên sâu"),
          pBullet([
            { text: "Tỷ lệ phát hiện lỗi: ", bold: true },
            { text: "Trong 12 tình huống trên, có tới 9 tình huống (chiếm 75%) được phát hiện hiệu quả nhất bằng Static Testing (Review và Static Analysis), và 3 tình huống (25%) thuộc về Dynamic Testing." }
          ]),
          pBullet([
            { text: "Bản chất phát hiện: ", bold: true },
            { text: "Static Testing tìm trực tiếp NGUYÊN NHÂN GỐC RỄ (Defect/Flaw) nằm trong tài liệu, mô hình và mã nguồn. Ngược lại, Dynamic Testing phát hiện HẬU QUẢ BỘC LỘ (Failure) khi mã nguồn được chạy trong môi trường thực tế." }
          ]),
          pBullet([
            { text: "Chiến lược Shift-Left: ", bold: true },
            { text: "Việc rà soát sớm tài liệu SRS (tình huống 1, 12) và thiết kế API/DB (tình huống 3, 10) giúp loại bỏ hơn 50% lỗi tiềm tàng ngay trước khi viết bất kỳ dòng mã nào. Điều này tiết kiệm từ 10 đến 100 lần chi phí so với việc để lỗi trôi đến giai đoạn kiểm thử hệ thống." }
          ]),
          pBullet([
            { text: "Sự kết hợp hoàn hảo: ", bold: true },
            { text: "Static Testing không thể thay thế Dynamic Testing (không thể đo được 15 giây phản hồi hay OOM sau 3 ngày), và Dynamic Testing cũng không thể phát hiện dead code hay tên biến xấu. Hai phương pháp có tính chất bổ trợ sống còn cho chất lượng phần mềm." }
          ]),

          new Paragraph({ children: [new PageBreak()] }),

          // CHƯƠNG 3
          heading1("BÀI 2 — REVIEW TÀI LIỆU YÊU CẦU (SRS) CHỨC NĂNG ĐĂNG KÝ TÀI KHOẢN"),
          heading2("Bối cảnh và tiêu chí kỹ thuật Review SRS"),
          pText("Tài liệu đặc tả yêu cầu phần mềm (Software Requirements Specification - SRS) của ShopFU v0.3 cho chức năng 'Đăng ký tài khoản' được đưa vào phiên họp Technical Review với vai trò Tester rà soát. Các tiêu chí đánh giá chất lượng yêu cầu phần mềm theo chuẩn ISO/IEC/IEEE 29148 bao gồm:"),
          pBullet([
            { text: "Tính rõ ràng, không mơ hồ (Unambiguous): ", bold: true },
            { text: "Mỗi yêu cầu chỉ có một cách hiểu duy nhất, không dùng từ ngữ cảm tính." }
          ]),
          pBullet([
            { text: "Tính nhất quán (Consistent): ", bold: true },
            { text: "Các yêu cầu không mâu thuẫn, đá lẫn nhau." }
          ]),
          pBullet([
            { text: "Tính đầy đủ (Complete): ", bold: true },
            { text: "Mô tả đầy đủ luồng chính, luồng phụ, ngoại lệ và dữ liệu đầu vào." }
          ]),
          pBullet([
            { text: "Tính kiểm thử được (Testable): ", bold: true },
            { text: "Tester có thể thiết kế kịch bản kiểm thử với tiêu chí Pass/Fail rõ ràng." }
          ]),
          pBullet([
            { text: "Tính khả thi (Feasible / Realistic): ", bold: true },
            { text: "Yêu cầu có thể hiện thực hóa trong thực tế kỹ thuật." }
          ]),
          pBullet([
            { text: "Không dư thừa (Non-redundant): ", bold: true },
            { text: "Không lặp lại yêu cầu gây lãng phí và khó bảo trì tài liệu." }
          ]),

          heading2("Bảng phát hiện và phân tích chi tiết 10 Defect trong SRS ShopFU"),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableCell("ID", { bold: true, header: true, width: 600 }),
                  createTableCell("Requirement liên quan", { bold: true, header: true, width: 2200 }),
                  createTableCell("Loại defect", { bold: true, header: true, width: 2000 }),
                  createTableCell("Mô tả chi tiết vấn đề", { bold: true, header: true, width: 2700 }),
                  createTableCell("Đề xuất khắc phục chuẩn", { bold: true, header: true, width: 2700 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D1"),
                  createTableCell("REQ-3.3 vs REQ-3.6"),
                  createTableCell("Mâu thuẫn\n(Contradictory)"),
                  createTableCell("REQ-3.3 yêu cầu mật khẩu dài từ 6 đến 12 ký tự, nhưng REQ-3.6 lại yêu cầu từ 8 đến 16 ký tự. Developer và Tester không có căn cứ xác định đâu là chuẩn."),
                  createTableCell("Xóa bỏ REQ-3.3. Thống nhất quy chuẩn duy nhất tại REQ-3.6: Mật khẩu có độ dài từ 8 đến 16 ký tự.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D2"),
                  createTableCell("REQ-3.3"),
                  createTableCell("Mơ hồ / Không kiểm thử được\n(Ambiguous / Untestable)"),
                  createTableCell("Cụm từ 'đủ mạnh' hoàn toàn mang tính cảm tính, không có tiêu chí kỹ thuật định lượng để xác định mật khẩu đạt hay không đạt."),
                  createTableCell("Quy định cụ thể các điều kiện mật khẩu mạnh: chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@, #, $, !...).")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D3"),
                  createTableCell("REQ-3.5"),
                  createTableCell("Mơ hồ / Không kiểm thử được\n(Ambiguous / Untestable)"),
                  createTableCell("Cụm từ 'trong một khoảng thời gian hợp lý' không có con số cụ thể (bao nhiêu giây hay phút). Tester không thể viết test case kiểm tra hết hạn OTP."),
                  createTableCell("Quy định rõ ràng: 'Mã OTP có hiệu lực trong vòng 03 phút (180 giây) kể từ thời điểm hệ thống gửi tin nhắn thành công'.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D4"),
                  createTableCell("REQ-3.7"),
                  createTableCell("Phi thực tế / Không chính xác\n(Unrealistic / Incorrect)"),
                  createTableCell("Yêu cầu 'hệ thống phải xử lý đăng ký thành công cho 100% người dùng trong mọi trường hợp' là bất khả thi (không tính đến sự cố mạng viễn thông SMS, sập kết nối, người dùng nhập sai)."),
                  createTableCell("Sửa thành chỉ số SLA định lượng: 'Hệ thống đạt tỷ lệ đăng ký thành công tối thiểu 99.5% đối với các yêu cầu hợp lệ trong điều kiện mạng ổn định'.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D5"),
                  createTableCell("REQ-3.8 vs REQ-3.1"),
                  createTableCell("Thiếu / Không khả thi\n(Missing / Infeasible)"),
                  createTableCell("REQ-3.8 yêu cầu người dùng từ 18 tuổi trở lên, nhưng REQ-3.1 chỉ thu thập Email, SĐT và Mật khẩu, hoàn toàn không có trường Ngày sinh để kiểm tra."),
                  createTableCell("Bổ sung trường 'Ngày sinh (Date of Birth)' vào REQ-3.1, và quy định công thức tính tuổi: Ngày hiện tại trừ Ngày sinh phải >= 18 năm.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D6"),
                  createTableCell("REQ-3.9"),
                  createTableCell("Mơ hồ / Không kiểm thử được\n(Ambiguous / Untestable)"),
                  createTableCell("Yêu cầu 'Giao diện trang đăng ký phải thân thiện với người dùng' là đánh giá chủ quan, không thể đo lường và nghiệm thu."),
                  createTableCell("Thay bằng tiêu chí đo lường Usability: Tuân thủ Design System ShopFU v1.0, hỗ trợ Responsive từ 375px trở lên, hiển thị lỗi inline ngay dưới ô nhập sai.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D7"),
                  createTableCell("REQ-3.2 vs REQ-3.10"),
                  createTableCell("Dư thừa / Trùng lặp\n(Redundant)"),
                  createTableCell("REQ-3.10 lặp lại nguyên văn quy định 'Email không được trùng với tài khoản đã có trong hệ thống' đã được nêu đầy đủ tại REQ-3.2."),
                  createTableCell("Xóa bỏ hoàn toàn REQ-3.10 khỏi tài liệu để tinh gọn và tránh dư thừa đặc tả.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D8"),
                  createTableCell("REQ-3.4 & REQ-3.5"),
                  createTableCell("Thiếu luồng ngoại lệ & Bảo mật\n(Missing Exception & Security)"),
                  createTableCell("Không đặc tả xử lý khi: Người dùng nhập sai OTP, nhập sai quá nhiều lần (tấn công brute-force), OTP hết hạn, hoặc không nhận được SMS."),
                  createTableCell("Bổ sung: Cho phép gửi lại OTP sau 60s; khóa tạm thời 15 phút nếu nhập sai OTP quá 5 lần liên tiếp; hiển thị thông báo lỗi rõ ràng khi OTP hết hạn.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D9"),
                  createTableCell("REQ-3.2"),
                  createTableCell("Thiếu quy chuẩn kỹ thuật\n(Incomplete Specification)"),
                  createTableCell("Ghi 'Email phải đúng định dạng' nhưng không nêu rõ theo chuẩn nào, độ dài tối đa là bao nhiêu và cách xử lý chữ hoa/thường, khoảng trắng thừa."),
                  createTableCell("Quy định: Email tuân thủ chuẩn RFC 5322 (tối đa 254 ký tự), hệ thống tự động trim khoảng trắng 2 đầu và chuyển về chữ thường trước khi kiểm tra trùng.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("D10"),
                  createTableCell("REQ-3.1"),
                  createTableCell("Thiếu quy định về Số điện thoại\n(Incomplete Specification)"),
                  createTableCell("Không quy định số điện thoại có được phép trùng không, định dạng đầu số quốc gia (Việt Nam +84 hay quốc tế), và độ dài bao nhiêu số."),
                  createTableCell("Quy định: Số điện thoại phải là số di động Việt Nam gồm đúng 10 chữ số (đầu số 03x, 05x, 07x, 08x, 09x) và mỗi số điện thoại chỉ gắn với 1 tài khoản duy nhất.")
                ]
              })
            ]
          }),

          heading2("Bản đặc tả yêu cầu (SRS) chuẩn hóa sau Review"),
          pText("Dưới đây là phiên bản SRS Mục 3 đã được khắc phục toàn bộ 10 lỗi trên, sẵn sàng để đội ngũ Lập trình và Kiểm thử sử dụng làm Test Basis chính thức:"),
          pBullet([
            { text: "REQ-3.1 (Thông tin thu thập): ", bold: true },
            { text: "Người dùng đăng ký tài khoản bắt buộc cung cấp: Họ và tên, Email, Số điện thoại, Ngày sinh (DD/MM/YYYY) và Mật khẩu." }
          ]),
          pBullet([
            { text: "REQ-3.2 (Định dạng Email): ", bold: true },
            { text: "Email phải tuân thủ định dạng chuẩn RFC 5322, độ dài tối đa 254 ký tự, hệ thống tự động loại bỏ khoảng trắng thừa và kiểm tra không được trùng với tài khoản đã kích hoạt trên hệ thống." }
          ]),
          pBullet([
            { text: "REQ-3.3 (Định dạng Số điện thoại): ", bold: true },
            { text: "Số điện thoại phải là thuê bao di động Việt Nam gồm đúng 10 chữ số, bắt đầu bằng các đầu số hợp lệ (03, 05, 07, 08, 09) và không được trùng với tài khoản đã có." }
          ]),
          pBullet([
            { text: "REQ-3.4 (Quy chuẩn Mật khẩu): ", bold: true },
            { text: "Mật khẩu có độ dài từ 8 đến 16 ký tự, bao gồm ít nhất: 1 chữ cái in hoa (A-Z), 1 chữ cái in thường (a-z), 1 chữ số (0-9) và 1 ký tự đặc biệt (!@#$%^&*)." }
          ]),
          pBullet([
            { text: "REQ-3.5 (Ràng buộc Độ tuổi): ", bold: true },
            { text: "Người dùng phải đủ từ 18 tuổi trở lên tính đến ngày đăng ký (tính theo Ngày sinh nhập vào so với ngày hiện tại của hệ thống)." }
          ]),
          pBullet([
            { text: "REQ-3.6 (Xác thực OTP & Kích hoạt): ", bold: true },
            { text: "Sau khi gửi thông tin hợp lệ, hệ thống tạo mã OTP gồm 6 chữ số ngẫu nhiên gửi qua SMS tới số điện thoại đăng ký. Mã OTP có hiệu lực đúng 180 giây (03 phút). Người dùng nhập chính xác OTP để kích hoạt tài khoản." }
          ]),
          pBullet([
            { text: "REQ-3.7 (Xử lý ngoại lệ OTP): ", bold: true },
            { text: "Nút 'Gửi lại mã OTP' chỉ được kích hoạt sau 60 giây đếm ngược. Nếu người dùng nhập sai OTP quá 5 lần liên tiếp, mã OTP hiện tại bị hủy và hệ thống tạm khóa chức năng đăng ký với số điện thoại này trong vòng 15 phút." }
          ]),
          pBullet([
            { text: "REQ-3.8 (Chỉ số chất lượng & Giao diện): ", bold: true },
            { text: "Hệ thống đáp ứng tỷ lệ đăng ký thành công >= 99.5% cho các yêu cầu hợp lệ trong điều kiện mạng bình thường. Giao diện trang đăng ký tuân thủ Design System ShopFU v1.0, hỗ trợ hiển thị tốt từ màn hình 375px và thông báo lỗi trực quan dưới từng trường nhập liệu sai." }
          ]),

          new Paragraph({ children: [new PageBreak()] }),

          // CHƯƠNG 4
          heading1("BÀI 4 — CODE REVIEW THEO CHECKLIST (MODULE GIỎ HÀNG & ĐƠN HÀNG)"),
          heading2("Bối cảnh và Business Rules đã được phê duyệt"),
          pText("Buổi Formal Inspection được thực hiện cho lớp Java OrderService phụ trách tính tiền giỏ hàng và hủy đơn hàng. Các quy tắc nghiệp vụ (Business Rules - BR) bắt buộc phải tuân thủ:"),
          pBullet([
            { text: "BR-01 (Công thức tính tổng tiền): ", bold: true },
            { text: "Tổng tiền hàng = Tổng (Giá sản phẩm x Số lượng) - Giá trị Coupon giảm giá. Tổng tiền hàng sau giảm giá KHÔNG ĐƯỢC ÂM (tối thiểu bằng 0)." }
          ]),
          pBullet([
            { text: "BR-02 (Chính sách phí vận chuyển): ", bold: true },
            { text: "Đơn hàng có tổng tiền từ 500.000đ trở lên (>= 500.000đ) được MIỄN PHÍ SHIP (0đ). Đơn hàng dưới 500.000đ áp dụng phí ship cố định 30.000đ." }
          ]),
          pBullet([
            { text: "BR-03 (Quy định hủy đơn hàng): ", bold: true },
            { text: "Chỉ cho phép hủy đơn hàng khi đơn hàng đang ở trạng thái PENDING. Các trạng thái khác (PROCESSING, SHIPPING, COMPLETED) không được phép hủy." }
          ]),

          heading2("Mã nguồn Java ban đầu của OrderService"),
          pText("Đoạn mã nguồn được bàn giao kiểm tra:"),
          pMulti([
            { text: " 1  public class OrderService {\n", italics: true },
            { text: " 2      private static final String DB_PASSWORD = \"Shopfu@2026\";\n", italics: true },
            { text: " 3\n", italics: true },
            { text: " 4      public double calculateTotal(List<Item> items, String couponCode) {\n", italics: true },
            { text: " 5          double total = 0;\n", italics: true },
            { text: " 6          for (int i = 0; i <= items.size(); i++) {\n", italics: true },
            { text: " 7              total += items.get(i).getPrice() * items.get(i).getQty();\n", italics: true },
            { text: " 8          }\n", italics: true },
            { text: " 9          if (couponCode != \"\") {\n", italics: true },
            { text: "10              Coupon c = couponRepo.findByCode(couponCode);\n", italics: true },
            { text: "11              total = total - c.getValue();\n", italics: true },
            { text: "12          }\n", italics: true },
            { text: "13          double shipFee = 30000;\n", italics: true },
            { text: "14          if (total > 500000);\n", italics: true },
            { text: "15              shipFee = 0;\n", italics: true },
            { text: "16          return total + shipFee;\n", italics: true },
            { text: "17      }\n", italics: true },
            { text: "18\n", italics: true },
            { text: "19      public void cancelOrder(String orderId) {\n", italics: true },
            { text: "20          try {\n", italics: true },
            { text: "21              String sql = \"UPDATE orders SET status='CANCELLED' WHERE id='\" + orderId + \"'\";\n", italics: true },
            { text: "22              db.execute(sql);\n", italics: true },
            { text: "23          } catch (Exception e) {\n", italics: true },
            { text: "24          }\n", italics: true },
            { text: "25      }\n", italics: true },
            { text: "26  }\n", italics: true }
          ]),

          heading2("Bảng phân tích chi tiết lỗi theo 8 mục Checklist (K1 – K8)"),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableCell("Dòng", { bold: true, header: true, width: 600 }),
                  createTableCell("Checklist", { bold: true, header: true, width: 1200 }),
                  createTableCell("Tên Defect & Đoạn code lỗi", { bold: true, header: true, width: 2200 }),
                  createTableCell("Hậu quả nghiêm trọng", { bold: true, header: true, width: 2800 }),
                  createTableCell("Giải pháp khắc phục chuẩn", { bold: true, header: true, width: 2800 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("2"),
                  createTableCell("K4"),
                  createTableCell("Hardcode DB Password:\nprivate static final String DB_PASSWORD = \"Shopfu@2026\";"),
                  createTableCell("Bất kỳ ai có quyền đọc mã nguồn (Git repo, file .class decompile) đều thấy mật khẩu DB. Nguy cơ bị chiếm đoạt toàn bộ database ShopFU."),
                  createTableCell("Xóa hằng số khỏi mã nguồn. Đọc thông tin kết nối từ Biến môi trường (Environment Variable) hoặc Secret Vault.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("6"),
                  createTableCell("K1"),
                  createTableCell("Lỗi Off-by-one trong vòng lặp:\nfor (int i = 0; i <= items.size(); i++)"),
                  createTableCell("Vòng lặp chạy tới i == size(), gọi items.get(size()) ném IndexOutOfBoundsException. Kết quả: MỌI đơn hàng đều sập hàm tính tiền."),
                  createTableCell("Sửa điều kiện thành: i < items.size() hoặc chuyển sang vòng lặp for-each an toàn: for (Item item : items).")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("4, 6"),
                  createTableCell("K2"),
                  createTableCell("Thiếu kiểm tra null/rỗng:\nitems.size() mà không kiểm tra items == null"),
                  createTableCell("Nếu client gọi hàm với items == null, phương thức lập tức ném NullPointerException làm crash ứng dụng."),
                  createTableCell("Bổ sung guard clause: if (items == null || items.isEmpty()) return 0;")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("9"),
                  createTableCell("K3"),
                  createTableCell("So sánh String bằng toán tử !=:\nif (couponCode != \"\")"),
                  createTableCell("Toán tử != so sánh tham chiếu ô nhớ. Chuỗi rỗng đối tượng mới vẫn khác \"\". Đặc biệt nếu couponCode == null thì couponCode != \"\" vẫn là TRUE, gây lỗi tiếp theo!"),
                  createTableCell("Sửa cách kiểm tra chuẩn: if (couponCode != null && !couponCode.trim().isEmpty())")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("10, 11"),
                  createTableCell("K2"),
                  createTableCell("Thiếu null check kết quả Coupon:\nc.getValue() khi findByCode trả về null"),
                  createTableCell("Nếu khách hàng nhập mã coupon không tồn tại, repository trả về null. Lệnh c.getValue() ném NullPointerException lập tức."),
                  createTableCell("Kiểm tra coupon hợp lệ: if (c != null) { ... } else { ném BusinessException(\"Mã giảm giá không hợp lệ\"); }")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("14, 15"),
                  createTableCell("K8"),
                  createTableCell("Cú pháp bẫy - Dấu chấm phẩy ';' thừa:\nif (total > 500000);\n    shipFee = 0;"),
                  createTableCell("Dấu ';' làm lệnh if kết thúc với thân rỗng. Câu lệnh shipFee = 0; luôn luôn được thực thi trong mọi trường hợp! TẤT CẢ đơn hàng đều được free ship (thất thoát doanh thu)."),
                  createTableCell("Xóa dấu ';' và luôn đặt thân lệnh trong cặp ngoặc nhọn: if (total >= 500000) { shipFee = 0; }")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("14"),
                  createTableCell("K7"),
                  createTableCell("Vi phạm Business Rule miễn phí ship:\nif (total > 500000) thay vì >="),
                  createTableCell("Đơn hàng đúng 500.000đ (giá trị biên) bị tính phí ship 30.000đ, vi phạm chính sách công bố 'Đơn từ 500.000đ trở lên được miễn phí ship'."),
                  createTableCell("Sửa toán tử so sánh thành >=: if (total >= 500000)")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("11"),
                  createTableCell("K7"),
                  createTableCell("Vi phạm Business Rule tổng tiền âm:\ntotal = total - c.getValue();"),
                  createTableCell("Nếu giá trị mã coupon lớn hơn tổng tiền hàng (ví dụ coupon giảm 100k cho đơn 80k), total sẽ bị âm (-20k), dẫn đến sai lệch thanh toán."),
                  createTableCell("Ràng buộc giá trị không âm: total = Math.max(0, total - c.getValue());")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("21"),
                  createTableCell("K5"),
                  createTableCell("Ghép chuỗi câu lệnh SQL:\nWHERE id='\" + orderId + \"'\""),
                  createTableCell("Lỗ hổng bảo mật nghiêm trọng SQL Injection. Kẻ tấn công có thể chèn orderId = \"1' OR '1'='1\" để hủy sạch mọi đơn hàng trên hệ thống."),
                  createTableCell("Sử dụng PreparedStatement có tham số ràng buộc '?': UPDATE orders SET status = 'CANCELLED' WHERE id = ?")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("23, 24"),
                  createTableCell("K6"),
                  createTableCell("Nuốt ngoại lệ - Empty Catch Block:\ncatch (Exception e) { }"),
                  createTableCell("Khi hủy đơn thất bại (mất kết nối DB, lỗi cú pháp), hệ thống im lặng bỏ qua. Khách tưởng đã hủy nhưng đơn vẫn còn, không có log để điều tra sự cố."),
                  createTableCell("Ghi log lỗi: logger.error(\"Lỗi hủy đơn: \" + orderId, e); và ném ngoại lệ nghiệp vụ ra ngoài để thông báo lỗi cho người dùng.")
                ]
              })
            ]
          }),

          heading2("Phân tích các lỗi nghiêm trọng NẰM NGOÀI CHECKLIST"),
          pText("Bên cạnh các mục trong checklist, quá trình Inspection phát hiện thêm 4 lỗi kiến trúc và nghiệp vụ cực kỳ nghiêm trọng:"),
          pBullet([
            { text: "Lỗi ngoài checklist 1 — Dùng kiểu số thực 'double' cho tiền tệ: ", bold: true },
            { text: "Kiểu dữ liệu double (IEEE 754 floating-point) không thể biểu diễn chính xác các số thập phân hữu hạn trong hệ nhị phân, gây sai số làm tròn số học (ví dụ: 0.1 + 0.2 = 0.30000000000000004). Trong ứng dụng tài chính/e-commerce, điều này dẫn đến lệch tiền quyết toán và sai lệch điều kiện biên miễn phí ship. Giải pháp: Bắt buộc sử dụng BigDecimal hoặc long (đơn vị đồng)." }
          ]),
          pBullet([
            { text: "Lỗi ngoài checklist 2 — Vi phạm Business Rule 3 (Không kiểm tra trạng thái PENDING trước khi hủy): ", bold: true },
            { text: "Quy tắc nghiệp vụ số 3 nêu rõ: 'Chỉ được hủy đơn ở trạng thái PENDING'. Trong mã nguồn, câu lệnh SQL UPDATE cập nhật trạng thái CANCELLED bất chấp đơn hàng đang ở trạng thái nào (kể cả SHIPPING hay COMPLETED). Điều này làm rối loạn quy trình giao vận và kho bãi. Giải pháp: Bổ sung điều kiện vào câu SQL: WHERE id = ? AND status = 'PENDING'." }
          ]),
          pBullet([
            { text: "Lỗi ngoài checklist 3 — Hàm cancelOrder trả về void và không kiểm tra số bản ghi bị ảnh hưởng: ", bold: true },
            { text: "Hàm cancelOrder kiểu void không kiểm tra xem câu lệnh UPDATE có thực sự cập nhật dòng nào trong database hay không (nếu orderId không tồn tại hoặc đơn không ở trạng thái PENDING). Người dùng nhận được phản hồi thành công dù thực tế đơn không bị hủy. Giải pháp: Trả về boolean hoặc ném ngoại lệ nếu executeUpdate() trả về 0." }
          ]),
          pBullet([
            { text: "Lỗi ngoài checklist 4 — Thiếu Transaction Management và Injection: ", bold: true },
            { text: "Các biến couponRepo và db không có khai báo kiểu dữ liệu, không có cơ chế Dependency Injection. Hơn nữa, việc hủy đơn hàng phải đi kèm hoàn kho hoặc hoàn tiền, cần được bao bọc trong một Database Transaction (@Transactional) để đảm bảo tính toàn vẹn dữ liệu (ACID)." }
          ]),

          heading2("Mã nguồn Java sau khi Refactor toàn diện (Clean & Secure Code)"),
          pText("Dưới đây là phiên bản mã nguồn Java của OrderService sau khi đã được khắc phục toàn bộ các lỗi trong checklist và ngoài checklist:"),
          pMulti([
            { text: "package com.shopfu.service;\n\n", italics: true },
            { text: "import java.math.BigDecimal;\n", italics: true },
            { text: "import java.sql.Connection;\n", italics: true },
            { text: "import java.sql.PreparedStatement;\n", italics: true },
            { text: "import java.sql.SQLException;\n", italics: true },
            { text: "import java.util.List;\n", italics: true },
            { text: "import org.slf4j.Logger;\n", italics: true },
            { text: "import org.slf4j.LoggerFactory;\n\n", italics: true },
            { text: "public class OrderService {\n", italics: true },
            { text: "    private static final Logger log = LoggerFactory.getLogger(OrderService.class);\n", italics: true },
            { text: "    private static final BigDecimal FREE_SHIP_THRESHOLD = new BigDecimal(\"500000\");\n", italics: true },
            { text: "    private static final BigDecimal DEFAULT_SHIP_FEE = new BigDecimal(\"30000\");\n\n", italics: true },
            { text: "    private final CouponRepository couponRepo;\n", italics: true },
            { text: "    private final DatabaseConnectionManager dbManager;\n\n", italics: true },
            { text: "    public OrderService(CouponRepository couponRepo, DatabaseConnectionManager dbManager) {\n", italics: true },
            { text: "        this.couponRepo = couponRepo;\n", italics: true },
            { text: "        this.dbManager = dbManager;\n", italics: true },
            { text: "    }\n\n", italics: true },
            { text: "    /**\n", italics: true },
            { text: "     * Tinh tong tien don hang theo dung Business Rule BR-01 va BR-02\n", italics: true },
            { text: "     */\n", italics: true },
            { text: "    public BigDecimal calculateTotal(List<Item> items, String couponCode) {\n", italics: true },
            { text: "        if (items == null || items.isEmpty()) {\n", italics: true },
            { text: "            return BigDecimal.ZERO;\n", italics: true },
            { text: "        }\n\n", italics: true },
            { text: "        // 1. Tinh tong tien san pham (dung for-each tranh off-by-one)\n", italics: true },
            { text: "        BigDecimal subTotal = BigDecimal.ZERO;\n", italics: true },
            { text: "        for (Item item : items) {\n", italics: true },
            { text: "            if (item != null && item.getPrice() != null && item.getQty() > 0) {\n", italics: true },
            { text: "                BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQty()));\n", italics: true },
            { text: "                subTotal = subTotal.add(itemTotal);\n", italics: true },
            { text: "            }\n", italics: true },
            { text: "        }\n\n", italics: true },
            { text: "        // 2. Ap dung Coupon neu co\n", italics: true },
            { text: "        if (couponCode != null && !couponCode.trim().isEmpty()) {\n", italics: true },
            { text: "            Coupon coupon = couponRepo.findByCode(couponCode.trim());\n", italics: true },
            { text: "            if (coupon != null && coupon.isValid()) {\n", italics: true },
            { text: "                subTotal = subTotal.subtract(coupon.getValue());\n", italics: true },
            { text: "                // BR-01: Tong tien hang khong duoc am\n", italics: true },
            { text: "                if (subTotal.compareTo(BigDecimal.ZERO) < 0) {\n", italics: true },
            { text: "                    subTotal = BigDecimal.ZERO;\n", italics: true },
            { text: "                }\n", italics: true },
            { text: "            } else {\n", italics: true },
            { text: "                log.warn(\"Coupon code khong hop le hoac het han: {}\", couponCode);\n", italics: true },
            { text: "            }\n", italics: true },
            { text: "        }\n\n", italics: true },
            { text: "        // 3. Tinh phi van chuyen (BR-02: >= 500k duoc free ship)\n", italics: true },
            { text: "        BigDecimal shipFee = DEFAULT_SHIP_FEE;\n", italics: true },
            { text: "        if (subTotal.compareTo(FREE_SHIP_THRESHOLD) >= 0) {\n", italics: true },
            { text: "            shipFee = BigDecimal.ZERO;\n", italics: true },
            { text: "        }\n\n", italics: true },
            { text: "        return subTotal.add(shipFee);\n", italics: true },
            { text: "    }\n\n", italics: true },
            { text: "    /**\n", italics: true },
            { text: "     * Huy don hang an toan theo dung Business Rule BR-03 va phong chong SQL Injection\n", italics: true },
            { text: "     */\n", italics: true },
            { text: "    public boolean cancelOrder(String orderId) {\n", italics: true },
            { text: "        if (orderId == null || orderId.trim().isEmpty()) {\n", italics: true },
            { text: "            throw new IllegalArgumentException(\"OrderId khong duoc de trong\");\n", italics: true },
            { text: "        }\n\n", italics: true },
            { text: "        // BR-03: Chi duoc huy don o trang thai PENDING; Dung PreparedStatement chong SQL Injection\n", italics: true },
            { text: "        String sql = \"UPDATE orders SET status = 'CANCELLED' WHERE id = ? AND status = 'PENDING'\";\n\n", italics: true },
            { text: "        try (Connection conn = dbManager.getConnection();\n", italics: true },
            { text: "             PreparedStatement ps = conn.prepareStatement(sql)) {\n", italics: true },
            { text: "            ps.setString(1, orderId.trim());\n", italics: true },
            { text: "            int affectedRows = ps.executeUpdate();\n", italics: true },
            { text: "            if (affectedRows > 0) {\n", italics: true },
            { text: "                log.info(\"Huy thanh cong don hang ID: {}\", orderId);\n", italics: true },
            { text: "                return true;\n", italics: true },
            { text: "            } else {\n", italics: true },
            { text: "                log.warn(\"Khong the huy don hang ID: {} (Don khong ton tai hoac khong o trang thai PENDING)\", orderId);\n", italics: true },
            { text: "                return false;\n", italics: true },
            { text: "            }\n", italics: true },
            { text: "        } catch (SQLException e) {\n", italics: true },
            { text: "            log.error(\"Loi he thong khi thuc hien huy don hang ID: \" + orderId, e);\n", italics: true },
            { text: "            throw new RuntimeException(\"Loi co so du lieu khi huy don hang\", e);\n", italics: true },
            { text: "        }\n", italics: true },
            { text: "    }\n", italics: true },
            { text: "}\n", italics: true }
          ]),

          new Paragraph({ children: [new PageBreak()] }),

          // CHƯƠNG 5
          heading1("KẾT LUẬN VÀ BÀI HỌC KINH NGHIỆM"),
          heading2("Tổng kết kết quả bài tập"),
          pText("Qua quá trình thực hiện chuyên đề Chapter 3 — Static Testing trên dự án ShopFU, chúng ta đã đạt được các kết quả nổi bật:"),
          pBullet([
            { text: "Bài 1: ", bold: true },
            { text: "Phân tích và phân loại chính xác toàn bộ 12 tình huống thực tế, làm rõ sự khác biệt giữa Static Testing (tìm Defect tĩnh trong sản phẩm làm việc) và Dynamic Testing (quan sát Failure động khi chạy). Khẳng định nguyên tắc Shift-Left Testing giúp ngăn ngừa lỗi từ trong trứng nước." }
          ]),
          pBullet([
            { text: "Bài 2: ", bold: true },
            { text: "Tiến hành Technical Review tài liệu đặc tả yêu cầu (SRS) chức năng Đăng ký tài khoản, chỉ ra 10 lỗi nghiêm trọng thuộc 6 nhóm khuyết tật yêu cầu (Mâu thuẫn, Mơ hồ, Thiếu, Không kiểm thử được, Phi thực tế, Dư thừa). Từ đó xây dựng thành công bản SRS chuẩn hóa hoàn chỉnh." }
          ]),
          pBullet([
            { text: "Bài 4: ", bold: true },
            { text: "Thực hiện Code Inspection theo checklist K1-K8 trên lớp OrderService, phát hiện 10 lỗi kỹ thuật và phát hiện thêm 4 lỗi mở rộng cực kỳ nguy hiểm (sai số kiểu double, vi phạm BR-03 trạng thái PENDING, thiếu check affected rows, thiếu Transaction). Đồng thời refactor lại toàn bộ code đạt chuẩn chất lượng cao của doanh nghiệp." }
          ]),

          heading2("Đề xuất quy trình Static Testing áp dụng cho dự án"),
          pText("Để đảm bảo chất lượng phần mềm ngay từ giai đoạn đầu, các dự án công nghệ nên áp dụng quy trình kiểm thử tĩnh 3 tầng:"),
          pBullet([
            { text: "Tầng 1 — Requirement & Design Review: ", bold: true },
            { text: "Bắt buộc tổ chức các buổi Review tài liệu SRS và Architecture Design với sự tham gia của Tester trước khi tiến hành viết code." }
          ]),
          pBullet([
            { text: "Tầng 2 — Automated Static Analysis (CI/CD Pipeline): ", bold: true },
            { text: "Tích hợp các công cụ tự động (SonarQube, Checkstyle, ESLint, Trivy/Snyk) vào quy trình commit code để tự động chặn các đoạn mã vi phạm convention, dead code hoặc chứa lỗ hổng bảo mật SAST." }
          ]),
          pBullet([
            { text: "Tầng 3 — Peer Code Review theo Checklist: ", bold: true },
            { text: "Áp dụng văn hóa Code Review bắt buộc trước khi merge Pull Request (ít nhất 1 Senior Developer duyệt qua) dựa trên checklist chuẩn đã được chuẩn hóa của tổ chức." }
          ])
        ]
      }
    ]
  });

  return doc;
}

async function run() {
  console.log("Generating Word document with native Multilevel Automatic Numbering...");
  const doc = buildDocument();
  const outputPath = path.resolve("H:/SEM5/SWT/codenop/Chapter3/BaoCao_Chapter3_Static_Testing.docx");
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated successfully at: " + outputPath);
}

run().catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});

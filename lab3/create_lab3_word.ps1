# PowerShell script to create BaoCao_ThucHanh_Lab3.docx
[CmdletBinding()]
param()

$outputPath = "h:\SEM5\SWT\codenop\lab3\BaoCao_ThucHanh_Lab3.docx"

# Initialize Word COM Object
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

try {
    # Page Setup (A4, standard margins: Top 2cm, Bottom 2cm, Left 3cm, Right 2cm)
    $doc.PageSetup.PaperSize = 7 # wdPaperA4
    $doc.PageSetup.TopMargin = 56.7    # 2.0 cm
    $doc.PageSetup.BottomMargin = 56.7 # 2.0 cm
    $doc.PageSetup.LeftMargin = 85.05  # 3.0 cm
    $doc.PageSetup.RightMargin = 56.7  # 2.0 cm

    # Configure Styles for 100% black and white, uniform font Times New Roman
    $normalStyle = $doc.Styles.Item(-1) # wdStyleNormal
    $normalStyle.Font.Name = "Times New Roman"
    $normalStyle.Font.Size = 13
    $normalStyle.Font.Color = 0 # Black
    $normalStyle.ParagraphFormat.LineSpacingRule = 0 # wdLineSpaceSingle
    $normalStyle.ParagraphFormat.LineSpacing = 15.6  # 1.2 lines
    $normalStyle.ParagraphFormat.SpaceBefore = 0
    $normalStyle.ParagraphFormat.SpaceAfter = 4
    $normalStyle.ParagraphFormat.Alignment = 3 # wdAlignParagraphJustify

    $h1Style = $doc.Styles.Item(-2) # wdStyleHeading1
    $h1Style.Font.Name = "Times New Roman"
    $h1Style.Font.Size = 14
    $h1Style.Font.Bold = $true
    $h1Style.Font.Color = 0 # Black
    $h1Style.ParagraphFormat.SpaceBefore = 12
    $h1Style.ParagraphFormat.SpaceAfter = 6
    $h1Style.ParagraphFormat.KeepWithNext = $true
    $h1Style.ParagraphFormat.Alignment = 0 # wdAlignParagraphLeft

    $h2Style = $doc.Styles.Item(-3) # wdStyleHeading2
    $h2Style.Font.Name = "Times New Roman"
    $h2Style.Font.Size = 13
    $h2Style.Font.Bold = $true
    $h2Style.Font.Color = 0 # Black
    $h2Style.ParagraphFormat.SpaceBefore = 8
    $h2Style.ParagraphFormat.SpaceAfter = 4
    $h2Style.ParagraphFormat.KeepWithNext = $true
    $h2Style.ParagraphFormat.Alignment = 0

    $h3Style = $doc.Styles.Item(-4) # wdStyleHeading3
    $h3Style.Font.Name = "Times New Roman"
    $h3Style.Font.Size = 13
    $h3Style.Font.Bold = $true
    $h3Style.Font.Italic = $true
    $h3Style.Font.Color = 0 # Black
    $h3Style.ParagraphFormat.SpaceBefore = 6
    $h3Style.ParagraphFormat.SpaceAfter = 2
    $h3Style.ParagraphFormat.KeepWithNext = $true
    $h3Style.ParagraphFormat.Alignment = 0

    $selection = $word.Selection

    # -------------------------------------------------------------
    # 1. COVER PAGE / HEADER
    # -------------------------------------------------------------
    $p = $doc.Paragraphs.Add()
    $p.Range.Text = "TRƯỜNG ĐẠI HỌC FPT"
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 13
    $p.Range.Font.Bold = $true
    $p.Range.Font.Color = 0
    $p.Range.ParagraphFormat.Alignment = 1 # Center
    $p.Range.ParagraphFormat.SpaceAfter = 2
    $p.Range.InsertParagraphAfter()

    $p = $doc.Paragraphs.Add()
    $p.Range.Text = "KHOA CÔNG NGHỆ THÔNG TIN - BỘ MÔN KỸ THUẬT PHẦN MỀM"
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 12
    $p.Range.Font.Bold = $true
    $p.Range.Font.Color = 0
    $p.Range.ParagraphFormat.Alignment = 1
    $p.Range.ParagraphFormat.SpaceAfter = 36
    $p.Range.InsertParagraphAfter()

    $p = $doc.Paragraphs.Add()
    $p.Range.Text = "BÁO CÁO THỰC HÀNH KIỂM THỬ PHẦN MỀM"
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 16
    $p.Range.Font.Bold = $true
    $p.Range.Font.Color = 0
    $p.Range.ParagraphFormat.Alignment = 1
    $p.Range.ParagraphFormat.SpaceAfter = 6
    $p.Range.InsertParagraphAfter()

    $p = $doc.Paragraphs.Add()
    $p.Range.Text = "BÀI TẬP THỰC HÀNH LAB 3"
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 14
    $p.Range.Font.Bold = $true
    $p.Range.Font.Color = 0
    $p.Range.ParagraphFormat.Alignment = 1
    $p.Range.ParagraphFormat.SpaceAfter = 18
    $p.Range.InsertParagraphAfter()

    $p = $doc.Paragraphs.Add()
    $p.Range.Text = "CHỦ ĐỀ: QUẢN LÝ VÀ BÁO CÁO LỖI (DEFECT REPORTING & LIFECYCLE)`nHỆ THỐNG ÁP DỤNG: CINEMAFU — BÁN VÉ XEM PHIM TRỰC TUYẾN"
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 13
    $p.Range.Font.Bold = $true
    $p.Range.Font.Color = 0
    $p.Range.ParagraphFormat.Alignment = 1
    $p.Range.ParagraphFormat.SpaceAfter = 60
    $p.Range.InsertParagraphAfter()

    # Information block
    $p = $doc.Paragraphs.Add()
    $p.Range.Text = "Sinh viên thực hiện: Nguyễn Văn A`nMã số sinh viên: SE123456`nLớp: SE1701`nMôn học: Kiểm thử phần mềm (SWT301)`nNgày hoàn thành: 13/10/2026"
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 12
    $p.Range.Font.Bold = $false
    $p.Range.Font.Color = 0
    $p.Range.ParagraphFormat.Alignment = 0 # Left
    $p.Range.ParagraphFormat.LeftIndent = 120 # Indent for clean cover layout
    $p.Range.ParagraphFormat.SpaceAfter = 40
    $p.Range.InsertParagraphAfter()

    # Page break after Cover
    $selection.EndKey(6) # wdStory
    $selection.InsertBreak(7) # wdPageBreak

    # -------------------------------------------------------------
    # 2. AUTOMATIC TABLE OF CONTENTS (MỤC LỤC TỰ ĐỘNG)
    # -------------------------------------------------------------
    $p = $doc.Paragraphs.Add()
    $p.Range.Text = "MỤC LỤC"
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 14
    $p.Range.Font.Bold = $true
    $p.Range.Font.Color = 0
    $p.Range.ParagraphFormat.Alignment = 1
    $p.Range.ParagraphFormat.SpaceAfter = 12
    $p.Range.InsertParagraphAfter()

    # Insert Table of Contents with Hyperlinks enabled (\h switch)
    $selection.EndKey(6)
    $tocRange = $selection.Range
    $toc = $doc.TablesOfContents.Add($tocRange, $true, 1, 3, [Type]::Missing, [Type]::Missing, $true, $true, [Type]::Missing, $true)
    $toc.UseHyperlinks = $true
    $selection.EndKey(6)
    $selection.InsertBreak(7) # Page break after TOC

    # Helper function to add Paragraphs
    function Append-Para($text, [switch]$Bold, [switch]$Italic, $align=3, $indent=0) {
        $p = $doc.Paragraphs.Add()
        $p.Range.Text = $text
        $p.Range.Font.Name = "Times New Roman"
        $p.Range.Font.Size = 13
        $p.Range.Font.Bold = $Bold.IsPresent
        $p.Range.Font.Italic = $Italic.IsPresent
        $p.Range.Font.Color = 0
        $p.Range.ParagraphFormat.Alignment = $align
        $p.Range.ParagraphFormat.LeftIndent = $indent
        $p.Range.ParagraphFormat.SpaceBefore = 0
        $p.Range.ParagraphFormat.SpaceAfter = 4
        $p.Range.ParagraphFormat.LineSpacing = 15.6
        $p.Range.InsertParagraphAfter()
    }

    function Append-H1($text) {
        $p = $doc.Paragraphs.Add()
        $p.Range.Text = $text
        $p.Range.Style = $h1Style
        $p.Range.Font.Name = "Times New Roman"
        $p.Range.Font.Size = 14
        $p.Range.Font.Bold = $true
        $p.Range.Font.Color = 0
        $p.Range.ParagraphFormat.SpaceBefore = 12
        $p.Range.ParagraphFormat.SpaceAfter = 6
        $p.Range.InsertParagraphAfter()
    }

    function Append-H2($text) {
        $p = $doc.Paragraphs.Add()
        $p.Range.Text = $text
        $p.Range.Style = $h2Style
        $p.Range.Font.Name = "Times New Roman"
        $p.Range.Font.Size = 13
        $p.Range.Font.Bold = $true
        $p.Range.Font.Color = 0
        $p.Range.ParagraphFormat.SpaceBefore = 8
        $p.Range.ParagraphFormat.SpaceAfter = 4
        $p.Range.InsertParagraphAfter()
    }

    function Append-H3($text) {
        $p = $doc.Paragraphs.Add()
        $p.Range.Text = $text
        $p.Range.Style = $h3Style
        $p.Range.Font.Name = "Times New Roman"
        $p.Range.Font.Size = 13
        $p.Range.Font.Bold = $true
        $p.Range.Font.Italic = $true
        $p.Range.Font.Color = 0
        $p.Range.ParagraphFormat.SpaceBefore = 6
        $p.Range.ParagraphFormat.SpaceAfter = 2
        $p.Range.InsertParagraphAfter()
    }

    function Append-DefectTable($rowsData) {
        $selection.EndKey(6)
        $tableRange = $selection.Range
        $table = $doc.Tables.Add($tableRange, $rowsData.Count, 2)
        $table.Borders.Enable = 1
        $table.Borders.OutsideLineStyle = 1
        $table.Borders.OutsideLineWidth = 4 # 0.5 pt
        $table.Borders.OutsideColor = 0
        $table.Borders.InsideLineStyle = 1
        $table.Borders.InsideLineWidth = 4
        $table.Borders.InsideColor = 0
        
        # Set widths: col1 = 3.8 cm (107.7 pt), col2 = 12.2 cm (345.8 pt)
        $table.Columns.Item(1).Width = 107.7
        $table.Columns.Item(2).Width = 345.8
        
        $rowIndex = 1
        foreach ($item in $rowsData) {
            $c1 = $table.Cell($rowIndex, 1).Range
            $c1.Text = $item[0]
            $c1.Font.Name = "Times New Roman"
            $c1.Font.Size = 12
            $c1.Font.Bold = $true
            $c1.Font.Color = 0
            $c1.ParagraphFormat.SpaceBefore = 2
            $c1.ParagraphFormat.SpaceAfter = 2
            $c1.ParagraphFormat.LineSpacingRule = 0
            $c1.ParagraphFormat.Alignment = 0

            $c2 = $table.Cell($rowIndex, 2).Range
            $c2.Text = $item[1]
            $c2.Font.Name = "Times New Roman"
            $c2.Font.Size = 12
            $c2.Font.Bold = $false
            $c2.Font.Color = 0
            $c2.ParagraphFormat.SpaceBefore = 2
            $c2.ParagraphFormat.SpaceAfter = 2
            $c2.ParagraphFormat.LineSpacingRule = 0
            $c2.ParagraphFormat.Alignment = 3 # Justify

            $rowIndex++
        }
        $selection.EndKey(6)
        $selection.TypeParagraph()
    }

    # -------------------------------------------------------------
    # NỘI DUNG YÊU CẦU 1
    # -------------------------------------------------------------
    Append-H1 "1. Yêu cầu 1: Viết lại mô tả lỗi kém thành Defect Report hoàn chỉnh"

    Append-H2 "1.1. Phân tích ngữ cảnh và các điểm thiếu sót của mô tả ban đầu"
    Append-Para "Trong quá trình kiểm thử phần mềm, việc báo cáo lỗi rõ ràng, chính xác và khách quan đóng vai trò quyết định giúp đội ngũ phát triển nhanh chóng cô lập và khắc phục sự cố. Một tester mới đã gửi báo cáo lỗi ban đầu như sau:"
    Append-Para "Tiêu đề: Lỗi chọn ghế" -Bold -indent 20
    Append-Para "Mô tả: Đặt ghế đôi bị sao đó, tiền tính sai. Sửa gấp!!!" -Italic -indent 20
    Append-Para "Báo cáo trên mắc các sai phạm và thiếu sót nghiêm trọng theo chuẩn ISTQB:"
    Append-Para "1. Tiêu đề chung chung, mơ hồ: 'Lỗi chọn ghế' không cho biết lỗi xảy ra ở kịch bản nào, màn hình nào và triệu chứng cụ thể là gì." -indent 20
    Append-Para "2. Thiếu cấu hình phiên bản và môi trường: Không ghi nhận phiên bản kiểm thử (build), hệ điều hành, trình duyệt hoặc môi trường (Staging/Production)." -indent 20
    Append-Para "3. Thiếu tiền điều kiện và dữ liệu kiểm thử: Không có tài khoản đăng nhập thử nghiệm, tên phim, mã rạp, suất chiếu hoặc vị trí ghế cụ thể." -indent 20
    Append-Para "4. Thiếu các bước tái hiện (Steps to reproduce): Đội ngũ lập trình viên không thể biết người kiểm thử đã thao tác những gì để lỗi xảy ra." -indent 20
    Append-Para "5. Không phân biệt kết quả mong đợi và kết quả thực tế: Chỉ mô tả cảm tính 'tiền tính sai' mà không chỉ ra công thức đúng phải là bao nhiêu và hệ thống đang trả về bao nhiêu." -indent 20
    Append-Para "6. Ngôn từ thiếu tính chuyên nghiệp: Câu từ mang tính thúc ép và cảm tính cá nhân ('bị sao đó', 'Sửa gấp!!!'), vi phạm nguyên tắc tâm lý học trong kiểm thử (Psychology of Testing)." -indent 20

    Append-H2 "1.2. Defect Report hoàn chỉnh (CNM-101)"
    Append-Para "Dưới đây là báo cáo lỗi đã được chuẩn hóa đầy đủ theo biểu mẫu tiêu chuẩn, bổ sung dữ liệu kiểm thử thực tế cho hệ thống CinemaFU:"

    $cnm101 = @(
        @("ID", "CNM-101"),
        @("Title/Summary", "Đơn giá ghế đôi (Couple) bị nhân đôi khi khách hàng chọn 1 ghế đôi tại sơ đồ rạp"),
        @("Reporter / Ngày báo cáo", "Nguyễn Văn A / 13/10/2026"),
        @("Test object & version", "CinemaFU Web — Module Booking / Seat Selection, build v1.0.0-build210"),
        @("Environment", "Staging; Windows 11 Pro 64-bit; Google Chrome 130.0.6723.70; DB PostgreSQL 16 Snapshot 2026-10-12"),
        @("Reference", "TC-SEAT-042; User story US-24 'Đặt vé ghế đôi phòng chiếu 2D'; REQ-BOOK-015 v1.1"),
        @("Preconditions", "1. Tài khoản khách hàng customer01@cinemafu.vn đã đăng nhập thành công.`n2. Suất chiếu phim 'Dune: Part Two' lúc 19:30 ngày 15/10/2026 tại Rạp 1 còn trống ghế đôi tại vị trí F01-F02.`n3. Theo REQ-BOOK-015, đơn giá niêm yết cho 1 ghế đôi trọn gói là 220.000 VNĐ."),
        @("Steps to reproduce", "1. Truy cập trang chủ CinemaFU và đăng nhập bằng tài khoản thử nghiệm.`n2. Chọn phim 'Dune: Part Two', chọn rạp CinemaFU Hà Nội, suất chiếu 19:30 ngày 15/10/2026.`n3. Tại màn hình sơ đồ ghế, nhấp chuột chọn 1 ghế đôi tại vị trí F01-F02 (hàng F).`n4. Quan sát bảng tóm tắt 'Thông tin đặt vé' và mục 'Tổng tiền vé' ở cột bên phải."),
        @("Expected result", "Theo REQ-BOOK-015, ghế đôi là sản phẩm đơn vị trọn gói dành cho 2 người với giá cố định. Hệ thống phải hiển thị:`n- Số lượng: 1 ghế đôi (F01-F02).`n- Đơn giá: 220.000 VNĐ.`n- Tổng tiền vé: 220.000 VNĐ."),
        @("Actual result", "Hệ thống ghi nhận thành 2 ghế với đơn giá của ghế đôi:`n- Số lượng hiển thị: 2 ghế đôi.`n- Tổng tiền vé hiển thị: 440.000 VNĐ (tương đương 220.000 VNĐ x 2)."),
        @("Evidence", "CNM-101_seat_selection_error.png, CNM-101_payload_seat_calculation.json"),
        @("Severity", "High (Major)`nGiải thích: Lỗi tính toán sai giá trị đơn hàng, làm tăng gấp đôi giá vé thực tế, ảnh hưởng trực tiếp đến trải nghiệm người dùng và ngăn cản quyết định mua hàng."),
        @("Priority", "High`nGiải thích: Module chọn ghế và tính tiền là chức năng cốt lõi (core feature) của luồng đặt vé, cần được xử lý dứt điểm ngay trong sprint hiện tại."),
        @("Status", "New"),
        @("Reproducibility", "5/5 lần (100%)"),
        @("Ghi chú / Root cause", "Ghế đôi bao gồm 2 vị trí vật lý (F01 và F02). Hệ thống đang lấy số lượng vị trí vật lý (2) nhân với đơn giá ghế đôi thay vì kiểm tra mã thuộc tính loại ghế (SeatType = 'COUPLE') để gán giá trọn gói.")
    )
    Append-DefectTable $cnm101

    # -------------------------------------------------------------
    # NỘI DUNG YÊU CẦU 2
    # -------------------------------------------------------------
    Append-H1 "2. Yêu cầu 2: Viết Defect Report cho 5 kịch bản theo ma trận Severity và Priority"
    Append-Para "Trong kiểm thử phần mềm, Severity (Mức độ nghiêm trọng) thể hiện tác động kỹ thuật của lỗi tới hệ thống và do Tester đánh giá. Ngược lại, Priority (Mức độ ưu tiên) thể hiện tính cấp bách cần sửa chữa đối với nghiệp vụ/kinh doanh và do Product Owner/Project Manager quyết định. Dưới đây là 5 Defect Report hoàn chỉnh tương ứng với các trường hợp điển hình:"

    # 2.1 Kịch bản 1
    Append-H2 "2.1. Kịch bản 1: Thanh toán ví điện tử không đủ tiền nhưng vẫn xuất vé (Severity Cao - Priority Cao)"
    Append-Para "Báo cáo lỗi mã CNM-201:"
    $cnm201 = @(
        @("ID", "CNM-201"),
        @("Title/Summary", "Hệ thống tự động xác nhận thanh toán thành công và xuất vé điện tử khi số dư Ví điện tử không đủ"),
        @("Reporter / Ngày báo cáo", "Trần Thị B / 13/10/2026"),
        @("Test object & version", "CinemaFU Web & Backend Checkout Service, build v1.0.0-build210"),
        @("Environment", "Staging; Windows 11; Google Chrome 130; Cổng thanh toán Sandbox Ví điện tử MoMo/ZaloPay; DB PostgreSQL 16"),
        @("Reference", "TC-PAY-088; User story US-55 'Thanh toán qua ví điện tử'; REQ-PAY-030 v2.0"),
        @("Preconditions", "1. Tài khoản khách hàng liên kết ví điện tử thử nghiệm có số dư hiện tại là 50.000 VNĐ.`n2. Đơn đặt vé hiện tại có tổng giá trị thanh toán là 180.000 VNĐ."),
        @("Steps to reproduce", "1. Thực hiện quy trình chọn phim, suất chiếu và ghế ngồi để tạo đơn hàng có giá trị 180.000 VNĐ.`n2. Tại màn hình Thanh toán, chọn phương thức 'Ví điện tử MoMo'.`n3. Nhấn 'Thanh toán ngay', quét mã QR hoặc ủy quyền giao dịch với ví thử nghiệm (số dư 50.000 VNĐ).`n4. Cổng thanh toán trả về mã lỗi giao dịch: INSUFFICIENT_FUNDS (Số dư không đủ).`n5. Quan sát phản hồi trên giao diện hệ thống CinemaFU."),
        @("Expected result", "Hệ thống phải nhận mã lỗi từ cổng thanh toán, hiển thị thông báo 'Giao dịch không thành công: Số dư ví không đủ', không tạo mã vé và cho phép khách hàng chọn phương thức thanh toán khác hoặc hủy đơn."),
        @("Actual result", "Hệ thống bỏ qua mã lỗi phản hồi, điều hướng người dùng đến trang 'Thanh toán thành công', tạo mã vé điện tử QR hợp lệ, gửi email xác nhận và đổi trạng thái ghế sang 'Đã bán' mà không thực hiện trừ tiền trong ví."),
        @("Evidence", "CNM-201_payment_bypass_success.png, CNM-201_gateway_callback_log.txt"),
        @("Severity", "Critical`nGiải thích: Lỗ hổng kỹ thuật cực kỳ nghiêm trọng gây thất thoát doanh thu trực tiếp cho doanh nghiệp; khách hàng có thể sở hữu vé xem phim miễn phí mà rạp không nhận được tiền."),
        @("Priority", "High (Immediate)`nGiải thích: Lỗi đe dọa trực tiếp đến tính toàn vẹn tài chính và bảo mật giao dịch, bắt buộc phải chặn phát hành và sửa đổi khẩn cấp ngay lập tức."),
        @("Status", "New"),
        @("Reproducibility", "5/5 lần (100%)"),
        @("Ghi chú / Root cause", "Hàm xử lý callback (/api/v1/payment/callback) chỉ kiểm tra có nhận được response từ đối tác hay không mà không kiểm tra giá trị của trường trạng thái (status != 'SUCCESS'), dẫn đến tự động cập nhật đơn hàng thành PAID.")
    )
    Append-DefectTable $cnm201

    # 2.2 Kịch bản 2
    Append-H2 "2.2. Kịch bản 2: Treo hệ thống khi xuất báo cáo doanh thu trên 2 năm (Severity Cao - Priority Thấp)"
    Append-Para "Báo cáo lỗi mã CNM-202:"
    $cnm202 = @(
        @("ID", "CNM-202"),
        @("Title/Summary", "Trang quản trị bị treo và trả về lỗi 504 Gateway Timeout khi xuất báo cáo doanh thu theo rạp cho khoảng thời gian vượt quá 2 năm"),
        @("Reporter / Ngày báo cáo", "Lê Văn C / 13/10/2026"),
        @("Test object & version", "CinemaFU Admin Portal — Module Báo cáo & Thống kê, build v1.0.0-build210"),
        @("Environment", "Staging; Windows 11; Google Chrome 130; Server Node.js / PostgreSQL 16 (Cơ sở dữ liệu mẫu chứa dữ liệu 5 năm từ 2021-2026)"),
        @("Reference", "TC-REP-015; User story US-82 'Báo cáo doanh thu tài chính theo rạp'; REQ-REP-005 v1.0"),
        @("Preconditions", "1. Đăng nhập tài khoản Quản trị viên (Admin) có quyền trích xuất báo cáo tài chính.`n2. Hệ thống lưu trữ dữ liệu giao dịch bán vé thực tế từ tháng 01/2021 đến tháng 10/2026."),
        @("Steps to reproduce", "1. Truy cập CinemaFU Admin Portal, điều hướng đến menu 'Báo cáo doanh thu theo rạp'.`n2. Tại bộ lọc chi nhánh rạp, chọn 'Tất cả các rạp'.`n3. Tại bộ lọc thời gian, chọn từ ngày '01/01/2022' đến ngày '31/12/2025' (khoảng thời gian 4 năm, vượt mức 2 năm).`n4. Nhấn nút 'Xuất file Excel'.`n5. Quan sát phản hồi của trang web trong quá trình xử lý."),
        @("Expected result", "Hệ thống hiển thị trạng thái đang xử lý (loading indicator), thực hiện truy vấn tối ưu hoặc tạo tác vụ nền (background job), sau đó xuất ra file báo cáo Excel định dạng .xlsx hoàn chỉnh."),
        @("Actual result", "Giao diện trang web bị đơ hoàn toàn (trình duyệt hiển thị cảnh báo 'Page Unresponsive'), tài nguyên CPU tăng vọt, sau 60 giây trang web ngắt kết nối và trả về mã lỗi HTTP 504 Gateway Timeout; file Excel không được tạo ra."),
        @("Evidence", "CNM-202_admin_timeout_504.png, CNM-202_server_crash_log.log"),
        @("Severity", "High (Major)`nGiải thích: Chức năng xuất dữ liệu báo cáo thời gian dài bị vô hiệu hóa hoàn toàn do lỗi xử lý tài nguyên và timeout của máy chủ."),
        @("Priority", "Low`nGiải thích: Chức năng này chỉ phục vụ nội bộ cho bộ phận kế toán với tần suất 1 lần/năm vào dịp tổng kết năm tài chính, không ảnh hưởng đến người dùng cuối mua vé và không gây gián đoạn hoạt động kinh doanh hàng ngày."),
        @("Status", "New"),
        @("Reproducibility", "5/5 lần (100%)"),
        @("Ghi chú / Root cause", "Câu lệnh SQL query đang thực hiện truy vấn đồng bộ quét toàn bộ bảng (FULL TABLE SCAN) kèm nhiều phép kết nối bảng (JOIN) không có phân trang và thiếu index trên cột ngày thanh toán.")
    )
    Append-DefectTable $cnm202

    # 2.3 Kịch bản 3
    Append-H2 "2.3. Kịch bản 3: Sai chính tả tên phim bom tấn trên banner trang chủ (Severity Thấp - Priority Cao)"
    Append-Para "Báo cáo lỗi mã CNM-203:"
    $cnm203 = @(
        @("ID", "CNM-203"),
        @("Title/Summary", "Sai chính tả tên phim bom tấn trên Banner quảng bá sự kiện mở bán vé sớm tại Trang chủ ('Avatar: Lứa Nước')"),
        @("Reporter / Ngày báo cáo", "Hoàng Thị D / 13/10/2026"),
        @("Test object & version", "CinemaFU Web Client — Module Homepage Banner Carousel, build v1.0.0-build210"),
        @("Environment", "Staging; Windows 11, macOS Sonoma; Google Chrome 130, Apple Safari 17.5"),
        @("Reference", "TC-MKT-003; User story US-02 'Hiển thị banner sự kiện nổi bật'; REQ-MKT-008 v1.0"),
        @("Preconditions", "1. Mở trang chủ hệ thống CinemaFU tại địa chỉ thử nghiệm.`n2. Banner chiến dịch Presale phim bom tấn cuối tuần đang được cấu hình kích hoạt tại vị trí ưu tiên số 1."),
        @("Steps to reproduce", "1. Truy cập trang chủ hệ thống CinemaFU.`n2. Quan sát slide đầu tiên của Banner quảng cáo chính giữa màn hình.`n3. Đọc nội dung văn bản tiêu đề trên hình ảnh banner."),
        @("Expected result", "Tiêu đề banner phải hiển thị chính xác tên tác phẩm điện ảnh theo thông cáo truyền thông chính thức: 'Avatar: Dòng Chảy Của Nước' (hoặc 'Avatar: Dòng Chảy Của Cát' theo đúng hợp đồng phát hành)."),
        @("Actual result", "Tiêu đề banner hiển thị sai chính tả nghiêm trọng thành: 'Avatar: Lứa Nước'."),
        @("Evidence", "CNM-203_banner_spelling_mistake.png"),
        @("Severity", "Low (Minor / Trivial)`nGiải thích: Lỗi thuần túy về mặt nội dung hiển thị (UI/Content), không ảnh hưởng đến chức năng kỹ thuật, luồng đặt vé hay cơ sở dữ liệu của hệ thống."),
        @("Priority", "High (Urgent)`nGiải thích: Banner hiển thị ở vị trí trung tâm trang chủ đúng thời điểm mở bán sớm (presale), lỗi sai chính tả làm tổn hại nghiêm trọng đến hình ảnh chuyên nghiệp của thương hiệu rạp chiếu và vi phạm cam kết truyền thông với nhà phát hành phim quốc tế."),
        @("Status", "New"),
        @("Reproducibility", "5/5 lần (100%)"),
        @("Ghi chú / Root cause", "Đội ngũ quản trị nội dung (CMS) nhập sai chuỗi ký tự tiêu đề trong component HeroBanner hoặc nhúng nhầm hình ảnh thiết kế nháp chưa qua duyệt.")
    )
    Append-DefectTable $cnm203

    # 2.4 Kịch bản 4
    Append-H2 "2.4. Kịch bản 4: Lệch 4px icon ghế VIP trong phần chú thích trên mobile (Severity Thấp - Priority Thấp)"
    Append-Para "Báo cáo lỗi mã CNM-204:"
    $cnm204 = @(
        @("ID", "CNM-204"),
        @("Title/Summary", "Icon ghế VIP bị lệch 4px so với icon ghế Thường trong phần chú thích sơ đồ ghế trên giao diện Mobile"),
        @("Reporter / Ngày báo cáo", "Phạm Văn E / 13/10/2026"),
        @("Test object & version", "CinemaFU Mobile Web — Module Seat Legend, build v1.0.0-build210"),
        @("Environment", "Staging; Thiết bị di động iPhone 14 (iOS 17.5) và Samsung Galaxy S23 (Android 14); Viewport độ phân giải 375x812 và 390x844"),
        @("Reference", "TC-UI-012; User story US-18 'Xem sơ đồ và chú thích loại ghế trên mobile'; REQ-UI-SEAT-004 v1.0"),
        @("Preconditions", "1. Người dùng mở ứng dụng web CinemaFU trên trình duyệt di động hoặc bật DevTools chế độ Mobile Simulation.`n2. Đã chọn một suất chiếu bất kỳ để chuyển tới màn hình sơ đồ ghế."),
        @("Steps to reproduce", "1. Mở màn hình chọn ghế của một suất chiếu bất kỳ trên giao diện mobile.`n2. Cuộn màn hình xuống khu vực 'Chú thích loại ghế' (Legend) bên dưới sơ đồ ghế.`n3. Quan sát vị trí thẳng hàng theo phương ngang giữa icon ghế 'VIP' và icon ghế 'Thường'."),
        @("Expected result", "Các icon minh họa loại ghế (Thường, VIP, Ghế đôi) và nhãn văn bản đi kèm phải được căn lề thẳng hàng chính xác theo trục ngang (align-items: center)."),
        @("Actual result", "Icon ghế VIP bị thụt xuống dưới khoảng 4px so với icon ghế Thường và nhãn chữ đi kèm, gây cảm giác lệch nhẹ về mặt thị giác."),
        @("Evidence", "CNM-204_icon_misalignment_mobile.png"),
        @("Severity", "Low (Trivial)`nGiải thích: Lỗi giao diện hiển thị cực nhỏ, không che khuất thông tin, không làm biến dạng bố cục và không ảnh hưởng đến bất kỳ thao tác chọn ghế nào của người dùng."),
        @("Priority", "Low`nGiải thích: Lỗi khó nhận biết đối với người dùng thông thường, không có tính cấp bách, có thể xếp hàng đợi để tinh chỉnh CSS trong các đợt phát hành định kỳ."),
        @("Status", "New"),
        @("Reproducibility", "5/5 lần (100%)"),
        @("Ghi chú / Root cause", "Lớp CSS '.legend-vip-icon' trên mobile bị áp đặt thuộc tính 'margin-top: 4px' do ghi đè nhầm quy tắc style từ phiên bản desktop.")
    )
    Append-DefectTable $cnm204

    # 2.5 Kịch bản 5
    Append-H2 "2.5. Kịch bản 5: Tiền âm khi áp dụng đồng thời mã giảm giá và điểm tích lũy (Tự phân tích mức độ)"
    Append-Para "Báo cáo lỗi mã CNM-205:"
    $cnm205 = @(
        @("ID", "CNM-205"),
        @("Title/Summary", "Tổng tiền thanh toán bị âm và hệ thống tạo giao dịch hoàn tiền ảo khi thành viên hạng Vàng áp dụng đồng thời mã giảm giá sinh viên và điểm tích lũy"),
        @("Reporter / Ngày báo cáo", "Đặng Văn F / 13/10/2026"),
        @("Test object & version", "CinemaFU Web & Backend Checkout Service, build v1.0.0-build210"),
        @("Environment", "Staging; Windows 11; Google Chrome 130; DB PostgreSQL 16"),
        @("Reference", "TC-CHK-078; User story US-45 'Áp dụng khuyến mãi và điểm thưởng thành viên'; REQ-PROMO-019 v1.2"),
        @("Preconditions", "1. Tài khoản thành viên hạng Vàng gold_member@cinemafu.vn có sẵn 300 điểm thưởng tích lũy (tương đương mức giảm 15% hoặc 45.000 VNĐ).`n2. Mã giảm giá sinh viên STUDENT20 (giảm 20%) đang còn hạn sử dụng.`n3. Giỏ hàng có 1 vé xem phim tiêu chuẩn (80.000 VNĐ) và 1 combo bắp nước nhỏ (70.000 VNĐ); tổng giá trị đơn hàng là 150.000 VNĐ."),
        @("Steps to reproduce", "1. Đăng nhập tài khoản thành viên hạng Vàng và tạo đơn hàng gồm 1 vé + 1 combo (tổng tiền 150.000 VNĐ).`n2. Tại màn hình Thanh toán, nhập mã giảm giá STUDENT20 vào ô khuyến mãi và nhấn 'Áp dụng'.`n3. Tiếp tục tích chọn tùy chọn 'Sử dụng điểm tích lũy thành viên Vàng' để cấn trừ tiền đơn hàng.`n4. Quan sát số tiền tại ô 'Tổng thanh toán' (Final Amount).`n5. Nhấn nút 'Xác nhận thanh toán'."),
        @("Expected result", "Theo REQ-PROMO-019:`n1. Hệ thống phải quy định rõ chính sách cộng dồn khuyến mãi (hoặc từ chối nếu không cho phép dùng đồng thời mã ngoài và điểm thành viên).`n2. Nếu cho phép kết hợp, tổng tiền sau giảm giá không bao giờ được phép nhỏ hơn 0 VNĐ (sàn tối thiểu bằng 0 VNĐ).`n3. Nút 'Xác nhận thanh toán' phải bị vô hiệu hóa hoặc yêu cầu điều chỉnh nếu đơn hàng có giá trị không hợp lệ."),
        @("Actual result", "1. Tổng tiền đơn hàng hiển thị giá trị âm (ví dụ: -45.000 VNĐ do thuật toán áp dụng trừ giảm giá kép trên tổng giá trị).`n2. Nút 'Xác nhận thanh toán' vẫn kích hoạt bình thường.`n3. Khi nhấn xác nhận, hệ thống xử lý giao dịch thành công, xuất vé điện tử và tự động gửi lệnh hoàn tiền (refund) 45.000 VNĐ vào ví ảo của khách hàng."),
        @("Evidence", "CNM-205_negative_total_checkout.png, CNM-205_transaction_history.json"),
        @("Severity", "Critical`nGiải thích: Lỗi tính toán tài chính nghiêm trọng. Không chỉ làm thất thoát doanh thu của rạp mà còn tạo ra kẽ hở gian lận rút tiền ảo từ hệ thống, gây sai lệch toàn bộ báo cáo doanh thu và kế toán."),
        @("Priority", "High (Immediate)`nGiải thích: Đây là lỗ hổng nghiệp vụ cấp bách (Showstopper/Blocker). Nếu hệ thống triển khai thực tế có lỗi này, kẻ xấu có thể lợi dụng tạo hàng loạt giao dịch âm để trục lợi tài chính, do đó phải sửa ngay lập tức."),
        @("Status", "New"),
        @("Reproducibility", "5/5 lần (100%)"),
        @("Ghi chú / Root cause", "Logic hàm tính toán giảm giá tại PromotionService thiếu biểu thức giới hạn giá trị tối thiểu Math.max(0, Total - Discounts), đồng thời tầng Controller của Payment thiếu bộ lọc kiểm tra điều kiện (Amount <= 0) trước khi tạo lệnh thanh toán.")
    )
    Append-DefectTable $cnm205

    # -------------------------------------------------------------
    # NỘI DUNG YÊU CẦU 3
    # -------------------------------------------------------------
    Append-H1 "3. Yêu cầu 3: Mô phỏng vòng đời (Defect Lifecycle) chi tiết"

    Append-H2 "3.1. Lựa chọn Defect mô phỏng"
    Append-Para "Defect được lựa chọn để mô phỏng là CNM-205: 'Tổng tiền thanh toán bị âm và hệ thống tạo giao dịch hoàn tiền ảo khi thành viên hạng Vàng áp dụng đồng thời mã giảm giá sinh viên và điểm tích lũy'."
    Append-Para "Kịch bản mô phỏng bao gồm toàn bộ các trạng thái theo chuẩn ISTQB và phát sinh nhánh Reopened nhằm phản ánh đúng thực tế dự án phần mềm khi đợt sửa lỗi đầu tiên phát sinh lỗi biên (edge case)."

    Append-H2 "3.2. Sơ đồ luồng trạng thái"
    Append-Para "Sơ đồ chuyển giao trạng thái của Defect CNM-205:"
    Append-Para "[New] --> [Assigned] --> [Open] --> [Fixed] --> [Retest] --> [Reopened]" -Bold -indent 20
    Append-Para "                                              |             |" -indent 20
    Append-Para "                                              | (lần 2)     v" -indent 20
    Append-Para "                                              +-------- [Open (2)] --> [Fixed (2)] --> [Retest (2)] --> [Verified] --> [Closed]" -Bold -indent 20

    Append-H2 "3.3. Diễn giải chi tiết từng bước trong vòng đời"

    # Lifecycle Summary Table
    $lifeTableData = @(
        @("Bước / Trạng thái", "Người thực hiện", "Hành động chi tiết", "Thời gian & Build"),
        @("1. New", "Đặng Văn F (Tester)", "Phát hiện lỗi tiền âm khi chạy TC-CHK-078. Chụp ảnh, trích xuất log JSON và tạo ticket CNM-205 trên Jira.", "09:15 13/10/2026`nBuild v1.0.0-build210"),
        @("2. Assigned", "Phạm Thị Mai (QA Lead)", "Thẩm định tính chất nghiêm trọng của lỗi. Duyệt Severity Critical, Priority High (Immediate) và gán ticket cho Dev Toàn.", "09:45 13/10/2026"),
        @("3. Open", "Nguyễn Văn Toàn (Backend Dev)", "Tiếp nhận ticket, debug và tái hiện thành công lỗi trên môi trường cục bộ. Chuyển ticket sang Open để viết code fix.", "10:00 13/10/2026"),
        @("4. Fixed (Lần 1)", "Nguyễn Văn Toàn (Backend Dev)", "Thêm hàm chặn Math.max(0, Total - Discount). Tạo PR #412, merge code và trigger build v1.0.0-build212 lên Staging.", "14:00 13/10/2026`nBuild v1.0.0-build212"),
        @("5. Retest (Lần 1)", "Đặng Văn F (Tester)", "Retest trên build 212. Tiền đã về 0đ nhưng khi bấm thanh toán, hệ thống gọi cổng thanh toán với số tiền 0đ gây lỗi Invalid Amount: 0.", "15:30 13/10/2026`nBuild v1.0.0-build212"),
        @("6. Reopened", "Đặng Văn F (Tester)", "Đánh giá retest thất bại. Chuyển trạng thái sang Reopened kèm log lỗi cổng thanh toán, yêu cầu xử lý luồng đơn hàng 0đ.", "16:00 13/10/2026"),
        @("7. Fixed (Lần 2)", "Nguyễn Văn Toàn (Backend Dev)", "Bổ sung luồng rẽ nhánh: Đơn hàng 0đ tự động xác nhận thành công mà không gọi cổng thanh toán ngoài. Deploy build v1.0.0-build215.", "17:15 13/10/2026`nBuild v1.0.0-build215"),
        @("8. Verified", "Đặng Văn F (Tester)", "Retest toàn diện trên build 215. Đơn hàng 0đ và đơn hàng bình thường đều xử lý chính xác. Xác nhận đạt tiêu chuẩn.", "18:00 13/10/2026`nBuild v1.0.0-build215"),
        @("9. Closed", "Phạm Thị Mai (QA Lead)", "Rà soát toàn bộ lịch sử xử lý, nhật ký bằng chứng kiểm thử lại. Đóng ticket với trạng thái Closed.", "18:30 13/10/2026")
    )

    $selection.EndKey(6)
    $tableRange = $selection.Range
    $table = $doc.Tables.Add($tableRange, $lifeTableData.Count, 4)
    $table.Borders.Enable = 1
    $table.Borders.OutsideLineStyle = 1
    $table.Borders.OutsideLineWidth = 4
    $table.Borders.OutsideColor = 0
    $table.Borders.InsideLineStyle = 1
    $table.Borders.InsideLineWidth = 4
    $table.Borders.InsideColor = 0
    $table.Columns.Item(1).Width = 85.0   # 3.0 cm
    $table.Columns.Item(2).Width = 99.2   # 3.5 cm
    $table.Columns.Item(3).Width = 184.2  # 6.5 cm
    $table.Columns.Item(4).Width = 85.0   # 3.0 cm

    $rIdx = 1
    foreach ($row in $lifeTableData) {
        for ($c = 1; $c -le 4; $c++) {
            $cell = $table.Cell($rIdx, $c).Range
            $cell.Text = $row[$c-1]
            $cell.Font.Name = "Times New Roman"
            $cell.Font.Size = 11.5
            $cell.Font.Bold = ($rIdx -eq 1 -or $c -eq 1)
            $cell.Font.Color = 0
            $cell.ParagraphFormat.SpaceBefore = 2
            $cell.ParagraphFormat.SpaceAfter = 2
            if ($c -eq 1 -or $rIdx -eq 1) {
                $cell.ParagraphFormat.Alignment = 0
            } else {
                $cell.ParagraphFormat.Alignment = 3
            }
        }
        $rIdx++
    }
    $selection.EndKey(6)
    $selection.TypeParagraph()

    Append-H3 "3.3.1. Phân tích chi tiết Bước 1 đến Bước 3 (Khởi tạo và Tiếp nhận)"
    Append-Para "- Bước 1 (New - 09:15 13/10/2026): Tester Đặng Văn F thực thi ca kiểm thử TC-CHK-078 trên build v1.0.0-build210. Khi kết hợp mã giảm giá sinh viên và điểm thành viên Vàng, số tiền tính toán hiển thị âm và hệ thống hoàn tiền ảo. Tester thu thập chứng cứ, mở ticket CNM-205 trên Jira với độ nghiêm trọng Critical và độ ưu tiên High."
    Append-Para "- Bước 2 (Assigned - 09:45 13/10/2026): QA Lead Phạm Thị Mai rà soát ticket, đồng thuận mức độ rủi ro tài chính cấp bách và phân công cho Senior Backend Developer Nguyễn Văn Toàn phụ trách xử lý."
    Append-Para "- Bước 3 (Open - 10:00 13/10/2026): Backend Dev Nguyễn Văn Toàn tiếp nhận ticket, đọc các bước tái hiện, thiết lập dữ liệu mẫu trên môi trường kiểm thử cục bộ và tái hiện thành công lỗi. Chuyển ticket sang trạng thái Open để bắt đầu sửa mã nguồn."

    Append-H3 "3.3.2. Phân tích chi tiết Bước 4 đến Bước 6 (Sửa chữa lần 1 và Reopen)"
    Append-Para "- Bước 4 (Fixed Lần 1 - 14:00 13/10/2026): Dev Toàn bổ sung hàm chặn giá trị âm: FinalAmount = Math.max(0, Total - Discount). Dev chạy unit test nội bộ pass, tạo Pull Request và merge code. Hệ thống CI/CD tạo bản build v1.0.0-build212 lên môi trường Staging. Dev cập nhật ticket sang Fixed."
    Append-Para "- Bước 5 (Retest Lần 1 - 15:30 13/10/2026): Tester F kiểm thử lại trên build 212. Tổng tiền hiển thị chính xác là 0 VNĐ. Tuy nhiên, khi bấm Xác nhận thanh toán, hệ thống vẫn gửi request sang cổng thanh toán ngoài với số tiền bằng 0 VNĐ. Cổng thanh toán trả về lỗi 'Invalid Amount: 0' và đơn hàng bị treo vô thời hạn."
    Append-Para "- Bước 6 (Reopened - 16:00 13/10/2026): Tester F đánh giá việc khắc phục chưa hoàn thiện do phát sinh lỗi biên với đơn hàng 0 VNĐ. Tester đính kèm log lỗi cổng thanh toán và chuyển trạng thái ticket sang Reopened, yêu cầu xử lý luồng riêng cho đơn hàng miễn phí."

    Append-H3 "3.3.3. Phân tích chi tiết Bước 7 đến Bước 9 (Sửa chữa lần 2, Nghiệm thu và Đóng ticket)"
    Append-Para "- Bước 7 (Fixed Lần 2 - 17:15 13/10/2026): Dev Toàn bổ sung luồng rẽ nhánh: Nếu FinalAmount == 0, hệ thống tự động xác nhận thành công đơn hàng mà không gọi cổng thanh toán ngoài. Đóng gói bản build v1.0.0-build215 lên Staging và chuyển ticket sang Fixed."
    Append-Para "- Bước 8 (Retest & Verified Lần 2 - 18:00 13/10/2026): Tester F kiểm tra lại cả hai luồng: đơn hàng 0 VNĐ (xuất vé thành công ngay lập tức) và đơn hàng thanh toán thông thường (kết nối cổng thanh toán ổn định). Kết quả kiểm thử hồi quy đạt yêu cầu, chuyển trạng thái sang Verified."
    Append-Para "- Bước 9 (Closed - 18:30 13/10/2026): QA Lead Phạm Thị Mai kiểm tra tổng thể biên bản kiểm thử lại, xác nhận lỗi đã được khắc phục triệt để và an toàn, chính thức đóng ticket với trạng thái Closed."

    # -------------------------------------------------------------
    # UPDATE TOC & SAVE
    # -------------------------------------------------------------
    # Update Table of Contents
    if ($doc.TablesOfContents.Count -ge 1) {
        $doc.TablesOfContents.Item(1).UseHyperlinks = $true
        $doc.TablesOfContents.Item(1).Update()
    }

    # Save document - try original or save to Hyperlink file
    $linkPath = "h:\SEM5\SWT\codenop\lab3\BaoCao_ThucHanh_Lab3_Hyperlink.docx"
    $doc.SaveAs([ref]$linkPath)
    Write-Output "SUCCESS: Document generated and saved at $linkPath"

    try {
        $doc.SaveAs([ref]$outputPath)
        Write-Output "SUCCESS: Document also updated at $outputPath"
    } catch {
        Write-Output "NOTE: Original file was open in Word, saved successfully as $linkPath"
    }
}
catch {
    Write-Error "ERROR: $_"
}
finally {
    $doc.Close($false)
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

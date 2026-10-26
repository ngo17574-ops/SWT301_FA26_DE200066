# BÁO CÁO THỰC HÀNH KIỂM THỬ PHẦN MỀM (LAB 3)
## CHỦ ĐỀ: QUẢN LÝ VÀ BÁO CÁO LỖI (DEFECT REPORTING & LIFECYCLE)
### HỆ THỐNG ÁP DỤNG: CINEMAFU — BÁN VÉ XEM PHIM TRỰC TUYẾN

---

## MỤC LỤC

- [1. Yêu cầu 1: Viết lại mô tả lỗi kém thành Defect Report hoàn chỉnh](#1-yeu-cau-1-viet-lai-mo-ta-loi-kem-thanh-defect-report-hoan-chinh)
  - [1.1. Phân tích ngữ cảnh và các điểm thiếu sót của mô tả ban đầu](#11-phan-tich-ngu-canh-va-cac-diem-thieu-sot-cua-mo-ta-ban-dau)
  - [1.2. Defect Report hoàn chỉnh (CNM-101)](#12-defect-report-hoan-chinh-cnm-101)
- [2. Yêu cầu 2: Viết Defect Report cho 5 kịch bản theo ma trận Severity và Priority](#2-yeu-cau-2-viet-defect-report-cho-5-kich-ban-theo-ma-tran-severity-va-priority)
  - [2.1. Kịch bản 1: Thanh toán ví điện tử không đủ tiền nhưng vẫn xuất vé (Severity Cao - Priority Cao)](#21-kich-ban-1-thanh-toan-vi-dien-tu-khong-du-tien-nhung-van-xuat-ve-severity-cao---priority-cao)
  - [2.2. Kịch bản 2: Treo hệ thống khi xuất báo cáo doanh thu trên 2 năm (Severity Cao - Priority Thấp)](#22-kich-ban-2-treo-he-thong-khi-xuat-bao-cao-doanh-thu-tren-2-nam-severity-cao---priority-thap)
  - [2.3. Kịch bản 3: Sai chính tả tên phim bom tấn trên banner trang chủ (Severity Thấp - Priority Cao)](#23-kich-ban-3-sai-chinh-ta-ten-phim-bom-tan-tren-banner-trang-chu-severity-thap---priority-cao)
  - [2.4. Kịch bản 4: Lệch 4px icon ghế VIP trong phần chú thích trên mobile (Severity Thấp - Priority Thấp)](#24-kich-ban-4-lech-4px-icon-ghe-vip-trong-phan-chu-thich-tren-mobile-severity-thap---priority-thap)
  - [2.5. Kịch bản 5: Tiền âm khi áp dụng đồng thời mã giảm giá và điểm tích lũy (Tự phân tích mức độ)](#25-kich-ban-5-tien-am-khi-ap-dung-dong-thoi-ma-giam-gia-va-diem-tich-luy-tu-phan-tich-muc-do)
- [3. Yêu cầu 3: Mô phỏng vòng đời (Defect Lifecycle) chi tiết](#3-yeu-cau-3-mo-phong-vong-doi-defect-lifecycle-chi-tiet)
  - [3.1. Lựa chọn Defect mô phỏng](#31-lua-chon-defect-mo-phong)
  - [3.2. Sơ đồ luồng trạng thái](#32-so-do-luong-trang-thai)
  - [3.3. Diễn giải chi tiết từng bước trong vòng đời](#33-dien-giai-chi-tiet-tung-buoc-trong-vong-doi)

---

## 1. Yêu cầu 1: Viết lại mô tả lỗi kém thành Defect Report hoàn chỉnh

### 1.1. Phân tích ngữ cảnh và các điểm thiếu sót của mô tả ban đầu

- **Nội dung mô tả ban đầu:**
  - *Title:* Lỗi chọn ghế
  - *Mô tả:* Đặt ghế đôi bị sao đó, tiền tính sai. Sửa gấp!!!
- **Các lỗi và thiếu sót nghiêm trọng:**
  - Tiêu đề chung chung, mơ hồ, không nêu được bản chất lỗi và hệ quả.
  - Thiếu toàn bộ thông tin môi trường, phiên bản phần mềm (build/version) và tài liệu tham chiếu.
  - Không có tiền điều kiện (preconditions) và dữ liệu thử nghiệm cụ thể (test data).
  - Không có các bước tái hiện (steps to reproduce) tuần tự.
  - Không phân định kết quả kỳ vọng (Expected result) và kết quả thực tế (Actual result).
  - Sử dụng văn phong cảm tính, mang tính thúc ép ("Sửa gấp!!!"), vi phạm nguyên tắc khách quan trong kiểm thử.
- **Kịch bản chuẩn hóa:** Khách chọn 1 ghế đôi (couple) ở hàng F, hệ thống nhân đôi đơn giá ghế đôi (tính tiền cho 2 ghế đôi) thay vì tính đúng giá niêm yết cho 1 ghế đôi.

### 1.2. Defect Report hoàn chỉnh (CNM-101)

```
ID: CNM-101
Title/Summary: Đơn giá ghế đôi (Couple) bị nhân đôi khi khách hàng chọn 1 ghế đôi tại sơ đồ rạp
Reporter / Ngày báo cáo: Nguyễn Văn A / 2026-10-13
Test object & version (build): CinemaFU Web — Module Booking / Seat Selection, build v1.0.0-build210
Environment (OS, Browser/App version, thiết bị, DB...): Staging; Windows 11 Pro 64-bit; Google Chrome version 130.0.6723.70; DB PostgreSQL 16 Snapshot 2026-10-12
Reference (Test case / User story / Requirement liên quan): TC-SEAT-042; User story US-24 "Đặt vé ghế đôi phòng chiếu 2D"; REQ-BOOK-015 v1.1

Preconditions:
1. Tài khoản khách hàng "customer01@cinemafu.vn" đã đăng nhập thành công.
2. Suất chiếu phim "Dune: Part Two" lúc 19:30 ngày 15/10/2026 tại Rạp 1 còn trống ghế đôi tại vị trí F01-F02.
3. Theo REQ-BOOK-015, đơn giá niêm yết cho 1 ghế đôi trọn gói là 220.000 VNĐ.

Steps to reproduce:
1. Truy cập trang chủ CinemaFU, đăng nhập bằng tài khoản thử nghiệm.
2. Chọn phim "Dune: Part Two", chọn rạp CinemaFU Hà Nội, suất chiếu 19:30 ngày 15/10/2026.
3. Tại màn hình sơ đồ ghế, nhấp chuột chọn 1 ghế đôi tại vị trí F01-F02 (hàng F).
4. Quan sát bảng tóm tắt "Thông tin đặt vé" và mục "Tổng tiền vé" ở cột bên phải.

Expected result:
Theo REQ-BOOK-015, ghế đôi là một sản phẩm đơn vị trọn gói dành cho 2 người với giá cố định.
Hệ thống phải hiển thị:
- Số lượng: 1 ghế đôi (F01-F02).
- Đơn giá: 220.000 VNĐ.
- Tổng tiền vé: 220.000 VNĐ.

Actual result:
Hệ thống tính thành 2 ghế với đơn giá của ghế đôi:
- Số lượng: 2 ghế đôi.
- Tổng tiền vé hiển thị: 440.000 VNĐ (220.000 VNĐ x 2).

Evidence (screenshot/video/log — mô tả hoặc tên file):
CNM-101_seat_selection_error.png, CNM-101_payload_seat_calculation.json

Severity: High (Major)
Giải thích: Lỗi tính toán sai giá trị đơn hàng, làm tăng gấp đôi giá vé thực tế, ảnh hưởng trực tiếp đến trải nghiệm người dùng và ngăn cản quyết định mua hàng.

Priority: High
Giải thích: Module chọn ghế và tính tiền là chức năng cốt lõi (core feature) của luồng đặt vé, cần được xử lý ngay trong sprint kiểm thử hiện tại.

Status: New
Reproducibility: 5/5 lần (100%)
Ghi chú / Root cause nghi ngờ (nếu có): Ghế đôi bao gồm 2 vị trí vật lý (F01 và F02). Hệ thống đang lấy số lượng vị trí vật lý (2) nhân với đơn giá ghế đôi thay vì kiểm tra mã thuộc tính loại ghế (SeatType = "COUPLE") để gán giá trọn gói.
```

---

## 2. Yêu cầu 2: Viết Defect Report cho 5 kịch bản theo ma trận Severity và Priority

### 2.1. Kịch bản 1: Thanh toán ví điện tử không đủ tiền nhưng vẫn xuất vé (Severity Cao - Priority Cao)

```
ID: CNM-201
Title/Summary: Hệ thống tự động xác nhận thanh toán thành công và xuất vé điện tử khi số dư Ví điện tử không đủ
Reporter / Ngày báo cáo: Trần Thị B / 2026-10-13
Test object & version (build): CinemaFU Web & Mobile Backend — Module Checkout / Payment Gateway, build v1.0.0-build210
Environment (OS, Browser/App version, thiết bị, DB...): Staging; Windows 11; Google Chrome 130; Cổng thanh toán Sandbox Ví điện tử MoMo/ZaloPay; DB PostgreSQL 16
Reference (Test case / User story / Requirement liên quan): TC-PAY-088; User story US-55 "Thanh toán qua ví điện tử"; REQ-PAY-030 v2.0

Preconditions:
1. Tài khoản khách hàng liên kết ví điện tử thử nghiệm có số dư hiện tại là 50.000 VNĐ.
2. Đơn đặt vé hiện tại có tổng giá trị thanh toán là 180.000 VNĐ.

Steps to reproduce:
1. Thực hiện quy trình chọn phim, suất chiếu và ghế ngồi để tạo đơn hàng có giá trị 180.000 VNĐ.
2. Tại màn hình Thanh toán, chọn phương thức "Ví điện tử MoMo".
3. Nhấn "Thanh toán ngay", quét mã QR hoặc ủy quyền giao dịch với ví thử nghiệm (số dư 50.000 VNĐ).
4. Cổng thanh toán trả về mã lỗi giao dịch: INSUFFICIENT_FUNDS (Số dư không đủ).
5. Quan sát phản hồi trên giao diện hệ thống CinemaFU.

Expected result:
Hệ thống phải nhận mã lỗi từ cổng thanh toán, hiển thị thông báo "Giao dịch không thành công: Số dư ví không đủ", không tạo mã vé và cho phép khách hàng chọn phương thức thanh toán khác hoặc hủy đơn.

Actual result:
Hệ thống bỏ qua mã lỗi phản hồi, điều hướng người dùng đến trang "Thanh toán thành công", tạo mã vé điện tử QR hợp lệ, gửi email xác nhận và đổi trạng thái ghế sang "Đã bán" mà không thực hiện trừ tiền trong ví.

Evidence (screenshot/video/log — mô tả hoặc tên file):
CNM-201_payment_bypass_success.png, CNM-201_gateway_callback_log.txt

Severity: Critical
Giải thích: Lỗ hổng kỹ thuật cực kỳ nghiêm trọng gây thất thoát doanh thu trực tiếp cho doanh nghiệp; khách hàng có thể sở hữu vé xem phim miễn phí mà rạp không nhận được tiền.

Priority: High (Immediate)
Giải thích: Lỗi đe dọa trực tiếp đến tính toàn vẹn tài chính và bảo mật giao dịch, bắt buộc phải chặn phát hành và sửa đổi khẩn cấp ngay lập tức.

Status: New
Reproducibility: 5/5 lần (100%)
Ghi chú / Root cause nghi ngờ (nếu có): Hàm xử lý callback (/api/v1/payment/callback) chỉ kiểm tra có nhận được response từ đối tác hay không mà không kiểm tra giá trị của trường trạng thái (status != 'SUCCESS'), dẫn đến tự động cập nhật đơn hàng thành PAID.
```

### 2.2. Kịch bản 2: Treo hệ thống khi xuất báo cáo doanh thu trên 2 năm (Severity Cao - Priority Thấp)

```
ID: CNM-202
Title/Summary: Trang quản trị bị treo và trả về lỗi 504 Gateway Timeout khi xuất báo cáo doanh thu theo rạp cho khoảng thời gian vượt quá 2 năm
Reporter / Ngày báo cáo: Lê Văn C / 2026-10-13
Test object & version (build): CinemaFU Admin Portal — Module Báo cáo & Thống kê, build v1.0.0-build210
Environment (OS, Browser/App version, thiết bị, DB...): Staging; Windows 11; Google Chrome 130; Server Node.js / PostgreSQL 16 (Cơ sở dữ liệu mẫu chứa dữ liệu 5 năm từ 2021-2026)
Reference (Test case / User story / Requirement liên quan): TC-REP-015; User story US-82 "Báo cáo doanh thu tài chính theo rạp"; REQ-REP-005 v1.0

Preconditions:
1. Đăng nhập tài khoản Quản trị viên (Admin) có quyền trích xuất báo cáo tài chính.
2. Hệ thống lưu trữ dữ liệu giao dịch bán vé thực tế từ tháng 01/2021 đến tháng 10/2026.

Steps to reproduce:
1. Truy cập CinemaFU Admin Portal, điều hướng đến menu "Báo cáo doanh thu theo rạp".
2. Tại bộ lọc chi nhánh rạp, chọn "Tất cả các rạp".
3. Tại bộ lọc thời gian, chọn từ ngày "01/01/2022" đến ngày "31/12/2025" (khoảng thời gian 4 năm, vượt mức 2 năm).
4. Nhấn nút "Xuất file Excel".
5. Quan sát phản hồi của trang web trong quá trình xử lý.

Expected result:
Hệ thống hiển thị trạng thái đang xử lý (loading indicator), thực hiện truy vấn tối ưu hoặc tạo tác vụ nền (background job), sau đó xuất ra file báo cáo Excel định dạng .xlsx hoàn chỉnh.

Actual result:
Giao diện trang web bị đơ hoàn toàn (trình duyệt hiển thị cảnh báo "Page Unresponsive"), tài nguyên CPU tăng vọt, sau 60 giây trang web ngắt kết nối và trả về mã lỗi HTTP 504 Gateway Timeout; file Excel không được tạo ra.

Evidence (screenshot/video/log — mô tả hoặc tên file):
CNM-202_admin_timeout_504.png, CNM-202_server_crash_log.log

Severity: High (Major)
Giải thích: Chức năng xuất dữ liệu báo cáo thời gian dài bị vô hiệu hóa hoàn toàn do lỗi xử lý tài nguyên và timeout của máy chủ.

Priority: Low
Giải thích: Chức năng này chỉ phục vụ nội bộ cho bộ phận kế toán với tần suất 1 lần/năm vào dịp tổng kết năm tài chính, không ảnh hưởng đến người dùng cuối mua vé và không gây gián đoạn hoạt động kinh doanh hàng ngày.

Status: New
Reproducibility: 5/5 lần (100%)
Ghi chú / Root cause nghi ngờ (nếu có): Câu lệnh SQL query đang thực hiện truy vấn đồng bộ quét toàn bộ bảng (FULL TABLE SCAN) kèm nhiều phép kết nối bảng (JOIN) không có phân trang và thiếu index trên cột ngày thanh toán.
```

### 2.3. Kịch bản 3: Sai chính tả tên phim bom tấn trên banner trang chủ (Severity Thấp - Priority Cao)

```
ID: CNM-203
Title/Summary: Sai chính tả tên phim bom tấn trên Banner quảng bá sự kiện mở bán vé sớm tại Trang chủ ("Avatar: Lứa Nước")
Reporter / Ngày báo cáo: Hoàng Thị D / 2026-10-13
Test object & version (build): CinemaFU Web Client — Module Homepage Banner Carousel, build v1.0.0-build210
Environment (OS, Browser/App version, thiết bị, DB...): Staging; Windows 11, macOS Sonoma; Google Chrome 130, Apple Safari 17.5
Reference (Test case / User story / Requirement liên quan): TC-MKT-003; User story US-02 "Hiển thị banner sự kiện nổi bật"; REQ-MKT-008 v1.0

Preconditions:
1. Mở trang chủ hệ thống CinemaFU tại địa chỉ thử nghiệm.
2. Banner chiến dịch Presale phim bom tấn cuối tuần đang được cấu hình kích hoạt tại vị trí ưu tiên số 1.

Steps to reproduce:
1. Truy cập trang chủ hệ thống CinemaFU.
2. Quan sát slide đầu tiên của Banner quảng cáo chính giữa màn hình.
3. Đọc nội dung văn bản tiêu đề trên hình ảnh banner.

Expected result:
Tiêu đề banner phải hiển thị chính xác tên tác phẩm điện ảnh theo thông cáo truyền thông chính thức: "Avatar: Dòng Chảy Của Nước" (hoặc "Avatar: Dòng Chảy Của Cát" theo đúng hợp đồng phát hành).

Actual result:
Tiêu đề banner hiển thị sai chính tả nghiêm trọng thành: "Avatar: Lứa Nước".

Evidence (screenshot/video/log — mô tả hoặc tên file):
CNM-203_banner_spelling_mistake.png

Severity: Low (Minor / Trivial)
Giải thích: Lỗi thuần túy về mặt nội dung hiển thị (UI/Content), không ảnh hưởng đến chức năng kỹ thuật, luồng đặt vé hay cơ sở dữ liệu của hệ thống.

Priority: High (Urgent)
Giải thích: Banner hiển thị ở vị trí trung tâm trang chủ đúng thời điểm mở bán sớm (presale), lỗi sai chính tả làm tổn hại nghiêm trọng đến hình ảnh chuyên nghiệp của thương hiệu rạp chiếu và vi phạm cam kết truyền thông với nhà phát hành phim quốc tế.

Status: New
Reproducibility: 5/5 lần (100%)
Ghi chú / Root cause nghi ngờ (nếu có): Đội ngũ quản trị nội dung (CMS) nhập sai chuỗi ký tự tiêu đề trong component HeroBanner hoặc nhúng nhầm hình ảnh thiết kế nháp chưa qua duyệt.
```

### 2.4. Kịch bản 4: Lệch 4px icon ghế VIP trong phần chú thích trên mobile (Severity Thấp - Priority Thấp)

```
ID: CNM-204
Title/Summary: Icon ghế VIP bị lệch 4px so với icon ghế Thường trong phần chú thích sơ đồ ghế trên giao diện Mobile
Reporter / Ngày báo cáo: Phạm Văn E / 2026-10-13
Test object & version (build): CinemaFU Mobile Web — Module Seat Legend, build v1.0.0-build210
Environment (OS, Browser/App version, thiết bị, DB...): Staging; Thiết bị di động iPhone 14 (iOS 17.5) và Samsung Galaxy S23 (Android 14); Viewport độ phân giải 375x812 và 390x844
Reference (Test case / User story / Requirement liên quan): TC-UI-012; User story US-18 "Xem sơ đồ và chú thích loại ghế trên mobile"; REQ-UI-SEAT-004 v1.0

Preconditions:
1. Người dùng mở ứng dụng web CinemaFU trên trình duyệt di động hoặc bật DevTools chế độ Mobile Simulation.
2. Đã chọn một suất chiếu bất kỳ để chuyển tới màn hình sơ đồ ghế.

Steps to reproduce:
1. Mở màn hình chọn ghế của một suất chiếu bất kỳ trên giao diện mobile.
2. Cuộn màn hình xuống khu vực "Chú thích loại ghế" (Legend) bên dưới sơ đồ ghế.
3. Quan sát vị trí thẳng hàng theo phương ngang giữa icon ghế "VIP" và icon ghế "Thường".

Expected result:
Các icon minh họa loại ghế (Thường, VIP, Ghế đôi) và nhãn văn bản đi kèm phải được căn lề thẳng hàng chính xác theo trục ngang (align-items: center).

Actual result:
Icon ghế VIP bị thụt xuống dưới khoảng 4px so với icon ghế Thường và nhãn chữ đi kèm, gây cảm giác lệch nhẹ về mặt thị giác.

Evidence (screenshot/video/log — mô tả hoặc tên file):
CNM-204_icon_misalignment_mobile.png

Severity: Low (Trivial)
Giải thích: Lỗi giao diện hiển thị cực nhỏ, không che khuất thông tin, không làm biến dạng bố cục và không ảnh hưởng đến bất kỳ thao tác chọn ghế nào của người dùng.

Priority: Low
Giải thích: Lỗi khó nhận biết đối với người dùng thông thường, không có tính cấp bách, có thể xếp hàng đợi để tinh chỉnh CSS trong các đợt phát hành định kỳ.

Status: New
Reproducibility: 5/5 lần (100%)
Ghi chú / Root cause nghi ngờ (nếu có): Lớp CSS ".legend-vip-icon" trên mobile bị áp đặt thuộc tính "margin-top: 4px" do ghi đè nhầm quy tắc style từ phiên bản desktop.
```

### 2.5. Kịch bản 5: Tiền âm khi áp dụng đồng thời mã giảm giá và điểm tích lũy (Tự phân tích mức độ)

```
ID: CNM-205
Title/Summary: Tổng tiền thanh toán bị âm và hệ thống tạo giao dịch hoàn tiền ảo khi thành viên hạng Vàng áp dụng đồng thời mã giảm giá sinh viên và điểm tích lũy
Reporter / Ngày báo cáo: Đặng Văn F / 2026-10-13
Test object & version (build): CinemaFU Web & Backend Checkout Service, build v1.0.0-build210
Environment (OS, Browser/App version, thiết bị, DB...): Staging; Windows 11; Google Chrome 130; DB PostgreSQL 16
Reference (Test case / User story / Requirement liên quan): TC-CHK-078; User story US-45 "Áp dụng khuyến mãi và điểm thưởng thành viên"; REQ-PROMO-019 v1.2

Preconditions:
1. Tài khoản thành viên hạng Vàng "gold_member@cinemafu.vn" có sẵn 300 điểm thưởng tích lũy (tương đương mức giảm 15% hoặc 45.000 VNĐ).
2. Mã giảm giá sinh viên "STUDENT20" (giảm 20%) đang còn hạn sử dụng.
3. Giỏ hàng có 1 vé xem phim tiêu chuẩn (80.000 VNĐ) và 1 combo bắp nước nhỏ (70.000 VNĐ); tổng giá trị đơn hàng là 150.000 VNĐ.

Steps to reproduce:
1. Đăng nhập tài khoản thành viên hạng Vàng và tạo đơn hàng gồm 1 vé + 1 combo (tổng tiền 150.000 VNĐ).
2. Tại màn hình Thanh toán, nhập mã giảm giá "STUDENT20" vào ô khuyến mãi và nhấn "Áp dụng".
3. Tiếp tục tích chọn tùy chọn "Sử dụng điểm tích lũy thành viên Vàng" để cấn trừ tiền đơn hàng.
4. Quan sát số tiền tại ô "Tổng thanh toán" (Final Amount).
5. Nhấn nút "Xác nhận thanh toán".

Expected result:
Theo REQ-PROMO-019:
1. Hệ thống phải quy định rõ chính sách cộng dồn khuyến mãi (hoặc từ chối nếu không cho phép dùng đồng thời mã ngoài và điểm thành viên).
2. Nếu cho phép kết hợp, tổng tiền sau giảm giá không bao giờ được phép nhỏ hơn 0 VNĐ (sàn tối thiểu bằng 0 VNĐ).
3. Nút "Xác nhận thanh toán" phải bị vô hiệu hóa hoặc yêu cầu điều chỉnh nếu đơn hàng có giá trị không hợp lệ.

Actual result:
1. Tổng tiền đơn hàng hiển thị giá trị âm (ví dụ: -45.000 VNĐ do thuật toán áp dụng trừ giảm giá kép trên tổng giá trị).
2. Nút "Xác nhận thanh toán" vẫn kích hoạt bình thường.
3. Khi nhấn xác nhận, hệ thống xử lý giao dịch thành công, xuất vé điện tử và tự động gửi lệnh hoàn tiền (refund) 45.000 VNĐ vào ví ảo của khách hàng.

Evidence (screenshot/video/log — mô tả hoặc tên file):
CNM-205_negative_total_checkout.png, CNM-205_transaction_history.json

Severity: Critical
Giải thích: Lỗi tính toán tài chính nghiêm trọng. Không chỉ làm thất thoát doanh thu của rạp mà còn tạo ra kẽ hở gian lận rút tiền ảo từ hệ thống, gây sai lệch toàn bộ báo cáo doanh thu và kế toán.

Priority: High (Immediate)
Giải thích: Đây là lỗ hổng nghiệp vụ cấp bách (Showstopper/Blocker). Nếu hệ thống triển khai thực tế có lỗi này, kẻ xấu có thể lợi dụng tạo hàng loạt giao dịch âm để trục lợi tài chính, do đó phải sửa ngay lập tức.

Status: New
Reproducibility: 5/5 lần (100%)
Ghi chú / Root cause nghi ngờ (nếu có): Logic hàm tính toán giảm giá tại PromotionService thiếu biểu thức giới hạn giá trị tối thiểu Math.max(0, Total - Discounts), đồng thời tầng Controller của Payment thiếu bộ lọc kiểm tra điều kiện (Amount <= 0) trước khi tạo lệnh thanh toán.
```

---

## 3. Yêu cầu 3: Mô phỏng vòng đời (Defect Lifecycle) chi tiết

### 3.1. Lựa chọn Defect mô phỏng

- **Mã lỗi:** `CNM-205`
- **Tên lỗi:** Tổng tiền thanh toán bị âm và hệ thống tạo giao dịch hoàn tiền ảo khi thành viên hạng Vàng áp dụng đồng thời mã giảm giá sinh viên và điểm tích lũy.
- **Tính chất mô phỏng:** Quy trình xử lý thực tế có phát sinh nhánh **Reopened** do lần khắc phục đầu tiên của lập trình viên chưa xử lý triệt để trường hợp biên (edge case khi tổng tiền bằng 0 VNĐ).

### 3.2. Sơ đồ luồng trạng thái

```
[New] ──> [Assigned] ──> [Open] ──> [Fixed] ──> [Retest] ──> [Reopened]
                                                   │             │
                                                   │ (lần 2)     ▼
                                                   └───────── [Open (2)] ──> [Fixed (2)] ──> [Retest (2)] ──> [Verified] ──> [Closed]
```

### 3.3. Diễn giải chi tiết từng bước trong vòng đời

#### Bước 1: Trạng thái New
- **Người thực hiện:** Đặng Văn F (Tester phụ trách module Thanh toán & Khuyến mãi).
- **Hành động:** 
  - Trong quá trình kiểm thử hồi quy kịch bản kết hợp ưu đãi, phát hiện tổng tiền bị tính thành số âm và hệ thống hoàn tiền ảo.
  - Thu thập log hệ thống, chụp ảnh màn hình giao diện và ghi lại gói tin JSON phản hồi.
  - Tạo ticket defect mã `CNM-205` trên hệ thống quản lý Jira, phân loại Severity: Critical, đề xuất Priority: High.
- **Thời gian:** 09:15 ngày 13/10/2026 trên bản build `v1.0.0-build210`.

#### Bước 2: Trạng thái Assigned
- **Người thực hiện:** Phạm Thị Mai (QA Lead) phối hợp cùng Product Owner (PO).
- **Hành động:**
  - QA Lead tiếp nhận ticket, rà soát mức độ nghiêm trọng và chấp thuận đánh giá Severity: Critical, Priority: High (Immediate).
  - Gán (Assign) ticket cho Nguyễn Văn Toàn (Senior Backend Developer phụ trách Module Thanh toán).
- **Thời gian:** 09:45 ngày 13/10/2026.

#### Bước 3: Trạng thái Open (In Progress)
- **Người thực hiện:** Nguyễn Văn Toàn (Backend Developer).
- **Hành động:**
  - Nhận thông báo ticket, đọc các bước tái hiện và dữ liệu thử nghiệm trong báo cáo.
  - Tái hiện thành công lỗi trên môi trường kiểm thử cục bộ (Local Development Environment).
  - Chuyển trạng thái ticket từ `Assigned` sang `Open` để bắt đầu phân tích mã nguồn và sửa đổi logic.
- **Thời gian:** 10:00 ngày 13/10/2026.

#### Bước 4: Trạng thái Fixed (Lần 1)
- **Người thực hiện:** Nguyễn Văn Toàn (Backend Developer).
- **Hành động:**
  - Bổ sung biểu thức toán học giới hạn giá trị đơn hàng tối thiểu bằng 0 VNĐ: `FinalAmount = Math.max(0, CalculatedAmount)`.
  - Chạy unit test nội bộ, tạo Pull Request và merge code vào nhánh phát triển.
  - Hệ thống CI/CD đóng gói thành bản build mới `v1.0.0-build212` và deploy lên môi trường Staging.
  - Chuyển trạng thái ticket sang `Fixed`, thêm ghi chú: "Đã bổ sung hàm chặn tiền âm, chuyển QA kiểm tra lại".
- **Thời gian:** 14:00 ngày 13/10/2026.

#### Bước 5: Trạng thái Retest (Lần 1 - Phát hiện lỗi thứ cấp)
- **Người thực hiện:** Đặng Văn F (Tester).
- **Hành động:**
  - Nhận thông báo bản build `v1.0.0-build212`, chuyển trạng thái ticket sang `Retest`.
  - Thực hiện lại các bước kiểm thử theo kịch bản trong report.
  - Kết quả kiểm tra: Tổng tiền không còn bị âm mà hiển thị đúng 0 VNĐ. Tuy nhiên, khi nhấn "Xác nhận thanh toán", hệ thống vẫn gửi yêu cầu sang cổng thanh toán bên thứ ba với số tiền bằng 0 VNĐ, dẫn đến cổng thanh toán báo lỗi "Invalid Amount: 0" và đơn hàng bị treo vô thời hạn.
- **Thời gian:** 15:30 ngày 13/10/2026.

#### Bước 6: Trạng thái Reopened
- **Người thực hiện:** Đặng Văn F (Tester).
- **Hành động:**
  - Đánh giá lần khắc phục thứ nhất chưa đạt yêu cầu nghiệp vụ (Retest Failed).
  - Đính kèm log lỗi từ cổng thanh toán và ảnh chụp màn hình đơn hàng bị treo.
  - Chuyển trạng thái ticket từ `Retest` sang `Reopened` với ghi chú: "Tiền đã hết âm nhưng hệ thống chưa xử lý luồng đơn hàng 0 VNĐ, vẫn gọi cổng thanh toán gây crash giao dịch".
- **Thời gian:** 16:00 ngày 13/10/2026.

#### Bước 7: Trạng thái Open và Fixed (Lần 2)
- **Người thực hiện:** Nguyễn Văn Toàn (Backend Developer).
- **Hành động:**
  - Developer mở lại mã nguồn, viết bổ sung luồng rẽ nhánh: Nếu `FinalAmount == 0`, hệ thống tự động đánh dấu đơn hàng là đã thanh toán hợp lệ (Bypass Payment Gateway), cấp mã vé ngay lập tức mà không gọi API cổng thanh toán ngoài.
  - Viết bổ sung integration test cho trường hợp biên đơn hàng 0 VNĐ.
  - Merge mã nguồn, trigger build bản `v1.0.0-build215` lên Staging và cập nhật ticket sang `Fixed`.
- **Thời gian:** 17:15 ngày 13/10/2026.

#### Bước 8: Trạng thái Retest và Verified (Lần 2)
- **Người thực hiện:** Đặng Văn F (Tester).
- **Hành động:**
  - Tiến hành kiểm thử lại toàn diện trên build `v1.0.0-build215`:
    + Kiểm tra kịch bản giảm giá vượt mức: Tổng tiền hiển thị 0 VNĐ, bấm xác nhận thì hệ thống xuất vé thành công ngay lập tức, không xuất hiện giao dịch hoàn tiền âm.
    + Kiểm tra kịch bản thanh toán bình thường: Giao dịch qua cổng thanh toán vẫn vận hành chuẩn xác.
  - Xác nhận lỗi đã được khắc phục hoàn toàn và không phát sinh lỗi phụ (Regression Pass).
  - Cập nhật ticket sang trạng thái `Verified`.
- **Thời gian:** 18:00 ngày 13/10/2026.

#### Bước 9: Trạng thái Closed
- **Người thực hiện:** Phạm Thị Mai (QA Lead).
- **Hành động:**
  - Rà soát toàn bộ lịch sử xử lý, nhật ký bằng chứng kiểm thử lại và xác nhận của Tester F.
  - Đánh giá lỗi đã được giải quyết triệt để theo đúng tiêu chuẩn chất lượng.
  - Chuyển trạng thái ticket sang `Closed` để hoàn tất vòng đời của defect.
- **Thời gian:** 18:30 ngày 13/10/2026.

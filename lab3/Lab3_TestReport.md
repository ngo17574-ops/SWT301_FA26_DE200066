# Thực hành viết Test Report (Defect Report) — Hệ thống bán vé xem phim "CinemaFU"

---

## 1. Tóm tắt lý thuyết cần nhớ

### 1.1 Defect lifecycle

```
New ──► Assigned ──► Open ──► Fixed ──► Retest ──► Verified ──► Closed
                       ▲                  │
                       └──── Reopened ◄───┘ (retest vẫn fail)
```
Một defect cũng có thể kết thúc ở **Rejected** (không phải lỗi), **Duplicate** (trùng lỗi đã có), hoặc **Deferred** (để lại release sau) thay vì đi hết vòng đời.

### 1.2 Mục đích của defect report

1. Cung cấp đủ thông tin để dev **xác định, cô lập và sửa** defect.
2. Giúp Test Manager **theo dõi chất lượng** sản phẩm và tiến độ test.
3. Cho **ý tưởng cải tiến quy trình** phát triển/kiểm thử.

### 1.3 Nội dung một defect report (các trường bắt buộc)

ID · Title/Summary · Ngày & người báo cáo · Test object & version (build) · Environment · Steps to reproduce · Expected result · Actual result · Evidence · **Severity** · **Priority** · Status · References · (Khác: phạm vi ảnh hưởng, root cause nếu biết, đề xuất).

### 1.4 Phân biệt Severity vs Priority

| | Priority **cao** | Priority **thấp** |
|---|---|---|
| **Severity cao** | Lỗi nghiêm trọng + cần sửa ngay (vd: crash khi thanh toán) | Lỗi nghiêm trọng nhưng hiếm gặp/ít người dùng |
| **Severity thấp** | Lỗi nhỏ nhưng ảnh hưởng hình ảnh/thời điểm nhạy cảm, cần sửa gấp | Lỗi nhỏ, không gấp (vd: lệch vài px) |

---

## 2. Hệ thống dùng để thực hành: CinemaFU — Bán vé xem phim trực tuyến

**Mô tả chung:** CinemaFU là website/app đặt vé xem phim, gồm các module chính:

- **Đăng ký/Đăng nhập**, tài khoản thành viên (có hạng: Thường, Bạc, Vàng).
- **Danh sách phim & lịch chiếu**: chọn phim → chọn rạp → chọn suất chiếu (ngày, giờ, phòng chiếu 2D/3D).
- **Sơ đồ ghế**: ghế thường, ghế VIP, **ghế đôi (couple)**; hiển thị ghế trống/đã đặt theo thời gian thực.
- **Combo bắp nước**: chọn thêm đồ ăn/nước uống đi kèm vé.
- **Mã giảm giá & điểm thành viên**: áp mã khuyến mãi, tích/dùng điểm thành viên theo hạng.
- **Thanh toán**: thẻ ngân hàng, ví điện tử, hoặc giữ vé thanh toán tại quầy.
- **Vé điện tử**: xuất vé kèm mã QR, gửi email xác nhận.
- **Hủy/đổi vé**, đánh giá phim sau khi xem.

Bạn sẽ đóng vai **Tester** của dự án CinemaFU, nhận các tình huống lỗi phát hiện được trong quá trình test, và phải **viết lại thành defect report hoàn chỉnh** theo đúng mẫu ở mục 5.6.3.

---

## 3. Mẫu (Template) trống — dùng để điền cho mỗi defect

```
ID:
Title/Summary:
Reporter / Ngày báo cáo:
Test object & version (build):
Environment (OS, Browser/App version, thiết bị, DB...):
Reference (Test case / User story / Requirement liên quan):

Preconditions:

Steps to reproduce:
1.
2.
3.

Expected result:
Actual result:
Evidence (screenshot/video/log — mô tả hoặc tên file):

Severity:          (giải thích vì sao chọn mức này)
Priority:          (giải thích vì sao chọn mức này)
Status:
Reproducibility:   (vd: 5/5 lần)
Ghi chú / Root cause nghi ngờ (nếu có):
```
### 3.1. Mục đích của defect report

1. Cung cấp cho dev và người liên quan **đủ thông tin** để xác định, cô lập và sửa defect.
2. Giúp Test Manager **theo dõi chất lượng** sản phẩm và tiến độ test.
3. Cung cấp **ý tưởng cải tiến quy trình** phát triển và kiểm thử (vd: thấy nhiều lỗi requirement → tăng cường review requirement).

### 3.2. Nội dung một defect report (K3)

| Trường | Ý nghĩa |
|---|---|
| ID | Mã định danh duy nhất |
| Title / Summary | Tóm tắt ngắn gọn, rõ ràng vấn đề |
| Ngày, người báo cáo | Ai phát hiện, khi nào |
| Test object & version | Phần mềm, module, **build** đang test |
| Environment | OS, browser, môi trường, DB… |
| Steps to reproduce | Các bước tái hiện chi tiết |
| Expected result | Kết quả mong đợi (theo spec) |
| Actual result | Kết quả thực tế |
| Evidence | Screenshot, video, log |
| **Severity** | Mức độ **tác động** tới hệ thống (do tester đánh giá) |
| **Priority** | Mức độ **cấp bách** cần sửa (thường do PO/PM quyết định) |
| Status | Trạng thái trong lifecycle |
| References | Test case, requirement, user story liên quan |
| Khác | Phạm vi ảnh hưởng, root cause (nếu biết), đề xuất, lịch sử thay đổi |

**Severity vs Priority — hay bị nhầm:**

| Trường hợp | Ví dụ ShopFU |
|---|---|
| Severity **cao**, Priority **cao** | Bấm "Thanh toán" thì app crash → không ai mua được hàng |
| Severity **cao**, Priority **thấp** | Báo cáo Admin crash khi xuất dữ liệu năm 1990 (gần như không ai dùng) |
| Severity **thấp**, Priority **cao** | Logo công ty trên trang chủ bị sai màu / tên thương hiệu sai chính tả → ảnh hưởng hình ảnh, sửa gấp trước buổi ra mắt |
| Severity **thấp**, Priority **thấp** | Lệch 2px ở footer trang "Điều khoản" |

### 3.3. Ví dụ một defect report hoàn chỉnh

> **ID:** SHOP-231
> **Title:** Tổng tiền đơn hàng bị âm khi áp mã giảm giá 100% cho đơn có phí ship
> **Reporter / Date:** Nguyễn Thị Chi / 2026-10-12
> **Test object:** ShopFU Web — module Checkout, build `v2.0.3-build145`
> **Environment:** Staging; Windows 11; Chrome 129; DB snapshot 2026-10-10
> **Reference:** TC-CHK-045; User story US-78 "Áp mã giảm giá"; REQ-PAY-012 v1.2
>
> **Preconditions:** Tài khoản `test01@shopfu.vn` đã đăng nhập; mã `FREE100` (giảm 100%) còn hiệu lực.
>
> **Steps to reproduce:**
> 1. Thêm sản phẩm "Áo thun FU" (giá 150.000đ) vào giỏ hàng.
> 2. Vào trang Checkout, chọn địa chỉ giao hàng tại Hà Nội (phí ship 30.000đ).
> 3. Nhập mã `FREE100`, bấm "Áp dụng".
> 4. Quan sát mục "Tổng thanh toán".
>
> **Expected result:** Theo REQ-PAY-012, mã giảm giá chỉ áp dụng cho giá sản phẩm → Tổng thanh toán = **30.000đ** (chỉ còn phí ship).
> **Actual result:** Tổng thanh toán hiển thị **-150.000đ**; nút "Thanh toán" vẫn bấm được.
> **Evidence:** `SHOP-231_screenshot.png`, `console_log.txt`
>
> **Severity:** Critical (sai lệch tiền, có thể gây thất thoát)
> **Priority:** High (đề xuất)
> **Status:** New
> **Reproducibility:** 5/5 lần
> **Ghi chú:** Lỗi chỉ xảy ra khi giá trị giảm ≥ giá sản phẩm. Với mã `SALE50` (giảm 50%) kết quả đúng. Nghi ngờ hệ thống trừ giảm giá 2 lần (một lần trên giá sản phẩm, một lần trên tổng).

### 3.4. Ví dụ defect report KÉM để so sánh

> **Title:** Lỗi thanh toán
> **Mô tả:** Mã giảm giá bị lỗi, tiền sai. Dev sửa gấp!!!

→ Thiếu: build, môi trường, các bước tái hiện, expected/actual, bằng chứng; giọng điệu không khách quan. Dev không thể tái hiện được.

### Checklist defect report tốt

- ✅ **Ngắn gọn, chính xác, khách quan** — mô tả sự kiện, không chỉ trích ai (nhớ phần *psychology of testing* ở Chương 1).
- ✅ **Tái hiện được** — bước đầy đủ, có test data cụ thể.
- ✅ Có **expected và actual** rõ ràng.
- ✅ **Một report = một defect** (không gộp nhiều lỗi).
- ✅ Ghi rõ **build / version / environment** (gắn với configuration management — 5.4).
- ✅ **Liên kết** tới test case, requirement.
- ✅ Kiểm tra **trùng lặp** trước khi log.
---

## 4. Yêu cầu thực hành

### Yêu cầu 1 — Viết lại một mô tả lỗi "kém" thành defect report đầy đủ

Một tester mới log lỗi sau đây (giống kiểu mô tả KÉM trong ví dụ 5.6.4 của `Chapter5.md`):

> **Title:** Lỗi chọn ghế
> **Mô tả:** Đặt ghế đôi bị sao đó, tiền tính sai. Sửa gấp!!!

**Việc cần làm:** Dựa vào bối cảnh hệ thống CinemaFU ở Mục 2, hãy **tự bổ sung hợp lý** các chi tiết còn thiếu (build, environment, bước tái hiện cụ thể, expected/actual...) và viết lại thành một defect report đầy đủ, khách quan theo mẫu ở Mục 3. Gợi ý kịch bản thực tế để bạn cụ thể hóa: khi khách chọn **1 ghế đôi (couple)** ở hàng F, hệ thống tính giá **gấp đôi giá ghế đôi** thay vì tính đúng giá niêm yết cho 1 ghế đôi.

### Yêu cầu 2 — Viết defect report cho 5 kịch bản lỗi sau (áp dụng đúng 4 trường hợp Severity/Priority ở Mục 1.4)

Với **mỗi kịch bản**, hãy viết đầy đủ defect report theo mẫu Mục 3 — được phép tự thêm chi tiết hợp lý (build, environment, test data cụ thể) miễn **nhất quán với mô tả lỗi**. Quan trọng nhất: tự xác định **Severity** và **Priority** phù hợp, kèm **1–2 câu giải thích vì sao**.

1. **(Severity cao – Priority cao)** Tại bước thanh toán, khi khách chọn phương thức "Ví điện tử" và số dư ví không đủ, hệ thống vẫn hiển thị "Thanh toán thành công", xuất vé điện tử, nhưng thực tế **không trừ tiền** và ghế vẫn được giữ cho khách đó — đồng nghĩa khách xem phim miễn phí và rạp thất thu.

2. **(Severity cao – Priority thấp)** Chức năng **xuất báo cáo doanh thu theo rạp** cho khoảng thời gian **vượt quá 2 năm** (ví dụ từ 2022 đến 2026) bị treo trang (không crash toàn hệ thống, nhưng không xuất được báo cáo) — tính năng này chỉ được bộ phận kế toán dùng 1 lần/năm vào dịp tổng kết.

3. **(Severity thấp – Priority cao)** Trên banner trang chủ quảng bá **suất chiếu ra mắt phim bom tấn cuối tuần này**, tên phim bị hiển thị sai chính tả (" Avatar: Lứa Nước" thay vì "Avatar: Dòng Chảy Của Cát") — banner này đang chạy ngay trước đợt mở bán vé sớm (presale) được truyền thông rộng rãi.

4. **(Severity thấp – Priority thấp)** Trên giao diện mobile (độ phân giải nhỏ), icon ghế "VIP" bị lệch khoảng 4px so với icon ghế "Thường" trong chú thích (legend) sơ đồ ghế, không ảnh hưởng chức năng chọn ghế.

5. **(Tự phân tích — không gợi ý sẵn mức độ)** Khi khách hàng hạng **Vàng** áp dụng đồng thời **mã giảm giá sinh viên (giảm 20%)** và **điểm thành viên Vàng (quy đổi giảm thêm 15%)** cho cùng một đơn vé + combo, tổng tiền thanh toán hiển thị là **số âm**, và hệ thống vẫn cho phép bấm "Xác nhận thanh toán" với số âm đó (tạo ra giao dịch hoàn tiền ảo vào ví khách hàng). Hãy tự đánh giá Severity và Priority cho trường hợp này và giải thích lý do.

### Yêu cầu 3 — Mô phỏng vòng đời (lifecycle) cho 1 defect

Chọn **một trong 5 defect** ở Yêu cầu 2 (khuyến khích chọn defect số 1 hoặc số 5), viết một đoạn mô phỏng vòng đời defect theo đúng các trạng thái ở Mục 1.1, mỗi trạng thái ghi rõ: **ai** thực hiện, **làm gì**, **khi nào** (tương tự ví dụ `SHOP-231` trong `Chapter5.md`: *New → Assigned → Open → Fixed → Retest → Verified → Closed*, hoặc có thể có nhánh **Reopened** nếu bạn muốn mô phỏng tình huống fix lần đầu chưa triệt để).

### Yêu cầu 4 (nâng cao, liên hệ mục 5.3.2) — Viết một Test Summary Report ngắn

Giả sử nhóm QA đã hoàn thành đợt test cho **Release 1.0 của CinemaFU** trước khi ra mắt, với số liệu sau:

- Tổng số test case: 180, đã thực thi 176 (97,8%), pass 162.
- Còn mở: 2 defect Critical (gồm đúng defect số 1 và số 5 ở Yêu cầu 2 — **chưa fix xong**), 3 defect Medium (lỗi hiển thị trên một số dòng điện thoại Android cũ), 4 defect Low.
- Rủi ro còn tồn đọng: chưa test tải (load test) với kịch bản **mở bán vé đồng thời 5.000 người** trong giờ cao điểm trước suất chiếu hot.

**Việc cần làm:** Dựa theo cấu trúc Test Summary Report ở mục 5.3.2 trong `Chapter5.md` (tóm tắt test đã thực hiện, sai lệch so với kế hoạch, mức đạt exit criteria, tổng kết defect & rủi ro còn tồn đọng, lessons learned, **đề xuất release hay không**), hãy viết một đoạn Test Summary Report ngắn (150–250 từ) cho tình huống trên — lưu ý: với 2 defect Critical còn mở, bạn cần đưa ra **khuyến nghị hợp lý** (có nên release đúng hạn không, hay delay, hay release có điều kiện).

---

## 5. Checklist tự chấm bài làm (dựa trên mục 5.6.5 `Chapter5.md`)

Sau khi hoàn thành các Yêu cầu 1–4, tự kiểm tra lại từng defect report đã viết:

- [ ] Ngắn gọn, chính xác, **khách quan** — chỉ mô tả sự kiện, không chỉ trích cá nhân nào.
- [ ] Có đủ **bước tái hiện (steps to reproduce)** cụ thể, kèm test data rõ ràng (ví dụ: tên phim, mã ghế, mã giảm giá cụ thể — không viết chung chung "chọn ghế bất kỳ").
- [ ] Có **Expected result** và **Actual result** tách bạch, rõ ràng.
- [ ] **Một report chỉ mô tả một defect** (không gộp nhiều lỗi khác nhau vào 1 report).
- [ ] Ghi rõ **build/version/environment** test.
- [ ] Có **Severity** và **Priority** kèm **giải thích lý do** lựa chọn (không chỉ ghi mức độ suông).
- [ ] Có liên kết tới **test case/user story/requirement** liên quan (References).
- [ ] (Yêu cầu 3) Vòng đời defect mô tả đúng thứ tự trạng thái, có ghi rõ ai/làm gì/khi nào ở từng bước.
- [ ] (Yêu cầu 4) Test Summary Report có đủ: kết quả thực thi, tình trạng defect còn mở, rủi ro tồn đọng, và **kết luận đề xuất release rõ ràng** (không bỏ lửng).

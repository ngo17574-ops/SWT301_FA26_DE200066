# Progress Test 3 — Static Testing (Review & Code Review)

> Bối cảnh chung: dự án **CineFU**, website đặt vé xem phim online gồm các chức năng Chọn phim/suất chiếu, Chọn ghế, Thanh toán hóa đơn, Vé điện tử, Hủy vé.
>
> Thời gian làm bài: 60 phút · Tổng điểm: 10 (Bài 1: 4 điểm, Bài 2: 6 điểm)

---

## Bài 1 — Review tài liệu SRS chức năng Đặt vé xem phim (4 điểm)

### Đề bài

Bạn là **reviewer** (góc nhìn Tester) trong một buổi **technical review**. Hãy đọc đoạn SRS sau và tìm **càng nhiều requirement defect càng tốt (ít nhất 10)**. Với mỗi defect, ghi: *ID requirement – loại defect – mô tả – đề xuất sửa*.

Các loại requirement defect cần nhận diện: **Mơ hồ (ambiguous)**, **Mâu thuẫn (contradictory/inconsistent)**, **Thiếu (missing/incomplete)**, **Không kiểm thử được (untestable)**, **Không chính xác / phi thực tế (incorrect/unrealistic)**, **Dư thừa / trùng lặp (redundant)**.

> **SRS CineFU — Mục 4: Đặt vé xem phim (v0.5)**
>
> **REQ-4.1** Người dùng chọn phim, rạp, suất chiếu, sau đó chọn ghế trên sơ đồ phòng chiếu và tiến hành thanh toán.
>
> **REQ-4.2** Mỗi lần đặt, người dùng được chọn tối đa 8 ghế.
>
> **REQ-4.3** Ghế đang được người khác giữ hoặc đã bán hiển thị màu xám và không thể chọn.
>
> **REQ-4.4** Ghế được giữ cho người dùng trong 10 phút kể từ khi chọn ghế. Hết thời gian mà chưa thanh toán, ghế được trả lại.
>
> **REQ-4.5** Hệ thống không cho phép để trống một ghế lẻ giữa các ghế đã chọn.
>
> **REQ-4.6** Giá vé: ghế thường 90.000đ, ghế VIP 120.000đ, ghế đôi 200.000đ. Giá vé vào cuối tuần cao hơn ngày thường.
>
> **REQ-4.7** Phim có nhãn **T18** chỉ bán vé cho khách hàng từ 18 tuổi trở lên.
>
> **REQ-4.8** Người dùng được chọn tối đa 10 ghế cho mỗi giao dịch.
>
> **REQ-4.9** Sau khi thanh toán thành công, hệ thống gửi vé điện tử (mã QR) qua email **ngay lập tức**.
>
> **REQ-4.10** Người dùng được hủy vé và hoàn tiền 100% bất cứ lúc nào.
>
> **REQ-4.11** Hệ thống phải phục vụ được **không giới hạn** số người dùng đặt vé đồng thời mà không bị chậm.
>
> **REQ-4.12** Không được hủy vé trong vòng 2 giờ trước giờ chiếu.
>
> **REQ-4.13** Ghế đã có người khác giữ thì người dùng không được chọn.
>
> **REQ-4.14** Giao diện sơ đồ chọn ghế phải trực quan, dễ sử dụng.

*Ghi chú: Ở Mục 2 (Đăng ký tài khoản) của SRS, người dùng chỉ cung cấp email, số điện thoại và mật khẩu.*

---

## Bài 2 — Code review module Thanh toán hóa đơn đặt vé (6 điểm)

### Đề bài

Bạn là reviewer trong một buổi **inspection** cho class `payment_service` (Java) của CineFU. Hãy đối chiếu code với **business rule** và **coding convention** bên dưới để tìm defect. Với mỗi defect ghi: **số dòng – nhóm lỗi – mô tả – hậu quả – cách sửa**. Yêu cầu tìm **ít nhất 10 defect**, thuộc ít nhất 5 nhóm lỗi khác nhau.

**Business rule (từ requirement đã được duyệt):**

| Mã | Business rule |
|---|---|
| BR1 | Tiền vé = Σ giá từng ghế. Giá ghế lấy từ **bảng giá** (`priceTableRepo`) theo loại ghế: `STANDARD`, `VIP`, `COUPLE` (hiện tại lần lượt 90.000đ / 120.000đ / 200.000đ, có thể thay đổi). |
| BR2 | Mỗi hóa đơn có **từ 1 đến 8 ghế**; vi phạm → ném `InvalidBookingException`. |
| BR3 | Chỉ được thanh toán khi booking ở trạng thái `HOLDING` **và** thời gian giữ ghế **chưa quá 10 phút**; vi phạm → ném `BookingExpiredException`. |
| BR4 | Suất chiếu vào **Thứ 7 hoặc Chủ nhật**: phụ thu **10%** trên tiền vé. |
| BR5 | Giảm giá thành viên trên tiền vé (sau phụ thu): `GOLD` giảm **10%**, `PLATINUM` giảm **15%**, khách thường (`NONE`) không giảm. Không áp dụng cho combo bắp nước. |
| BR6 | Cộng giá combo bắp nước (`comboPrice`) sau khi đã giảm giá thành viên. |
| BR7 | Voucher (nếu có): mã **không phân biệt hoa/thường, bỏ khoảng trắng đầu cuối**; mã không tồn tại hoặc hết hạn → báo lỗi; mỗi voucher giảm **tối đa 50.000đ**. |
| BR8 | Tổng thanh toán **không được âm** và được **làm tròn đến 1.000đ** (≥ 500đ làm tròn lên). |
| BR9 | Số điện thoại nhận vé: đúng **10 chữ số**, bắt đầu bằng **0**; không hợp lệ → ném `IllegalArgumentException` trước khi tính tiền. |
| BR10 | Mã hóa đơn có dạng `INV-yyyyMMdd-<bookingId>` (ngày lập hóa đơn), vd. `INV-20261021-1503`. |

**Coding convention của team:**
- Class: `PascalCase`; method/biến: `camelCase`, tên có nghĩa; hằng số: `UPPER_SNAKE_CASE`.
- Tiền tệ dùng `BigDecimal`, không dùng `double`/`float`.
- Không có magic number / hardcode giá trị nghiệp vụ, secret trong code.
- Luôn dùng `{ }` cho `if/else/for`, kể cả khi chỉ có 1 lệnh.
- Ghi log bằng `Logger`, không dùng `System.out.println`.
- Một method không quá 30 dòng, chỉ làm một việc (Single Responsibility).

```java
 1  public class payment_service {
 2
 3      private static final String API_KEY = "sk_live_cinefu_8f2a91c7";
 4      private int Discount_Rate;
 5
 6      public double CalcInvoice(Booking b, String voucher, String memberLevel, String phone) {
 7          double t = 0;
 8          for (int i = 1; i < b.getSeats().size(); i++) {
 9              Seat s = b.getSeats().get(i);
10              if (s.getType() == "VIP") t += 120000;
11              else if (s.getType().equals("COUPLE")) t += 200000;
12              else t += 90000;
13          }
14
15          if (b.getSeats().size() > 8) {
16              throw new InvalidBookingException("Too many seats");
17          }
18
19          if (b.getStatus().equals("HOLDING") || b.getHoldMinutes() <= 10) {
20              // ok
21          } else {
22              return 0;
23          }
24
25          if (b.getShowDate().getDayOfWeek() == DayOfWeek.SATURDAY) {
26              t = t * 1.1;
27          }
28
29          if (memberLevel.equals("GOLD")) {
30              t = t - t * 10 / 100;
31          } else if (memberLevel.equals("PLATINUM")) {
32              t = t - t * 10 / 100;
33          }
34
35          t = t + b.getComboPrice();
36
37          if (voucher != null) {
38              Voucher v = voucherRepo.findByCode(voucher);
39              t = t - v.getAmount();
40          }
41
42          if (phone.length() != 10 && !phone.startsWith("0")) {
43              System.out.println("Phone invalid");
44          }
45
46          t = (long) t / 1000 * 1000;
47          String invoiceNo = "INV-" + new Date().getYear() + b.getId();
48          String seatList = "";
49          for (Seat s : b.getSeats()) {
50              seatList = seatList + s.getCode() + ",";
51          }
52          System.out.println("Invoice " + invoiceNo + " seats: " + seatList);
53          return t;
54      }
55  }
```

**Checklist code review gợi ý:**

| # | Nhóm | Câu hỏi kiểm tra |
|---|---|---|
| C1 | Name convention | Tên class/method/biến/hằng có đúng convention và có nghĩa không? |
| C2 | Code styling | Có thiếu `{ }`, dùng `System.out`, method quá dài / làm nhiều việc không? |
| C3 | Logic | Vòng lặp, toán tử `&&`/`\|\|`, công thức, điều kiện biên có khớp business rule không? |
| C4 | Validation | Input (`null`, rỗng, sai định dạng, vượt giới hạn) có được kiểm tra **trước khi dùng** không? |
| C5 | Hardcode / Magic number | Có hardcode giá, tỷ lệ, ngưỡng, secret trong code không? |
| C6 | Xử lý String | So sánh chuỗi, trim/hoa-thường, ghép chuỗi trong vòng lặp, format chuỗi có đúng không? |
| C7 | Kiểu dữ liệu / Exception | Kiểu tiền tệ, làm tròn, xử lý lỗi (return giá trị "ma" thay vì ném exception)? |
| C8 | Security | Có lộ secret / dữ liệu nhạy cảm không? |

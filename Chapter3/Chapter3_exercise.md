# Chapter 3 — Bài tập Static Testing

> Bối cảnh chung: dự án **ShopFU** (website bán hàng online: Đăng ký/Đăng nhập, Tìm kiếm, Giỏ hàng, Thanh toán, Báo cáo Admin).

---

## Mục lục nội dung
1. [Bài 1 — Static hay Dynamic? Phân loại defect](#bài-1--static-hay-dynamic-phân-loại-defect)
   - [Đề bài](#đề-bài-1)
   - [Bảng phân tích chi tiết 12 tình huống](#bảng-phân-tích-chi-tiết-12-tình-huống)
   - [Nhận xét & So sánh Static vs Dynamic Testing](#nhận-xét--so-sánh-static-vs-dynamic-testing)
2. [Bài 2 — Review tài liệu requirement (SRS) chức năng Đăng ký tài khoản](#bài-2--review-tài-liệu-requirement-srs-chức-năng-đăng-ký-tài-khoản)
   - [Đề bài](#đề-bài-2)
   - [Bảng phát hiện 10 Defect trong tài liệu SRS](#bảng-phát-hiện-10-defect-trong-tài-liệu-srs)
   - [Bản đặc tả SRS chuẩn hóa sau Review](#bản-đặc-tả-srs-chuẩn-hóa-sau-review)
3. [Bài 4 — Code review theo checklist (module Giỏ hàng & Đơn hàng)](#bài-4--code-review-theo-checklist-module-giỏ-hàng--đơn-hàng)
   - [Đề bài & Business Rules](#đề-bài--business-rules)
   - [Mã nguồn Java ban đầu (OrderService.java)](#mã-nguồn-java-ban-đầu-orderservicejava)
   - [Bảng phân tích chi tiết theo Checklist (K1 - K8)](#bảng-phân-tích-chi-tiết-theo-checklist-k1---k8)
   - [Phân tích các Defect nằm ngoài Checklist](#phân-tích-các-defect-nằm-ngoài-checklist)
   - [Mã nguồn Java sau khi Refactor hoàn chỉnh](#mã-nguồn-java-sau-khi-refactor-hoàn-chỉnh)

---

## Bài 1 — Static hay Dynamic? Phân loại defect

### Đề bài 1

Cho 12 tình huống phát hiện vấn đề trong dự án ShopFU. Với mỗi tình huống, hãy cho biết:
- **(a)** Vấn đề này được phát hiện **hiệu quả nhất** bằng **Static testing** (Review / Static analysis) hay **Dynamic testing**?
- **(b)** Thuộc **loại defect** nào? Chọn trong: *Requirement defect, Design defect, Coding defect, Vi phạm chuẩn (standard), Interface defect, Security vulnerability, Thiếu traceability/coverage của test basis, Code khó bảo trì, Failure khi chạy (performance / memory / hành vi sai)*.
- **(c)** Giải thích lý do lựa chọn.

### Bảng phân tích chi tiết 12 tình huống

| # | Tình huống | (a) Kỹ thuật | (b) Loại defect | Giải thích chi tiết |
|---|---|---|---|---|
| **1** | Tài liệu SRS ghi "Trang chủ phải tải **nhanh**", không có con số cụ thể. | **Static testing** (Review tài liệu SRS) | **Requirement defect** (Mơ hồ, không kiểm thử được) | Từ "nhanh" là cảm tính, phi định lượng. Đọc tài liệu là phát hiện ra ngay mà không cần lập trình hay chạy ứng dụng. Tester không thể viết test case có Expected Result cụ thể. |
| **2** | Khi 2.000 người dùng cùng truy cập trong đợt sale 11/11, trang thanh toán mất 15 giây mới phản hồi. | **Dynamic testing** (Performance / Load testing) | **Failure khi chạy** (Hiệu năng / Performance bottleneck) | Hiện tượng nghẽn tải, trễ phản hồi (15s) chỉ quan sát và đo lường được khi hệ thống đang vận hành thực tế dưới tải lớn đồng thời (2.000 concurrent users). Static testing không thể đo đạc con số này. |
| **3** | Tài liệu design API: module Giỏ hàng gửi `price` theo đơn vị **nghìn đồng**, còn tài liệu của module Payment ghi nhận `price` theo đơn vị **đồng**. | **Static testing** (API Specification Review / Interface Review) | **Interface defect / Design defect** | Đối chiếu chéo (cross-check) giữa 2 bản tài liệu thiết kế giao tiếp API trước khi code sẽ phát hiện ngay sự lệch pha về đơn vị dữ liệu (lệch 1.000 lần), ngăn chặn trừ sai tiền nghiêm trọng. |
| **4** | Trong code có một hàm `oldCalculateTax()` không được gọi ở bất kỳ đâu. | **Static testing** (Static Code Analysis / Linter) | **Code khó bảo trì** (Dead code / Unused code) | Công cụ phân tích tĩnh hoặc IDE compiler dựng Call Graph và chỉ ra ngay hàm không bao giờ được gọi. Mã chết làm phình kích thước file, gây hoang mang và tốn công bảo trì. |
| **5** | Server ShopFU bị tràn bộ nhớ (Out Of Memory - OOM) sau 3 ngày chạy liên tục. | **Dynamic testing** (Endurance Testing / Soak Testing) | **Failure khi chạy** (Rò rỉ bộ nhớ / Memory leak) | Hiện tượng rò rỉ bộ nhớ tích tụ chậm qua thời gian vận hành thực tế. Sự cố sập server (OOM) chỉ được kiểm chứng và tái hiện bằng việc cho hệ thống chạy liên tục kết hợp công cụ Memory Profiler. |
| **6** | Code có câu lệnh `"SELECT * FROM products WHERE name LIKE '%" + keyword + "%'"`. | **Static testing** (SAST / Security Code Review) | **Security vulnerability** (Lỗ hổng SQL Injection) | Ghép chuỗi trực tiếp tham số người dùng vào câu lệnh SQL là pattern lỗ hổng kinh điển. Review bằng mắt hoặc quét bằng công cụ SAST phát hiện ngay lập tức mà không cần gửi payload khai thác. |
| **7** | Requirement "Hoàn tiền khi khách hủy đơn" không có test case nào được viết cho nó. | **Static testing** (Review RTM - Traceability Matrix) | **Thiếu traceability / coverage của test basis** | Đối chiếu giữa ma trận yêu cầu (SRS) và danh sách kịch bản kiểm thử (Test Cases) phát hiện ngay vùng nghiệp vụ bị bỏ sót. Đây là hoạt động rà soát tài liệu tĩnh hoàn toàn. |
| **8** | Hàm `processOrder()` dài 750 dòng, có cyclomatic complexity = 52. | **Static testing** (Static Code Metric Analysis) | **Code khó bảo trì** (High Complexity / God Method) | Độ phức tạp xoay vòng (CC=52) và độ dài (750 LOC) được tính toán tự động dựa trên đồ thị dòng điều khiển (CFG) của mã nguồn mà không cần chạy chương trình. Hàm quá phức tạp cực kỳ dễ sinh lỗi. |
| **9** | Tên biến trong module Báo cáo đặt kiểu `a`, `b`, `x1`, `tmp2`, trái với coding convention của team. | **Static testing** (Code Review / Linter) | **Vi phạm chuẩn** (Coding convention violation) | Quy tắc đặt tên biến có ý nghĩa được phát hiện trực quan bằng Code Review hoặc cấu hình Rule trong Linter (SonarLint, Checkstyle). Lỗi không làm sai kết quả chạy nhưng phá vỡ tiêu chuẩn kỹ thuật. |
| **10** | Thiết kế database lưu đầy đủ tên, số điện thoại, địa chỉ khách hàng lặp lại trong **mỗi** bản ghi đơn hàng. | **Static testing** (Database Schema Review) | **Design defect** (Thiết kế DB dư thừa, vi phạm chuẩn hóa) | Xem xét lược đồ quan hệ ERD hoặc file DDL tạo bảng sẽ thấy ngay vi phạm dạng chuẩn hóa (2NF/3NF). Gây lãng phí lưu trữ và nguy cơ dị thường dữ liệu (Update Anomaly) khi khách đổi địa chỉ. |
| **11** | Khách bấm nút "Đặt hàng" 2 lần liên tiếp thì hệ thống tạo 2 đơn hàng giống hệt nhau và trừ tiền 2 lần. | **Dynamic testing** (Functional / Concurrency Testing) | **Failure khi chạy** (Lỗi logic giao dịch / Thiếu Idempotency) | Lỗi phát sinh do tương tác gửi 2 request liên tiếp trong thời gian ngắn (race condition, double-click). Phải chạy ứng dụng thực tế để kiểm tra frontend có disable nút và backend có khóa giao dịch hay không. |
| **12** | User story "Đổi mật khẩu" không có acceptance criteria nào mô tả trường hợp mật khẩu mới trùng mật khẩu cũ. | **Static testing** (Review User Story / Backlog Refinement) | **Requirement defect** (Thiếu Acceptance Criteria) | Đọc tài liệu User Story trong buổi Backlog Refinement sẽ phát hiện thiếu tiêu chí nghiệm thu cho trường hợp biên/ngoại lệ. Phát hiện sớm giúp PO/BA bổ sung trước khi tiến hành code. |

### Nhận xét & So sánh Static vs Dynamic Testing

- **Tỷ lệ phát hiện lỗi:** Trong 12 tình huống thực tế trên, có tới **9 tình huống (chiếm 75%)** được phát hiện hiệu quả nhất bằng **Static Testing** (Review tài liệu, phân tích mã nguồn tĩnh), và **3 tình huống (chiếm 25%)** bắt buộc phải dùng **Dynamic Testing**.
- **Bản chất phát hiện:**
  - **Static Testing:** Tìm trực tiếp **Defect** (nguyên nhân gốc rễ: mơ hồ trong tài liệu, cấu trúc DB sai, code smell, lỗ hổng injection) ngay trong các sản phẩm tĩnh.
  - **Dynamic Testing:** Phát hiện **Failure** (triệu chứng, hậu quả bên ngoài: sập bộ nhớ OOM, phản hồi chậm 15s, trừ tiền 2 lần) khi phần mềm đang thực thi.
- **Nguyên lý Shift-Left Testing:** Đẩy hoạt động kiểm thử về các giai đoạn đầu (Review SRS, Review Architecture & API Design) giúp ngăn ngừa defect lan truyền, tiết kiệm từ 10 đến 100 lần chi phí so với việc sửa lỗi sau khi phần mềm đã triển khai.

---

## Bài 2 — Review tài liệu requirement (SRS) chức năng Đăng ký tài khoản

### Đề bài 2

Bạn là **reviewer** (góc nhìn Tester) trong một buổi **technical review**. Hãy đọc đoạn SRS sau và tìm **càng nhiều requirement defect càng tốt** (ít nhất 8). Với mỗi defect, ghi: *ID requirement – loại defect – mô tả – đề xuất sửa*.

> **SRS ShopFU — Mục 3: Đăng ký tài khoản (v0.3)**
>
> **REQ-3.1** Người dùng đăng ký bằng email, số điện thoại và mật khẩu.  
> **REQ-3.2** Email phải đúng định dạng và không được trùng với tài khoản đã có.  
> **REQ-3.3** Mật khẩu phải có độ dài từ 6 đến 12 ký tự và đủ mạnh.  
> **REQ-3.4** Sau khi bấm "Đăng ký", hệ thống gửi mã OTP về số điện thoại. Người dùng nhập OTP để kích hoạt tài khoản.  
> **REQ-3.5** Mã OTP có hiệu lực trong một khoảng thời gian hợp lý.  
> **REQ-3.6** Mật khẩu phải có độ dài từ 8 đến 16 ký tự, gồm chữ hoa, chữ thường và chữ số.  
> **REQ-3.7** Hệ thống phải xử lý đăng ký thành công cho 100% người dùng trong mọi trường hợp.  
> **REQ-3.8** Người dùng phải từ 18 tuổi trở lên mới được đăng ký.  
> **REQ-3.9** Giao diện trang đăng ký phải thân thiện với người dùng.  
> **REQ-3.10** Email không được trùng với tài khoản đã có trong hệ thống.  

### Bảng phát hiện 10 Defect trong tài liệu SRS

| # | Requirement liên quan | Loại defect | Mô tả chi tiết vấn đề | Đề xuất sửa đổi chuẩn mực |
|---|---|---|---|---|
| **D1** | REQ-3.3 vs REQ-3.6 | **Mâu thuẫn (Contradictory)** | REQ-3.3 yêu cầu độ dài mật khẩu từ 6–12 ký tự, nhưng REQ-3.6 lại yêu cầu từ 8–16 ký tự. Developer và Tester không biết tuân theo quy tắc nào. | Xóa bỏ REQ-3.3. Thống nhất quy chuẩn duy nhất tại REQ-3.6: Mật khẩu có độ dài từ 8 đến 16 ký tự. |
| **D2** | REQ-3.3 | **Mơ hồ / Không kiểm thử được (Ambiguous / Untestable)** | Cụm từ "đủ mạnh" hoàn toàn mang tính cảm tính, không có tiêu chí kỹ thuật định lượng để xác định mật khẩu đạt hay không đạt. | Bổ sung quy định cụ thể: mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (`!@#$%^&*`). |
| **D3** | REQ-3.5 | **Mơ hồ / Không kiểm thử được (Ambiguous / Untestable)** | Cụm từ "trong một khoảng thời gian hợp lý" không có con số cụ thể (bao nhiêu giây hay phút). Tester không thể viết test case kiểm tra hết hạn OTP. | Quy định thời gian hết hạn rõ ràng: "Mã OTP có hiệu lực trong vòng 03 phút (180 giây) kể từ thời điểm gửi SMS thành công." |
| **D4** | REQ-3.7 | **Phi thực tế / Không chính xác (Unrealistic / Incorrect)** | Đòi hỏi hệ thống phải "xử lý đăng ký thành công cho 100% người dùng trong mọi trường hợp" là bất khả thi (không tính đến sự cố mạng viễn thông SMS, sập kết nối, người dùng nhập sai dữ liệu). | Điều chỉnh thành chỉ số SLA định lượng: "Hệ thống đáp ứng tỷ lệ đăng ký thành công tối thiểu 99.5% đối với các yêu cầu hợp lệ trong điều kiện mạng bình thường." |
| **D5** | REQ-3.8 vs REQ-3.1 | **Thiếu / Không khả thi (Missing / Infeasible)** | REQ-3.8 yêu cầu người dùng phải từ 18 tuổi trở lên, nhưng REQ-3.1 danh sách thông tin chỉ có email, SĐT và mật khẩu, hoàn toàn không có trường Ngày sinh để kiểm tra. | Bổ sung trường "Ngày sinh (Date of Birth)" vào REQ-3.1, và quy định công thức tính tuổi: Ngày hiện tại trừ Ngày sinh phải đủ từ 18 tuổi trở lên. |
| **D6** | REQ-3.9 | **Mơ hồ / Không kiểm thử được (Ambiguous / Untestable)** | Cụm từ "Giao diện trang đăng ký phải thân thiện với người dùng" là đánh giá chủ quan, không thể đo lường và nghiệm thu. | Thay bằng tiêu chí Usability cụ thể: "Giao diện tuân thủ Design System ShopFU v1.0, hỗ trợ Responsive từ màn hình 375px trở lên và hiển thị thông báo lỗi inline dưới từng ô nhập sai." |
| **D7** | REQ-3.2 vs REQ-3.10 | **Dư thừa / Trùng lặp (Redundant)** | REQ-3.10 lặp lại nguyên văn quy định "Email không được trùng với tài khoản đã có trong hệ thống" đã được nêu đầy đủ tại REQ-3.2. | Xóa bỏ hoàn toàn REQ-3.10 khỏi tài liệu để tránh dư thừa và tinh gọn đặc tả. |
| **D8** | REQ-3.4 & REQ-3.5 | **Thiếu luồng ngoại lệ & Bảo mật (Missing Exception & Security)** | Không đặc tả xử lý khi: Người dùng nhập sai OTP, nhập sai quá nhiều lần (tấn công brute-force), mã OTP hết hạn, hoặc khi không nhận được tin nhắn SMS. | Bổ sung: Cho phép gửi lại OTP sau 60s; khóa tạm thời 15 phút nếu nhập sai OTP quá 5 lần liên tiếp; hiển thị thông báo lỗi rõ ràng khi OTP hết hạn. |
| **D9** | REQ-3.2 | **Thiếu quy chuẩn kỹ thuật (Incomplete Specification)** | Ghi "Email phải đúng định dạng" nhưng không nêu rõ theo chuẩn nào, độ dài tối đa là bao nhiêu và cách xử lý chữ hoa/thường, khoảng trắng thừa. | Quy định: Email tuân thủ chuẩn RFC 5322 (tối đa 254 ký tự), hệ thống tự động trim khoảng trắng 2 đầu và chuyển về chữ thường trước khi kiểm tra trùng. |
| **D10** | REQ-3.1 | **Thiếu quy định về Số điện thoại (Incomplete Specification)** | Không quy định số điện thoại có được phép trùng không, định dạng đầu số quốc gia (Việt Nam +84 hay quốc tế), và độ dài bao nhiêu số. | Quy định: Số điện thoại phải là số di động Việt Nam gồm đúng 10 chữ số (đầu số 03x, 05x, 07x, 08x, 09x) và mỗi số điện thoại chỉ gắn với 1 tài khoản duy nhất. |

### Bản đặc tả SRS chuẩn hóa sau Review

- **REQ-3.1:** Người dùng đăng ký tài khoản bắt buộc cung cấp: Họ và tên, Email, Số điện thoại, Ngày sinh (DD/MM/YYYY) và Mật khẩu.
- **REQ-3.2:** Email phải tuân thủ định dạng chuẩn RFC 5322, độ dài tối đa 254 ký tự, hệ thống tự động loại bỏ khoảng trắng thừa và kiểm tra không được trùng với tài khoản đã kích hoạt trên hệ thống.
- **REQ-3.3:** Số điện thoại phải là thuê bao di động Việt Nam gồm đúng 10 chữ số, bắt đầu bằng các đầu số hợp lệ (03, 05, 07, 08, 09) và không được trùng với tài khoản đã có.
- **REQ-3.4:** Mật khẩu có độ dài từ 8 đến 16 ký tự, bao gồm ít nhất: 1 chữ cái in hoa (A-Z), 1 chữ cái in thường (a-z), 1 chữ số (0-9) và 1 ký tự đặc biệt (`!@#$%^&*`).
- **REQ-3.5:** Người dùng phải đủ từ 18 tuổi trở lên tính đến ngày đăng ký (tính theo Ngày sinh nhập vào so với ngày hiện tại của hệ thống).
- **REQ-3.6:** Sau khi gửi thông tin hợp lệ, hệ thống tạo mã OTP gồm 6 chữ số ngẫu nhiên gửi qua SMS tới số điện thoại đăng ký. Mã OTP có hiệu lực đúng 180 giây (03 phút). Người dùng nhập chính xác OTP để kích hoạt tài khoản.
- **REQ-3.7:** Nút "Gửi lại mã OTP" chỉ được kích hoạt sau 60 giây đếm ngược. Nếu người dùng nhập sai OTP quá 5 lần liên tiếp, mã OTP hiện tại bị hủy và hệ thống tạm khóa chức năng đăng ký với số điện thoại này trong vòng 15 phút.
- **REQ-3.8:** Hệ thống đáp ứng tỷ lệ đăng ký thành công >= 99.5% cho các yêu cầu hợp lệ trong điều kiện mạng bình thường. Giao diện trang đăng ký tuân thủ Design System ShopFU v1.0, hỗ trợ hiển thị tốt từ màn hình 375px và thông báo lỗi trực quan dưới từng trường nhập liệu sai.

---

## Bài 4 — Code review theo checklist (module Giỏ hàng & Đơn hàng)

### Đề bài & Business Rules

Bạn là reviewer trong một buổi **inspection** cho class `OrderService` (Java). Hãy dùng checklist bên dưới để tìm defect. Với mỗi defect ghi: **số dòng – mục checklist – mô tả – hậu quả – cách sửa**. Cố gắng tìm thêm ít nhất 1 defect **nằm ngoài checklist**.

**Business rules liên quan (đã được phê duyệt):**
1. **BR-01:** Tổng tiền = $\sum (giá \times số\ lượng) - giá\ trị\ mã\ giảm\ giá$; tổng tiền **không được âm** ($\ge 0$).
2. **BR-02:** Đơn từ **500.000đ** trở lên được **miễn phí ship**, ngược lại phí ship 30.000đ.
3. **BR-03:** Chỉ được hủy đơn ở trạng thái `PENDING`.

### Mã nguồn Java ban đầu (OrderService.java)

```java
 1  public class OrderService {
 2      private static final String DB_PASSWORD = "Shopfu@2026";
 3
 4      public double calculateTotal(List<Item> items, String couponCode) {
 5          double total = 0;
 6          for (int i = 0; i <= items.size(); i++) {
 7              total += items.get(i).getPrice() * items.get(i).getQty();
 8          }
 9          if (couponCode != "") {
10              Coupon c = couponRepo.findByCode(couponCode);
11              total = total - c.getValue();
12          }
13          double shipFee = 30000;
14          if (total > 500000);
15              shipFee = 0;
16          return total + shipFee;
17      }
18
19      public void cancelOrder(String orderId) {
20          try {
21              String sql = "UPDATE orders SET status='CANCELLED' WHERE id='" + orderId + "'";
22              db.execute(sql);
23          } catch (Exception e) {
24          }
25     }
26 }
```

### Bảng phân tích chi tiết theo Checklist (K1 - K8)

| Dòng | Checklist | Tên Defect & Đoạn code lỗi | Hậu quả nghiêm trọng | Giải pháp khắc phục chuẩn |
|---|---|---|---|---|
| **2** | **K4** | **Hardcode DB Password:**<br>`private static final String DB_PASSWORD = "Shopfu@2026";` | Lộ mật khẩu cơ sở dữ liệu khi commit mã lên Git repo hoặc decompile file `.class`. Nguy cơ bị chiếm đoạt toàn bộ cơ sở dữ liệu ShopFU. | Xóa hằng số khỏi mã nguồn. Đọc thông tin kết nối từ Biến môi trường (Environment Variable) hoặc Secret Vault. |
| **6** | **K1** | **Off-by-one trong vòng lặp:**<br>`for (int i = 0; i <= items.size(); i++)` | Vòng lặp chạy tới `i == size()`, gọi `items.get(size)` ném `IndexOutOfBoundsException`. Kết quả: MỌI đơn hàng đều sập hàm tính tiền. | Sửa điều kiện thành: `i < items.size()` hoặc chuyển sang vòng lặp for-each an toàn: `for (Item item : items)`. |
| **4, 6** | **K2** | **Thiếu kiểm tra null/rỗng đầu vào:**<br>`items.size()` mà không kiểm tra `items == null` | Nếu client gọi hàm với `items == null`, phương thức lập tức ném `NullPointerException` làm crash ứng dụng. | Bổ sung guard clause: `if (items == null \|\| items.isEmpty()) return 0;` |
| **9** | **K3** | **So sánh String bằng toán tử `!=`:**<br>`if (couponCode != "")` | Toán tử `!=` so sánh tham chiếu ô nhớ. Chuỗi rỗng đối tượng mới vẫn khác `""`. Đặc biệt nếu `couponCode == null` thì `couponCode != ""` vẫn là TRUE, gây lỗi tiếp theo! | Sửa cách kiểm tra chuẩn: `if (couponCode != null && !couponCode.trim().isEmpty())` |
| **10, 11** | **K2** | **Thiếu null check kết quả Coupon:**<br>`c.getValue()` khi `findByCode` trả về `null` | Nếu khách hàng nhập mã coupon không tồn tại, repository trả về `null`. Lệnh `c.getValue()` ném `NullPointerException` lập tức. | Kiểm tra coupon hợp lệ: `if (c != null) { ... }` hoặc ném ngoại lệ thông báo mã giảm giá không tồn tại. |
| **14, 15** | **K8** | **Cú pháp bẫy - Dấu chấm phẩy `;` thừa:**<br>`if (total > 500000);`<br>`    shipFee = 0;` | Dấu `;` làm lệnh `if` kết thúc với thân rỗng. Câu lệnh `shipFee = 0;` luôn luôn được thực thi trong mọi trường hợp! TẤT CẢ đơn hàng đều được free ship (thất thoát doanh thu). | Xóa dấu `;` và luôn đặt thân lệnh trong cặp ngoặc nhọn: `if (total >= 500000) { shipFee = 0; }` |
| **14** | **K7** | **Vi phạm Business Rule miễn phí ship:**<br>`if (total > 500000)` thay vì `>=` | Đơn hàng đúng 500.000đ (giá trị biên) bị tính phí ship 30.000đ, vi phạm chính sách công bố "Đơn từ 500.000đ trở lên được miễn phí ship". | Sửa toán tử so sánh thành `>=`: `if (total >= 500000)` |
| **11** | **K7** | **Vi phạm Business Rule tổng tiền âm:**<br>`total = total - c.getValue();` | Nếu giá trị mã coupon lớn hơn tổng tiền hàng (ví dụ coupon giảm 100k cho đơn 80k), `total` sẽ bị âm (-20k), dẫn đến sai lệch thanh toán. | Ràng buộc giá trị không âm: `total = Math.max(0, total - c.getValue());` |
| **21** | **K5** | **Ghép chuỗi câu lệnh SQL:**<br>`WHERE id='" + orderId + "'"` | Lỗ hổng bảo mật nghiêm trọng SQL Injection. Kẻ tấn công có thể chèn `orderId = "1' OR '1'='1"` để hủy sạch mọi đơn hàng trên hệ thống. | Sử dụng `PreparedStatement` có tham số ràng buộc `?`: `UPDATE orders SET status = 'CANCELLED' WHERE id = ?` |
| **23, 24** | **K6** | **Nuốt ngoại lệ - Empty Catch Block:**<br>`catch (Exception e) { }` | Khi hủy đơn thất bại (mất kết nối DB, lỗi cú pháp), hệ thống im lặng bỏ qua. Khách tưởng đã hủy nhưng đơn vẫn còn, không có log để điều tra sự cố. | Ghi log lỗi: `logger.error("Lỗi hủy đơn: " + orderId, e);` và ném ngoại lệ nghiệp vụ ra ngoài để thông báo lỗi cho người dùng. |

### Phân tích các Defect nằm ngoài Checklist

1. **Lỗi ngoài checklist 1 — Dùng kiểu số thực `double` cho tiền tệ (Floating-point Precision Issue):**
   - *Mô tả:* Biến `total`, `shipFee` và phương thức `getPrice()` dùng kiểu `double`.
   - *Hậu quả:* Kiểu `double` theo chuẩn IEEE 754 sử dụng biểu diễn nhị phân nên không thể biểu diễn chính xác các phân số thập phân, dẫn đến sai số làm tròn số học (ví dụ phép tính có thể ra kết quả `499999.99999999994` thay vì `500000`). Trong hệ thống tài chính, thương mại điện tử, điều này có thể làm sai lệch điều kiện miễn phí ship và sai lệch báo cáo kế toán.
   - *Cách sửa:* Bắt buộc sử dụng `BigDecimal` hoặc kiểu `long` (với đơn vị là đồng) cho toàn bộ các phép tính toán tiền tệ.
2. **Lỗi ngoài checklist 2 — Vi phạm Business Rule số 3 (Không kiểm tra trạng thái PENDING trước khi hủy):**
   - *Mô tả:* Quy tắc nghiệp vụ số 3 nêu rõ: *"Chỉ được hủy đơn ở trạng thái PENDING"*. Tuy nhiên câu lệnh SQL trong `cancelOrder` cập nhật bất chấp mọi trạng thái của đơn hàng (`WHERE id = '...'`).
   - *Hậu quả:* Đơn hàng đang ở trạng thái `SHIPPING` (đang giao hàng) hoặc `COMPLETED` (đã giao thành công) vẫn bị cập nhật thành `CANCELLED`, làm sai lệch toàn bộ quy trình kho bãi, vận chuyển và đối soát doanh thu.
   - *Cách sửa:* Thêm điều kiện kiểm tra trạng thái trong câu SQL hoặc trong logic nghiệp vụ: `UPDATE orders SET status = 'CANCELLED' WHERE id = ? AND status = 'PENDING'`.
3. **Lỗi ngoài checklist 3 — Hàm `cancelOrder` trả về void và không kiểm tra số bản ghi bị ảnh hưởng:**
   - *Mô tả:* Phương thức có kiểu trả về `void` và không kiểm tra kết quả trả về của `db.execute(sql)`. Nếu `orderId` không tồn tại trong hệ thống hoặc không thỏa mãn điều kiện `PENDING`, không có bản ghi nào được cập nhật nhưng phương thức vẫn kết thúc bình thường.
   - *Hậu quả:* Hệ thống thông báo thành công cho người dùng dù thực tế không có đơn hàng nào bị hủy.
   - *Cách sửa:* Chuyển kiểu trả về thành `boolean` hoặc ném ngoại lệ nếu số bản ghi cập nhật bằng 0.
4. **Lỗi ngoài checklist 4 — Thiếu Transaction Management và Injection:**
   - *Mô tả:* Các đối tượng `couponRepo` và `db` được gọi trực tiếp mà không khai báo, không có cơ chế Dependency Injection và quản lý giao dịch.
   - *Hậu quả:* Việc hủy đơn hàng phải đi kèm hoàn kho hoặc hoàn tiền, nếu không có Database Transaction (`@Transactional`), lỗi xảy ra giữa chừng sẽ làm dữ liệu bất đồng bộ.
   - *Cách sửa:* Tiêm phụ thuộc qua Spring Constructor Injection (`@Autowired`), đánh dấu `@Transactional` cho các phương thức ghi dữ liệu.

### Mã nguồn Java sau khi Refactor hoàn chỉnh

```java
package com.shopfu.service;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private static final BigDecimal FREE_SHIP_THRESHOLD = new BigDecimal("500000");
    private static final BigDecimal DEFAULT_SHIP_FEE = new BigDecimal("30000");

    private final CouponRepository couponRepo;
    private final DatabaseConnectionManager dbManager;

    public OrderService(CouponRepository couponRepo, DatabaseConnectionManager dbManager) {
        this.couponRepo = couponRepo;
        this.dbManager = dbManager;
    }

    /**
     * Tinh tong tien don hang theo dung Business Rule BR-01 va BR-02
     */
    public BigDecimal calculateTotal(List<Item> items, String couponCode) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }

        // 1. Tinh tong tien san pham (dung for-each tranh off-by-one)
        BigDecimal subTotal = BigDecimal.ZERO;
        for (Item item : items) {
            if (item != null && item.getPrice() != null && item.getQty() > 0) {
                BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQty()));
                subTotal = subTotal.add(itemTotal);
            }
        }

        // 2. Ap dung Coupon neu co
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            Coupon coupon = couponRepo.findByCode(couponCode.trim());
            if (coupon != null && coupon.isValid()) {
                subTotal = subTotal.subtract(coupon.getValue());
                // BR-01: Tong tien hang khong duoc am
                if (subTotal.compareTo(BigDecimal.ZERO) < 0) {
                    subTotal = BigDecimal.ZERO;
                }
            } else {
                log.warn("Coupon code khong hop le hoac het han: {}", couponCode);
            }
        }

        // 3. Tinh phi van chuyen (BR-02: >= 500k duoc free ship)
        BigDecimal shipFee = DEFAULT_SHIP_FEE;
        if (subTotal.compareTo(FREE_SHIP_THRESHOLD) >= 0) {
            shipFee = BigDecimal.ZERO;
        }

        return subTotal.add(shipFee);
    }

    /**
     * Huy don hang an toan theo dung Business Rule BR-03 va phong chong SQL Injection
     */
    public boolean cancelOrder(String orderId) {
        if (orderId == null || orderId.trim().isEmpty()) {
            throw new IllegalArgumentException("OrderId khong duoc de trong");
        }

        // BR-03: Chi duoc huy don o trang thai PENDING; Dung PreparedStatement chong SQL Injection
        String sql = "UPDATE orders SET status = 'CANCELLED' WHERE id = ? AND status = 'PENDING'";

        try (Connection conn = dbManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, orderId.trim());
            int affectedRows = ps.executeUpdate();
            if (affectedRows > 0) {
                log.info("Huy thanh cong don hang ID: {}", orderId);
                return true;
            } else {
                log.warn("Khong the huy don hang ID: {} (Don khong ton tai hoac khong o trang thai PENDING)", orderId);
                return false;
            }
        } catch (SQLException e) {
            log.error("Loi he thong khi thuc hien huy don hang ID: " + orderId, e);
            throw new RuntimeException("Loi co so du lieu khi huy don hang", e);
        }
    }
}
```
package lab2.account;

import lab2.Account;
import lab2.AccountService;
import lab2.AccountStatus;
import lab2.ResultCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Kiểm thử đơn vị lớp AccountService")
public class AccountServiceTest {

    private static final String DEFAULT_USER = "alice_01";
    private static final String DEFAULT_EMAIL = "alice@example.com";
    private static final String DEFAULT_PASS = "Secret@123";
    private static final LocalDate DEFAULT_DOB = LocalDate.now().minusYears(20);
    private static final String DEFAULT_PHONE = "0912345678";

    private AccountService service;

    @BeforeEach
    void setUp() {
        // Đảm bảo tính độc lập: mỗi test case dùng một instance AccountService mới
        service = new AccountService();
    }

    // =========================================================================
    // NESTED CLASS: REGISTER TESTS (TODO-5)
    // =========================================================================
    @Nested
    @DisplayName("Kiểm thử chức năng register()")
    class Register {

        @Test
        @DisplayName("Đăng ký thành công: trả về SUCCESS và kiểm tra toàn diện trạng thái tài khoản")
        void register_ValidInput_SuccessAndStateCorrect() {
            ResultCode result = service.register(DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE);

            assertEquals(ResultCode.SUCCESS, result);

            // Assert trạng thái được tạo bên trong AccountService
            Optional<Account> accountOpt = service.findByUsername(DEFAULT_USER);
            assertTrue(accountOpt.isPresent(), "Tài khoản phải tồn tại sau khi đăng ký thành công");

            Account account = accountOpt.get();
            assertEquals(DEFAULT_USER, account.getUsername());
            assertEquals(DEFAULT_EMAIL.toLowerCase(Locale.ROOT), account.getEmail(), "Email phải được lưu ở dạng chữ thường");
            assertEquals(AccountStatus.ACTIVE, account.getStatus(), "Trạng thái ban đầu phải là ACTIVE");
            assertEquals(0, account.getFailedAttempts(), "Số lần đăng nhập sai ban đầu phải là 0");
            assertFalse(account.isLocked(), "Tài khoản ban đầu không bị khóa");
            assertNotEquals(DEFAULT_PASS, account.getCurrentPasswordHash(), "Không được lưu mật khẩu dạng bản rõ");
            assertEquals(DEFAULT_PHONE, account.getPhone());
        }

        @ParameterizedTest(name = "[{index}] Phone là ''{0}'' -> Vẫn đăng ký thành công")
        @NullAndEmptySource
        void register_OptionalPhoneNullOrEmpty_Success(String phone) {
            ResultCode result = service.register("bob_02", "bob@example.com", DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, phone);
            assertEquals(ResultCode.SUCCESS, result);
            assertTrue(service.findByUsername("bob_02").isPresent());
        }

        @ParameterizedTest(name = "[{index}] {0}")
        @MethodSource("lab2.account.AccountServiceTest#invalidRegisterInputs")
        void register_InvalidInputsAndPriorityOrder(String description, String u, String e, String p, String c,
                                                    LocalDate dob, String phone, ResultCode expected) {
            ResultCode result = service.register(u, e, p, c, dob, phone);
            assertEquals(expected, result);

            // Đăng ký thất bại thì tuyệt đối không được tạo tài khoản
            if (u != null && !u.isBlank()) {
                assertTrue(service.findByUsername(u).isEmpty(), "Không được lưu tài khoản khi đăng ký thất bại");
            }
        }

        @ParameterizedTest(name = "[{index}] Trùng username (biến thể hoa thường: ''{0}'') -> DUPLICATE_USERNAME")
        @ValueSource(strings = {"alice_01", "ALICE_01", "Alice_01"})
        void register_DuplicateUsername_CaseInsensitive(String duplicateUser) {
            // Đăng ký user ban đầu
            assertEquals(ResultCode.SUCCESS, service.register(DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE));

            // Đăng ký lại với username trùng (khác hoa thường)
            ResultCode result = service.register(duplicateUser, "other@example.com", DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE);
            assertEquals(ResultCode.DUPLICATE_USERNAME, result);
        }

        @ParameterizedTest(name = "[{index}] Trùng email (biến thể hoa thường: ''{0}'') -> DUPLICATE_EMAIL")
        @ValueSource(strings = {"alice@example.com", "ALICE@EXAMPLE.COM", "Alice@Example.Com"})
        void register_DuplicateEmail_CaseInsensitive(String duplicateEmail) {
            // Đăng ký user ban đầu
            assertEquals(ResultCode.SUCCESS, service.register(DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE));

            // Đăng ký user mới nhưng trùng email
            ResultCode result = service.register("charlie_03", duplicateEmail, DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE);
            assertEquals(ResultCode.DUPLICATE_EMAIL, result);
        }

        @Test
        @DisplayName("Ưu tiên: Trùng cả username và email -> Trả về DUPLICATE_USERNAME trước DUPLICATE_EMAIL")
        void register_DuplicateUsernameAndEmail_ReturnsDuplicateUsernameFirst() {
            assertEquals(ResultCode.SUCCESS, service.register(DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE));

            // Đăng ký lại trùng cả user lẫn email
            ResultCode result = service.register(DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS,
                    DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE);
            assertEquals(ResultCode.DUPLICATE_USERNAME, result);
        }

        @ParameterizedTest(name = "[{index}] Sinh trước hôm nay {0} năm + {1} ngày -> {2}")
        @CsvSource({
                "18, 0, SUCCESS",       // Đúng tròn 18 tuổi hôm nay -> Hợp lệ
                "18, 1, UNDERAGE",      // Thiếu 1 ngày mới đủ 18 tuổi -> Chưa đủ tuổi
                "0,  1, INVALID_INPUT"  // Sinh vào ngày mai (tương lai) -> Đầu vào không hợp lệ
        })
        void register_RelativeAgeBoundaries(int yearsAgo, int plusDays, ResultCode expected) {
            LocalDate dob = LocalDate.now().minusYears(yearsAgo).plusDays(plusDays);
            ResultCode result = service.register("user_age_test", "age@example.com", DEFAULT_PASS,
                    DEFAULT_PASS, dob, null);
            assertEquals(expected, result);
        }
    }

    // =========================================================================
    // PROVIDER CHO CÁC INPUT KHÔNG HỢP LỆ & THỨ TỰ ƯU TIÊN (STATIC METHOD)
    // =========================================================================
    static Stream<Arguments> invalidRegisterInputs() {
        return Stream.of(
                // 1. Từng quy tắc đơn lẻ (BR-REG-01..09)
                Arguments.of("REG-01: Username rỗng", "   ", DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_INPUT),
                Arguments.of("REG-01: Email rỗng", DEFAULT_USER, "   ", DEFAULT_PASS, DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_INPUT),
                Arguments.of("REG-01: Password rỗng", DEFAULT_USER, DEFAULT_EMAIL, "   ", "   ", DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_INPUT),
                Arguments.of("REG-01: Confirm password rỗng", DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, "   ", DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_INPUT),
                Arguments.of("REG-01: DateOfBirth null", DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, null, DEFAULT_PHONE, ResultCode.INVALID_INPUT),
                Arguments.of("REG-01: Ngày sinh ở tương lai", DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, LocalDate.now().plusDays(2), DEFAULT_PHONE, ResultCode.INVALID_INPUT),
                Arguments.of("REG-02: Username sai định dạng (bắt đầu bằng số)", "1alice", DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_USERNAME),
                Arguments.of("REG-04: Email sai định dạng", DEFAULT_USER, "bad_email", DEFAULT_PASS, DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_EMAIL),
                Arguments.of("REG-06: Mật khẩu yếu (thiếu chữ hoa)", DEFAULT_USER, DEFAULT_EMAIL, "secret@123", "secret@123", DEFAULT_DOB, DEFAULT_PHONE, ResultCode.WEAK_PASSWORD),
                Arguments.of("REG-07: Xác nhận mật khẩu không khớp", DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, "Different@123", DEFAULT_DOB, DEFAULT_PHONE, ResultCode.PASSWORD_MISMATCH),
                Arguments.of("REG-08: Dưới 18 tuổi", DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, LocalDate.now().minusYears(16), DEFAULT_PHONE, ResultCode.UNDERAGE),
                Arguments.of("REG-09: Số điện thoại sai định dạng (đầu 02)", DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, DEFAULT_DOB, "0212345678", ResultCode.INVALID_PHONE),
                Arguments.of("REG-09: Số điện thoại toàn khoảng trắng", DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, DEFAULT_DOB, "   ", ResultCode.INVALID_PHONE),

                // 2. Kiểm thử THỨ TỰ ƯU TIÊN (≥ 3 dòng vi phạm nhiều quy tắc cùng lúc)
                Arguments.of("Ưu tiên: Username sai + Email sai -> Phải trả về INVALID_USERNAME trước",
                        "1alice", "bad_email", DEFAULT_PASS, DEFAULT_PASS, DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_USERNAME),

                Arguments.of("Ưu tiên: Email sai + Password yếu -> Phải trả về INVALID_EMAIL trước",
                        DEFAULT_USER, "bad_email", "weak", "weak", DEFAULT_DOB, DEFAULT_PHONE, ResultCode.INVALID_EMAIL),

                Arguments.of("Ưu tiên: Password yếu + Confirm không khớp -> Phải trả về WEAK_PASSWORD trước",
                        DEFAULT_USER, DEFAULT_EMAIL, "weak", "different_weak", DEFAULT_DOB, DEFAULT_PHONE, ResultCode.WEAK_PASSWORD),

                Arguments.of("Ưu tiên: Confirm không khớp + Dưới 18 tuổi -> Phải trả về PASSWORD_MISMATCH trước",
                        DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, "Mismatch@123", LocalDate.now().minusYears(15), DEFAULT_PHONE, ResultCode.PASSWORD_MISMATCH),

                Arguments.of("Ưu tiên: Dưới 18 tuổi + Phone sai -> Phải trả về UNDERAGE trước",
                        DEFAULT_USER, DEFAULT_EMAIL, DEFAULT_PASS, DEFAULT_PASS, LocalDate.now().minusYears(15), "0212345678", ResultCode.UNDERAGE)
        );
    }
}
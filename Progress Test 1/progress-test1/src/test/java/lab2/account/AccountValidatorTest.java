package lab2.account;

import lab2.AccountValidator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Kiểm thử đơn vị lớp AccountValidator")
public class AccountValidatorTest {

    // ==========================================
    // 1. KIỂM THỬ isValidUsername (BR-REG-02)
    // ==========================================

    @ParameterizedTest(name = "[{index}] Username hợp lệ: ''{0}''")
    @ValueSource(strings = {"alice", "Alice_01", "Z____", "User_Name_123"})
    void isValidUsername_ValidCases_ReturnsTrue(String username) {
        assertTrue(AccountValidator.isValidUsername(username));
    }

    @ParameterizedTest(name = "[{index}] Username không hợp lệ: ''{0}''")
    @ValueSource(strings = {"ab_1", "1alice", "_alice", "ali ce", "alice!", "alice-01"})
    void isValidUsername_InvalidFormat_ReturnsFalse(String username) {
        assertFalse(AccountValidator.isValidUsername(username));
    }

    @ParameterizedTest(name = "[{index}] Username null hoặc rỗng")
    @NullAndEmptySource
    @ValueSource(strings = {" ", "   "})
    void isValidUsername_NullOrBlank_ReturnsFalse(String username) {
        assertFalse(AccountValidator.isValidUsername(username));
    }

    @ParameterizedTest(name = "[{index}] Biên độ dài username: {0} ký tự -> {1}")
    @MethodSource("usernameLengths")
    void isValidUsername_BoundaryLength(int length, boolean expected) {
        assertEquals(expected, AccountValidator.isValidUsername("a".repeat(length)));
    }

    static Stream<Arguments> usernameLengths() {
        return Stream.of(
                Arguments.of(4, false), // Dưới biên min (5)
                Arguments.of(5, true),  // Đúng biên min
                Arguments.of(6, true),  // Trên biên min
                Arguments.of(19, true), // Dưới biên max (20)
                Arguments.of(20, true), // Đúng biên max
                Arguments.of(21, false) // Vượt biên max
        );
    }

    // ==========================================
    // 2. KIỂM THỬ isValidEmail (BR-REG-04)
    // ==========================================

    @ParameterizedTest(name = "[{index}] {2}: ''{0}'' -> {1}")
    @CsvSource(delimiter = '|', value = {
            "user@example.com             | true  | Email chuẩn hợp lệ",
            "user.name+tag@domain.co.uk   | true  | Email có dấu chấm, dấu cộng, subdomain",
            "plainaddress                 | false | Thiếu ký tự @ và tên miền",
            "@missingusername.com         | false | Thiếu username phía trước @",
            "username@.com                | false | Thiếu nhãn tên miền",
            "username@domain              | false | Thiếu phần mở rộng TLD",
            "username@domain.c            | false | TLD chỉ có 1 ký tự (yêu cầu >= 2)",
            "username@domain..com         | false | Hai dấu chấm liên tiếp trong domain"
    })
    void isValidEmail_Partitions(String email, boolean expected, String desc) {
        assertEquals(expected, AccountValidator.isValidEmail(email));
    }

    @ParameterizedTest(name = "[{index}] Email null hoặc rỗng")
    @NullAndEmptySource
    @ValueSource(strings = {" ", "   "})
    void isValidEmail_NullOrBlank_ReturnsFalse(String email) {
        assertFalse(AccountValidator.isValidEmail(email));
    }

    @ParameterizedTest(name = "[{index}] Biên độ dài email: {0} ký tự -> {1}")
    @MethodSource("emailLengths")
    void isValidEmail_BoundaryLength(int length, boolean expected) {
        // Tạo email dạng: a...a@b.co (phần đuôi "@b.co" có 5 ký tự)
        String local = "a".repeat(length - 5);
        String email = local + "@b.co";
        assertEquals(expected, AccountValidator.isValidEmail(email));
    }

    static Stream<Arguments> emailLengths() {
        return Stream.of(
                Arguments.of(99, true),   // Dưới biên max (100)
                Arguments.of(100, true),  // Đúng biên max (100)
                Arguments.of(101, false)  // Vượt quá 100 ký tự
        );
    }

    // ==========================================
    // 3. KIỂM THỬ isValidPassword (BR-REG-06)
    // ==========================================

    @ParameterizedTest(name = "[{index}] {3}")
    @CsvSource(delimiter = '|', value = {
            "Secret@123    | alice_01 | true  | Mật khẩu hợp lệ đầy đủ 4 nhóm",
            "Secret#123    | alice_01 | true  | Mật khẩu hợp lệ với ký tự đặc biệt #",
            "secret@123    | alice_01 | false | Thiếu chữ in hoa",
            "SECRET@123    | alice_01 | false | Thiếu chữ in thường",
            "Secret@xyz    | alice_01 | false | Thiếu chữ số",
            "Secret1234    | alice_01 | false | Thiếu ký tự đặc biệt",
            "'Secret @123' | alice_01 | false | Chứa khoảng trắng không hợp lệ",
            "Xalice_01@1   | alice_01 | false | Chứa username bên trong mật khẩu",
            "XALICE_01@1   | alice_01 | false | Chứa username (không phân biệt hoa/thường)",
            "Xalice_01@1   |          | true  | Username null -> bỏ qua kiểm tra chứa username",
            "Xalice_01@1   | '   '    | true  | Username blank -> bỏ qua kiểm tra chứa username"
    })
    void isValidPassword_Partitions(String pw, String user, boolean expected, String desc) {
        assertEquals(expected, AccountValidator.isValidPassword(pw, user));
    }

    @ParameterizedTest(name = "[{index}] Password null hoặc rỗng")
    @NullAndEmptySource
    @ValueSource(strings = {" "})
    void isValidPassword_NullOrBlank_ReturnsFalse(String password) {
        assertFalse(AccountValidator.isValidPassword(password, "alice_01"));
    }

    @ParameterizedTest(name = "[{index}] Biên độ dài mật khẩu: {0} ký tự -> {1}")
    @MethodSource("passwordLengths")
    void isValidPassword_BoundaryLength(int length, boolean expected) {
        // Chuỗi có đủ 4 nhóm: "Aa1@" + các chữ "x" bổ sung
        String pw = "Aa1@" + "x".repeat(Math.max(0, length - 4));
        assertEquals(expected, AccountValidator.isValidPassword(pw, "alice_01"));
    }

    static Stream<Arguments> passwordLengths() {
        return Stream.of(
                Arguments.of(7, false),  // Dưới biên min (8)
                Arguments.of(8, true),   // Đúng biên min
                Arguments.of(32, true),  // Đúng biên max (32)
                Arguments.of(33, false)  // Vượt quá 32 ký tự
        );
    }

    // ==========================================
    // 4. KIỂM THỬ isValidPhone (BR-REG-09)
    // ==========================================

    @ParameterizedTest(name = "[{index}] Số điện thoại hợp lệ: ''{0}''")
    @ValueSource(strings = {"0312345678", "0512345678", "0712345678", "0812345678", "0912345678"})
    void isValidPhone_ValidPrefixes_ReturnsTrue(String phone) {
        assertTrue(AccountValidator.isValidPhone(phone));
    }

    @ParameterizedTest(name = "[{index}] Số điện thoại không hợp lệ: ''{0}''")
    @ValueSource(strings = {
            "0212345678",    // Đầu số 02 không thuộc [03, 05, 07, 08, 09]
            "0412345678",    // Đầu số 04 sai
            "0612345678",    // Đầu số 06 sai
            "031234567",     // 9 số (thiếu chữ số)
            "03123456789",   // 11 số (thừa chữ số)
            "031234567a",    // Chứa chữ cái
            " 0312345678",   // Khoảng trắng phía trước
            "0312345678 "    // Khoảng trắng phía sau
    })
    void isValidPhone_InvalidCases_ReturnsFalse(String phone) {
        assertFalse(AccountValidator.isValidPhone(phone));
    }

    @ParameterizedTest(name = "[{index}] Số điện thoại null hoặc rỗng")
    @NullAndEmptySource
    void isValidPhone_NullOrEmpty_ReturnsFalse(String phone) {
        assertFalse(AccountValidator.isValidPhone(phone));
    }

    // ==========================================
    // 5. KIỂM THỬ calculateAge
    // ==========================================

    @ParameterizedTest(name = "[{index}] Sinh ngày {0}, hôm nay {1} -> {2} tuổi")
    @CsvSource({
            "2008-09-28, 2026-09-28, 18", // Đúng ngày sinh nhật tròn 18 tuổi
            "2008-09-29, 2026-09-28, 17", // Thiếu 1 ngày mới đủ 18 tuổi
            "2008-02-29, 2026-02-28, 17", // Năm nhuận, ngày 28/02 chưa tròn tuổi
            "2008-02-29, 2026-03-01, 18"  // Năm nhuận, ngày 01/03 đã tròn tuổi
    })
    void calculateAge_Boundaries_ReturnsExpectedAge(LocalDate dob, LocalDate today, int expectedAge) {
        assertEquals(expectedAge, AccountValidator.calculateAge(dob, today));
    }

    @Test
    @DisplayName("calculateAge với tham số null không ném exception mà trả về 0")
    void calculateAge_NullInputs_ReturnsZero() {
        assertEquals(0, AccountValidator.calculateAge(null, LocalDate.now()));
        assertEquals(0, AccountValidator.calculateAge(LocalDate.now(), null));
        assertEquals(0, AccountValidator.calculateAge(null, null));
    }
}
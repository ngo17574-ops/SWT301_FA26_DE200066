package lab2;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

public class AccountService {

    public static final int MAX_FAILED_ATTEMPTS = 5;
    public static final int PASSWORD_HISTORY_SIZE = 3;
    public static final int MIN_AGE = 18;

    // Lưu trữ tài khoản: key là username lowercase
    private final Map<String, Account> accounts = new HashMap<>();

    // Lưu trữ email: key là email lowercase -> value là username lowercase
    private final Map<String, String> emails = new HashMap<>();

    public AccountService() {
        // Constructor không tham số
    }

    /**
     * Đăng ký tài khoản mới theo đúng thứ tự kiểm tra:
     * REG-01 -> 02 -> 04 -> 06 -> 07 -> 08 -> 09 -> 03 -> 05 -> 10
     */
    public ResultCode register(String username, String email, String password,
                               String confirmPassword, LocalDate dateOfBirth, String phone) {
        LocalDate today = LocalDate.now();

        // 1. REG-01: Kiểm tra các trường rỗng/null hoặc ngày sinh ở tương lai
        if (isBlank(username) || isBlank(email) || isBlank(password) || isBlank(confirmPassword)
                || dateOfBirth == null || dateOfBirth.isAfter(today)) {
            return ResultCode.INVALID_INPUT;
        }

        // 2. REG-02: Kiểm tra định dạng username
        if (!AccountValidator.isValidUsername(username)) {
            return ResultCode.INVALID_USERNAME;
        }

        // 3. REG-04: Kiểm tra định dạng email
        if (!AccountValidator.isValidEmail(email)) {
            return ResultCode.INVALID_EMAIL;
        }

        // 4. REG-06: Kiểm tra mật khẩu (độ mạnh và không chứa username)
        if (!AccountValidator.isValidPassword(password, username)) {
            return ResultCode.WEAK_PASSWORD;
        }

        // 5. REG-07: Kiểm tra xác nhận mật khẩu
        if (!password.equals(confirmPassword)) {
            return ResultCode.PASSWORD_MISMATCH;
        }

        // 6. REG-08: Kiểm tra độ tuổi (>= 18 tuổi)
        if (AccountValidator.calculateAge(dateOfBirth, today) < MIN_AGE) {
            return ResultCode.UNDERAGE;
        }

        // 7. REG-09: Kiểm tra số điện thoại (tùy chọn: null hoặc "" được chấp nhận, "   " là INVALID_PHONE)
        if (phone != null && !phone.isEmpty()) {
            if (!AccountValidator.isValidPhone(phone)) {
                return ResultCode.INVALID_PHONE;
            }
        }

        // 8. REG-03: Kiểm tra trùng username (không phân biệt hoa/thường)
        if (accounts.containsKey(key(username))) {
            return ResultCode.DUPLICATE_USERNAME;
        }

        // 9. REG-05: Kiểm tra trùng email (không phân biệt hoa/thường)
        if (emails.containsKey(key(email))) {
            return ResultCode.DUPLICATE_EMAIL;
        }

        // 10. REG-10: Đăng ký thành công -> sinh salt, băm mật khẩu, lưu tài khoản
        String salt = PasswordHasher.generateSalt();
        String passwordHash = PasswordHasher.hash(salt, password);
        String normalizedEmail = key(email);
        String actualPhone = (phone == null || phone.isEmpty()) ? null : phone;

        Account account = new Account(username, normalizedEmail, dateOfBirth, actualPhone, salt, passwordHash);
        accounts.put(key(username), account);
        emails.put(normalizedEmail, key(username));

        return ResultCode.SUCCESS;
    }

    /**
     * Tìm kiếm tài khoản theo username (không phân biệt hoa/thường)
     */
    public Optional<Account> findByUsername(String username) {
        if (isBlank(username)) {
            return Optional.empty();
        }
        return Optional.ofNullable(accounts.get(key(username)));
    }

    // --- Các phương thức còn lại sẽ cài đặt ở TODO-6 ---

    public ResultCode login(String username, String password) {
        throw new UnsupportedOperationException("TODO");
    }

    public ResultCode changePassword(String username, String oldPassword,
                                     String newPassword, String confirmPassword) {
        throw new UnsupportedOperationException("TODO");
    }

    public TokenResult requestPasswordReset(String email) {
        throw new UnsupportedOperationException("TODO");
    }

    public ResultCode resetPassword(String token, String newPassword, String confirmPassword) {
        throw new UnsupportedOperationException("TODO");
    }

    public ResultCode disableAccount(String username) {
        throw new UnsupportedOperationException("TODO");
    }

    public ResultCode unlockAccount(String username) {
        throw new UnsupportedOperationException("TODO");
    }

    public boolean isLocked(String username) {
        throw new UnsupportedOperationException("TODO");
    }

    // --- Helper methods ---

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static String key(String s) {
        return s == null ? "" : s.toLowerCase(Locale.ROOT);
    }
}
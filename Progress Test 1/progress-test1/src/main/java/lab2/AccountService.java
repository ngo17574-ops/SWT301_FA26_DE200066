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

    // --- Cài đặt TODO-6: login, unlockAccount, disableAccount, isLocked ---

    /**
     * BR-LOG: Đăng nhập bám theo bảng quyết định 6 quy tắc
     */
    public ResultCode login(String username, String password) {
        // 1. Kiểm tra input rỗng/null
        if (isBlank(username) || isBlank(password)) {
            return ResultCode.INVALID_INPUT;
        }

        // 2. Tra cứu tài khoản (không phân biệt hoa/thường)
        Account acc = accounts.get(key(username));
        if (acc == null) {
            return ResultCode.INVALID_CREDENTIALS; // Bảo mật: không tiết lộ lý do
        }

        // 3. Kiểm tra trạng thái DISABLED
        if (acc.getStatus() == AccountStatus.DISABLED) {
            return ResultCode.ACCOUNT_DISABLED;
        }

        // 4. Kiểm tra tài khoản đang bị khóa (không tăng bộ đếm)
        if (acc.isLocked()) {
            return ResultCode.ACCOUNT_LOCKED;
        }

        // 5. Kiểm tra mật khẩu
        if (!PasswordHasher.matches(acc.getSalt(), password, acc.getCurrentPasswordHash())) {
            acc.incrementFailedAttempts();
            // Đạt ngưỡng 5 lần sai (dùng >=) thì tự động khóa
            if (acc.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
                acc.lock();
                return ResultCode.ACCOUNT_LOCKED;
            }
            return ResultCode.INVALID_CREDENTIALS;
        }

        // 6. Đăng nhập thành công -> reset bộ đếm về 0
        acc.resetFailedAttempts();
        return ResultCode.SUCCESS;
    }

    /**
     * BR-ADM-03: Mở khóa tài khoản và reset bộ đếm số lần sai về 0
     */
    public ResultCode unlockAccount(String username) {
        if (isBlank(username)) {
            return ResultCode.USER_NOT_FOUND;
        }
        Optional<Account> acc = findByUsername(username);
        if (acc.isEmpty()) {
            return ResultCode.USER_NOT_FOUND;
        }
        acc.get().unlock(); // locked = false, failedAttempts = 0
        return ResultCode.SUCCESS;
    }

    /**
     * Vô hiệu hóa tài khoản (chuyển sang DISABLED)
     */
    public ResultCode disableAccount(String username) {
        if (isBlank(username)) {
            return ResultCode.USER_NOT_FOUND;
        }
        Optional<Account> acc = findByUsername(username);
        if (acc.isEmpty()) {
            return ResultCode.USER_NOT_FOUND;
        }
        acc.get().setStatus(AccountStatus.DISABLED);
        return ResultCode.SUCCESS;
    }

    /**
     * Kiểm tra tài khoản có đang bị khóa hay không (an toàn với username null/không tồn tại)
     */
    public boolean isLocked(String username) {
        if (isBlank(username)) {
            return false;
        }
        Account acc = accounts.get(key(username));
        return acc != null && acc.isLocked();
    }

    // --- Các hàm Bonus (giữ nguyên stub TODO theo yêu cầu đề bài) ---

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

    // --- Helper methods ---

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static String key(String s) {
        return s == null ? "" : s.toLowerCase(Locale.ROOT);
    }

}
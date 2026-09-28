package lab2.account;

import java.time.LocalDate;
import java.time.Period;
import java.util.Locale;
import java.util.regex.Pattern;

public final class AccountValidator {

    private static final Pattern USERNAME_PATTERN =
            Pattern.compile("^[A-Za-z][A-Za-z0-9_]{4,19}$");

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^0[35789]\\d{8}$");

    private static final String SPECIAL_CHARS = "!@#$%^&*()_+-=";

    private AccountValidator() {
        // Private constructor để ngăn việc tạo instance
    }

    /**
     * BR-REG-02: Kiểm tra username hợp lệ (5-20 ký tự, bắt đầu bằng chữ cái, chỉ gồm A-Za-z0-9_)
     */
    public static boolean isValidUsername(String username) {
        return username != null && USERNAME_PATTERN.matcher(username).matches();
    }

    /**
     * BR-REG-04: Kiểm tra email hợp lệ (độ dài <= 100, định dạng local@domain.tld, TLD >= 2 ký tự)
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.length() > 100) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * BR-REG-06: Kiểm tra mật khẩu (8-32 ký tự, đủ 4 nhóm: hoa, thường, số, ký tự đặc biệt, không chứa username)
     */
    public static boolean isValidPassword(String password, String username) {
        if (password == null || password.length() < 8 || password.length() > 32) {
            return false;
        }

        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (c >= 'A' && c <= 'Z') {
                hasUpper = true;
            } else if (c >= 'a' && c <= 'z') {
                hasLower = true;
            } else if (c >= '0' && c <= '9') {
                hasDigit = true;
            } else if (SPECIAL_CHARS.indexOf(c) >= 0) {
                hasSpecial = true;
            } else {
                return false; // Chứa khoảng trắng hoặc ký tự lạ ngoài danh sách cho phép
            }
        }

        // Bắt buộc phải có đủ cả 4 nhóm
        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            return false;
        }

        // Không được chứa username (bỏ qua nếu username là null hoặc blank)
        if (username != null && !username.isBlank()) {
            String lowerPassword = password.toLowerCase(Locale.ROOT);
            String lowerUsername = username.toLowerCase(Locale.ROOT);
            if (lowerPassword.contains(lowerUsername)) {
                return false;
            }
        }

        return true;
    }

    /**
     * BR-REG-09: Kiểm tra định dạng số điện thoại Việt Nam (03x, 05x, 07x, 08x, 09x gồm 10 chữ số)
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * Tính tuổi tròn dựa trên ngày sinh và ngày hiện tại (Hàm thuần)
     */
    public static int calculateAge(LocalDate dob, LocalDate today) {
        if (dob == null || today == null) {
            return 0;
        }
        return Period.between(dob, today).getYears();
    }
}
package lab2;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

public final class PasswordHasher {

    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordHasher() {
        // Ngăn khởi tạo instance
    }

    /**
     * Sinh chuỗi salt ngẫu nhiên 16 bytes dạng Hex (32 ký tự)
     */
    public static String generateSalt() {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        return HexFormat.of().formatHex(salt);
    }

    /**
     * Băm mật khẩu với salt bằng thuật toán SHA-256, trả về chuỗi Hex 64 ký tự
     */
    public static String hash(String salt, String rawPassword) {
        if (salt == null || rawPassword == null) {
            return null;
        }
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] digest = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Không tìm thấy thuật toán SHA-256", e);
        }
    }

    /**
     * Kiểm tra mật khẩu thô có khớp với chuỗi hash đã lưu hay không (an toàn với null)
     */
    public static boolean matches(String salt, String rawPassword, String expectedHash) {
        if (salt == null || rawPassword == null || expectedHash == null) {
            return false;
        }
        String calculatedHash = hash(salt, rawPassword);
        return expectedHash.equals(calculatedHash);
    }
}
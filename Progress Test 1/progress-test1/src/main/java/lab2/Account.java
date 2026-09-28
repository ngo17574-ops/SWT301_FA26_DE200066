package lab2;

import java.time.LocalDate;
import java.util.List;

public class Account {
    private String username;
    private String email;
    private LocalDate dateOfBirth;
    private String phone;
    private String salt;
    private AccountStatus status;
    private int failedAttempts;
    private boolean locked;
    private List<String> passwordHistory;

    // Chi tiết entity sẽ được hoàn thiện ở TODO-3
}
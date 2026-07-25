package com.hamon.portfolio.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    /**
     * 로그인 처리.
     * 환경변수 ADMIN_PASSWORD 값이 BCrypt 해시($2a$로 시작)면 matches()로 비교,
     * plain text면 직접 비교(로컬 개발 편의용).
     */
    public String login(String username, String password) {
        if (!adminUsername.equals(username)) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        boolean matched = adminPassword.startsWith("$2a$") || adminPassword.startsWith("$2b$")
                ? passwordEncoder.matches(password, adminPassword)
                : adminPassword.equals(password);

        if (!matched) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return jwtProvider.generateToken(username);
    }
}

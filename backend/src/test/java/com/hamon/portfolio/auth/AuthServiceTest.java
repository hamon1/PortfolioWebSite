package com.hamon.portfolio.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    JwtProvider jwtProvider;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "adminUsername", "admin");
        ReflectionTestUtils.setField(authService, "adminPassword", "testpassword");
    }

    @Test
    @DisplayName("올바른 plain-text 비밀번호로 로그인 성공")
    void login_plainPassword_success() {
        when(jwtProvider.generateToken("admin")).thenReturn("mocked-token");

        String token = authService.login("admin", "testpassword");

        assertThat(token).isEqualTo("mocked-token");
    }

    @Test
    @DisplayName("BCrypt 해시 비밀번호로 로그인 성공")
    void login_bcryptPassword_success() {
        String bcryptHash = "$2a$10$dummyHashForTesting.................";
        ReflectionTestUtils.setField(authService, "adminPassword", bcryptHash);
        when(passwordEncoder.matches("rawpassword", bcryptHash)).thenReturn(true);
        when(jwtProvider.generateToken("admin")).thenReturn("mocked-token");

        String token = authService.login("admin", "rawpassword");

        assertThat(token).isEqualTo("mocked-token");
    }

    @Test
    @DisplayName("잘못된 username으로 로그인 실패")
    void login_wrongUsername_throws() {
        assertThatThrownBy(() -> authService.login("unknown", "testpassword"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    @DisplayName("잘못된 password로 로그인 실패")
    void login_wrongPassword_throws() {
        assertThatThrownBy(() -> authService.login("admin", "wrongpassword"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid credentials");
    }
}

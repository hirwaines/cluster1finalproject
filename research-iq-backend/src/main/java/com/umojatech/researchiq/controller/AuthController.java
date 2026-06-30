package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.AuthResponse;
import com.umojatech.researchiq.dto.EmailOtpRequestDto;
import com.umojatech.researchiq.dto.FunderSignupDto;
import com.umojatech.researchiq.dto.LoginDto;
import com.umojatech.researchiq.dto.OrcidLoginDto;
import com.umojatech.researchiq.dto.PasswordResetConfirmDto;
import com.umojatech.researchiq.dto.PasswordResetRequestDto;
import com.umojatech.researchiq.dto.ResearcherSignupDto;
import com.umojatech.researchiq.dto.SignupDto;
import com.umojatech.researchiq.dto.VerifyOtpDto;
import com.umojatech.researchiq.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth APIs")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Basic signup", description = "Creates a researcher or funder account with minimal fields.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error or email exists", content = @Content)
    })
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @Operation(summary = "Researcher signup", description = "Registers a researcher with full profile (institution, ORCID, CV, publications). Account is PENDING until admin approval.")
    @PostMapping("/signup/researcher")
    public ResponseEntity<AuthResponse> signupResearcher(@Valid @RequestBody ResearcherSignupDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signupResearcher(request));
    }

    @Operation(summary = "Funder signup", description = "Registers a funder with organization details. Account is PENDING until admin approval.")
    @PostMapping("/signup/funder")
    public ResponseEntity<AuthResponse> signupFunder(@Valid @RequestBody FunderSignupDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signupFunder(request));
    }

    @Operation(summary = "Login", description = """
            Authenticates a user and returns a JWT token.

            Admin two-step MFA: the first call (valid email + password, no mfaCode) returns HTTP 200 with
            `mfaRequired=true` and a null token, and dispatches a 6-digit code to the user's email (and logs it
            in the backend terminal). The client then resubmits the same email + password plus `mfaCode` to
            receive the token. A wrong password returns 401. Applies to all roles.""")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authenticated, or mfaRequired=true when an admin must supply a code",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid or expired MFA code", content = @Content),
            @ApiResponse(responseCode = "401", description = "Invalid credentials or account pending/disabled", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Login with ORCID", description = "Finds the account registered with this ORCID and authenticates with password. Same two-step MFA flow as /login.")
    @PostMapping("/orcid-login")
    public ResponseEntity<AuthResponse> orcidLogin(@Valid @RequestBody OrcidLoginDto request) {
        return ResponseEntity.ok(authService.orcidLogin(request));
    }

    @Operation(summary = "Request email verification code", description = "Sends a 6-digit OTP to console (simulates email send).")
    @PostMapping("/signup/email-verification/request")
    public ResponseEntity<String> requestSignupEmailVerification(@Valid @RequestBody EmailOtpRequestDto request) {
        return ResponseEntity.ok(authService.requestEmailVerification(request));
    }

    @Operation(summary = "Verify email OTP", description = "Verifies the OTP before completing signup.")
    @PostMapping("/signup/email-verification/verify")
    public ResponseEntity<String> verifySignupEmail(@Valid @RequestBody VerifyOtpDto request) {
        return ResponseEntity.ok(authService.verifyEmailCode(request));
    }

    @Operation(summary = "Request password reset", description = "Sends a 6-digit reset OTP to console (simulates email send).")
    @PostMapping("/password-reset/request")
    public ResponseEntity<String> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDto request) {
        return ResponseEntity.ok(authService.requestPasswordReset(request));
    }

    @Operation(summary = "Confirm password reset", description = "Verifies OTP and sets a new password.")
    @PostMapping("/password-reset/confirm")
    public ResponseEntity<String> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmDto request) {
        return ResponseEntity.ok(authService.confirmPasswordReset(request));
    }
}

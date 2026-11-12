package in.priyojit.authify.service;

import in.priyojit.authify.io.ProfileRequest;
import in.priyojit.authify.io.ProfileResponse;
import org.springframework.mail.SimpleMailMessage;

public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest request);

    ProfileResponse getProfile(String email);

    void sendResetOtp(String email);

    void resetPassword(String email,String otp, String newPassword);

    void sendOtp(String email);

    void verifyOtp(String email,String otp);

    String getLoggedInUserId(String email);




    }


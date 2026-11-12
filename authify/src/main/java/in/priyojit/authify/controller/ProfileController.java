package in.priyojit.authify.controller;

import in.priyojit.authify.io.ProfileRequest;
import in.priyojit.authify.io.ProfileResponse;
import in.priyojit.authify.service.EmailService;
import in.priyojit.authify.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request){
        ProfileResponse response = profileService.createProfile(request);
        try {
            emailService.sendWelcomeEmail(response.getEmail(), response.getName());
        }catch(Exception ex){
            System.err.println("Failed to send welcome email:"+ex.getMessage());
        }
        return response;
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression ="authentication?.name") String email){
        return profileService.getProfile(email);
    }

}

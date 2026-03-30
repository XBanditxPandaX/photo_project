package com.photographer.config;

import com.photographer.model.User;
import com.photographer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DefaultAdminInitializer {

    @Bean
    public CommandLineRunner seedDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.default-admin.email:admin@photo-project.local}") String defaultAdminEmail,
            @Value("${app.default-admin.password:admin}") String defaultAdminPassword
    ) {
        return args -> {
            if (userRepository.existsByEmail(defaultAdminEmail)) {
                return;
            }

            User adminUser = User.builder()
                    .email(defaultAdminEmail)
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .build();

            userRepository.save(adminUser);
        };
    }
}

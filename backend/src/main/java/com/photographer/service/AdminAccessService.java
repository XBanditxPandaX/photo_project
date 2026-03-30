package com.photographer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminAccessService {

    private final Set<String> adminEmails;

    public AdminAccessService(
            @Value("${app.admin.emails:${app.admin.email:admin@photo-project.local}}") String adminEmails
    ) {
        this.adminEmails = Arrays.stream(adminEmails.split(","))
                .map(this::normalize)
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toSet());
    }

    public boolean isAdminEmail(String email) {
        return adminEmails.contains(normalize(email));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
}

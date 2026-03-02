package com.photographer.model;

public record ContactRequest(
        String firstName,
        String lastName,
        String email,
        String subject,
        String message
) {
}

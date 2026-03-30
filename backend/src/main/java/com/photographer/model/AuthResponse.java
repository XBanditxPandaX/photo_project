package com.photographer.model;

public record AuthResponse(String token, String email, boolean isAdmin) {}

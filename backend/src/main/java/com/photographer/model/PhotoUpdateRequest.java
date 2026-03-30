package com.photographer.model;

public record PhotoUpdateRequest(
        String title,
        String description,
        String imageUrl,
        String category
) {}

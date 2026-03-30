package com.photographer.controller;

import com.photographer.model.Photo;
import com.photographer.model.PhotoUpdateRequest;
import com.photographer.service.AdminAccessService;
import com.photographer.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoService photoService;
    private final AdminAccessService adminAccessService;

    @Autowired
    public PhotoController(PhotoService photoService, AdminAccessService adminAccessService) {
        this.photoService = photoService;
        this.adminAccessService = adminAccessService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPhotos() {
        List<Photo> photos = photoService.getAllPhotos();
        List<Map<String, Object>> photoMetadata = photos.stream()
                .map(this::toMetadataMap)
                .collect(Collectors.toList());
        return ResponseEntity.ok(photoMetadata);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPhotoById(@PathVariable("id") Long id) {
        return photoService.getPhotoById(id)
                .map(photo -> ResponseEntity.ok(toMetadataMap(photo)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<String> getPhotoImage(@PathVariable("id") Long id) {
        return photoService.getPhotoById(id)
                .map(photo -> ResponseEntity.ok(photo.getImageUrl()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            Authentication authentication,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("image") String url,
            @RequestParam("category") String category) {
        if (!adminAccessService.isAdminEmail(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acces reserve a l'administrateur."));
        }

        Photo savedPhoto = photoService.savePhoto(title, description, url, category);
        return ResponseEntity.status(HttpStatus.CREATED).body(toMetadataMap(savedPhoto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhoto(
            Authentication authentication,
            @PathVariable("id") Long id,
            @RequestBody PhotoUpdateRequest request) {
        if (!adminAccessService.isAdminEmail(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acces reserve a l'administrateur."));
        }

        return photoService.updatePhoto(
                        id,
                        request.title(),
                        request.description(),
                        request.imageUrl(),
                        request.category()
                )
                .map(photo -> ResponseEntity.ok(toMetadataMap(photo)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(Authentication authentication, @PathVariable("id") Long id) {
        if (!adminAccessService.isAdminEmail(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acces reserve a l'administrateur."));
        }

        if (photoService.getPhotoById(id).isPresent()) {
            photoService.deletePhoto(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private Map<String, Object> toMetadataMap(Photo photo) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", photo.getId());
        map.put("title", photo.getTitle());
        map.put("description", photo.getDescription());
        map.put("createdAt", photo.getCreatedAt());
        map.put("imageUrl", photo.getImageUrl());
        map.put("category", photo.getCategory());
        return map;
    }
}

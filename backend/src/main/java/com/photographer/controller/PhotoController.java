package com.photographer.controller;

import com.photographer.model.Photo;
import com.photographer.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "http://localhost:5173")
public class PhotoController {

    private final PhotoService photoService;

    @Autowired
    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
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
    public ResponseEntity<Map<String, Object>> getPhotoById(@PathVariable Long id) {
        return photoService.getPhotoById(id)
                .map(photo -> ResponseEntity.ok(toMetadataMap(photo)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<String> getPhotoImage(@PathVariable Long id) {
        return photoService.getPhotoById(id)
                .map(photo -> ResponseEntity.ok(photo.getImageUrl()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("image") String url) {
        try {
            Photo savedPhoto = photoService.savePhoto(title, description, url);
            return ResponseEntity.status(HttpStatus.CREATED).body(toMetadataMap(savedPhoto));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
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
        return map;
    }
}

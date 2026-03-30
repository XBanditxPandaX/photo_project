package com.photographer.service;

import com.photographer.model.Photo;
import com.photographer.repository.PhotoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;

    @Autowired
    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    @Transactional
    public List<Photo> getAllPhotos() {
        return photoRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Optional<Photo> getPhotoById(Long id) {
        return photoRepository.findById(id);
    }

    @Transactional
    public Photo savePhoto(String title, String description, String url, String category) {
        Photo photo = Photo.builder()
                .title(title)
                .description(description)
                .imageUrl(url)
                .category(category)
                .build();
        return photoRepository.save(photo);
    }

    @Transactional
    public Optional<Photo> updatePhoto(Long id, String title, String description, String url, String category) {
        return photoRepository.findById(id)
                .map(photo -> {
                    photo.setTitle(title);
                    photo.setDescription(description);
                    photo.setImageUrl(url);
                    photo.setCategory(category);
                    return photoRepository.save(photo);
                });
    }

    @Transactional
    public void deletePhoto(Long id) {
        photoRepository.deleteById(id);
    }
}

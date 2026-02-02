package com.photographer.service;

import com.photographer.model.Photo;
import com.photographer.repository.PhotoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public Photo savePhoto(String title, String description, String url) throws IOException {
        Photo photo = Photo.builder()
                .title(title)
                .description(description)
                .imageUrl(url)
                .build();
        return photoRepository.save(photo);
    }

    @Transactional
    public void deletePhoto(Long id) {
        photoRepository.deleteById(id);
    }
}

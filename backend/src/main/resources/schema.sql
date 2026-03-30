CREATE TABLE IF NOT EXISTS photos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    image_url VARCHAR(1000) NOT NULL,
    content_type VARCHAR(100),
    category VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
                                      id BIGSERIAL PRIMARY KEY,
                                      email VARCHAR(255) NOT NULL,
                                      password VARCHAR(1000),
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


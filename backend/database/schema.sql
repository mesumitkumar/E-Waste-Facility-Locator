-- =====================================
-- E-Waste Facility Locator Schema
-- FINAL PRODUCTION VERSION
-- =====================================

DROP DATABASE IF EXISTS ewaste_db;
CREATE DATABASE ewaste_db;
USE ewaste_db;

-- =====================
-- USERS
-- =====================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    city VARCHAR(100),
    total_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================
-- PICKUP ADDRESSES
-- =====================
CREATE TABLE pickup_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    flat_no VARCHAR(50) NOT NULL,
    area VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================
-- BOOKINGS
-- =====================
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    pickup_address_id INT NOT NULL,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    weight DECIMAL(6,2) NOT NULL COMMENT 'Weight in kg',
    pickup_date DATE NOT NULL,
    pickup_time_slot VARCHAR(50) NOT NULL,
    special_instructions TEXT,
    status ENUM('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
    points_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pickup_address_id) REFERENCES pickup_addresses(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_pickup_date (pickup_date),
    INDEX idx_status (status)
);

-- =====================
-- DEVICE CATALOG
-- =====================
CREATE TABLE device_catalog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100) NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    avg_weight_kg DECIMAL(4,2) NOT NULL,
    base_points INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- SAMPLE DEVICE DATA
-- =====================
INSERT INTO device_catalog
(category, device_name, avg_weight_kg, base_points, description) VALUES
('Mobile', 'Smartphone', 0.2, 6, 'Average smartphone weight'),
('Mobile', 'Feature Phone', 0.1, 3, 'Basic phone'),
('Computer', 'Laptop', 2.0, 60, 'Laptop'),
('Computer', 'Desktop CPU', 5.0, 150, 'Desktop CPU'),
('Computer', 'Monitor', 3.0, 90, 'Monitor'),
('Home Appliance', 'Television', 10.0, 300, 'TV'),
('Home Appliance', 'Refrigerator', 50.0, 1500, 'Refrigerator'),
('Home Appliance', 'Washing Machine', 30.0, 900, 'Washing machine'),
('Small Electronics', 'Router', 0.5, 15, 'Router'),
('Audio', 'Headphones', 0.3, 9, 'Headphones');

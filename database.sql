
-- SQL Schema for "Entregas App"
CREATE DATABASE IF NOT EXISTS entregas_app;
USE entregas_app;

CREATE TABLE towers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE apartments (
    id VARCHAR(50) PRIMARY KEY,
    tower_id VARCHAR(50),
    number VARCHAR(10) NOT NULL,
    resident_name VARCHAR(100),
    resident_phone VARCHAR(20),
    FOREIGN KEY (tower_id) REFERENCES towers(id)
);

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('MASTER', 'ADMIN', 'PORTARIA') NOT NULL,
    name VARCHAR(100),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_code VARCHAR(100) NOT NULL,
    status ENUM('PORTARIA', 'ADMINISTRACAO_ESPERA', 'PENDENTE_RECOLHIMENTO', 'ENTREGUE') NOT NULL,
    tower_id VARCHAR(50),
    apartment_id VARCHAR(50),
    received_at_portaria DATETIME NOT NULL,
    received_by_portaria_name VARCHAR(100),
    received_at_admin DATETIME,
    received_by_admin_name VARCHAR(100),
    notified_at DATETIME,
    delivered_at DATETIME,
    delivered_to_name VARCHAR(100),
    FOREIGN KEY (tower_id) REFERENCES towers(id),
    FOREIGN KEY (apartment_id) REFERENCES apartments(id)
);

-- Initial Mock Data
INSERT INTO towers (id, name) VALUES 
('t1', 'Torre A - Ipê'),
('t2', 'Torre B - Jatobá'),
('t3', 'Torre C - Aroeira'),
('t4', 'Torre D - Algaroba'),
('t5', 'Torre E - Jacarandá'),
('t6', 'Torre F - Imbúia');

-- Master user (password: 123456)
INSERT INTO users (id, username, password_hash, role, name, active) VALUES 
('u1', 'master', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'MASTER', 'Suporte Master', 1);

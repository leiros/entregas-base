
CREATE DATABASE IF NOT EXISTS entregas_app;
USE entregas_app;

-- Limpar tabelas para re-população
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS towers;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE towers (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE apartments (
    id VARCHAR(20) PRIMARY KEY,
    tower_id VARCHAR(10),
    number VARCHAR(10) NOT NULL,
    resident_name VARCHAR(100) DEFAULT 'Morador Pendente',
    resident_phone VARCHAR(20) DEFAULT '5511999999999',
    FOREIGN KEY (tower_id) REFERENCES towers(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    tower_id VARCHAR(10),
    apartment_id VARCHAR(20),
    received_at_portaria DATETIME DEFAULT CURRENT_TIMESTAMP,
    received_by_portaria_name VARCHAR(100),
    received_at_admin DATETIME,
    received_by_admin_name VARCHAR(100), -- Coluna que estava faltando
    notified_at DATETIME,
    delivered_at DATETIME,
    delivered_to_name VARCHAR(100),
    FOREIGN KEY (tower_id) REFERENCES towers(id),
    FOREIGN KEY (apartment_id) REFERENCES apartments(id)
);

-- Cadastro das Torres
INSERT INTO towers (id, name) VALUES 
('t1', 'Torre A - Ipê'),
('t2', 'Torre B - Jatobá'),
('t3', 'Torre C - Aroeira'),
('t4', 'Torre D - Algaroba'),
('t5', 'Torre E - Jacarandá'),
('t6', 'Torre F - Imbúia');

-- Inserção de Usuários Base (Senha 123456)
INSERT INTO users (username, password_hash, role, name) VALUES 
('master', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'MASTER', 'Suporte Técnico Master'),
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'Administração Predial'),
('portaria', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PORTARIA', 'Vigilância Noturna');

-- Procedimento para criar os 480 apartamentos corrigido
DELIMITER //
CREATE PROCEDURE PopulateApartments()
BEGIN
    DECLARE t_id VARCHAR(10);
    DECLARE floor_num INT;
    DECLARE unit_num INT;
    DECLARE final_apt_num VARCHAR(10);
    
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR SELECT id FROM towers;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO t_id;
        IF done THEN LEAVE read_loop; END IF;
        
        SET floor_num = 1;
        WHILE floor_num <= 20 DO
            SET unit_num = 1;
            WHILE unit_num <= 4 DO
                SET final_apt_num = CONCAT(floor_num, LPAD(unit_num, 2, '0'));
                INSERT INTO apartments (id, tower_id, number) 
                VALUES (CONCAT(t_id, '-', final_apt_num), t_id, final_apt_num);
                SET unit_num = unit_num + 1;
            END WHILE;
            SET floor_num = floor_num + 1;
        END WHILE;
    END LOOP;
    CLOSE cur;
END //
DELIMITER ;

CALL PopulateApartments();
DROP PROCEDURE PopulateApartments;

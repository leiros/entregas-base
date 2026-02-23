<?php
require_once 'config.php';
checkAuth();

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'portaria_register':
        $tracking = $_POST['tracking'];
        $aptId = $_POST['apt_id'];
        
        $stmtApt = $pdo->prepare("SELECT tower_id FROM apartments WHERE id = ?");
        $stmtApt->execute([$aptId]);
        $towerId = $stmtApt->fetchColumn();

        $stmt = $pdo->prepare("INSERT INTO deliveries (tracking_code, status, tower_id, apartment_id, received_at_portaria, received_by_portaria_name) VALUES (?, 'PORTARIA', ?, ?, NOW(), ?)");
        $stmt->execute([$tracking, $towerId, $aptId, $_SESSION['user_name']]);
        break;

    case 'bulk_forward':
        // Move da Portaria para Administração Espera e registra o horário de recebimento na ADM
        $pdo->query("UPDATE deliveries SET status = 'ADMINISTRACAO_ESPERA', received_at_admin = NOW(), received_by_admin_name = 'Lote Portaria' WHERE status = 'PORTARIA'");
        break;

    case 'mark_notified':
        $id = $_POST['id'];
        $pdo->prepare("UPDATE deliveries SET status = 'PENDENTE_RECOLHIMENTO', notified_at = NOW() WHERE id = ?")->execute([$id]);
        break;

    case 'finish_delivery':
        $id = $_POST['id'];
        $receivedBy = $_POST['received_by'] ?? 'Não informado';
        // Finaliza a entrega independente se está na ADM ou Portaria
        $stmt = $pdo->prepare("UPDATE deliveries SET status = 'ENTREGUE', delivered_at = NOW(), delivered_to_name = ? WHERE id = ?");
        $stmt->execute([$receivedBy, $id]);
        break;

    case 'update_resident':
        $aptId = $_POST['apt_id'];
        $name = $_POST['name'];
        $phone = $_POST['phone'];
        $pdo->prepare("UPDATE apartments SET resident_name = ?, resident_phone = ? WHERE id = ?")->execute([$name, $phone, $aptId]);
        header("Location: manage_residents.php?success=1");
        exit;

    case 'manage_users':
        if ($_SESSION['user_role'] !== 'MASTER') exit;
        $username = $_POST['username'];
        $name = $_POST['name'];
        $role = $_POST['role'];
        $pass = password_hash('123456', PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO users (username, password_hash, role, name) VALUES (?, ?, ?, ?)")->execute([$username, $pass, $role, $name]);
        header("Location: manage_users.php");
        exit;
}

header("Location: dashboard.php");
exit;
<?php
require_once 'config.php';
checkAuth();

$role = $_SESSION['user_role'];

// Cálculos de Estatísticas Completos
$stats = [
    'received_today' => $pdo->query("SELECT COUNT(*) FROM deliveries WHERE DATE(received_at_portaria) = CURDATE()")->fetchColumn(),
    'received_week'  => $pdo->query("SELECT COUNT(*) FROM deliveries WHERE YEARWEEK(received_at_portaria, 1) = YEARWEEK(CURDATE(), 1)")->fetchColumn(),
    'at_portaria'    => $pdo->query("SELECT COUNT(*) FROM deliveries WHERE status = 'PORTARIA'")->fetchColumn(),
    'retained_admin' => $pdo->query("SELECT COUNT(*) FROM deliveries WHERE status IN ('ADMINISTRACAO_ESPERA', 'PENDENTE_RECOLHIMENTO')")->fetchColumn(),
    'delivered_today' => $pdo->query("SELECT COUNT(*) FROM deliveries WHERE status = 'ENTREGUE' AND DATE(delivered_at) = CURDATE()")->fetchColumn(),
    'delivered_week'  => $pdo->query("SELECT COUNT(*) FROM deliveries WHERE status = 'ENTREGUE' AND YEARWEEK(delivered_at, 1) = YEARWEEK(CURDATE(), 1)")->fetchColumn(),
];

// Query para Encomendas Ativas (conforme o cargo)
$sqlActive = "SELECT d.*, t.name as tower_name, a.number as apt_number, a.resident_name, a.resident_phone 
              FROM deliveries d 
              JOIN towers t ON d.tower_id = t.id 
              JOIN apartments a ON d.apartment_id = a.id 
              WHERE d.status != 'ENTREGUE' ";

if ($role === 'PORTARIA') {
    // Portaria só vê o que está com ela
    $sqlActive .= " AND d.status = 'PORTARIA' ORDER BY d.received_at_portaria DESC";
} elseif ($role === 'ADMIN') {
    // Administração vê o que está na Portaria (para fiscalização) e o que está com ela
    $sqlActive .= " AND d.status IN ('PORTARIA', 'ADMINISTRACAO_ESPERA', 'PENDENTE_RECOLHIMENTO') ORDER BY 
                    CASE 
                        WHEN d.status = 'ADMINISTRACAO_ESPERA' THEN 1 
                        WHEN d.status = 'PENDENTE_RECOLHIMENTO' THEN 2 
                        ELSE 3 
                    END, d.received_at_portaria DESC";
} else {
    $sqlActive .= " ORDER BY d.received_at_portaria DESC";
}

$activeDeliveries = $pdo->query($sqlActive)->fetchAll();

// Query para Histórico de Entregas Concluídas (Recentes)
$deliveredDeliveries = $pdo->query("SELECT d.*, t.name as tower_name, a.number as apt_number 
                                    FROM deliveries d 
                                    JOIN towers t ON d.tower_id = t.id 
                                    JOIN apartments a ON d.apartment_id = a.id 
                                    WHERE d.status = 'ENTREGUE' 
                                    ORDER BY d.delivered_at DESC LIMIT 15")->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Entregas App - Painel Geral</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 min-h-screen">
    <nav class="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="bg-white p-1 rounded-lg">
                    <svg class="w-7 h-7 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <div>
                    <span class="font-black text-xl tracking-tight uppercase">Entregas App</span>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <div class="hidden md:block text-right mr-4">
                    <p class="text-[10px] font-bold uppercase text-blue-300">Operador Logado</p>
                    <p class="text-sm font-bold leading-none"><?= $_SESSION['user_name'] ?> (<?= $role ?>)</p>
                </div>
                <a href="logout.php" class="bg-blue-900 hover:bg-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-inner uppercase">Sair</a>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- Cards de Estatísticas Otimizados -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Recebidos Hoje</p>
                <h3 class="text-2xl font-black text-blue-600"><?= $stats['received_today'] ?></h3>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Recebidos Semana</p>
                <h3 class="text-2xl font-black text-slate-600"><?= $stats['received_week'] ?></h3>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-blue-100 bg-blue-50/20">
                <p class="text-[9px] font-black text-blue-500 uppercase mb-1">Na Portaria</p>
                <h3 class="text-2xl font-black text-blue-700"><?= $stats['at_portaria'] ?></h3>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-amber-100 bg-amber-50/30">
                <p class="text-[9px] font-black text-amber-600 uppercase mb-1">Na Administração</p>
                <h3 class="text-2xl font-black text-amber-600"><?= $stats['retained_admin'] ?></h3>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Entregues Hoje</p>
                <h3 class="text-2xl font-black text-green-600"><?= $stats['delivered_today'] ?></h3>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Entregues Semana</p>
                <h3 class="text-2xl font-black text-indigo-600"><?= $stats['delivered_week'] ?></h3>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Sidebar de Ações -->
            <div class="lg:col-span-1 space-y-6">
                <?php if($role === 'PORTARIA' || $role === 'MASTER'): ?>
                <div class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="font-bold text-slate-800 mb-4 flex items-center border-b pb-2">📥 Receber Encomenda</h2>
                    <form action="actions.php" method="POST" class="space-y-4">
                        <input type="hidden" name="action" value="portaria_register">
                        <div>
                            <label class="text-[10px] font-bold uppercase text-slate-400">Rastreio</label>
                            <input name="tracking" required placeholder="Código ou Barras" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase text-slate-400">Unidade</label>
                            <select name="apt_id" required class="w-full border p-2 rounded-lg text-sm bg-slate-50">
                                <option value="">Selecione...</option>
                                <?php
                                $apts = $pdo->query("SELECT a.id, a.number, t.name as tower_name FROM apartments a JOIN towers t ON a.tower_id = t.id ORDER BY t.name, a.number")->fetchAll();
                                foreach($apts as $a): ?>
                                    <option value="<?= $a['id'] ?>"><?= $a['tower_name'] ?> - Apt <?= $a['number'] ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <button class="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm">Registrar Entrada</button>
                    </form>
                    
                    <form action="actions.php" method="POST" class="mt-6 border-t pt-4">
                        <input type="hidden" name="action" value="bulk_forward">
                        <button class="w-full bg-amber-100 text-amber-700 font-bold py-2 rounded-lg hover:bg-amber-200 transition-all text-[11px] uppercase border border-amber-200">
                            Encaminhar p/ Administração
                        </button>
                    </form>
                </div>
                <?php endif; ?>

                <?php if($role === 'ADMIN' || $role === 'MASTER'): ?>
                <div class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="font-bold text-slate-800 mb-4 flex items-center border-b pb-2 text-indigo-700">⚙️ Gestão ADM</h2>
                    <a href="manage_residents.php" class="flex items-center justify-between p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all group mb-3">
                        <span class="text-xs font-bold text-indigo-700 uppercase">Lista de Moradores</span>
                        <span class="text-lg">👥</span>
                    </a>
                </div>
                <?php endif; ?>
            </div>

            <!-- Listas de Encomendas -->
            <div class="lg:col-span-3 space-y-8">
                
                <!-- SEÇÃO: ENCOMENDAS PENDENTES -->
                <div class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    <div class="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                        <h2 class="font-bold text-slate-700 uppercase text-xs tracking-widest">Aguardando Retirada</h2>
                        <span class="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold"><?= count($activeDeliveries) ?> ITENS</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50/80">
                                <tr class="text-slate-500 text-left text-[10px] uppercase font-bold tracking-widest border-b">
                                    <th class="px-6 py-3">Entrada</th>
                                    <th class="px-6 py-3">Rastreio / Unidade</th>
                                    <th class="px-6 py-3">Localização</th>
                                    <th class="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <?php foreach($activeDeliveries as $d): ?>
                                <tr class="hover:bg-blue-50/50 transition-all <?= $d['status'] === 'PORTARIA' ? 'opacity-80' : '' ?>">
                                    <td class="px-6 py-4 whitespace-nowrap text-[11px] font-medium text-slate-500">
                                        <?= date('d/m/H:i', strtotime($d['received_at_portaria'])) ?>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-blue-900"><?= $d['tracking_code'] ?></div>
                                        <div class="text-[11px] text-slate-400 font-bold uppercase">Apto <?= $d['apt_number'] ?></div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <?php if($d['status'] === 'PORTARIA'): ?>
                                            <span class="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[9px] font-black uppercase">Na Portaria</span>
                                        <?php elseif($d['status'] === 'ADMINISTRACAO_ESPERA'): ?>
                                            <span class="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase">Na ADM (Aguardando Aviso)</span>
                                        <?php elseif($d['status'] === 'PENDENTE_RECOLHIMENTO'): ?>
                                            <span class="px-2 py-1 rounded bg-green-100 text-green-700 text-[9px] font-black uppercase">Na ADM (Avisado)</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex flex-col items-end space-y-2">
                                            <?php if($d['status'] === 'PORTARIA'): ?>
                                                <span class="text-[9px] text-slate-400 uppercase font-bold">Aguardando Lote</span>
                                            <?php else: ?>
                                                <?php if(($role === 'ADMIN' || $role === 'MASTER') && $d['status'] === 'ADMINISTRACAO_ESPERA'): ?>
                                                    <a href="https://api.whatsapp.com/send?phone=<?= $d['resident_phone'] ?>&text=<?= urlencode("Olá " . $d['resident_name'] . ", sua encomenda (" . $d['tracking_code'] . ") já está na Administração! Pode vir retirar.") ?>" target="_blank" class="text-green-600 hover:text-green-700 font-bold text-[10px] uppercase flex items-center">
                                                        <span class="mr-1">📲</span> Avisar Morador
                                                    </a>
                                                <?php endif; ?>

                                                <form action="actions.php" method="POST" class="flex items-center space-x-1">
                                                    <input type="hidden" name="action" value="finish_delivery">
                                                    <input type="hidden" name="id" value="<?= $d['id'] ?>">
                                                    <input name="received_by" required placeholder="Nome do Recebedor" class="border p-1.5 text-[10px] rounded-lg outline-none focus:border-blue-500 w-32 bg-slate-50">
                                                    <button class="bg-blue-600 text-white font-bold text-[10px] px-3 py-2 rounded-lg hover:bg-green-600 transition-colors uppercase shadow-sm">Entregar</button>
                                                </form>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- SEÇÃO: HISTÓRICO DE ENTREGAS -->
                <div class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    <div class="bg-green-600 px-6 py-3 flex justify-between items-center">
                        <h2 class="font-bold text-white uppercase text-xs tracking-widest">Histórico Recente</h2>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 border-b">
                                <tr class="text-slate-500 text-left text-[9px] uppercase font-bold tracking-widest">
                                    <th class="px-4 py-3">Cód / Unidade</th>
                                    <th class="px-4 py-3 text-center">Portaria</th>
                                    <th class="px-4 py-3 text-center">ADM</th>
                                    <th class="px-4 py-3 text-center">Retirada</th>
                                    <th class="px-4 py-3">Recebido por</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <?php foreach($deliveredDeliveries as $dd): ?>
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-4 py-3">
                                        <div class="font-bold text-slate-700"><?= $dd['tracking_code'] ?></div>
                                        <div class="text-[10px] text-slate-400 font-black uppercase">Apto <?= $dd['apt_number'] ?></div>
                                    </td>
                                    <td class="px-4 py-3 text-center text-[10px] text-slate-500"><?= date('H:i', strtotime($dd['received_at_portaria'])) ?></td>
                                    <td class="px-4 py-3 text-center text-[10px] text-amber-600"><?= $dd['received_at_admin'] ? date('H:i', strtotime($dd['received_at_admin'])) : '-' ?></td>
                                    <td class="px-4 py-3 text-center text-[10px] text-green-600 font-bold"><?= date('H:i', strtotime($dd['delivered_at'])) ?></td>
                                    <td class="px-4 py-3 text-[11px] font-bold text-slate-700"><?= $dd['delivered_to_name'] ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
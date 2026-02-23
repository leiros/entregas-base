<?php
require_once 'config.php';
checkAuth();

if (!in_array($_SESSION['user_role'], ['ADMIN', 'MASTER'])) {
    header("Location: dashboard.php");
    exit;
}

$search = $_GET['search'] ?? '';
$query = "SELECT a.*, t.name as tower_name FROM apartments a JOIN towers t ON a.tower_id = t.id ";
if ($search) {
    $query .= "WHERE a.number LIKE :s OR a.resident_name LIKE :s OR t.name LIKE :s ";
}
$query .= "ORDER BY t.name, a.number ASC";

$stmt = $pdo->prepare($query);
if ($search) $stmt->execute(['s' => "%$search%"]);
else $stmt->execute();
$apartments = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Gerenciar Moradores - Lista</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-slate-100 min-h-screen pb-20">
    <nav class="bg-indigo-700 text-white p-4 shadow-lg mb-8">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="font-bold flex items-center text-lg"><span class="mr-2">👥</span> Gestão de Moradores</h1>
            <a href="dashboard.php" class="text-xs bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded font-bold transition-all uppercase">Voltar ao Painel</a>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4">
        <!-- Filtro -->
        <div class="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <form method="GET" class="flex flex-col md:flex-row gap-4">
                <div class="flex-1 relative">
                    <span class="absolute inset-y-0 left-3 flex items-center text-slate-400">🔍</span>
                    <input name="search" value="<?= htmlspecialchars($search) ?>" placeholder="Buscar por apartamento, nome ou torre..." class="w-full border pl-10 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-sm">
                </div>
                <button class="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all text-sm shadow-md">Filtrar Lista</button>
                <?php if($search): ?>
                    <a href="manage_residents.php" class="text-indigo-600 font-bold text-xs self-center hover:underline">Limpar busca</a>
                <?php endif; ?>
            </form>
        </div>

        <!-- Tabela -->
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 border-b border-slate-100">
                    <tr class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <th class="px-6 py-4">Torre</th>
                        <th class="px-6 py-4">Apartamento</th>
                        <th class="px-6 py-4">Residente Ativo</th>
                        <th class="px-6 py-4">Contato (WhatsApp)</th>
                        <th class="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <?php foreach($apartments as $a): ?>
                    <tr class="hover:bg-indigo-50/30 transition-all group">
                        <td class="px-6 py-4">
                            <span class="text-slate-400 font-medium"><?= $a['tower_name'] ?></span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="font-bold text-slate-800">Apto <?= $a['number'] ?></span>
                        </td>
                        <form action="actions.php" method="POST">
                            <input type="hidden" name="action" value="update_resident">
                            <input type="hidden" name="apt_id" value="<?= $a['id'] ?>">
                            <td class="px-6 py-4">
                                <input name="name" value="<?= htmlspecialchars($a['resident_name']) ?>" class="bg-transparent border-b border-transparent focus:border-indigo-300 focus:bg-white outline-none px-2 py-1 w-full text-slate-700 font-medium rounded transition-all">
                            </td>
                            <td class="px-6 py-4">
                                <input name="phone" value="<?= htmlspecialchars($a['resident_phone']) ?>" class="bg-transparent border-b border-transparent focus:border-indigo-300 focus:bg-white outline-none px-2 py-1 w-48 text-slate-700 font-medium rounded transition-all font-mono">
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button type="submit" class="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all shadow-sm">Salvar</button>
                            </td>
                        </form>
                    </tr>
                    <?php endforeach; ?>
                    <?php if(empty($apartments)): ?>
                        <tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">Nenhum apartamento encontrado com esse filtro.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
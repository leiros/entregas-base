<?php
require_once 'config.php';
checkAuth();

if ($_SESSION['user_role'] !== 'MASTER') {
    header("Location: dashboard.php");
    exit;
}

$users = $pdo->query("SELECT * FROM users ORDER BY role ASC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Gerenciar Operadores</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100">
    <nav class="bg-red-700 text-white p-4 shadow-lg mb-8">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="font-bold flex items-center"><span class="mr-2">🛡️</span> Painel Master: Operadores</h1>
            <a href="dashboard.php" class="text-sm bg-red-800 px-4 py-2 rounded font-bold">Voltar ao Painel</a>
        </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 class="font-bold text-slate-800 mb-4">Novo Operador</h2>
            <form action="actions.php" method="POST" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input type="hidden" name="action" value="manage_users">
                <div>
                    <label class="text-[10px] font-bold uppercase text-slate-400">Login</label>
                    <input name="username" required class="w-full border p-2 rounded text-sm">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase text-slate-400">Nome</label>
                    <input name="name" required class="w-full border p-2 rounded text-sm">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase text-slate-400">Nível</label>
                    <select name="role" class="w-full border p-2 rounded text-sm bg-white">
                        <option value="PORTARIA">Portaria</option>
                        <option value="ADMIN">Administração</option>
                        <option value="MASTER">Master</option>
                    </select>
                </div>
                <button class="bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 text-sm">Criar Usuário</button>
            </form>
            <p class="mt-2 text-[10px] text-red-400 font-bold">Senha padrão para novos: 123456</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="p-4 text-xs font-bold text-slate-500 uppercase">Nome</th>
                        <th class="p-4 text-xs font-bold text-slate-500 uppercase">Cargo</th>
                        <th class="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <?php foreach($users as $u): ?>
                    <tr>
                        <td class="p-4">
                            <div class="font-bold"><?= $u['name'] ?></div>
                            <div class="text-xs text-slate-500">@<?= $u['username'] ?></div>
                        </td>
                        <td class="p-4">
                            <span class="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded"><?= $u['role'] ?></span>
                        </td>
                        <td class="p-4 text-green-600 font-bold text-xs"><?= $u['active'] ? 'ATIVO' : 'INATIVO' ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
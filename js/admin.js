// Выход из админки
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('adminAuthenticated');
            window.location.href = 'admin-login.html';
        });
    }
});

// Демо-данные гостей (только те, кто заполнил форму)
let guests = [
    {
        id: 1,
        name: "Анна Иванова",
        guests: 1,
        children: 0,
        alcohol: ["вино"],
        allergies: "Нет",
        comment: "—",
        status: "coming"
    },
    {
        id: 2,
        name: "Дмитрий Петров",
        guests: 2,
        children: 0,
        alcohol: ["водка", "вино"],
        allergies: "Нет",
        comment: "Будем рады увидеть всех!",
        status: "coming"
    },
    {
        id: 3,
        name: "Елена Смирнова",
        guests: 0,
        children: 0,
        alcohol: [],
        allergies: "Орехи",
        comment: "—",
        status: "not"
    },
    {
        id: 4,
        name: "Михаил Козлов",
        guests: 1,
        children: 1,
        alcohol: ["пиво"],
        allergies: "Нет",
        comment: "—",
        status: "coming"
    },
    {
        id: 5,
        name: "Алексей Виноградов",
        guests: 2,
        children: 0,
        alcohol: ["виски", "вино"],
        allergies: "Нет",
        comment: "—",
        status: "coming"
    },
    {
        id: 6,
        name: "Мария Федорова",
        guests: 1,
        children: 2,
        alcohol: ["без алкоголя"],
        allergies: "Нет",
        comment: "Дети будут, 5 и 7 лет",
        status: "coming"
    },
    {
        id: 7,
        name: "Сергей Николаев",
        guests: 0,
        children: 0,
        alcohol: [],
        allergies: "Нет",
        comment: "—",
        status: "not"
    },
    {
        id: 8,
        name: "Игорь Соколов",
        guests: 2,
        children: 1,
        alcohol: ["водка", "пиво"],
        allergies: "Нет",
        comment: "—",
        status: "coming"
    }
];

// Текущий фильтр
let currentFilter = 'all';
let searchQuery = '';

// Рендер таблицы
function renderTable() {
    console.log('renderTable вызван!');
    const tbody = document.getElementById('tableBody');
    const rowCount = document.getElementById('rowCount');
    
    // Проверка, что элементы найдены
    if (!tbody) {
        console.error('Элемент tableBody не найден!');
        return;
    }
    
    // Фильтрация
    let filtered = guests;
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(g => g.status === currentFilter);
    }
    
    if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(g => g.name.toLowerCase().includes(query));
    }
    
    // Обновляем статистику
    updateStats();
    
    // Рендер строк
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #6B7A8A;">
                    Нет записей, соответствующих фильтрам
                </td>
            </tr>
        `;
        rowCount.textContent = 'Показано: 0 записей';
        return;
    }
    
    let html = '';
    filtered.forEach((guest, index) => {
        const statusLabels = {
            'coming': 'Идёт',
            'not': 'Не идёт'
        };
        const statusClasses = {
            'coming': 'coming',
            'not': 'not'
        };
        
        const alcoholText = guest.alcohol.length > 0 ? guest.alcohol.join(', ') : 'Не выбрано';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${guest.name}</strong></td>
                <td>${guest.guests}</td>
                <td>${guest.children}</td>
                <td>${alcoholText}</td>
                <td>${guest.allergies}</td>
                <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${guest.comment}</td>
                <td><span class="status-badge ${statusClasses[guest.status]}">${statusLabels[guest.status]}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteGuest(${guest.id})" title="Удалить">✕</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    rowCount.textContent = `Показано: ${filtered.length} из ${guests.length} записей`;
}

// Обновление статистики
function updateStats() {
    const total = guests.length;
    const coming = guests.filter(g => g.status === 'coming').length;
    const not = guests.filter(g => g.status === 'not').length;
    const children = guests.reduce((sum, g) => sum + g.children, 0);
    const alcoholOrders = guests.reduce((sum, g) => sum + g.alcohol.length, 0);
    
    document.getElementById('totalGuests').textContent = total;
    document.getElementById('confirmedGuests').textContent = coming;
    document.getElementById('declinedGuests').textContent = not;
    document.getElementById('totalChildren').textContent = children;
    document.getElementById('totalAlcohol').textContent = alcoholOrders;
}

// Удаление гостя
function deleteGuest(id) {
    if (confirm('Удалить этого гостя из списка?')) {
        guests = guests.filter(g => g.id !== id);
        renderTable();
    }
}

// Фильтры
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен!');
    
    const filterStatus = document.getElementById('filterStatus');
    const searchInput = document.getElementById('searchInput');
    
    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            currentFilter = this.value;
            renderTable();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value;
            renderTable();
        });
    }
    
    // Кнопки экспорта
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
    document.getElementById('exportCsvBtn').addEventListener('click', () => exportToCSV('guests_list.csv'));
    
    // Инициализация таблицы
    renderTable();
});

// Экспорт в Excel (CSV с разделителем ;)
function exportToCSV(filename = 'guests_list.csv') {
    const headers = ['№', 'Имя', 'Гостей', 'Детей', 'Алкоголь', 'Аллергии', 'Комментарий', 'Статус'];
    const statusMap = { 'coming': 'Идёт', 'not': 'Не идёт' };
    
    let csv = headers.join(';') + '\n';
    
    guests.forEach((guest, index) => {
        const row = [
            index + 1,
            guest.name,
            guest.guests,
            guest.children,
            guest.alcohol.length > 0 ? guest.alcohol.join(', ') : 'Не выбрано',
            guest.allergies,
            guest.comment,
            statusMap[guest.status]
        ];
        csv += row.join(';') + '\n';
    });
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Экспорт в Excel (XLSX через простой HTML)
function exportToExcel() {
    const statusMap = { 'coming': 'Идёт', 'not': 'Не идёт' };
    
    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Гости</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>td,th{border:1px solid #ccc;padding:8px;}</style>
        </head><body>
        <table>
            <thead>
                <tr>
                    <th>№</th><th>Имя</th><th>Гостей</th><th>Детей</th><th>Алкоголь</th><th>Аллергии</th><th>Комментарий</th><th>Статус</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    guests.forEach((guest, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${guest.name}</td>
                <td>${guest.guests}</td>
                <td>${guest.children}</td>
                <td>${guest.alcohol.length > 0 ? guest.alcohol.join(', ') : 'Не выбрано'}</td>
                <td>${guest.allergies}</td>
                <td>${guest.comment}</td>
                <td>${statusMap[guest.status]}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></body></html>';
    
    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guests_list.xls';
    link.click();
    URL.revokeObjectURL(link.href);
}
// =====================================================
// Weddy — Админ-панель (исправленная)
// =====================================================

// Проверка авторизации
if (!sessionStorage.getItem('adminAuthenticated')) {
    window.location.href = 'admin-login.html';
}

// Получаем URL таблицы из сессии
const SCRIPT_URL = sessionStorage.getItem('tableUrl');
const PROJECT_NAME = sessionStorage.getItem('projectName');

if (!SCRIPT_URL) {
    alert('Ошибка: не найден URL таблицы. Войдите заново.');
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'admin-login.html';
}

// Показываем название проекта в шапке
document.addEventListener('DOMContentLoaded', function() {
    const projectNameEl = document.getElementById('projectName');
    if (projectNameEl && PROJECT_NAME) {
        projectNameEl.textContent = PROJECT_NAME;
    }
});

let guests = [];
let headers = [];
let allHeaders = [];

// =====================================================
// ЗАГРУЗКА ДАННЫХ ИЗ ТАБЛИЦЫ
// =====================================================
function loadGuestsFromSheet() {
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            // data = { headers: [...], rows: [...] }
            if (data.headers) {
                // Сохраняем все заголовки
                allHeaders = data.headers;
                // Фильтруем заголовки: убираем пустые и служебные
                headers = data.headers.filter(h => {
                    return h && h.trim() !== '' && 
                           h.trim() !== 'ID' && 
                           h.trim() !== 'id' &&
                           h.trim() !== '№';
                });
                guests = data.rows.map(row => {
                    const newRow = {};
                    data.headers.forEach(h => {
                        newRow[h] = row[h] !== undefined ? row[h] : '—';
                    });
                    return newRow;
                });
                console.log('✅ Все заголовки:', allHeaders);
                console.log('✅ Отображаемые заголовки:', headers);
            } else {
                // Если данные без заголовков — используем старый формат
                guests = data;
                headers = guests.length > 0 ? Object.keys(guests[0]).filter(h => h !== 'id' && h !== 'ID') : ['Имя', 'Статус'];
                allHeaders = headers;
            }
            console.log('✅ Данные загружены из таблицы:', guests.length, 'записей');
            renderTable();
            updateStats();
        })
        .catch(error => {
            console.error('❌ Ошибка загрузки данных:', error);
            guests = getDemoData();
            renderTable();
            updateStats();
            alert('⚠️ Не удалось загрузить данные из таблицы. Показаны демо-данные.');
        });
}

// =====================================================
// ДЕМО-ДАННЫЕ
// =====================================================
function getDemoData() {
    return [
        { Имя: "Анна Иванова", Гостей: 1, Детей: 0, Алкоголь: "вино", Аллергии: "Нет", Комментарий: "—", Статус: "Идёт", Дата: "15.08.2026" },
        { Имя: "Дмитрий Петров", Гостей: 2, Детей: 0, Алкоголь: "водка, вино", Аллергии: "Нет", Комментарий: "Будем рады увидеть всех!", Статус: "Идёт", Дата: "15.08.2026" },
        { Имя: "Елена Смирнова", Гостей: 0, Детей: 0, Алкоголь: "—", Аллергии: "Орехи", Комментарий: "—", Статус: "Не идёт", Дата: "14.08.2026" },
        { Имя: "Михаил Козлов", Гостей: 1, Детей: 1, Алкоголь: "пиво", Аллергии: "Нет", Комментарий: "—", Статус: "Идёт", Дата: "15.08.2026" }
    ];
}

let currentFilter = 'all';
let searchQuery = '';

// =====================================================
// РЕНДЕР ТАБЛИЦЫ (исправленный)
// =====================================================
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const rowCount = document.getElementById('rowCount');
    
    if (!tbody) {
        console.error('Элемент tableBody не найден!');
        return;
    }
    
    // Используем отфильтрованные заголовки
    let headerKeys = headers.length > 0 ? headers : ['Имя', 'Статус'];
    
    // Фильтрация
    let filtered = guests;
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(g => {
            const status = g.Статус || g.status || '';
            return status === currentFilter;
        });
    }
    
    if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(g => {
            const name = g.Имя || g.name || '';
            return name.toLowerCase().includes(query);
        });
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="${headerKeys.length + 1}" style="text-align: center; padding: 40px; color: #6B7A8A;">
                    Нет записей, соответствующих фильтрам
                </td>
            </tr>
        `;
        rowCount.textContent = 'Показано: 0 записей';
        return;
    }
    
    let html = '';
    filtered.forEach((guest, index) => {
        html += '<tr>';
        html += `<td>${index + 1}</td>`;
        
        // Показываем только нужные колонки
        headerKeys.forEach(key => {
            let value = guest[key] !== undefined && guest[key] !== '—' ? guest[key] : '—';
            
            // Форматируем дату
            if (key === 'Дата' || key === 'date' || key === 'timestamp' || key === 'Date') {
                if (value && value !== '—') {
                    try {
                        const d = new Date(value);
                        if (!isNaN(d.getTime())) {
                            value = d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
                        }
                    } catch(e) {}
                }
            }
            
            // Делаем первую колонку жирной (если это имя)
            if (key === 'Имя' || key === 'name') {
                html += `<td><strong>${value}</strong></td>`;
            } else if (key === 'Статус' || key === 'status') {
                const statusMap = { 'coming': 'Идёт', 'not': 'Не идёт', 'Идёт': 'Идёт', 'Не идёт': 'Не идёт' };
                value = statusMap[value] || value;
                const statusClass = value === 'Идёт' ? 'coming' : 'not';
                html += `<td><span class="status-badge ${statusClass}">${value}</span></td>`;
            } else {
                html += `<td>${value}</td>`;
            }
        });
        
        html += '</tr>';
    });
    
    tbody.innerHTML = html;
    rowCount.textContent = `Показано: ${filtered.length} из ${guests.length} записей`;
}

// =====================================================
// СТАТИСТИКА
// =====================================================
function updateStats() {
    const total = guests.length;
    
    // Считаем статусы
    const coming = guests.filter(g => {
        const status = g.Статус || g.status || '';
        return status === 'coming' || status === 'Идёт';
    }).length;
    
    const not = guests.filter(g => {
        const status = g.Статус || g.status || '';
        return status === 'not' || status === 'Не идёт';
    }).length;
    
    // Считаем детей
    const children = guests.reduce((sum, g) => {
        const val = parseInt(g.Детей) || parseInt(g.children) || 0;
        return sum + val;
    }, 0);
    
    // Считаем алкоголь
    const alcoholOrders = guests.reduce((sum, g) => {
        const alcohol = g.Алкоголь || g.alcohol || '';
        if (alcohol && alcohol !== '—' && alcohol !== 'Не выбрано') {
            return sum + alcohol.split(',').length;
        }
        return sum;
    }, 0);
    
    document.getElementById('totalGuests').textContent = total;
    document.getElementById('confirmedGuests').textContent = coming;
    document.getElementById('declinedGuests').textContent = not;
    document.getElementById('totalChildren').textContent = children;
    document.getElementById('totalAlcohol').textContent = alcoholOrders;
}

// =====================================================
// ЭКСПОРТ В CSV
// =====================================================
function exportToCSV(filename = 'guests_list.csv') {
    const headerKeys = headers.length > 0 ? headers : ['Имя', 'Статус'];
    
    let csv = headerKeys.join(';') + '\n';
    
    guests.forEach((guest) => {
        const row = headerKeys.map(key => {
            let value = guest[key] !== undefined ? guest[key] : '—';
            return value;
        });
        csv += row.join(';') + '\n';
    });
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// =====================================================
// ЭКСПОРТ В EXCEL
// =====================================================
function exportToExcel() {
    const headerKeys = headers.length > 0 ? headers : ['Имя', 'Статус'];
    
    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Гости</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>td,th{border:1px solid #ccc;padding:8px;}</style>
        </head><body>
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    ${headerKeys.map(key => `<th>${key}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;
    
    guests.forEach((guest, index) => {
        html += `<tr><td>${index + 1}</td>`;
        headerKeys.forEach(key => {
            let value = guest[key] !== undefined ? guest[key] : '—';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table></body></html>';
    
    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guests_list.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// =====================================================
// ВЫХОД
// =====================================================
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('tableUrl');
    sessionStorage.removeItem('projectName');
    sessionStorage.removeItem('projectId');
    window.location.href = 'admin-login.html';
}

// =====================================================
// ИНИЦИАЛИЗАЦИЯ
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Админ-панель загружена (v2)');
    console.log('📁 Проект:', PROJECT_NAME);
    console.log('🔗 URL:', SCRIPT_URL);
    
    // Кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Фильтры
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
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }
    
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => exportToCSV('guests_list.csv'));
    }
    
    // Загружаем данные
    loadGuestsFromSheet();
});
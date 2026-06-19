// =====================================================
// Weddy — Админ-панель (без удаления)
// =====================================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQkcz3X4LrCLH_7xeVveUegZzjovW0jLkxYoWPLIvr3SyWf-_IA6dLfONweY7g3HgL/exec';

let guests = [];

function loadGuestsFromSheet() {
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            guests = data;
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

function getDemoData() {
    return [
        { id: 1, name: "Анна Иванова", guests: 1, children: 0, alcohol: "вино", allergies: "Нет", comment: "—", status: "coming", date: "15.08.2026" },
        { id: 2, name: "Дмитрий Петров", guests: 2, children: 0, alcohol: "водка, вино", allergies: "Нет", comment: "Будем рады увидеть всех!", status: "coming", date: "15.08.2026" },
        { id: 3, name: "Елена Смирнова", guests: 0, children: 0, alcohol: "—", allergies: "Орехи", comment: "—", status: "not", date: "14.08.2026" },
        { id: 4, name: "Михаил Козлов", guests: 1, children: 1, alcohol: "пиво", allergies: "Нет", comment: "—", status: "coming", date: "15.08.2026" }
    ];
}

let currentFilter = 'all';
let searchQuery = '';

function renderTable() {
    const tbody = document.getElementById('tableBody');
    const rowCount = document.getElementById('rowCount');
    
    if (!tbody) {
        console.error('Элемент tableBody не найден!');
        return;
    }
    
    let filtered = guests;
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(g => g.status === currentFilter);
    }
    
    if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(g => g.name.toLowerCase().includes(query));
    }
    
    filtered.sort((a, b) => {
        if (a.status === 'coming' && b.status !== 'coming') return -1;
        if (a.status !== 'coming' && b.status === 'coming') return 1;
        return 0;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #6B7A8A;">
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
        
        const alcoholText = guest.alcohol && guest.alcohol !== '—' ? guest.alcohol : 'Не выбрано';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${guest.name}</strong></td>
                <td>${guest.guests || 0}</td>
                <td>${guest.children || 0}</td>
                <td>${alcoholText}</td>
                <td>${guest.allergies || 'Нет'}</td>
                <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${guest.comment || '—'}</td>
                <td><span class="status-badge ${statusClasses[guest.status]}">${statusLabels[guest.status]}</span></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    rowCount.textContent = `Показано: ${filtered.length} из ${guests.length} записей`;
}

function updateStats() {
    const total = guests.length;
    const coming = guests.filter(g => g.status === 'coming').length;
    const not = guests.filter(g => g.status === 'not').length;
    const children = guests.reduce((sum, g) => sum + (g.children || 0), 0);
    const alcoholOrders = guests.reduce((sum, g) => {
        if (g.alcohol && g.alcohol !== '—' && g.alcohol !== 'Не выбрано') {
            return sum + g.alcohol.split(',').length;
        }
        return sum;
    }, 0);
    
    document.getElementById('totalGuests').textContent = total;
    document.getElementById('confirmedGuests').textContent = coming;
    document.getElementById('declinedGuests').textContent = not;
    document.getElementById('totalChildren').textContent = children;
    document.getElementById('totalAlcohol').textContent = alcoholOrders;
}

function exportToCSV(filename = 'guests_list.csv') {
    const headers = ['№', 'Имя', 'Гостей', 'Детей', 'Алкоголь', 'Аллергии', 'Комментарий', 'Статус'];
    const statusMap = { 'coming': 'Идёт', 'not': 'Не идёт' };
    
    let csv = headers.join(';') + '\n';
    
    guests.forEach((guest, index) => {
        const row = [
            index + 1,
            guest.name,
            guest.guests || 0,
            guest.children || 0,
            guest.alcohol && guest.alcohol !== '—' ? guest.alcohol : 'Не выбрано',
            guest.allergies || 'Нет',
            guest.comment || '—',
            statusMap[guest.status] || guest.status
        ];
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
                <td>${guest.guests || 0}</td>
                <td>${guest.children || 0}</td>
                <td>${guest.alcohol && guest.alcohol !== '—' ? guest.alcohol : 'Не выбрано'}</td>
                <td>${guest.allergies || 'Нет'}</td>
                <td>${guest.comment || '—'}</td>
                <td>${statusMap[guest.status] || guest.status}</td>
            </tr>
        `;
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Админ-панель загружена');
    
    loadGuestsFromSheet();
    
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
    
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }
    
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => exportToCSV('guests_list.csv'));
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('adminAuthenticated');
            window.location.href = 'admin-login.html';
        });
    }
});
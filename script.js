// التهيئة المبدئية للبيانات في المتصفح
const defaultClasses = ["القسم 1", "القسم 2", "القسم 3", "القسم 4", "القسم 5", "القسم 6", "القسم 7"];

if (!localStorage.getItem('appData')) {
    let initialData = {
        classes: defaultClasses,
        students: {}, // صيغة: { "القسم 1": ["أحمد", "فاطمة"] }
        records: []
    };
    defaultClasses.forEach(c => initialData.students[c] = []);
    localStorage.setItem('appData', JSON.stringify(initialData));
}

// دالة لجلب البيانات
function getData() {
    return JSON.parse(localStorage.getItem('appData'));
}

// دالة لحفظ البيانات
function saveData(data) {
    localStorage.setItem('appData', JSON.stringify(data));
}

// التنقل بين التبويبات
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    document.getElementById('btn-' + tabId).classList.add('active');
    
    if (tabId === 'daily-entry') loadClassesSelect();
    if (tabId === 'settings') loadClassesSelect();
    if (tabId === 'reports') loadClassesSelect();
}

// تعبئة قوائم الأقسام
function loadClassesSelect() {
    const data = getData();
    const selects = ['class-select', 'settings-class-select', 'report-class-select'];
    
    selects.forEach(id => {
        const select = document.getElementById(id);
        if(!select) return;
        select.innerHTML = '<option value="">اختر القسم...</option>';
        data.classes.forEach(c => {
            select.innerHTML += `<option value="${c}">${c}</option>`;
        });
    });
}

// إضافة تلميذ جديد
function addStudent() {
    const name = document.getElementById('new-student-name').value;
    const className = document.getElementById('settings-class-select').value;
    
    if (!name || !className) return alert("يرجى إدخال الاسم واختيار القسم!");
    
    let data = getData();
    data.students[className].push(name);
    saveData(data);
    
    alert(`تمت إضافة ${name} إلى ${className} بنجاح!`);
    document.getElementById('new-student-name').value = '';
}

// تحميل التلاميذ في جدول التسجيل اليومي
function loadStudentsForEntry() {
    const className = document.getElementById('class-select').value;
    const tbody = document.getElementById('entry-tbody');
    tbody.innerHTML = ''; // تفريغ الجدول
    
    if (!className) return;
    
    const data = getData();
    const students = data.students[className] || [];
    
    // وضع تاريخ اليوم كافتراضي
    document.getElementById('record-date').valueAsDate = new Date();

    students.forEach((student, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student}</td>
            <td>
                <select id="att-${index}">
                    <option value="حاضر" selected>حاضر (الافتراضي)</option>
                    <option value="غائب">غائب</option>
                    <option value="متأخر">متأخر</option>
                </select>
            </td>
            <td>
                <select id="prep-${index}">
                    <option value="غير منجز">غير منجز</option>
                    <option value="إنجاز ضعيف">إنجاز ضعيف</option>
                    <option value="إنجاز متوسط">إنجاز متوسط</option>
                    <option value="إنجاز جيد">إنجاز جيد</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// حفظ سجل اليوم
function saveDailyRecords() {
    const className = document.getElementById('class-select').value;
    const date = document.getElementById('record-date').value;
    
    if (!className || !date) return alert("يرجى اختيار القسم والتاريخ!");
    
    let data = getData();
    const students = data.students[className] || [];
    
    students.forEach((student, index) => {
        const att = document.getElementById(`att-${index}`).value;
        const prep = document.getElementById(`prep-${index}`).value;
        
        // التحقق مما إذا كان هناك سجل مسبق وتحديثه، أو إضافة جديد
        let existingRecordIndex = data.records.findIndex(r => r.date === date && r.student === student && r.class === className);
        
        let record = { date, class: className, student, attendance: att, preparation: prep };
        
        if (existingRecordIndex >= 0) {
            data.records[existingRecordIndex] = record;
        } else {
            data.records.push(record);
        }
    });
    
    saveData(data);
    alert("تم حفظ السجل بنجاح!");
}

// توليد تقرير مبسط
function generateReport() {
    const className = document.getElementById('report-class-select').value;
    const container = document.getElementById('report-container');
    container.innerHTML = '';
    
    if (!className) return;
    
    const data = getData();
    const classRecords = data.records.filter(r => r.class === className);
    const students = data.students[className] || [];
    
    let html = `<table class="report-table">
        <thead>
            <tr>
                <th>التلميذ</th>
                <th>إجمالي الغياب</th>
                <th>إجمالي التأخر</th>
                <th>الإنجازات الجيدة</th>
            </tr>
        </thead>
        <tbody>`;
        
    students.forEach(student => {
        const studentRecords = classRecords.filter(r => r.student === student);
        const absentCount = studentRecords.filter(r => r.attendance === 'غائب').length;
        const lateCount = studentRecords.filter(r => r.attendance === 'متأخر').length;
        const goodPrepCount = studentRecords.filter(r => r.preparation === 'إنجاز جيد').length;
        
        html += `<tr>
            <td>${student}</td>
            <td>${absentCount}</td>
            <td>${lateCount}</td>
            <td>${goodPrepCount}</td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    container.innerHTML = html;
}

// تصدير البيانات
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getData()));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "student_data_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// استيراد البيانات
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if(data && data.classes && data.students) {
                saveData(data);
                alert("تم استيراد البيانات بنجاح!");
                location.reload();
            } else {
                alert("ملف غير صالح.");
            }
        } catch (err) {
            alert("حدث خطأ أثناء قراءة الملف.");
        }
    };
    reader.readAsText(file);
}

// تشغيل عند البداية
window.onload = loadClassesSelect;

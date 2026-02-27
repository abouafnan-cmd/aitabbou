// تهيئة البيانات
const defaultClasses = ["جذع مشترك علوم 5", "جذع مشترك علوم 6", "جذع مشترك علوم 7", "جذع مشترك علوم 8", "الأولى علوم 5", "الأولى علوم 6", "الأولى آداب 3"];
let db = JSON.parse(localStorage.getItem('schoolDB')) || { classes: defaultClasses, students: {}, records: {} };
let currentReportText = ""; // متغير لتخزين النص الجاهز للمشاركة

document.getElementById('recordDate').valueAsDate = new Date();
document.getElementById('reportDate').valueAsDate = new Date();

function init() {
    const classSelect = document.getElementById('classSelect');
    const manageSelect = document.getElementById('manageClassSelect');
    const reportSelect = document.getElementById('reportClassSelect');
    
    // الاحتفاظ بالقسم المختار حالياً إذا وجد
    const currClass = classSelect.value;
    const currManage = manageSelect.value;
    const currReport = reportSelect.value;

    classSelect.innerHTML = '<option value="">-- اختر القسم --</option>';
    manageSelect.innerHTML = '<option value="">-- اختر القسم للإدارة --</option>';
    reportSelect.innerHTML = '<option value="">-- اختر القسم --</option>';

    db.classes.forEach(cls => {
        classSelect.innerHTML += `<option value="${cls}">${cls}</option>`;
        manageSelect.innerHTML += `<option value="${cls}">${cls}</option>`;
        reportSelect.innerHTML += `<option value="${cls}">${cls}</option>`;
    });

    classSelect.value = currClass;
    manageSelect.value = currManage;
    reportSelect.value = currReport;
}

function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

/* ================== شاشة التتبع ================== */
function loadStudents() {
    const selectedDate = document.getElementById('recordDate').value;
    const selectedClass = document.getElementById('classSelect').value;
    const listDiv = document.getElementById('studentsList');
    listDiv.innerHTML = '';

    if (!selectedClass) {
        listDiv.innerHTML = '<p style="text-align: center; color: #777; padding: 20px;">المرجو اختيار القسم لعرض لائحة التلاميذ.</p>';
        return;
    }

    if (!db.students[selectedClass] || db.students[selectedClass].length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; color: #e74c3c; padding: 20px;">لا يوجد تلاميذ. اذهب لإدارة الأقسام لإضافتهم.</p>';
        return;
    }

    const savedData = (db.records && db.records[selectedDate] && db.records[selectedDate][selectedClass]) ? db.records[selectedDate][selectedClass] : null;

    db.students[selectedClass].forEach((student, index) => {
        let att = "حاضر", prep = "لم ينجز";
        if (savedData) {
            const studentRecord = savedData.find(s => s.name === student);
            if (studentRecord) { att = studentRecord.attendance; prep = studentRecord.preparation; }
        }

        const row = document.createElement('div');
        row.className = 'student-row';
        row.innerHTML = `
            <div class="student-name">${student}</div>
            <div class="options-group">
                <strong>الغياب:</strong>
                <label><input type="radio" name="att_${index}" value="حاضر" ${att === 'حاضر' ? 'checked' : ''}> حاضر</label>
                <label><input type="radio" name="att_${index}" value="متأخر" ${att === 'متأخر' ? 'checked' : ''}> متأخر</label>
                <label><input type="radio" name="att_${index}" value="غائب" ${att === 'غائب' ? 'checked' : ''}> غائب</label>
            </div>
            <div class="options-group">
                <strong>الإعداد:</strong>
                <label><input type="radio" name="prep_${index}" value="لم ينجز" ${prep === 'لم ينجز' ? 'checked' : ''}> لم ينجز</label>
                <label><input type="radio" name="prep_${index}" value="إنجاز ضعيف" ${prep === 'إنجاز ضعيف' ? 'checked' : ''}> ضعيف</label>
                <label><input type="radio" name="prep_${index}" value="إنجاز متوسط" ${prep === 'إنجاز متوسط' ? 'checked' : ''}> متوسط</label>
                <label><input type="radio" name="prep_${index}" value="إنجاز جيد" ${prep === 'إنجاز جيد' ? 'checked' : ''}> جيد</label>
            </div>
        `;
        listDiv.appendChild(row);
    });
}

function saveData() {
    const selectedDate = document.getElementById('recordDate').value;
    const selectedClass = document.getElementById('classSelect').value;

    if (!selectedDate || !selectedClass) return alert("المرجو اختيار التاريخ والقسم.");
    if (!db.students[selectedClass] || db.students[selectedClass].length === 0) return alert("لا يوجد تلاميذ.");

    if (!db.records) db.records = {};
    if (!db.records[selectedDate]) db.records[selectedDate] = {};

    let classRecord = [];
    db.students[selectedClass].forEach((student, index) => {
        let attendanceValue = document.querySelector(`input[name="att_${index}"]:checked`).value;
        let prepValue = document.querySelector(`input[name="prep_${index}"]:checked`).value;
        
        classRecord.push({ name: student, attendance: attendanceValue, preparation: prepValue });
    });

    db.records[selectedDate][selectedClass] = classRecord;
    localStorage.setItem('schoolDB', JSON.stringify(db));
    alert(`تم حفظ بيانات قسم ${selectedClass} بنجاح!`);
}

/* ================== شاشة إدارة الأقسام ================== */
function addClass() {
    const name = document.getElementById('newClassName').value.trim();
    if (!name) return;
    if (db.classes.includes(name)) return alert("هذا القسم موجود مسبقاً!");
    
    db.classes.push(name);
    db.students[name] = [];
    localStorage.setItem('schoolDB', JSON.stringify(db));
    document.getElementById('newClassName').value = "";
    init();
    alert("تمت إضافة القسم بنجاح.");
}

function deleteClass() {
    const selClass = document.getElementById('manageClassSelect').value;
    if (!selClass) return;
    if (confirm(`هل أنت متأكد من حذف قسم "${selClass}" وجميع تلاميذه؟ لا يمكن التراجع عن هذا الإجراء.`)) {
        db.classes = db.classes.filter(c => c !== selClass);
        delete db.students[selClass];
        // تنظيف السجلات المرتبطة بهذا القسم لتوفير المساحة
        for (let date in db.records) {
            if (db.records[date][selClass]) delete db.records[date][selClass];
        }
        localStorage.setItem('schoolDB', JSON.stringify(db));
        init();
        document.getElementById('studentManagementArea').style.display = 'none';
        alert("تم الحذف بنجاح.");
    }
}

function renderStudentManagement() {
    const selClass = document.getElementById('manageClassSelect').value;
    const area = document.getElementById('studentManagementArea');
    const list = document.getElementById('manageStudentList');
    
    if (!selClass) {
        area.style.display = 'none';
        return;
    }
    
    area.style.display = 'block';
    list.innerHTML = '';
    
    if (!db.students[selClass]) db.students[selClass] = [];
    
    db.students[selClass].forEach((student, index) => {
        list.innerHTML += `
            <li>
                <span>${student}</span>
                <button class="btn-danger" style="padding: 5px 10px; font-size: 0.8rem;" onclick="deleteStudent('${selClass}', ${index})">حذف</button>
            </li>
        `;
    });
}

function addStudent() {
    const selClass = document.getElementById('manageClassSelect').value;
    const name = document.getElementById('newStudentName').value.trim();
    if (!name || !selClass) return;
    
    db.students[selClass].push(name);
    localStorage.setItem('schoolDB', JSON.stringify(db));
    document.getElementById('newStudentName').value = "";
    renderStudentManagement();
}

function deleteStudent(className, studentIndex) {
    if (confirm("هل أنت متأكد من حذف هذا التلميذ؟")) {
        db.students[className].splice(studentIndex, 1);
        localStorage.setItem('schoolDB', JSON.stringify(db));
        renderStudentManagement();
    }
}

function importStudents() {
    const file = document.getElementById('fileInput').files[0];
    const selectedClass = document.getElementById('manageClassSelect').value;
    if (!file) return alert("المرجو اختيار ملف txt أولاً");

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').map(line => line.replace(/\\s*/g, '').trim()).filter(line => line.length > 0);
        db.students[selectedClass] = lines;
        localStorage.setItem('schoolDB', JSON.stringify(db));
        alert(`تم استيراد ${lines.length} تلميذ بنجاح.`);
        document.getElementById('fileInput').value = ""; 
        renderStudentManagement();
    };
    reader.readAsText(file);
}

/* ================== شاشة التقارير ================== */
function viewReport() {
    const date = document.getElementById('reportDate').value;
    const selClass = document.getElementById('reportClassSelect').value;
    const display = document.getElementById('reportDisplay');
    const actions = document.getElementById('reportActions');

    if (!date || !selClass) {
        display.style.display = 'none';
        actions.style.display = 'none';
        return;
    }

    if (!db.records || !db.records[date] || !db.records[date][selClass]) {
        display.style.display = 'block';
        display.innerHTML = `<p style="color: red; text-align: center;">لا توجد بيانات محفوظة لقسم ${selClass} في هذا التاريخ.</p>`;
        actions.style.display = 'none';
        return;
    }

    const records = db.records[date][selClass];
    
    // تصنيف التلاميذ
    const prepGood = records.filter(s => s.preparation === "إنجاز جيد" && s.attendance !== "غائب").map(s => s.name);
    const prepMed = records.filter(s => s.preparation === "إنجاز متوسط" && s.attendance !== "غائب").map(s => s.name);
    const prepWeak = records.filter(s => s.preparation === "إنجاز ضعيف" && s.attendance !== "غائب").map(s => s.name);
    const noPrep = records.filter(s => s.preparation === "لم ينجز" && s.attendance !== "غائب").map(s => s.name);
    const absentees = records.filter(s => s.attendance === "غائب").map(s => s.name);
    const late = records.filter(s => s.attendance === "متأخر").map(s => s.name);

    // بناء واجهة HTML للعرض في الصفحة
    let html = `<h4>🗓️ تقرير: ${selClass} (${date})</h4>`;
    
    html += `<strong>📝 التلاميذ الذين أنجزوا الإعداد القبلي:</strong><ul>`;
    html += `<li><strong>أ- بميزة جيد (${prepGood.length}):</strong> ${prepGood.join('، ') || '-'}</li>`;
    html += `<li><strong>ب- بميزة متوسط (${prepMed.length}):</strong> ${prepMed.join('، ') || '-'}</li>`;
    html += `<li><strong>ج- بميزة ضعيف (${prepWeak.length}):</strong> ${prepWeak.join('، ') || '-'}</li>`;
    html += `</ul>`;

    html += `<strong>❌ التلاميذ الذين لم ينجزوا الإعداد القبلي (${noPrep.length}):</strong><br> ${noPrep.join('، ') || 'لا يوجد'}<br><br>`;
    html += `<strong>🚫 المتغيبون عن الحصة (${absentees.length}):</strong><br> ${absentees.join('، ') || 'لا يوجد'}<br><br>`;
    html += `<strong>⏳ المتأخرون عن الحصة (${late.length}):</strong><br> ${late.join('، ') || 'لا يوجد'}`;

    display.innerHTML = html;
    display.style.display = 'block';
    actions.style.display = 'flex';

    // بناء النص النظيف للمشاركة والتحميل
    currentReportText = `*تقرير: ${selClass} (${date})*\n\n`;
    currentReportText += `*التلاميذ الذين أنجزوا الإعداد القبلي:*\n`;
    currentReportText += `- بميزة جيد: ${prepGood.join('، ') || '-'}\n`;
    currentReportText += `- بميزة متوسط: ${prepMed.join('، ') || '-'}\n`;
    currentReportText += `- بميزة ضعيف: ${prepWeak.join('، ') || '-'}\n\n`;
    currentReportText += `*التلاميذ الذين لم ينجزوا الإعداد القبلي:*\n${noPrep.join('، ') || 'لا يوجد'}\n\n`;
    currentReportText += `*المتغيبون عن الحصة:*\n${absentees.join('، ') || 'لا يوجد'}\n\n`;
    currentReportText += `*المتأخرون عن الحصة:*\n${late.join('، ') || 'لا يوجد'}`;
}

function shareReport(type) {
    if (!currentReportText) return;
    
    if (type === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(currentReportText)}`, '_blank');
    } else if (type === 'telegram') {
        window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(currentReportText)}`, '_blank');
    } else if (type === 'download') {
        // إضافة شفرة uFEFF (BOM) ليتعرف ويندوز على أن الملف بترميز UTF-8 ويدعم اللغة العربية
        const cleanText = currentReportText.replace(/\*/g, '');
        const blob = new Blob(['\uFEFF' + cleanText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const selClass = document.getElementById('reportClassSelect').value;
        const date = document.getElementById('reportDate').value;
        link.download = `تقرير_${selClass}_${date}.txt`;
        link.click();
    }
}

// تشغيل التهيئة
init();
const defaultClasses = ["جذع مشترك علوم 5", "جذع مشترك علوم 6", "جذع مشترك علوم 7", "جذع مشترك علوم 8", "الأولى علوم 5", "الأولى علوم 6", "الأولى آداب 3"];
let db = JSON.parse(localStorage.getItem('schoolDB')) || {};
// تحديث هيكل البيانات القديم لدعم الخصائص الجديدة
if (!db.classes) db.classes = defaultClasses;
if (!db.students) db.students = {};
if (!db.records) db.records = {};
if (!db.notes) db.notes = {}; // أرشيف الملاحظات
if (!db.grades) db.grades = {}; // أرشيف النقط

let currentReportText = ""; 
let currentNotesText = "";
let currentGradesData = [];

// توحيد تعيين تاريخ اليوم لجميع الخانات
const today = new Date();
document.getElementById('recordDate').valueAsDate = today;
document.getElementById('reportDate').valueAsDate = today;
document.getElementById('noteDate').valueAsDate = today;
document.getElementById('gradesDate').valueAsDate = today;

function init() {
    const selects = ['classSelect', 'manageClassSelect', 'reportClassSelect', 'noteClassSelect', 'gradesClassSelect'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        const currVal = el.value;
        el.innerHTML = `<option value="">-- اختر القسم --</option>`;
        db.classes.forEach(cls => el.innerHTML += `<option value="${cls}">${cls}</option>`);
        el.value = currVal;
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

/* ================== شاشة التتبع والتقارير ================== */
// (بقيت دالة loadStudents و saveData و viewReport كما هي في النسخة السابقة، سأختصرها لتوفير المساحة)
function loadStudents() {
    const date = document.getElementById('recordDate').value;
    const cls = document.getElementById('classSelect').value;
    const list = document.getElementById('studentsList');
    list.innerHTML = '';
    if (!cls || !db.students[cls] || db.students[cls].length === 0) return list.innerHTML = '<p style="text-align:center;">لا يوجد تلاميذ. اذهب لإدارة الأقسام لإضافتهم.</p>';

    const saved = (db.records[date] && db.records[date][cls]) ? db.records[date][cls] : null;

    db.students[cls].forEach((student, index) => {
        let att = "حاضر", prep = "لم ينجز";
        if (saved) {
            const rec = saved.find(s => s.name === student);
            if (rec) { att = rec.attendance; prep = rec.preparation; }
        }
        list.innerHTML += `
            <div class="student-row">
                <div class="student-name"><span class="student-number">${index + 1}</span> ${student}</div>
                <div class="options-group">
                    <strong>الغياب:</strong>
                    <label><input type="radio" name="att_${index}" value="حاضر" ${att==='حاضر'?'checked':''}> حاضر</label>
                    <label><input type="radio" name="att_${index}" value="متأخر" ${att==='متأخر'?'checked':''}> متأخر</label>
                    <label><input type="radio" name="att_${index}" value="غائب" ${att==='غائب'?'checked':''}> غائب</label>
                </div>
                <div class="options-group">
                    <strong>الإعداد:</strong>
                    <label><input type="radio" name="prep_${index}" value="لم ينجز" ${prep==='لم ينجز'?'checked':''}> لم ينجز</label>
                    <label><input type="radio" name="prep_${index}" value="إنجاز ضعيف" ${prep==='إنجاز ضعيف'?'checked':''}> ضعيف</label>
                    <label><input type="radio" name="prep_${index}" value="إنجاز متوسط" ${prep==='إنجاز متوسط'?'checked':''}> متوسط</label>
                    <label><input type="radio" name="prep_${index}" value="إنجاز جيد" ${prep==='إنجاز جيد'?'checked':''}> جيد</label>
                </div>
            </div>`;
    });
}

function saveData() {
    const date = document.getElementById('recordDate').value;
    const cls = document.getElementById('classSelect').value;
    if (!date || !cls || !db.students[cls]) return;

    if (!db.records[date]) db.records[date] = {};
    let rec = [];
    db.students[cls].forEach((student, i) => {
        rec.push({
            number: i + 1,
            name: student,
            attendance: document.querySelector(`input[name="att_${i}"]:checked`).value,
            preparation: document.querySelector(`input[name="prep_${i}"]:checked`).value
        });
    });
    db.records[date][cls] = rec;
    localStorage.setItem('schoolDB', JSON.stringify(db));
    alert(`تم الحفظ بنجاح!`);
}

function viewReport() {
    // ...نفس الكود السابق للتقارير...
    const date = document.getElementById('reportDate').value;
    const selClass = document.getElementById('reportClassSelect').value;
    const display = document.getElementById('reportDisplay');
    const actions = document.getElementById('reportActions');

    if (!date || !selClass || !db.records[date] || !db.records[date][selClass]) {
        display.style.display = 'none'; actions.style.display = 'none'; return;
    }

    const records = db.records[date][selClass];
    const formatName = s => `(${s.number || (db.students[selClass].indexOf(s.name) + 1)}) ${s.name}`;
    
    const prepGood = records.filter(s => s.preparation === "إنجاز جيد" && s.attendance !== "غائب").map(formatName);
    const prepMed = records.filter(s => s.preparation === "إنجاز متوسط" && s.attendance !== "غائب").map(formatName);
    const prepWeak = records.filter(s => s.preparation === "إنجاز ضعيف" && s.attendance !== "غائب").map(formatName);
    const noPrep = records.filter(s => s.preparation === "لم ينجز" && s.attendance !== "غائب").map(formatName);
    const absentees = records.filter(s => s.attendance === "غائب").map(formatName);
    const late = records.filter(s => s.attendance === "متأخر").map(formatName);

    let html = `<h4>🗓️ تقرير: ${selClass} (${date})</h4><ul>`;
    html += `<li><strong>بميزة جيد (${prepGood.length}):</strong> ${prepGood.join('، ') || '-'}</li>`;
    html += `<li><strong>بميزة متوسط (${prepMed.length}):</strong> ${prepMed.join('، ') || '-'}</li>`;
    html += `<li><strong>بميزة ضعيف (${prepWeak.length}):</strong> ${prepWeak.join('، ') || '-'}</li></ul>`;
    html += `<strong>❌ لم ينجزوا (${noPrep.length}):</strong><br> ${noPrep.join('، ') || '-'}<br><br>`;
    html += `<strong>🚫 المتغيبون (${absentees.length}):</strong><br> ${absentees.join('، ') || '-'}<br><br>`;
    html += `<strong>⏳ المتأخرون (${late.length}):</strong><br> ${late.join('، ') || '-'}`;

    display.innerHTML = html;
    display.style.display = 'block'; actions.style.display = 'flex';

    currentReportText = `*تقرير: ${selClass} (${date})*\n\n*المنجزون للإعداد:*\n- جيد: ${prepGood.join('، ') || '-'}\n- متوسط: ${prepMed.join('، ') || '-'}\n- ضعيف: ${prepWeak.join('، ') || '-'}\n\n*لم ينجزوا:*\n${noPrep.join('، ') || 'لا يوجد'}\n\n*الغياب:*\n${absentees.join('، ') || 'لا يوجد'}\n\n*التأخر:*\n${late.join('، ') || 'لا يوجد'}`;
}

function shareReport(type) {
    if (!currentReportText) return;
    if (type === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(currentReportText)}`, '_blank');
    else if (type === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(currentReportText)}`, '_blank');
}

/* ================== شاشة ملاحظات خاصة ================== */
function loadNoteStudents() {
    const cls = document.getElementById('noteClassSelect').value;
    const studentSelect = document.getElementById('noteStudentSelect');
    document.getElementById('noteCheckboxesArea').style.display = 'none';
    document.getElementById('noteHistoryArea').style.display = 'none';
    
    if (!cls || !db.students[cls]) { studentSelect.style.display = 'none'; return; }
    
    studentSelect.innerHTML = '<option value="">-- اختر التلميذ --</option>';
    db.students[cls].forEach((s, i) => studentSelect.innerHTML += `<option value="${s}">${i+1} - ${s}</option>`);
    studentSelect.style.display = 'block';
}

function loadStudentHistory() {
    const date = document.getElementById('noteDate').value;
    const cls = document.getElementById('noteClassSelect').value;
    const student = document.getElementById('noteStudentSelect').value;
    const cbArea = document.getElementById('noteCheckboxesArea');
    const histArea = document.getElementById('noteHistoryArea');
    const histDiv = document.getElementById('noteHistory');

    if (!student) { cbArea.style.display = 'none'; histArea.style.display = 'none'; return; }

    // مسح الاختيارات السابقة
    document.querySelectorAll('#noteCheckboxesArea input[type="checkbox"]').forEach(cb => cb.checked = false);

    // تفعيل الاختيارات المحفوظة لنفس اليوم إن وجدت
    if (db.notes[cls] && db.notes[cls][student] && db.notes[cls][student][date]) {
        const todayNotes = db.notes[cls][student][date];
        document.querySelectorAll('#noteCheckboxesArea input[type="checkbox"]').forEach(cb => {
            if (todayNotes.includes(cb.value)) cb.checked = true;
        });
    }

    cbArea.style.display = 'block';

    // جلب الأرشيف الكامل للتلميذ
    histDiv.innerHTML = '';
    currentNotesText = `*سجل الملاحظات الخاصة*\n*التلميذ:* ${student}\n*القسم:* ${cls}\n\n`;
    let hasHistory = false;

    if (db.notes[cls] && db.notes[cls][student]) {
        const dates = Object.keys(db.notes[cls][student]).sort((a,b) => new Date(b) - new Date(a));
        dates.forEach(d => {
            const notes = db.notes[cls][student][d];
            if (notes.length > 0) {
                hasHistory = true;
                const isPositive = notes.includes("تقديم مشاركة متميزة");
                histDiv.innerHTML += `
                    <div class="note-item ${isPositive ? 'positive' : ''}">
                        <strong>📅 ${d}</strong><br>
                        - ${notes.join('<br>- ')}
                    </div>`;
                currentNotesText += `📅 *${d}:*\n- ${notes.join('\n- ')}\n\n`;
            }
        });
    }

    if (hasHistory) histArea.style.display = 'block';
    else histArea.style.display = 'none';
}

function saveNotes() {
    const date = document.getElementById('noteDate').value;
    const cls = document.getElementById('noteClassSelect').value;
    const student = document.getElementById('noteStudentSelect').value;

    if (!date || !cls || !student) return alert("المرجو إكمال الاختيارات.");

    const selectedNotes = Array.from(document.querySelectorAll('#noteCheckboxesArea input[type="checkbox"]:checked')).map(cb => cb.value);

    if (!db.notes[cls]) db.notes[cls] = {};
    if (!db.notes[cls][student]) db.notes[cls][student] = {};
    
    db.notes[cls][student][date] = selectedNotes;
    localStorage.setItem('schoolDB', JSON.stringify(db));
    
    alert("تم حفظ الملاحظات بنجاح!");
    loadStudentHistory(); // تحديث الأرشيف
}

function shareNotes(type) {
    if (!currentNotesText) return;
    if (type === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(currentNotesText)}`, '_blank');
    else if (type === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(currentNotesText)}`, '_blank');
}

/* ================== شاشة المراقبة المستمرة ================== */
function loadGrades() {
    const date = document.getElementById('gradesDate').value;
    const cls = document.getElementById('gradesClassSelect').value;
    const list = document.getElementById('gradesList');
    const actions = document.getElementById('gradesActions');
    list.innerHTML = '';

    if (!cls || !db.students[cls] || db.students[cls].length === 0) {
        actions.style.display = 'none';
        return list.innerHTML = '<p style="text-align: center;">المرجو اختيار التاريخ والقسم.</p>';
    }

    actions.style.display = 'flex';
    const saved = (db.grades[date] && db.grades[date][cls]) ? db.grades[date][cls] : {};

    db.students[cls].forEach((student, index) => {
        const stdData = saved[student] || { e1: '', e2: '', act: '', avg: '-' };
        
        list.innerHTML += `
            <div class="student-row">
                <div class="student-name"><span class="student-number">${index + 1}</span> ${student}</div>
                <div class="grades-grid">
                    <div>
                        <label>الفرض الأول</label>
                        <input type="number" id="e1_${index}" value="${stdData.e1}" min="0" max="20" step="0.25" oninput="calcAvg(${index})">
                    </div>
                    <div>
                        <label>الفرض الثاني</label>
                        <input type="number" id="e2_${index}" value="${stdData.e2}" min="0" max="20" step="0.25" oninput="calcAvg(${index})">
                    </div>
                    <div>
                        <label>الأنشطة</label>
                        <input type="number" id="act_${index}" value="${stdData.act}" min="0" max="20" step="0.25" oninput="calcAvg(${index})">
                    </div>
                    <div>
                        <label>المعدل العام</label>
                        <div class="avg-box" id="avg_${index}">${stdData.avg}</div>
                    </div>
                </div>
            </div>`;
    });
}

// دالة حساب المعدل العام
function calcAvg(index) {
    const e1 = parseFloat(document.getElementById(`e1_${index}`).value) || 0;
    const e2 = parseFloat(document.getElementById(`e2_${index}`).value) || 0;
    const act = parseFloat(document.getElementById(`act_${index}`).value) || 0;
    
    // الفرضان يمثلان 75% والأنشطة 25%
    // المعدل = (((الفرض 1 + الفرض 2) / 2) * 0.75) + (الأنشطة * 0.25)
    const avg = (((e1 + e2) / 2) * 0.75) + (act * 0.25);
    
    document.getElementById(`avg_${index}`).innerText = avg.toFixed(2);
}

function saveGrades() {
    const date = document.getElementById('gradesDate').value;
    const cls = document.getElementById('gradesClassSelect').value;
    if (!date || !cls) return;

    if (!db.grades[date]) db.grades[date] = {};
    db.grades[date][cls] = {};

    db.students[cls].forEach((student, index) => {
        const e1 = document.getElementById(`e1_${index}`).value;
        const e2 = document.getElementById(`e2_${index}`).value;
        const act = document.getElementById(`act_${index}`).value;
        const avg = document.getElementById(`avg_${index}`).innerText;

        db.grades[date][cls][student] = { e1, e2, act, avg };
    });

    localStorage.setItem('schoolDB', JSON.stringify(db));
    alert("تم حفظ النقط بنجاح!");
}

function shareGrades(type) {
    const date = document.getElementById('gradesDate').value;
    const cls = document.getElementById('gradesClassSelect').value;
    if (!db.grades[date] || !db.grades[date][cls]) return alert("المرجو حفظ النقط أولاً قبل التصدير.");

    const data = db.grades[date][cls];
    let txt = `*لائحة نقط المراقبة المستمرة*\n*القسم:* ${cls}\n*التاريخ:* ${date}\n\n`;
    
    // بناء محتوى ملف الإكسيل (CSV) مع إضافة uFEFF ليدعم اللغة العربية في إكسيل
    let csvContent = "\uFEFFالرقم,الاسم الكامل,الفرض الأول,الفرض الثاني,الأنشطة المندمجة,المعدل العام\n";

    db.students[cls].forEach((student, index) => {
        const d = data[student];
        txt += `${index+1}- ${student}: ${d.avg}\n`;
        csvContent += `${index+1},${student},${d.e1},${d.e2},${d.act},${d.avg}\n`;
    });

    if (type === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, '_blank');
    else if (type === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(txt)}`, '_blank');
    else if (type === 'excel') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `نقط_${cls}_${date}.csv`;
        link.click();
    }
}

// تشغيل التهيئة
init();
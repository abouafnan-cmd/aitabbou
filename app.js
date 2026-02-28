const defaultClasses = ["جذع مشترك علوم 5", "جذع مشترك علوم 6", "جذع مشترك علوم 7", "جذع مشترك علوم 8", "الأولى علوم 5", "الأولى علوم 6", "الأولى آداب 3"];
let db = JSON.parse(localStorage.getItem('schoolDB')) || {};

if (!db.classes) db.classes = defaultClasses;
if (!db.students) db.students = {};
if (!db.records) db.records = {};
if (!db.notes) db.notes = {}; 
if (!db.grades) db.grades = {}; 
if (!db.miniExams) db.miniExams = {}; 
if (!db.lessonLog) db.lessonLog = {}; // قاعدة بيانات دفتر النصوص

let currentReportText = ""; 
let currentNotesText = "";

const today = new Date();
const dateInputs = ['recordDate', 'reportDate', 'noteDate', 'gradesDate', 'miniExamsDate', 'lessonDate'];
dateInputs.forEach(id => {
    if(document.getElementById(id)) document.getElementById(id).valueAsDate = today;
});

function init() {
    const selects = ['classSelect', 'manageClassSelect', 'reportClassSelect', 'noteClassSelect', 'gradesClassSelect', 'miniExamsClassSelect', 'lessonClassSelect'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
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

/* ================== دفتر النصوص (الجديد) ================== */

function toggleCompFields() {
    const comp = document.getElementById('compSelect').value;
    document.getElementById('comp_texts').style.display = comp === 'النصوص' ? 'block' : 'none';
    document.getElementById('comp_lang').style.display = comp === 'الدرس اللغوي' ? 'block' : 'none';
    document.getElementById('comp_expr').style.display = comp === 'التعبير والإنشاء' ? 'block' : 'none';
    document.getElementById('comp_lit').style.display = comp === 'المؤلفات' ? 'block' : 'none';
}

function saveLessonLog() {
    const date = document.getElementById('lessonDate').value;
    const cls = document.getElementById('lessonClassSelect').value;
    const comp = document.getElementById('compSelect').value;

    if (!date || !cls || !comp) return alert("المرجو اختيار التاريخ والقسم والمكون.");

    let entry = { id: Date.now(), component: comp, details: {} };

    if (comp === 'النصوص') {
        entry.details.title = document.getElementById('texts_title').value;
        entry.details.steps = Array.from(document.querySelectorAll('input[name="texts_steps"]:checked')).map(cb => cb.value);
        entry.details.analysis = Array.from(document.querySelectorAll('input[name="texts_analysis"]:checked')).map(cb => cb.value);
    } 
    else if (comp === 'الدرس اللغوي') {
        entry.details.title = document.getElementById('lang_title').value;
    } 
    else if (comp === 'التعبير والإنشاء') {
        entry.details.title = document.getElementById('expr_title').value;
        entry.details.steps = Array.from(document.querySelectorAll('input[name="expr_steps"]:checked')).map(cb => cb.value);
    } 
    else if (comp === 'المؤلفات') {
        entry.details.steps = Array.from(document.querySelectorAll('input[name="lit_steps"]:checked')).map(cb => cb.value);
        entry.details.content = document.getElementById('lit_content').value;
    }

    if (!db.lessonLog[date]) db.lessonLog[date] = {};
    if (!db.lessonLog[date][cls]) db.lessonLog[date][cls] = [];
    
    // إضافة الإنجاز إلى السجل
    db.lessonLog[date][cls].push(entry);
    localStorage.setItem('schoolDB', JSON.stringify(db));
    
    // تفريغ الحقول بعد الحفظ
    document.querySelectorAll('#lessonLogTab input[type="text"], #lessonLogTab textarea').forEach(el => el.value = '');
    document.querySelectorAll('#lessonLogTab input[type="checkbox"]').forEach(el => el.checked = false);
    document.getElementById('compSelect').value = '';
    toggleCompFields();

    alert("تم حفظ المنجز في دفتر النصوص بنجاح!");
    viewLessonLog();
}

function viewLessonLog() {
    const date = document.getElementById('lessonDate').value;
    const cls = document.getElementById('lessonClassSelect').value;
    const area = document.getElementById('lessonDisplayArea');
    const display = document.getElementById('lessonLogDisplay');
    
    if (!date || !cls || !db.lessonLog[date] || !db.lessonLog[date][cls] || db.lessonLog[date][cls].length === 0) {
        area.style.display = 'none';
        return;
    }

    const logs = db.lessonLog[date][cls];
    let html = '';

    logs.forEach(log => {
        html += `<div class="log-entry">`;
        html += `<button class="delete-log" onclick="deleteLessonLog(${log.id})">حذف</button>`;
        html += `<h4>📘 المكون: ${log.component}</h4>`;
        
        if (log.component === 'النصوص') {
            if(log.details.title) html += `<strong>العنوان:</strong> ${log.details.title}<br>`;
            if(log.details.steps.length > 0) html += `<strong>الخطوات:</strong><ul><li>${log.details.steps.join('</li><li>')}</li></ul>`;
            if(log.details.analysis.length > 0) html += `<strong>عناصر التحليل:</strong><ul><li>${log.details.analysis.join('</li><li>')}</li></ul>`;
        } 
        else if (log.component === 'الدرس اللغوي') {
            html += `<strong>الظاهرة اللغوية:</strong> ${log.details.title || 'لم يحدد'}<br>`;
        } 
        else if (log.component === 'التعبير والإنشاء') {
            if(log.details.title) html += `<strong>المهارة:</strong> ${log.details.title}<br>`;
            if(log.details.steps.length > 0) html += `<strong>النشاط:</strong><ul><li>${log.details.steps.join('</li><li>')}</li></ul>`;
        } 
        else if (log.component === 'المؤلفات') {
            if(log.details.steps.length > 0) html += `<strong>القراءة:</strong><ul><li>${log.details.steps.join('</li><li>')}</li></ul>`;
            if(log.details.content) html += `<strong>المحتوى المنجز:</strong><p style="margin-top:5px; background:white; padding:10px; border-radius:4px;">${log.details.content}</p>`;
        }
        html += `</div>`;
    });

    display.innerHTML = html;
    area.style.display = 'block';
}

function deleteLessonLog(id) {
    if(!confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    const date = document.getElementById('lessonDate').value;
    const cls = document.getElementById('lessonClassSelect').value;
    
    db.lessonLog[date][cls] = db.lessonLog[date][cls].filter(log => log.id !== id);
    localStorage.setItem('schoolDB', JSON.stringify(db));
    viewLessonLog();
}

/* ================== الدوال السابقة كما هي ================== */
// (تتبع الأداء، الفروض المصغرة، الملاحظات الخاصة، المراقبة المستمرة، التقارير، إدارة الأقسام)
// الرجاء الاحتفاظ بباقي دوال ملف app.js القديم هنا لتفادي مسح وظائف التطبيق

function loadStudents() {
    const date = document.getElementById('recordDate').value;
    const cls = document.getElementById('classSelect').value;
    const list = document.getElementById('studentsList');
    list.innerHTML = '';
    if (!cls || !db.students[cls] || db.students[cls].length === 0) return list.innerHTML = '<p style="text-align:center;">لا يوجد تلاميذ. يرجى إضافتهم من إدارة الأقسام.</p>';

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
    if (!date || !cls || !db.students[cls]) return alert("المرجو اختيار التاريخ والقسم.");
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
    alert(`تم حفظ الغياب والإعداد بنجاح!`);
}

function loadMiniExams() {
    const date = document.getElementById('miniExamsDate').value;
    const cls = document.getElementById('miniExamsClassSelect').value;
    const list = document.getElementById('miniExamsList');
    list.innerHTML = '';
    
    if (!cls || !db.students[cls] || db.students[cls].length === 0) {
        return list.innerHTML = '<p style="text-align: center;">المرجو اختيار التاريخ والقسم.</p>';
    }

    const saved = (db.miniExams[date] && db.miniExams[date][cls]) ? db.miniExams[date][cls] : {};

    db.students[cls].forEach((student, index) => {
        const stdData = saved[student] || { type: 'خلاصة تركيبية', grade: '' };
        list.innerHTML += `
            <div class="student-row">
                <div class="student-name"><span class="student-number">${index + 1}</span> ${student}</div>
                <div class="options-group" style="display:flex; gap: 10px; flex-wrap: nowrap;">
                    <select id="miniType_${index}" style="flex-grow: 1; padding: 8px;">
                        <option value="خلاصة تركيبية" ${stdData.type === 'خلاصة تركيبية' ? 'selected' : ''}>خلاصة تركيبية</option>
                        <option value="موضوع إنشائي" ${stdData.type === 'موضوع إنشائي' ? 'selected' : ''}>موضوع إنشائي</option>
                        <option value="تطبيقات لغوية" ${stdData.type === 'تطبيقات لغوية' ? 'selected' : ''}>تطبيقات لغوية</option>
                        <option value="تقويم مرحلي" ${stdData.type === 'تقويم مرحلي' ? 'selected' : ''}>تقويم مرحلي</option>
                    </select>
                    <input type="number" id="miniGrade_${index}" value="${stdData.grade}" min="0" max="20" step="0.25" placeholder="النقطة" style="width: 80px; padding: 8px;">
                </div>
            </div>`;
    });
}

function saveMiniExams() {
    const date = document.getElementById('miniExamsDate').value;
    const cls = document.getElementById('miniExamsClassSelect').value;
    if (!date || !cls) return alert("المرجو اختيار التاريخ والقسم.");

    if (!db.miniExams[date]) db.miniExams[date] = {};
    db.miniExams[date][cls] = {};

    db.students[cls].forEach((student, index) => {
        const type = document.getElementById(`miniType_${index}`).value;
        const grade = document.getElementById(`miniGrade_${index}`).value;
        db.miniExams[date][cls][student] = { type, grade };
    });
    localStorage.setItem('schoolDB', JSON.stringify(db));
    alert("تم حفظ الفروض المصغرة بنجاح!");
}

function viewReport() {
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
    else if (type === 'download') {
        const cleanText = currentReportText.replace(/\*/g, '');
        const blob = new Blob(['\uFEFF' + cleanText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `تقرير_${document.getElementById('reportClassSelect').value}.txt`;
        link.click();
    }
}

function loadNoteStudents() {
    const cls = document.getElementById('noteClassSelect').value;
    const studentSelect = document.getElementById('noteStudentSelect');
    document.getElementById('noteCheckboxesArea').style.display = 'none';
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
    if (!student) { cbArea.style.display = 'none'; return; }
    document.querySelectorAll('#noteCheckboxesArea input[type="checkbox"]').forEach(cb => cb.checked = false);
    cbArea.style.display = 'block';
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
}

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
        let bgStyle = "background: var(--secondary);";
        let numAvg = parseFloat(stdData.avg);
        if (!isNaN(numAvg)) {
            bgStyle = numAvg < 10 ? "background: var(--danger); color: white;" : "background: var(--accent); color: white;";
        }
        list.innerHTML += `
            <div class="student-row">
                <div class="student-name"><span class="student-number">${index + 1}</span> ${student}</div>
                <div class="grades-grid">
                    <div><label>الفرض الأول</label><input type="number" id="e1_${index}" value="${stdData.e1}" min="0" max="20" step="0.25" oninput="calcAvg(${index})"></div>
                    <div><label>الفرض الثاني</label><input type="number" id="e2_${index}" value="${stdData.e2}" min="0" max="20" step="0.25" oninput="calcAvg(${index})"></div>
                    <div><label>الأنشطة</label><input type="number" id="act_${index}" value="${stdData.act}" min="0" max="20" step="0.25" oninput="calcAvg(${index})"></div>
                    <div><label>المعدل العام</label><div class="avg-box" id="avg_${index}" style="${bgStyle}">${stdData.avg}</div></div>
                </div>
            </div>`;
    });
}

function calcAvg(index) {
    const e1 = parseFloat(document.getElementById(`e1_${index}`).value) || 0;
    const e2 = parseFloat(document.getElementById(`e2_${index}`).value) || 0;
    const act = parseFloat(document.getElementById(`act_${index}`).value) || 0;
    const avg = (((e1 + e2) / 2) * 0.75) + (act * 0.25);
    const avgBox = document.getElementById(`avg_${index}`);
    avgBox.innerText = avg.toFixed(2);
    if (avg < 10) { avgBox.style.background = 'var(--danger)'; avgBox.style.color = 'white'; } 
    else { avgBox.style.background = 'var(--accent)'; avgBox.style.color = 'white'; }
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
    if (!db.grades[date] || !db.grades[date][cls]) return alert("المرجو حفظ النقط أولاً.");
    const data = db.grades[date][cls];
    let txt = `*لائحة المراقبة المستمرة*\n*القسم:* ${cls}\n*التاريخ:* ${date}\n\n`;
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

function addClass() {
    const name = document.getElementById('newClassName').value.trim();
    if (!name) return alert("المرجو إدخال اسم القسم.");
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
    if (!selClass) return alert("المرجو اختيار قسم أولاً.");
    if (confirm(`هل أنت متأكد من حذف قسم "${selClass}" بالكامل؟`)) {
        db.classes = db.classes.filter(c => c !== selClass);
        delete db.students[selClass];
        localStorage.setItem('schoolDB', JSON.stringify(db));
        init();
        document.getElementById('studentManagementArea').style.display = 'none';
        alert("تم حذف القسم بنجاح.");
    }
}

function renderStudentManagement() {
    const selClass = document.getElementById('manageClassSelect').value;
    const area = document.getElementById('studentManagementArea');
    const list = document.getElementById('manageStudentList');
    if (!selClass) { area.style.display = 'none'; return; }
    area.style.display = 'block';
    list.innerHTML = '';
    if (!db.students[selClass]) db.students[selClass] = [];
    db.students[selClass].forEach((student, index) => {
        list.innerHTML += `
            <li>
                <span><span class="student-number">${index + 1}</span> - ${student}</span>
                <button class="btn-danger" style="padding: 5px 10px; font-size: 0.8rem;" onclick="deleteStudent('${selClass}', ${index})">حذف التلميذ</button>
            </li>
        `;
    });
}

function addStudent() {
    const selClass = document.getElementById('manageClassSelect').value;
    const name = document.getElementById('newStudentName').value.trim();
    if (!name || !selClass) return alert("المرجو التأكد من اختيار القسم وكتابة اسم التلميذ.");
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
    if (!selectedClass) return alert("المرجو اختيار القسم من القائمة أعلاه أولاً.");
    if (!file) return alert("المرجو اختيار ملف txt.");
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n')
                      .map(line => line.replace(/\\s*/g, '').trim())
                      .filter(line => line.length > 0);
        db.students[selectedClass] = lines;
        localStorage.setItem('schoolDB', JSON.stringify(db));
        alert(`تم استيراد ${lines.length} تلميذ بنجاح.`);
        document.getElementById('fileInput').value = ""; 
        renderStudentManagement();
    };
    reader.readAsText(file);
}

init();
/* ================== تهيئة الاتصال السحابي (Firebase) ================== */
const firebaseConfig = {
    apiKey: "AIzaSyCRTTSh0dw0IgY1dLGVeJ2HONH_UmB1Vco",
    authDomain: "tilmid-c43c6.firebaseapp.com",
    databaseURL: "https://tilmid-c43c6-default-rtdb.firebaseio.com",
    projectId: "tilmid-c43c6",
    storageBucket: "tilmid-c43c6.firebasestorage.app",
    messagingSenderId: "971380157589",
    appId: "1:971380157589:web:cae37710ea282c70c97f9c",
    measurementId: "G-RNRXLVXKM3"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dbRef = database.ref('schoolDB_Cloud');

const defaultClasses = ["جذع مشترك علوم 5", "جذع مشترك علوم 6", "جذع مشترك علوم 7", "جذع مشترك علوم 8", "الأولى علوم 5", "الأولى علوم 6", "الأولى آداب 3"];
let db = JSON.parse(localStorage.getItem('schoolDB')) || {};
let isInitialLoad = true;

function initDBStructure() {
    if (!db.classes) db.classes = defaultClasses;
    if (!db.students) db.students = {};
    if (!db.records) db.records = {};
    if (!db.notes) db.notes = {}; 
    if (!db.grades) db.grades = {}; 
    if (!db.miniExams) db.miniExams = {}; 
    if (!db.lessonLog) db.lessonLog = {};
    if (!db.randomTopics) db.randomTopics = {}; // قاعدة بيانات القرعة
}
initDBStructure();

dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        db = data;
        initDBStructure();
        localStorage.setItem('schoolDB', JSON.stringify(db)); 
        const statusEl = document.getElementById('cloudStatus');
        statusEl.innerText = "☁️ متصل ومُحَدَّث";
        statusEl.style.color = "#a8e6cf";

        if(isInitialLoad) {
            init();
            refreshCurrentView();
            isInitialLoad = false;
        } else {
            refreshCurrentView();
        }
    } else {
        saveToCloud(false);
    }
});

function saveToCloud(showAlert = true) {
    localStorage.setItem('schoolDB', JSON.stringify(db)); 
    const statusEl = document.getElementById('cloudStatus');
    statusEl.innerText = "⏳ جاري الحفظ في السحابة...";
    statusEl.style.color = "#f1c40f";

    dbRef.set(db).then(() => {
        statusEl.innerText = "☁️ تم الحفظ بنجاح";
        statusEl.style.color = "#a8e6cf";
        if(showAlert) alert("تم الحفظ بنجاح!");
    }).catch((error) => {
        statusEl.innerText = "⚠️ خطأ في الاتصال (مخزن محلياً)";
        statusEl.style.color = "#e74c3c";
        if(showAlert) alert("تم الحفظ في الهاتف/الحاسوب، وسيتم الرفع عند توفر الإنترنت.");
    });
}

function refreshCurrentView() {
    const activeSection = document.querySelector('.section.active').id;
    if(activeSection === 'tracking') loadStudents();
    else if(activeSection === 'lessonLogTab') viewLessonLog();
    else if(activeSection === 'notesTab') {
        const student = document.getElementById('noteStudentSelect').value;
        if(student) loadStudentHistory();
        else if (document.getElementById('classNotesArea').style.display === 'block') viewClassNotes();
    }
    else if(activeSection === 'miniExamsTab') loadMiniExams();
    else if(activeSection === 'gradesTab') loadGrades();
    else if(activeSection === 'reports') viewReport();
    else if(activeSection === 'management') renderStudentManagement();
    else if(activeSection === 'randomizerTab') loadRandomizerData();
}

/* ================== باقي الدوال ================== */
let currentReportText = ""; 
const today = new Date();
const dateInputs = ['recordDate', 'reportDate', 'noteDate', 'gradesDate', 'miniExamsDate', 'lessonDate'];
dateInputs.forEach(id => { if(document.getElementById(id)) document.getElementById(id).valueAsDate = today; });

function init() {
    const selects = ['classSelect', 'manageClassSelect', 'reportClassSelect', 'noteClassSelect', 'gradesClassSelect', 'miniExamsClassSelect', 'lessonClassSelect', 'randClassSelect'];
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
    if(tabId === 'randomizerTab') loadRandomizerData();
}

/* ================== نظام القرعة العشوائية (الجديد) ================== */
function loadRandomizerData() {
    const catSelect = document.getElementById('randCatSelect');
    const catList = document.getElementById('randCatList');
    const currentVal = catSelect.value;
    
    catSelect.innerHTML = '<option value="">-- اختر مجموعة الموضوعات --</option>';
    catList.innerHTML = '';
    
    Object.keys(db.randomTopics).forEach(cat => {
        catSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
        catList.innerHTML += `<li>
            <span>📁 ${cat} (${db.randomTopics[cat].length} موضوع)</span>
            <button class="btn-danger" style="padding: 5px 10px; font-size: 0.8rem;" onclick="deleteTopicCategory('${cat}')">حذف</button>
        </li>`;
    });
    catSelect.value = currentVal;
}

function addTopicCategory() {
    const catName = document.getElementById('newRandCatName').value.trim();
    const file = document.getElementById('randFileInput').files[0];
    
    if (!catName || !file) return alert("المرجو كتابة اسم المجموعة واختيار ملف txt.");
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        db.randomTopics[catName] = lines;
        document.getElementById('newRandCatName').value = '';
        document.getElementById('randFileInput').value = '';
        saveToCloud(true);
        loadRandomizerData();
        alert(`تمت إضافة مجموعة "${catName}" بـ ${lines.length} موضوع بنجاح.`);
    };
    reader.readAsText(file);
}

function deleteTopicCategory(catName) {
    if(confirm(`هل أنت متأكد من حذف مجموعة "${catName}"؟`)) {
        delete db.randomTopics[catName];
        saveToCloud(false);
        loadRandomizerData();
    }
}

function drawRandom(type) {
    const cls = document.getElementById('randClassSelect').value;
    const cat = document.getElementById('randCatSelect').value;
    const resDiv = document.getElementById('drawResult');
    let resultHtml = '';

    if ((type === 'both' || type === 'student') && (!cls || !db.students[cls] || db.students[cls].length === 0)) {
        return alert("المرجو اختيار قسم يحتوي على تلاميذ لسحب اسم.");
    }
    if ((type === 'both' || type === 'topic') && (!cat || !db.randomTopics[cat] || db.randomTopics[cat].length === 0)) {
        return alert("المرجو اختيار مجموعة موضوعات متوفرة.");
    }

    resDiv.style.display = 'block';
    resDiv.innerHTML = '<h2 style="color: #7f8c8d; font-size:1.5rem;">⏳ جاري السحب...</h2>';

    // تأثير توقف عجلة القرعة
    setTimeout(() => {
        if (type === 'both' || type === 'student') {
            const students = db.students[cls];
            const randStudent = students[Math.floor(Math.random() * students.length)];
            resultHtml += `<h2 style="color: var(--primary); margin-bottom: 5px;">👤 التلميذ: ${randStudent}</h2>`;
        }
        if (type === 'both' || type === 'topic') {
            const topics = db.randomTopics[cat];
            const randTopic = topics[Math.floor(Math.random() * topics.length)];
            resultHtml += `<h3 style="color: #e67e22; margin-top: 10px;">🎯 الموضوع: ${randTopic}</h3>`;
        }
        resDiv.innerHTML = resultHtml;
    }, 800);
}

/* ================== تتبع الأداء (تم تحديث عبارات الإعداد) ================== */
function loadStudents() {
    const date = document.getElementById('recordDate').value;
    const cls = document.getElementById('classSelect').value;
    const list = document.getElementById('studentsList');
    list.innerHTML = '';
    if (!cls || !db.students[cls] || db.students[cls].length === 0) return list.innerHTML = '<p style="text-align:center;">لا يوجد تلاميذ. يرجى إضافتهم من إدارة الأقسام.</p>';
    const saved = (db.records[date] && db.records[date][cls]) ? db.records[date][cls] : null;
    db.students[cls].forEach((student, index) => {
        let att = "حاضر", prep = "لم ينجز";
        if (saved) { const rec = saved.find(s => s.name === student); if (rec) { att = rec.attendance; prep = rec.preparation; } }
        list.innerHTML += `<div class="student-row">
            <div class="student-name"><span class="student-number">${index + 1}</span> ${student}</div>
            <div class="options-group"><strong>الغياب:</strong>
                <label><input type="radio" name="att_${index}" value="حاضر" ${att==='حاضر'?'checked':''}> حاضر</label>
                <label><input type="radio" name="att_${index}" value="متأخر" ${att==='متأخر'?'checked':''}> متأخر</label>
                <label><input type="radio" name="att_${index}" value="غائب" ${att==='غائب'?'checked':''}> غائب</label>
            </div>
            <div class="options-group"><strong>الإعداد:</strong>
                <label><input type="radio" name="prep_${index}" value="لم ينجز" ${prep==='لم ينجز'?'checked':''}> لم ينجز</label>
                <label><input type="radio" name="prep_${index}" value="إنجاز ضعيف" ${prep==='إنجاز ضعيف'?'checked':''}> إنجاز ضعيف</label>
                <label><input type="radio" name="prep_${index}" value="إنجاز متوسط" ${prep==='إنجاز متوسط'?'checked':''}> إنجاز متوسط</label>
                <label><input type="radio" name="prep_${index}" value="إنجاز جيد" ${prep==='إنجاز جيد'?'checked':''}> إنجاز جيد</label>
            </div></div>`;
    });
}

function saveData() {
    const date = document.getElementById('recordDate').value;
    const cls = document.getElementById('classSelect').value;
    if (!date || !cls || !db.students[cls]) return alert("المرجو اختيار التاريخ والقسم.");
    if (!db.records[date]) db.records[date] = {};
    let rec = [];
    db.students[cls].forEach((student, i) => { rec.push({ number: i + 1, name: student, attendance: document.querySelector(`input[name="att_${i}"]:checked`).value, preparation: document.querySelector(`input[name="prep_${i}"]:checked`).value }); });
    db.records[date][cls] = rec;
    saveToCloud(true);
}

/* ================== دفتر النصوص ================== */
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
        entry.details.session1 = Array.from(document.querySelectorAll('input[name="texts_s1"]:checked')).map(cb => cb.value);
        entry.details.analysis = Array.from(document.querySelectorAll('input[name="texts_s2_analysis"]:checked')).map(cb => cb.value);
        entry.details.session2_end = Array.from(document.querySelectorAll('input[name="texts_s2_end"]:checked')).map(cb => cb.value);
    } else if (comp === 'الدرس اللغوي') {
        entry.details.title = document.getElementById('lang_title').value;
    } else if (comp === 'التعبير والإنشاء') {
        entry.details.title = document.getElementById('expr_title').value;
        entry.details.steps = Array.from(document.querySelectorAll('input[name="expr_steps"]:checked')).map(cb => cb.value);
    } else if (comp === 'المؤلفات') {
        entry.details.steps = Array.from(document.querySelectorAll('input[name="lit_steps"]:checked')).map(cb => cb.value);
        entry.details.content = document.getElementById('lit_content').value;
    }

    if (!db.lessonLog[date]) db.lessonLog[date] = {};
    if (!db.lessonLog[date][cls]) db.lessonLog[date][cls] = [];
    db.lessonLog[date][cls].push(entry);
    
    document.querySelectorAll('#lessonLogTab input[type="text"], #lessonLogTab textarea').forEach(el => el.value = '');
    document.querySelectorAll('#lessonLogTab input[type="checkbox"]').forEach(el => el.checked = false);
    document.getElementById('compSelect').value = '';
    toggleCompFields();
    saveToCloud(true);
    viewLessonLog();
}

function viewLessonLog() {
    const date = document.getElementById('lessonDate').value;
    const cls = document.getElementById('lessonClassSelect').value;
    const area = document.getElementById('lessonDisplayArea');
    const display = document.getElementById('lessonLogDisplay');
    if (!date || !cls || !db.lessonLog[date] || !db.lessonLog[date][cls] || db.lessonLog[date][cls].length === 0) { area.style.display = 'none'; return; }
    const logs = db.lessonLog[date][cls];
    let html = '';
    logs.forEach(log => {
        html += `<div class="log-entry"><button class="delete-log" onclick="deleteLessonLog(${log.id})">حذف</button><h4>📘 المكون: ${log.component}</h4>`;
        if (log.component === 'النصوص') {
            if(log.details.title) html += `<strong>العنوان:</strong> ${log.details.title}<br>`;
            if(log.details.steps && log.details.steps.length > 0) html += `<strong>الخطوات:</strong><ul><li>${log.details.steps.join('</li><li>')}</li></ul>`;
            if(log.details.session1 && log.details.session1.length > 0) html += `<strong>الحصة الأولى:</strong><ul><li>${log.details.session1.join('</li><li>')}</li></ul>`;
            if(log.details.analysis && log.details.analysis.length > 0) html += `<strong>الحصة الثانية (تحليل):</strong><ul><li>${log.details.analysis.join('</li><li>')}</li></ul>`;
            if(log.details.session2_end && log.details.session2_end.length > 0) html += `<strong>خواتيم:</strong><ul><li>${log.details.session2_end.join('</li><li>')}</li></ul>`;
        } else if (log.component === 'الدرس اللغوي') {
            html += `<strong>الظاهرة اللغوية:</strong> ${log.details.title || 'لم يحدد'}<br>`;
        } else if (log.component === 'التعبير والإنشاء') {
            if(log.details.title) html += `<strong>المهارة:</strong> ${log.details.title}<br>`;
            if(log.details.steps && log.details.steps.length > 0) html += `<strong>النشاط:</strong><ul><li>${log.details.steps.join('</li><li>')}</li></ul>`;
        } else if (log.component === 'المؤلفات') {
            if(log.details.steps && log.details.steps.length > 0) html += `<strong>القراءة:</strong><ul><li>${log.details.steps.join('</li><li>')}</li></ul>`;
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
    saveToCloud(false);
    viewLessonLog();
}

/* ================== الفروض المصغرة ================== */
function loadMiniExams() {
    const date = document.getElementById('miniExamsDate').value;
    const cls = document.getElementById('miniExamsClassSelect').value;
    const list = document.getElementById('miniExamsList');
    list.innerHTML = '';
    if (!cls || !db.students[cls] || db.students[cls].length === 0) return list.innerHTML = '<p style="text-align: center;">المرجو اختيار التاريخ والقسم.</p>';
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
    db.students[cls].forEach((student, index) => { db.miniExams[date][cls][student] = { type: document.getElementById(`miniType_${index}`).value, grade: document.getElementById(`miniGrade_${index}`).value }; });
    saveToCloud(true);
}

/* ================== الملاحظات الخاصة (تم التحديث) ================== */
function loadNoteStudents() {
    const cls = document.getElementById('noteClassSelect').value;
    const studentSelect = document.getElementById('noteStudentSelect');
    const currentStudent = studentSelect.value; 
    document.getElementById('noteCheckboxesArea').style.display = 'none';
    document.getElementById('noteHistoryArea').style.display = 'none';
    document.getElementById('classNotesArea').style.display = 'none';
    if (!cls || !db.students[cls]) { studentSelect.style.display = 'none'; return; }
    studentSelect.innerHTML = '<option value="">-- اختر التلميذ --</option>';
    db.students[cls].forEach((s, i) => studentSelect.innerHTML += `<option value="${s}">${i+1} - ${s}</option>`);
    studentSelect.style.display = 'block';
    if(currentStudent && db.students[cls].includes(currentStudent)) studentSelect.value = currentStudent;
}

function loadStudentHistory() {
    const date = document.getElementById('noteDate').value;
    const cls = document.getElementById('noteClassSelect').value;
    const student = document.getElementById('noteStudentSelect').value;
    const cbArea = document.getElementById('noteCheckboxesArea');
    document.getElementById('classNotesArea').style.display = 'none'; 
    if (!student) { cbArea.style.display = 'none'; document.getElementById('noteHistoryArea').style.display = 'none'; return; }
    
    document.querySelectorAll('#noteCheckboxesArea input[type="checkbox"]').forEach(cb => cb.checked = false);
    if (db.notes[cls] && db.notes[cls][student] && db.notes[cls][student][date]) {
        const todayNotes = db.notes[cls][student][date];
        document.querySelectorAll('#noteCheckboxesArea input[type="checkbox"]').forEach(cb => { if (todayNotes.includes(cb.value)) cb.checked = true; });
    }
    
    cbArea.style.display = 'block';
    const histDiv = document.getElementById('noteHistory');
    histDiv.innerHTML = '';
    let hasHistory = false;
    if (db.notes[cls] && db.notes[cls][student]) {
        Object.keys(db.notes[cls][student]).sort((a,b) => new Date(b) - new Date(a)).forEach(d => {
            const notes = db.notes[cls][student][d];
            if (notes.length > 0) {
                hasHistory = true;
                const isPositive = notes.includes("تقديم مشاركة متميزة") || notes.includes("استحقاق نقطة حسنة");
                histDiv.innerHTML += `<div class="note-item ${isPositive ? 'positive' : ''}"><strong>📅 ${d}</strong><br>- ${notes.join('<br>- ')}</div>`;
            }
        });
    }
    document.getElementById('studentArchiveTitle').innerText = `أرشيف ملاحظات: ${student}`;
    document.getElementById('noteHistoryArea').style.display = hasHistory ? 'block' : 'none';
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
    saveToCloud(true);
    loadStudentHistory(); 
}

function viewClassNotes() {
    const cls = document.getElementById('noteClassSelect').value;
    const classArea = document.getElementById('classNotesArea');
    const classDiv = document.getElementById('classNotesDisplay');
    if (!cls) return alert("المرجو اختيار القسم أولاً.");
    classDiv.innerHTML = '';
    let hasClassNotes = false;
    if (db.notes[cls]) {
        for (let student in db.notes[cls]) {
            let studentHtml = `<div style="background: white; padding: 10px; border-radius: 5px; margin-bottom: 10px; border-right: 4px solid var(--primary); box-shadow: 0 1px 3px rgba(0,0,0,0.1);">`;
            studentHtml += `<h4 style="margin: 0 0 10px 0; color: var(--primary);">👤 ${student}</h4>`;
            let hasStudentNotes = false;
            Object.keys(db.notes[cls][student]).sort((a,b) => new Date(b) - new Date(a)).forEach(d => {
                const notes = db.notes[cls][student][d];
                if (notes.length > 0) {
                    hasClassNotes = true; hasStudentNotes = true;
                    const isPositive = notes.includes("تقديم مشاركة متميزة") || notes.includes("استحقاق نقطة حسنة");
                    studentHtml += `<div class="note-item ${isPositive ? 'positive' : ''}" style="margin-left: 10px; margin-right: 10px;"><strong>📅 ${d}</strong><br>- ${notes.join('<br>- ')}</div>`;
                }
            });
            studentHtml += `</div>`;
            if (hasStudentNotes) classDiv.innerHTML += studentHtml;
        }
    }
    if (!hasClassNotes) classDiv.innerHTML = '<p style="text-align: center; color: #777;">لا توجد ملاحظات مسجلة لتلاميذ هذا القسم.</p>';
    classArea.style.display = 'block';
    document.getElementById('noteCheckboxesArea').style.display = 'none';
    document.getElementById('noteHistoryArea').style.display = 'none';
    document.getElementById('noteStudentSelect').value = ""; 
}

/* ================== المراقبة المستمرة ================== */
function loadGrades() {
    const date = document.getElementById('gradesDate').value;
    const cls = document.getElementById('gradesClassSelect').value;
    const list = document.getElementById('gradesList');
    const actions = document.getElementById('gradesActions');
    list.innerHTML = '';
    if (!cls || !db.students[cls] || db.students[cls].length === 0) { actions.style.display = 'none'; return list.innerHTML = '<p style="text-align: center;">المرجو اختيار التاريخ والقسم.</p>'; }
    actions.style.display = 'flex';
    const saved = (db.grades[date] && db.grades[date][cls]) ? db.grades[date][cls] : {};
    db.students[cls].forEach((student, index) => {
        const stdData = saved[student] || { e1: '', e2: '', act: '', avg: '-' };
        let bgStyle = "background: var(--secondary);";
        let numAvg = parseFloat(stdData.avg);
        if (!isNaN(numAvg)) bgStyle = numAvg < 10 ? "background: var(--danger); color: white;" : "background: var(--accent); color: white;";
        list.innerHTML += `<div class="student-row"><div class="student-name"><span class="student-number">${index + 1}</span> ${student}</div>
            <div class="grades-grid">
                <div><label>الفرض الأول</label><input type="number" id="e1_${index}" value="${stdData.e1}" min="0" max="20" step="0.25" oninput="calcAvg(${index})"></div>
                <div><label>الفرض الثاني</label><input type="number" id="e2_${index}" value="${stdData.e2}" min="0" max="20" step="0.25" oninput="calcAvg(${index})"></div>
                <div><label>الأنشطة</label><input type="number" id="act_${index}" value="${stdData.act}" min="0" max="20" step="0.25" oninput="calcAvg(${index})"></div>
                <div><label>المعدل العام</label><div class="avg-box" id="avg_${index}" style="${bgStyle}">${stdData.avg}</div></div>
            </div></div>`;
    });
}
function calcAvg(index) {
    const e1 = parseFloat(document.getElementById(`e1_${index}`).value) || 0;
    const e2 = parseFloat(document.getElementById(`e2_${index}`).value) || 0;
    const act = parseFloat(document.getElementById(`act_${index}`).value) || 0;
    const avg = (((e1 + e2) / 2) * 0.75) + (act * 0.25);
    const avgBox = document.getElementById(`avg_${index}`);
    avgBox.innerText = avg.toFixed(2);
    if (avg < 10) { avgBox.style.background = 'var(--danger)'; avgBox.style.color = 'white'; } else { avgBox.style.background = 'var(--accent)'; avgBox.style.color = 'white'; }
}
function saveGrades() {
    const date = document.getElementById('gradesDate').value;
    const cls = document.getElementById('gradesClassSelect').value;
    if (!date || !cls) return;
    if (!db.grades[date]) db.grades[date] = {};
    db.grades[date][cls] = {};
    db.students[cls].forEach((student, index) => { db.grades[date][cls][student] = { e1: document.getElementById(`e1_${index}`).value, e2: document.getElementById(`e2_${index}`).value, act: document.getElementById(`act_${index}`).value, avg: document.getElementById(`avg_${index}`).innerText }; });
    saveToCloud(true);
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
        const link = document.createElement("a"); link.href = URL.createObjectURL(blob);
        link.download = `نقط_${cls}_${date}.csv`; link.click();
    }
}

/* ================== التقارير الشاملة المحدثة ================== */
function viewReport() {
    const reportType = document.getElementById('reportTypeSelect').value;
    const date = document.getElementById('reportDate').value;
    const selClass = document.getElementById('reportClassSelect').value;
    const display = document.getElementById('reportDisplay');
    const actions = document.getElementById('reportActions');
    const dateInput = document.getElementById('reportDate');

    if (!selClass) { display.style.display = 'none'; actions.style.display = 'none'; return; }
    dateInput.style.display = (reportType === 'tracking' || reportType === 'miniExams') ? 'block' : 'none';
    
    display.innerHTML = ''; currentReportText = '';

    if (reportType === 'tracking') {
        if (!date || !db.records[date] || !db.records[date][selClass]) { 
            display.innerHTML = '<p style="text-align:center; color:red;">لا توجد بيانات غياب/إعداد محفوظة لهذا التاريخ.</p>';
            display.style.display = 'block'; actions.style.display = 'none'; return; 
        }
        const records = db.records[date][selClass];
        const formatName = s => `(${s.number || (db.students[selClass].indexOf(s.name) + 1)}) ${s.name}`;
        const prepGood = records.filter(s => s.preparation === "إنجاز جيد" && s.attendance !== "غائب").map(formatName);
        const prepMed = records.filter(s => s.preparation === "إنجاز متوسط" && s.attendance !== "غائب").map(formatName);
        const prepWeak = records.filter(s => s.preparation === "إنجاز ضعيف" && s.attendance !== "غائب").map(formatName);
        const noPrep = records.filter(s => s.preparation === "لم ينجز" && s.attendance !== "غائب").map(formatName);
        const absentees = records.filter(s => s.attendance === "غائب").map(formatName);
        const late = records.filter(s => s.attendance === "متأخر").map(formatName);

        let html = `<h4>🗓️ تتبع الحضور والإعداد: ${selClass} (${date})</h4><ul>`;
        html += `<li><strong>بميزة إنجاز جيد (${prepGood.length}):</strong> ${prepGood.join('، ') || '-'}</li>`;
        html += `<li><strong>بميزة إنجاز متوسط (${prepMed.length}):</strong> ${prepMed.join('، ') || '-'}</li>`;
        html += `<li><strong>بميزة إنجاز ضعيف (${prepWeak.length}):</strong> ${prepWeak.join('، ') || '-'}</li></ul>`;
        html += `<strong>❌ لم ينجزوا (${noPrep.length}):</strong><br> ${noPrep.join('، ') || '-'}<br><br>`;
        html += `<strong>🚫 المتغيبون (${absentees.length}):</strong><br> ${absentees.join('، ') || '-'}<br><br>`;
        html += `<strong>⏳ المتأخرون (${late.length}):</strong><br> ${late.join('، ') || '-'}`;
        display.innerHTML = html;
        currentReportText = `*تقرير الإعداد والحضور: ${selClass} (${date})*\n\n*المنجزون للإعداد:*\n- جيد: ${prepGood.join('، ') || '-'}\n- متوسط: ${prepMed.join('، ') || '-'}\n- ضعيف: ${prepWeak.join('، ') || '-'}\n\n*لم ينجزوا:*\n${noPrep.join('، ') || 'لا يوجد'}\n\n*الغياب:*\n${absentees.join('، ') || 'لا يوجد'}\n\n*التأخر:*\n${late.join('، ') || 'لا يوجد'}`;
        display.style.display = 'block'; actions.style.display = 'flex';
    } 
    else if (reportType === 'notes') {
        if (!db.notes[selClass] || Object.keys(db.notes[selClass]).length === 0) {
            display.innerHTML = '<p style="text-align:center;">لا توجد ملاحظات مسجلة لتلاميذ هذا القسم.</p>';
        } else {
            let html = `<h4>📝 تقرير الملاحظات الخاصة: ${selClass}</h4>`;
            let txt = `*تقرير الملاحظات الخاصة*\n*القسم:* ${selClass}\n\n`;
            for (let student in db.notes[selClass]) {
                let studentHtml = `<div style="margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;"><strong>👤 ${student}:</strong><ul>`;
                let hasNotes = false;
                Object.keys(db.notes[selClass][student]).sort((a,b) => new Date(b) - new Date(a)).forEach(d => {
                    const notes = db.notes[selClass][student][d];
                    if(notes.length > 0) { hasNotes = true; studentHtml += `<li><em>${d}:</em> ${notes.join('، ')}</li>`; txt += `👤 *${student}* (${d}):\n- ${notes.join('\n- ')}\n`; }
                });
                studentHtml += `</ul></div>`;
                if(hasNotes) { html += studentHtml; txt += '\n'; }
            }
            display.innerHTML = html; currentReportText = txt;
        }
        display.style.display = 'block'; actions.style.display = 'flex';
    }
    else if (reportType === 'lessons') {
        let allLogs = [];
        for(let d in db.lessonLog) { if(db.lessonLog[d][selClass]) { db.lessonLog[d][selClass].forEach(log => allLogs.push({ date: d, ...log })); } }
        if (allLogs.length === 0) { display.innerHTML = '<p style="text-align:center;">لا توجد دروس مسجلة لهذا القسم.</p>'; } 
        else {
            allLogs.sort((a,b) => new Date(b.date) - new Date(a.date));
            let html = `<h4>📘 دفتر النصوص التراكمي: ${selClass}</h4>`;
            let txt = `*دفتر النصوص التراكمي*\n*القسم:* ${selClass}\n\n`;
            allLogs.forEach(log => {
                html += `<div style="border-right: 4px solid var(--primary); background:#f9f9f9; padding: 10px; margin-bottom: 10px;">`;
                html += `<strong style="color:var(--primary);">📅 ${log.date} | ${log.component}</strong><br>`;
                txt += `📅 *${log.date}* | ${log.component}\n`;
                if (log.component === 'النصوص') {
                    if(log.details.title) { html += `<em>العنوان:</em> ${log.details.title}<br>`; txt += `العنوان: ${log.details.title}\n`; }
                    if(log.details.session1 && log.details.session1.length > 0) { html += `<em>الحصة 1:</em> ${log.details.session1.join('، ')}<br>`; txt += `الحصة 1: ${log.details.session1.join('، ')}\n`; }
                    if(log.details.analysis && log.details.analysis.length > 0) { html += `<em>الحصة 2:</em> ${log.details.analysis.join('، ')}<br>`; txt += `الحصة 2: ${log.details.analysis.join('، ')}\n`; }
                    if(log.details.session2_end && log.details.session2_end.length > 0) { html += `<em>خواتيم:</em> ${log.details.session2_end.join('، ')}<br>`; txt += `خواتيم: ${log.details.session2_end.join('، ')}\n`; }
                } else if (log.component === 'الدرس اللغوي') {
                    html += `<em>الظاهرة اللغوية:</em> ${log.details.title || 'لم يحدد'}<br>`; txt += `الظاهرة اللغوية: ${log.details.title || 'لم يحدد'}\n`;
                } else if (log.component === 'التعبير والإنشاء') {
                    if(log.details.title) { html += `<em>المهارة:</em> ${log.details.title}<br>`; txt += `المهارة: ${log.details.title}\n`; }
                    if(log.details.steps && log.details.steps.length > 0) { html += `<em>النشاط:</em> ${log.details.steps.join('، ')}<br>`; txt += `النشاط: ${log.details.steps.join('، ')}\n`; }
                } else if (log.component === 'المؤلفات') {
                    if(log.details.steps && log.details.steps.length > 0) { html += `<em>القراءة:</em> ${log.details.steps.join('، ')}<br>`; txt += `القراءة: ${log.details.steps.join('، ')}\n`; }
                    if(log.details.content) { html += `<em>المحتوى:</em> ${log.details.content}<br>`; txt += `المحتوى: ${log.details.content}\n`; }
                }
                html += `</div>`; txt += `-------------------\n`;
            });
            display.innerHTML = html; currentReportText = txt;
        }
        display.style.display = 'block'; actions.style.display = 'flex';
    }
    else if (reportType === 'miniExams') {
        if (!date || !db.miniExams[date] || !db.miniExams[date][selClass]) { 
            display.innerHTML = '<p style="text-align:center; color:red;">لا توجد نقط فروض مصغرة محفوظة لهذا التاريخ.</p>';
            display.style.display = 'block'; actions.style.display = 'none'; return; 
        }
        const exams = db.miniExams[date][selClass];
        let html = `<h4>📝 تقرير الفروض المصغرة: ${selClass} (${date})</h4><table style="width:100%; border-collapse: collapse; margin-top:10px;">`;
        html += `<tr style="background:var(--primary); color:white;"><th style="padding:8px; border:1px solid #ccc;">التلميذ</th><th style="padding:8px; border:1px solid #ccc;">النشاط</th><th style="padding:8px; border:1px solid #ccc;">النقطة</th></tr>`;
        let txt = `*تقرير الفروض المصغرة: ${selClass} (${date})*\n\n`;

        db.students[selClass].forEach((student, idx) => {
            const data = exams[student];
            if(data && data.grade) {
                html += `<tr><td style="padding:8px; border:1px solid #ccc;">${idx+1}- ${student}</td><td style="padding:8px; border:1px solid #ccc;">${data.type}</td><td style="padding:8px; border:1px solid #ccc;">${data.grade}</td></tr>`;
                txt += `${idx+1}- ${student} | ${data.type} | النقطة: ${data.grade}\n`;
            }
        });
        html += `</table>`;
        display.innerHTML = html; currentReportText = txt;
        display.style.display = 'block'; actions.style.display = 'flex';
    }
}

function shareReport(type) {
    if (!currentReportText) return;
    if (type === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(currentReportText)}`, '_blank');
    else if (type === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(currentReportText)}`, '_blank');
    else if (type === 'download') {
        const cleanText = currentReportText.replace(/\*/g, '');
        const blob = new Blob(['\uFEFF' + cleanText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
        const repType = document.getElementById('reportTypeSelect').options[document.getElementById('reportTypeSelect').selectedIndex].text;
        link.download = `تقرير_${repType}_${document.getElementById('reportClassSelect').value}.txt`; link.click();
    }
}

/* ================== إدارة الأقسام ================== */
function addClass() {
    const name = document.getElementById('newClassName').value.trim();
    if (!name) return alert("المرجو إدخال اسم القسم.");
    if (db.classes.includes(name)) return alert("هذا القسم موجود مسبقاً!");
    db.classes.push(name); db.students[name] = []; document.getElementById('newClassName').value = ""; init(); saveToCloud(true);
}
function deleteClass() {
    const selClass = document.getElementById('manageClassSelect').value;
    if (!selClass) return alert("المرجو اختيار قسم أولاً.");
    if (confirm(`هل أنت متأكد من حذف قسم "${selClass}" بالكامل؟`)) { db.classes = db.classes.filter(c => c !== selClass); delete db.students[selClass]; init(); document.getElementById('studentManagementArea').style.display = 'none'; saveToCloud(true); }
}
function renderStudentManagement() {
    const selClass = document.getElementById('manageClassSelect').value;
    const area = document.getElementById('studentManagementArea');
    const list = document.getElementById('manageStudentList');
    if (!selClass) { area.style.display = 'none'; return; }
    area.style.display = 'block'; list.innerHTML = '';
    if (!db.students[selClass]) db.students[selClass] = [];
    db.students[selClass].forEach((student, index) => {
        list.innerHTML += `<li><span><span class="student-number">${index + 1}</span> - ${student}</span><button class="btn-danger" style="padding: 5px 10px; font-size: 0.8rem;" onclick="deleteStudent('${selClass}', ${index})">حذف التلميذ</button></li>`;
    });
}
function addStudent() {
    const selClass = document.getElementById('manageClassSelect').value;
    const name = document.getElementById('newStudentName').value.trim();
    if (!name || !selClass) return alert("المرجو التأكد من الاختيارات.");
    db.students[selClass].push(name); document.getElementById('newStudentName').value = ""; renderStudentManagement(); saveToCloud(false);
}
function deleteStudent(className, studentIndex) {
    if (confirm("هل أنت متأكد من حذف هذا التلميذ؟")) { db.students[className].splice(studentIndex, 1); renderStudentManagement(); saveToCloud(false); }
}
function importStudents() {
    const file = document.getElementById('fileInput').files[0];
    const selectedClass = document.getElementById('manageClassSelect').value;
    if (!selectedClass || !file) return alert("المرجو اختيار القسم والملف.");
    const reader = new FileReader();
    reader.onload = function(e) {
        db.students[selectedClass] = e.target.result.split('\n').map(line => line.replace(/\\s*/g, '').trim()).filter(line => line.length > 0);
        document.getElementById('fileInput').value = ""; renderStudentManagement(); saveToCloud(true);
    };
    reader.readAsText(file);
}
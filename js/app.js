const subjects = ["الرياضيات", "العلوم", "التاريخ"];
const sections = ["القسم الأول", "القسم الثاني", "القسم الثالث"];
const students = [
  { id: 1, name: "ليلى عبد الله", section: "القسم الأول" },
  { id: 2, name: "كريم مصطفى", section: "القسم الأول" },
  { id: 3, name: "سارة حازم", section: "القسم الثاني" },
  { id: 4, name: "يوسف مروان", section: "القسم الثاني" },
  { id: 5, name: "شهد أحمد", section: "القسم الثالث" },
  { id: 6, name: "زياد عبد الرحمن", section: "القسم الثالث" }
];

let studentIdCounter = students.length + 1;
let attendanceState = {};
let lastSavedAttendance = null;

const subjectSelect = document.getElementById("subjectSelect");
const sectionSelect = document.getElementById("sectionSelect");
const studentSectionSelect = document.getElementById("studentSection");
const studentsTable = document.getElementById("studentsTable");
const studentsManageTable = document.getElementById("studentsManageTable");
const statusTitle = document.getElementById("statusTitle");
const statusSubtitle = document.getElementById("statusSubtitle");
const statusChips = document.getElementById("statusChips");
const studentListTitle = document.getElementById("studentListTitle");

function renderSelectOptions(select, list) {
  select.innerHTML = list.map((item) => `<option value="${item}">${item}</option>`).join("");
}

function renderChips(container, list, onRemove) {
  container.innerHTML = list
    .map(
      (item) =>
        `<button class="chip-button" aria-label="حذف ${item}" onclick="${onRemove}('${item}')">${item} ✕</button>`
    )
    .join("");
}

function renderStudents() {
  const selectedSection = sectionSelect.value;
  const filtered = students.filter(
    (student) => !selectedSection || student.section === selectedSection
  );

  studentListTitle.textContent = selectedSection
    ? `الطلبة في ${selectedSection}`
    : "لائحة الطلبة";

  const header = `
    <div class="table-head-row">
      <span>اسم الطالب</span>
      <span>الحالة</span>
      <span>ملاحظة</span>
    </div>`;

  const rows = filtered
    .map((student) => {
      const savedState = attendanceState[student.id] || { status: "present", note: "" };
      return `
        <div class="table-row">
          <div>
            <div class="badge-soft">${student.name}</div>
            <small>${student.section}</small>
          </div>
          <div class="radio-group">
            <label><input type="radio" name="status-${student.id}" value="present" ${
              savedState.status === "present" ? "checked" : ""
            } onchange="updateAttendanceState(${student.id}, 'present')"> حاضر</label>
            <label><input type="radio" name="status-${student.id}" value="absent" ${
              savedState.status === "absent" ? "checked" : ""
            } onchange="updateAttendanceState(${student.id}, 'absent')"> غائب</label>
          </div>
          <input class="note-input" type="text" value="${savedState.note}" placeholder="ملاحظة اختيارية" oninput="updateNoteState(${student.id}, this.value)">
        </div>`;
    })
    .join("");

  studentsTable.innerHTML = header + rows;
}

function renderManageStudents() {
  const header = `
    <div class="table-head-row">
      <span>اسم الطالب</span>
      <span>القسم</span>
      <span>إجراءات</span>
    </div>`;

  const rows = students
    .map(
      (student) => `
        <div class="table-row">
          <div class="badge-soft">${student.name}</div>
          <span>${student.section}</span>
          <button class="btn outline" onclick="removeStudent(${student.id})">حذف</button>
        </div>`
    )
    .join("");

  studentsManageTable.innerHTML = header + rows;
}

window.updateAttendanceState = (id, status) => {
  attendanceState[id] = attendanceState[id] || { status: "present", note: "" };
  attendanceState[id].status = status;
};

window.updateNoteState = (id, note) => {
  attendanceState[id] = attendanceState[id] || { status: "present", note: "" };
  attendanceState[id].note = note;
};

function saveAttendance() {
  const selectedSubject = subjectSelect.value;
  const selectedSection = sectionSelect.value;
  const filtered = students.filter((student) => student.section === selectedSection);

  const records = filtered.map((student) => ({
    student,
    status: attendanceState[student.id]?.status || "present",
    note: attendanceState[student.id]?.note || "",
  }));

  const presentCount = records.filter((record) => record.status === "present").length;
  const absentCount = records.length - presentCount;

  lastSavedAttendance = {
    subject: selectedSubject,
    section: selectedSection,
    date: new Date(),
    records,
  };

  statusTitle.textContent = "تم حفظ الحضور بنجاح";
  statusSubtitle.textContent = `${presentCount} حاضر / ${absentCount} غائب في ${selectedSubject} - ${selectedSection}`;
  statusChips.innerHTML = `
    <span class="pill success">${presentCount} حاضر</span>
    <span class="pill danger">${absentCount} غائب</span>
    <span class="pill">${records.length} طالب</span>
  `;

  document.getElementById("exportPdf").disabled = false;
}

function exportPdf() {
  if (!lastSavedAttendance) return;

  const { subject, section, date, records } = lastSavedAttendance;
  const printWindow = window.open("", "_blank");
  const dateText = date.toLocaleString("ar-EG", { dateStyle: "full", timeStyle: "short" });

  const rows = records
    .map(
      (record, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${record.student.name}</td>
          <td>${record.status === "present" ? "حاضر" : "غائب"}</td>
          <td>${record.note || "-"}</td>
        </tr>`
    )
    .join("");

  printWindow.document.write(`
    <html lang="ar" dir="rtl">
      <head>
        <title>تقرير الحضور</title>
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 20px; color: #111; }
          h2 { margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: right; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h2>تقرير الحضور والغياب</h2>
        <p><strong>المادة:</strong> ${subject} | <strong>القسم:</strong> ${section}</p>
        <p><strong>التاريخ:</strong> ${dateText}</p>
        <table>
          <thead>
            <tr><th>#</th><th>اسم الطالب</th><th>الحالة</th><th>الملاحظة</th></tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function addStudent() {
  const nameInput = document.getElementById("studentName");
  const sectionValue = studentSectionSelect.value;
  const name = nameInput.value.trim();

  if (!name) {
    alert("يرجى إدخال اسم الطالب");
    return;
  }

  const newId = studentIdCounter++;
  students.push({ id: newId, name, section: sectionValue });
  attendanceState[newId] = { status: "present", note: "" };

  nameInput.value = "";
  renderStudents();
  renderManageStudents();
}

window.removeStudent = (id) => {
  const index = students.findIndex((student) => student.id === id);
  if (index !== -1) {
    students.splice(index, 1);
    delete attendanceState[id];
    renderStudents();
    renderManageStudents();
  }
};

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportStudentsCsv() {
  const header = "الاسم,القسم";
  const rows = students.map((s) => `${s.name},${s.section}`);
  downloadFile("students.csv", [header, ...rows].join("\n"));
}

function exportStudentsTxt() {
  const rows = students.map((s, idx) => `${idx + 1}. ${s.name} - ${s.section}`);
  downloadFile("students.txt", rows.join("\n"));
}

function addSubject() {
  const input = document.getElementById("subjectInput");
  const value = input.value.trim();
  if (!value || subjects.includes(value)) return;
  subjects.push(value);
  input.value = "";
  renderSelectOptions(subjectSelect, subjects);
  renderChips(document.getElementById("subjectsChips"), subjects, "removeSubject");
}

function addSection() {
  const input = document.getElementById("sectionInput");
  const value = input.value.trim();
  if (!value || sections.includes(value)) return;
  sections.push(value);
  input.value = "";
  renderSelectOptions(sectionSelect, sections);
  renderSelectOptions(studentSectionSelect, sections);
  renderChips(document.getElementById("sectionsChips"), sections, "removeSection");
  sectionSelect.value = value;
  studentSectionSelect.value = value;
  renderStudents();
}

window.removeSubject = (value) => {
  const index = subjects.indexOf(value);
  if (index !== -1) {
    subjects.splice(index, 1);
    renderSelectOptions(subjectSelect, subjects);
    renderChips(document.getElementById("subjectsChips"), subjects, "removeSubject");
    if (lastSavedAttendance?.subject === value) {
      lastSavedAttendance = null;
      document.getElementById("exportPdf").disabled = true;
    }
  }
};

window.removeSection = (value) => {
  const index = sections.indexOf(value);
  if (index !== -1) {
    sections.splice(index, 1);
    renderSelectOptions(sectionSelect, sections);
    renderSelectOptions(studentSectionSelect, sections);
    renderChips(document.getElementById("sectionsChips"), sections, "removeSection");
    sectionSelect.value = sections[0] || "";
    studentSectionSelect.value = sections[0] || "";
    renderStudents();
  }
};

function bindEvents() {
  document.getElementById("saveAttendance").addEventListener("click", saveAttendance);
  document.getElementById("exportPdf").addEventListener("click", exportPdf);
  document.getElementById("addStudent").addEventListener("click", addStudent);
  document.getElementById("exportCsv").addEventListener("click", exportStudentsCsv);
  document.getElementById("exportTxt").addEventListener("click", exportStudentsTxt);
  document.getElementById("addSubject").addEventListener("click", addSubject);
  document.getElementById("addSection").addEventListener("click", addSection);
  sectionSelect.addEventListener("change", renderStudents);
}

function init() {
  renderSelectOptions(subjectSelect, subjects);
  renderSelectOptions(sectionSelect, sections);
  renderSelectOptions(studentSectionSelect, sections);
  renderChips(document.getElementById("subjectsChips"), subjects, "removeSubject");
  renderChips(document.getElementById("sectionsChips"), sections, "removeSection");
  renderStudents();
  renderManageStudents();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);

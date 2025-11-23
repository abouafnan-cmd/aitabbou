:root {
    --bg: #0f172a;
    --surface: #0b1224;
    --card: #121c34;
    --primary: #6dd3a0;
    --primary-strong: #26c185;
    --accent: #ffd166;
    --danger: #ff6b6b;
    --muted: #94a3b8;
    --text: #e2e8f0;
    --text-strong: #f8fafc;
    --border: rgba(255, 255, 255, 0.08);
    --shadow: 0 18px 60px rgba(0, 0, 0, 0.25);
    --radius: 18px;
}

* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Cairo', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

body {
    background: radial-gradient(circle at 20% 20%, rgba(109, 211, 160, 0.08), transparent 30%),
                radial-gradient(circle at 80% 0%, rgba(255, 209, 102, 0.1), transparent 32%),
                radial-gradient(circle at 50% 80%, rgba(255, 107, 107, 0.06), transparent 35%),
                var(--bg);
    color: var(--text);
    line-height: 1.7;
    min-height: 100vh;
    direction: rtl;
}

a {
    color: inherit;
    text-decoration: none;
}

.container {
    width: min(1200px, 100%);
    margin: 0 auto;
    padding: 0 20px;
}

.app-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(11, 18, 36, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
}

.header-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 24px;
    padding: 18px 0;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-icon {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(109, 211, 160, 0.18), rgba(38, 193, 133, 0.18));
    font-size: 1.4rem;
}

.brand-label {
    color: var(--muted);
    font-size: 0.9rem;
}

h1 {
    font-size: 1.3rem;
    color: var(--text-strong);
}

nav {
    display: flex;
    justify-content: center;
    gap: 16px;
    align-items: center;
}

nav a {
    padding: 10px 14px;
    border-radius: 12px;
    color: var(--text);
    transition: all 0.2s ease;
    font-weight: 600;
    border: 1px solid transparent;
}

nav a:hover {
    color: var(--text-strong);
    border-color: var(--border);
    background: rgba(255, 255, 255, 0.03);
}

.quick-stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.pill {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: var(--text);
    border: 1px solid var(--border);
    font-size: 0.9rem;
}

.hero {
    padding: 50px 0 40px;
}

.hero-grid {
    display: grid;
    gap: 30px;
    align-items: stretch;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.eyebrow {
    color: var(--accent);
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 0.9rem;
}

h2 {
    color: var(--text-strong);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    margin: 10px 0;
}

.lead {
    color: var(--muted);
    font-size: 1.05rem;
    margin-bottom: 18px;
}

.hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid transparent;
    border-radius: 12px;
    padding: 12px 18px;
    cursor: pointer;
    font-weight: 700;
    color: var(--text-strong);
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    background: rgba(255, 255, 255, 0.04);
}

.btn.primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-strong));
    color: #062517;
    box-shadow: 0 12px 30px rgba(38, 193, 133, 0.35);
}

.btn.secondary {
    background: rgba(109, 211, 160, 0.14);
    color: var(--text-strong);
    border-color: rgba(109, 211, 160, 0.35);
}

.btn.outline {
    border-color: var(--border);
    background: transparent;
    color: var(--text);
}

.btn.ghost {
    background: rgba(255, 255, 255, 0.04);
    border-color: var(--border);
}

.btn.full {
    width: 100%;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
}

.hero-card {
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
}

.hero-card h3 {
    color: var(--text-strong);
    margin: 8px 0 10px;
}

.hero-card ul {
    list-style: none;
    display: grid;
    gap: 10px;
    color: var(--muted);
}

.hero-card li::before {
    content: '•';
    color: var(--primary);
    margin-left: 8px;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 14px;
    background: rgba(255, 209, 102, 0.12);
    color: var(--text-strong);
    border: 1px solid rgba(255, 209, 102, 0.5);
}

.panel {
    padding: 32px 0;
}

.panel.subtle {
    background: rgba(255, 255, 255, 0.02);
}

.section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
}

.section-head h3 {
    color: var(--text-strong);
    margin-top: 6px;
}

.section-desc {
    color: var(--muted);
    max-width: 640px;
}

.actions-inline {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.card {
    background: rgba(18, 28, 52, 0.85);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    box-shadow: var(--shadow);
}

.info-banner {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px dashed var(--border);
    border-radius: 14px;
    padding: 12px 14px;
    color: var(--muted);
}

.info-banner .icon {
    font-size: 1.4rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
}

label span {
    color: var(--muted);
    font-size: 0.95rem;
}

select,
input[type="text"] {
    width: 100%;
    margin-top: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    color: var(--text-strong);
    padding: 12px 10px;
    border-radius: 12px;
}

input[type="text"]::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.status-card {
    display: grid;
    gap: 6px;
    background: linear-gradient(135deg, rgba(38, 193, 133, 0.1), rgba(18, 28, 52, 0.9));
}

#statusTitle {
    color: var(--text-strong);
}

#statusSubtitle {
    color: var(--muted);
}

.chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 6px;
}

.chips.editable .chip-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    color: var(--text);
}

.chips.editable .chip-button:hover {
    border-color: rgba(255, 107, 107, 0.5);
    color: var(--danger);
}

.table-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.legend {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.pill.success { background: rgba(38, 193, 133, 0.15); border-color: rgba(38, 193, 133, 0.4); }
.pill.danger { background: rgba(255, 107, 107, 0.15); border-color: rgba(255, 107, 107, 0.4); }
.pill.muted { background: rgba(255, 255, 255, 0.05); }

.table {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(11, 18, 36, 0.6);
}

.table-row, .table-head-row {
    display: grid;
    grid-template-columns: 1fr 120px 160px;
    align-items: center;
    padding: 12px 14px;
    gap: 12px;
    border-bottom: 1px solid var(--border);
}

.table-head-row {
    background: rgba(255, 255, 255, 0.03);
    color: var(--muted);
    font-weight: 700;
}

.table-row:last-child { border-bottom: none; }

.badge-soft {
    padding: 6px 10px;
    border-radius: 12px;
    font-size: 0.9rem;
    color: var(--text-strong);
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.04);
}

.note-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 12px;
    border-radius: 10px;
}

.radio-group {
    display: inline-flex;
    gap: 10px;
    align-items: center;
}

.helper {
    margin-top: 8px;
    color: var(--muted);
    font-size: 0.95rem;
}

.form-inline {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.table small {
    color: var(--muted);
}

.app-footer {
    padding: 22px 0;
    border-top: 1px solid var(--border);
    background: rgba(11, 18, 36, 0.85);
    margin-top: 12px;
}

.app-footer p {
    color: var(--text-strong);
}

.footer-meta {
    display: flex;
    gap: 10px;
    color: var(--muted);
    margin-top: 8px;
    flex-wrap: wrap;
}

@media (max-width: 720px) {
    .header-content {
        grid-template-columns: 1fr;
        text-align: center;
        justify-items: center;
    }

    nav { flex-wrap: wrap; }

    .table-row, .table-head-row {
        grid-template-columns: 1fr;
        align-items: start;
    }
}
index.html
+177
-79

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة التعليم التفاعلي - الرئيسية</title>
    <title>منصة تسجيل الحضور والغياب</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
    <header class="app-header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <span class="logo-icon">📚</span>
                    <h1>منصة التعليم التفاعلي</h1>
                <div class="brand">
                    <span class="brand-icon">🗓️</span>
                    <div>
                        <p class="brand-label">نظام الحضور والغياب</p>
                        <h1>حضور الطلبة</h1>
                    </div>
                </div>
                
                <nav>
                    <ul>
                        <li><a href="index.html">الرئيسية</a></li>
                        <li><a href="courses.html">الدروس</a></li>
                        <li><a href="teachers.html">المعلمون</a></li>
                        <li><a href="exams.html">الاختبارات</a></li>
                        <li><a href="chat.html">الدردشة</a></li>
                    </ul>
                    <a href="#attendance">تسجيل الحضور</a>
                    <a href="#students">إدارة الطلبة</a>
                    <a href="#subjects">المواد والأقسام</a>
                </nav>
                
                <div class="user-actions">
                    <a href="login.html" class="btn btn-outline">تسجيل الدخول</a>
                    <a href="register.html" class="btn btn-primary">انضم إلينا</a>
                <div class="quick-stats">
                    <div class="pill">واجهة عربية حديثة</div>
                    <div class="pill">تصدير PDF / Excel / TXT</div>
                </div>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h2>منصة تعليمية متكاملة للتواصل مع الطلاب</h2>
                <p>تقديم تجربة تعليمية تفاعلية تجمع بين الطلاب والمعلمين في بيئة تعاونية متطورة</p>
                <div class="hero-buttons">
                    <a href="register.html" class="btn btn-primary">ابدأ التعلم الآن</a>
                    <a href="#features" class="btn btn-outline" style="color: var(--dark); border-color: var(--dark);">استكشف المنصة</a>
    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-grid">
                    <div>
                        <p class="eyebrow">لوحة قيادة سلسة وعصرية</p>
                        <h2>تسجيل حضور وغياب الطلبة بواجهة أنيقة ومرتبة</h2>
                        <p class="lead">اختَر المادة والقسم، سجّل حضور الطلبة مع الملاحظات، وصدّر التقارير مباشرة. إدارة الطلبة والمواد والأقسام تتم بخطوات قليلة وواضحة.</p>
                        <div class="hero-actions">
                            <a class="btn primary" href="#attendance">ابدأ التسجيل الآن</a>
                            <a class="btn ghost" href="#students">إدارة الطلبة</a>
                        </div>
                    </div>
                    <div class="hero-card">
                        <div class="badge">تجربة حديثة</div>
                        <h3>كل ما تحتاجه في صفحة واحدة</h3>
                        <ul>
                            <li>تسجيل الحضور والغياب مع الملاحظات</li>
                            <li>حفظ وتصدير PDF بسهولة</li>
                            <li>إدارة الطلبة مع تصدير Excel / TXT</li>
                            <li>إدارة المواد والأقسام بإضافة وحذف سلس</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
        </section>

    <section class="features" id="features">
        <div class="container">
            <div class="section-title">
                <h2>مميزات منصتنا التعليمية</h2>
                <p>نقدم مجموعة متكاملة من الأدوات لتحسين تجربة التعليم والتعلم</p>
            </div>
            
            <div class="cards-grid">
                <div class="card">
                    <div class="feature-icon">💬</div>
                    <h3>غرف الحوار التفاعلية</h3>
                    <p>تواصل مباشر بين الطلاب والمعلمين عبر غرف حوار تفاعلية منظمة حسب المواد الدراسية</p>
        <section id="attendance" class="panel">
            <div class="container">
                <div class="section-head">
                    <div>
                        <p class="eyebrow">الخطوة الأولى</p>
                        <h3>تسجيل الحضور والغياب</h3>
                        <p class="section-desc">اختر المادة والقسم، ثم سجّل حضور الطلبة مع إمكانية تدوين ملاحظة لكل طالب.</p>
                    </div>
                    <div class="actions-inline">
                        <button class="btn secondary" id="saveAttendance">حفظ الحضور</button>
                        <button class="btn outline" id="exportPdf" disabled>تصدير PDF</button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="feature-icon">📹</div>
                    <h3>فصول افتراضية</h3>
                    <p>انضم إلى فصول افتراضية حية مع سبورة تفاعلية ومشاركة الشاشة والتسجيلات</p>

                <div class="grid-2">
                    <div class="card">
                        <div class="form-grid">
                            <label>
                                <span>المادة</span>
                                <select id="subjectSelect"></select>
                            </label>
                            <label>
                                <span>القسم</span>
                                <select id="sectionSelect"></select>
                            </label>
                        </div>
                        <div class="info-banner">
                            <div>
                                <p class="eyebrow">نصيحة</p>
                                <p>اختر المادة والقسم لإظهار لائحة الطلبة. يمكن تدوين ملاحظات خاصة بكل طالب.</p>
                            </div>
                            <span class="icon">📝</span>
                        </div>
                    </div>

                    <div class="card status-card">
                        <p class="eyebrow">حالة الحفظ</p>
                        <h4 id="statusTitle">لم يتم الحفظ بعد</h4>
                        <p id="statusSubtitle">سيتم تفعيل التصدير إلى PDF بعد حفظ الحضور.</p>
                        <div class="chips" id="statusChips"></div>
                    </div>
                </div>
                

                <div class="card">
                    <div class="feature-icon">📂</div>
                    <h3>مكتبة رقمية شاملة</h3>
                    <p>الوصول إلى مكتبة ضخمة من المصادر التعليمية والمراجع والدروس المسجلة</p>
                    <div class="table-head">
                        <div>
                            <p class="eyebrow">لائحة الطلبة</p>
                            <h4 id="studentListTitle">الطلبة حسب القسم المحدد</h4>
                        </div>
                        <div class="legend">
                            <span class="pill success">حاضر</span>
                            <span class="pill danger">غائب</span>
                            <span class="pill muted">ملاحظات</span>
                        </div>
                    </div>
                    <div class="table" id="studentsTable"></div>
                </div>
            </div>
        </div>
    </section>
        </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <h3>منصة التعليم التفاعلي</h3>
                    <p>نحو مستقبل تعليمي أفضل من خلال التكنولوجيا والابتكار</p>
        <section id="students" class="panel subtle">
            <div class="container">
                <div class="section-head">
                    <div>
                        <p class="eyebrow">الخطوة الثانية</p>
                        <h3>إدارة الطلبة</h3>
                        <p class="section-desc">أضف أو احذف الطلبة، وصدّر لائحة الطلبة كملف Excel أو TXT.</p>
                    </div>
                    <div class="actions-inline">
                        <button class="btn ghost" id="exportCsv">تصدير Excel (CSV)</button>
                        <button class="btn ghost" id="exportTxt">تصدير TXT</button>
                    </div>
                </div>
                
                <div class="footer-column">
                    <h3>روابط سريعة</h3>
                    <ul>
                        <li><a href="index.html">الرئيسية</a></li>
                        <li><a href="courses.html">الدروس</a></li>
                        <li><a href="teachers.html">المعلمون</a></li>
                        <li><a href="exams.html">الاختبارات</a></li>
                    </ul>

                <div class="grid-2">
                    <div class="card">
                        <h4>إضافة طالب جديد</h4>
                        <div class="form-grid">
                            <label>
                                <span>اسم الطالب</span>
                                <input type="text" id="studentName" placeholder="مثال: سلمى عبد الرحمن">
                            </label>
                            <label>
                                <span>القسم</span>
                                <select id="studentSection"></select>
                            </label>
                        </div>
                        <button class="btn primary full" id="addStudent">إضافة الطالب</button>
                        <p class="helper">إضافة الطالب ستظهره مباشرة في لائحة تسجيل الحضور.</p>
                    </div>

                    <div class="card">
                        <div class="table-head">
                            <div>
                                <p class="eyebrow">لائحة الطلبة</p>
                                <h4>إدارة وحذف</h4>
                            </div>
                        </div>
                        <div class="table" id="studentsManageTable"></div>
                    </div>
                </div>
            </div>
        </section>

        <section id="subjects" class="panel">
            <div class="container">
                <div class="section-head">
                    <div>
                        <p class="eyebrow">الخطوة الثالثة</p>
                        <h3>إدارة المواد والأقسام</h3>
                        <p class="section-desc">إضافة أو حذف المواد والأقسام يحدّث القوائم في كل الصفحات.</p>
                    </div>
                </div>
                
                <div class="footer-column">
                    <h3>الدعم</h3>
                    <ul>
                        <li><a href="#">الأسئلة الشائعة</a></li>
                        <li><a href="#">اتصل بنا</a></li>
                        <li><a href="#">الشروط والأحكام</a></li>
                        <li><a href="#">سياسة الخصوصية</a></li>
                    </ul>

                <div class="grid-2">
                    <div class="card">
                        <h4>المواد</h4>
                        <div class="form-inline">
                            <input type="text" id="subjectInput" placeholder="مثال: الفيزياء">
                            <button class="btn secondary" id="addSubject">إضافة المادة</button>
                        </div>
                        <div class="chips editable" id="subjectsChips"></div>
                    </div>

                    <div class="card">
                        <h4>الأقسام</h4>
                        <div class="form-inline">
                            <input type="text" id="sectionInput" placeholder="مثال: القسم الرابع">
                            <button class="btn secondary" id="addSection">إضافة القسم</button>
                        </div>
                        <div class="chips editable" id="sectionsChips"></div>
                    </div>
                </div>
            </div>
            
            <div class="copyright">
                <p>© 2024 منصة التعليم التفاعلي. جميع الحقوق محفوظة.</p>
        </section>
    </main>

    <footer class="app-footer">
        <div class="container">
            <p>تصميم عربي معاصر لإدارة حضور الطلبة وتصدير التقارير بسهولة.</p>
            <div class="footer-meta">
                <span>واجهة متجاوبة</span>
                <span>تجربة سلسة</span>
                <span>ملفات PDF / CSV / TXT</span>
            </div>
        </div>
    </footer>

    <script src="js/script.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
</html>
js/app.js
جديد
+320
-0

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

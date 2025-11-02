// js/script.js - الملف المحدث والمكتمل

// دالة للتحكم في التنقل بين الصفحات
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة تسجيل الدخول
    checkAuth();
    
    // إدارة نموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;
            
            // محاكاة عملية تسجيل الدخول
            if (email && password && userType) {
                localStorage.setItem('userType', userType);
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', email);
                window.location.href = 'dashboard.html';
            } else {
                showAlert('يرجى ملء جميع الحقول', 'error');
            }
        });
    }
    
    // إدارة نموذج التسجيل
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const userType = document.getElementById('userType').value;
            
            if (password !== confirmPassword) {
                showAlert('كلمات المرور غير متطابقة', 'error');
                return;
            }
            
            if (fullName && email && password && userType) {
                localStorage.setItem('userType', userType);
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', fullName);
                showAlert('تم إنشاء الحساب بنجاح!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }
    
    // إدارة نموذج الملف الشخصي
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showAlert('تم حفظ التغييرات بنجاح!', 'success');
        });
    }
    
    // تحميل بيانات المستخدم
    loadUserData();
    
    // إضافة تأثيرات للبطاقات
    initAnimations();
    
    // إدارة نظام الدردشة
    initChatSystem();
    
    // إدارة نظام الاختبارات
    initExamSystem();
});

// التحقق من المصادقة
function checkAuth() {
    const loggedIn = localStorage.getItem('loggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    const protectedPages = ['dashboard.html', 'profile.html', 'chat.html', 'courses.html', 'teachers.html', 'exams.html'];
    
    if (protectedPages.includes(currentPage) && loggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    if ((currentPage === 'login.html' || currentPage === 'register.html') && loggedIn === 'true') {
        window.location.href = 'dashboard.html';
    }
}

// تحميل بيانات المستخدم
function loadUserData() {
    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    // تحديث عرض نوع المستخدم
    const userTypeElement = document.getElementById('userTypeDisplay');
    if (userTypeElement) {
        const userTypeText = {
            'student': 'طالب',
            'teacher': 'معلم',
            'admin': 'مسؤول'
        };
        userTypeElement.textContent = userTypeText[userType] || 'زائر';
    }
    
    // تحديث بيانات الملف الشخصي
    if (userName && document.getElementById('firstName')) {
        const nameParts = userName.split(' ');
        document.getElementById('firstName').value = nameParts[0] || '';
        document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
    }
    
    if (userEmail && document.getElementById('email')) {
        document.getElementById('email').value = userEmail;
    }
}

// تهيئة الرسوم المتحركة
function initAnimations() {
    const cards = document.querySelectorAll('.card, .course-card, .teacher-card, .exam-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// نظام الدردشة
function initChatSystem() {
    const chatForm = document.getElementById('chatForm');
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (chatForm && messagesContainer) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            if (message) {
                addMessage(message, 'sent');
                messageInput.value = '';
                
                // محاكاة رد تلقائي
                setTimeout(() => {
                    const responses = [
                        'شكراً على رسالتك! كيف يمكنني مساعدتك؟',
                        'هل تحتاج إلى مساعدة في موضوع معين؟',
                        'سأكون سعيداً بمساعدتك في هذا الموضوع',
                        'هل يمكنك توضيح سؤالك أكثر؟'
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addMessage(randomResponse, 'received');
                }, 1000 + Math.random() * 2000);
            }
        });
    }
}

// إضافة رسالة إلى الدردشة
function addMessage(text, type) {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    messageDiv.innerHTML = `
        <div>${text}</div>
        <div class="message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// نظام الاختبارات
function initExamSystem() {
    const examForm = document.getElementById('examForm');
    if (examForm) {
        examForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showAlert('تم تقديم الإجابات بنجاح! سيتم عرض النتائج قريباً.', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }
}

// عرض التنبيهات
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        alertDiv.style.backgroundColor = '#27ae60';
    } else if (type === 'error') {
        alertDiv.style.backgroundColor = '#e74c3c';
    } else {
        alertDiv.style.backgroundColor = '#3498db';
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// تصفية الدروس
function initCourseFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const courses = document.querySelectorAll('.course-card');
            
            courses.forEach(course => {
                if (filter === 'all' || course.dataset.category === filter) {
                    course.style.display = 'block';
                } else {
                    course.style.display = 'none';
                }
            });
        });
    });
    
    // البحث في الدروس
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const courses = document.querySelectorAll('.course-card');
            
            courses.forEach(course => {
                const title = course.querySelector('h3').textContent.toLowerCase();
                const description = course.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    course.style.display = 'block';
                } else {
                    course.style.display = 'none';
                }
            });
        });
    }
}

// تبديل التبويبات
function initTabs() {
    // تبويبات الاختبارات
    document.querySelectorAll('.exam-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.exam-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.dataset.tab + 'Exams';
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // تبويبات الملف الشخصي
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.dataset.tab + 'Tab';
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(tabId).style.display = 'block';
        });
    });
}

// بدء الاختبار
function startExam() {
    if (confirm('هل أنت مستعد لبدء الاختبار؟ سيبدأ العد التنازلي فوراً.')) {
        showAlert('تم بدء الاختبار! حظاً موفقاً.', 'success');
        // هنا يمكن توجيه المستخدم إلى صفحة الاختبار
    }
}

// تهيئة جميع الأنظمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initCourseFilters();
    initTabs();
});

// إضافة أنماط CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
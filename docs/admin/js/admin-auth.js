// Admin Authentication
(function() {
    'use strict';
    
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, redirect to admin dashboard
            const currentPage = window.location.pathname;
            if (currentPage.includes('login.html')) {
                window.location.href = 'index-admin.html';
            }
        }
    });
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Signing In...';
            loginError.textContent = '';
            
            try {
                // Sign in with email and password
                await auth.signInWithEmailAndPassword(email, password);
                
                // Success - redirect will happen automatically via auth state change
                submitButton.innerHTML = '<i class="bi bi-check-circle"></i> Success!';
                
                // Small delay before redirect
                setTimeout(() => {
                    window.location.href = 'index-admin.html';
                }, 500);
                
            } catch (error) {
                // Handle errors
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                
                let errorMessage = 'Login failed. ';
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage += 'No account found with this email.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage += 'Incorrect password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage += 'Invalid email address.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage += 'This account has been disabled.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage += 'Too many failed attempts. Please try again later.';
                        break;
                    default:
                        errorMessage += error.message || 'Please check your credentials and try again.';
                }
                
                loginError.textContent = errorMessage;
                loginError.style.display = 'block';
            }
        });
    }
    
    // Logout function (used in admin pages)
    window.adminLogout = function() {
        auth.signOut().then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    };
    
    // Check authentication on admin pages
    window.checkAdminAuth = function() {
        return new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    resolve(user);
                } else {
                    window.location.href = 'login.html';
                    reject(new Error('Not authenticated'));
                }
            });
        });
    };
})();


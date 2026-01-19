// Admin Authentication
(function() {
    'use strict';
    
    // Get auth - wait for Firebase to be ready
    function getAuth() {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            return firebase.auth();
        }
        // Fallback: try to get from window if it was set globally
        if (window.auth) {
            return window.auth;
        }
        console.error('Firebase auth not available');
        return null;
    }
    
    const auth = getAuth();
    if (!auth) {
        console.error('Cannot initialize admin auth - Firebase auth not available');
        return;
    }
    
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
        const authInstance = getAuth();
        if (!authInstance) {
            console.error('Cannot logout - auth not available');
            window.location.href = 'login.html';
            return;
        }
        
        authInstance.signOut().then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Logout error:', error);
            // Still redirect even if signout fails
            window.location.href = 'login.html';
        });
    };
    
    // Check authentication on admin pages
    window.checkAdminAuth = function() {
        return new Promise((resolve, reject) => {
            const authInstance = getAuth();
            if (!authInstance) {
                console.error('Auth not available');
                reject(new Error('Auth not initialized'));
                return;
            }
            
            // Get current user immediately
            const currentUser = authInstance.currentUser;
            if (currentUser) {
                resolve(currentUser);
                return;
            }
            
            // If no current user, wait for auth state change
            const unsubscribe = authInstance.onAuthStateChanged((user) => {
                unsubscribe(); // Unsubscribe after first check
                if (user) {
                    resolve(user);
                } else {
                    window.location.href = 'login.html';
                    reject(new Error('Not authenticated'));
                }
            });
            
            // Timeout after 5 seconds
            setTimeout(() => {
                unsubscribe();
                if (!authInstance.currentUser) {
                    window.location.href = 'login.html';
                    reject(new Error('Authentication timeout'));
                }
            }, 5000);
        });
    };
})();


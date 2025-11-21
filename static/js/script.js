// EmailJS Configuration
const SERVICE_ID = 'service_k5igbu7';
const ADMIN_TEMPLATE_ID = 'template_n4p3bpk'; // Contact Us template
const USER_AUTO_REPLY_TEMPLATE_ID = 'template_ww8i09g'; // Add your Auto-Reply Template ID here if you have one
const PUBLIC_KEY = 'p3xL7lGK9CDfihn3n';
const ADMIN_EMAIL = 'erahulroy123@gmail.com';

document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const btn = event.target.querySelector('button');
    const status = document.getElementById('status-message');

    // Reset status
    status.textContent = '';
    status.style.color = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validation
    if (!name || !email || !message) {
        status.textContent = 'All fields are mandatory.';
        status.style.color = 'red';
        return;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        status.textContent = 'Name should not contain special characters or numbers.';
        status.style.color = 'red';
        return;
    }

    if (!email.includes('@')) {
        status.textContent = 'Please enter a valid email address.';
        status.style.color = 'red';
        return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        // 1) Admin notification
        const adminResult = await emailjs.send(
            SERVICE_ID,
            ADMIN_TEMPLATE_ID,
            {
                subject: `New Message from ${name}`,
                title: `New Message from ${name}`,
                message: message,
                sender_email: email,
                email: email,
                reply_to: email,
                from_name: name,
                to_email: ADMIN_EMAIL
            },
            PUBLIC_KEY
        );

        console.log("Admin Email Sent:", adminResult);

        // 2) User auto-reply (Only if template ID is provided)
        if (USER_AUTO_REPLY_TEMPLATE_ID) {
            try {
                const userResult = await emailjs.send(
                    SERVICE_ID,
                    USER_AUTO_REPLY_TEMPLATE_ID,
                    {
                        subject: "Thank you for contacting Royal Celebrations",
                        title: "We received your message",
                        message: "Thank you for reaching out. We will get back to you shortly.",
                        sender_email: ADMIN_EMAIL,
                        email: email, // Auto-reply goes to the user
                        reply_to: ADMIN_EMAIL,
                        to_name: name
                    },
                    PUBLIC_KEY
                );
                console.log("User Auto-reply Sent:", userResult);
            } catch (userErr) {
                console.warn("User auto-reply failed:", userErr);
            }
        }

        // Success
        // Show Modal
        const modal = document.getElementById('success-modal');
        const closeBtn = document.querySelector('.close-btn');
        const okBtn = document.getElementById('modal-ok-btn');

        modal.style.display = "block";

        // Close logic
        closeBtn.onclick = function () {
            modal.style.display = "none";
        }
        okBtn.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        status.textContent = ''; // Clear any previous text status
        document.getElementById('contact-form').reset();

    } catch (err) {
        console.error("EmailJS Error:", err);
        const errorMessage = err?.text || err?.message || JSON.stringify(err);
        status.textContent = "Failed to send message: " + errorMessage;
        status.style.color = 'red';
    } finally {
        btn.textContent = 'Send Message';
        btn.disabled = false;
    }
});



const districtsByProvince = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

document.addEventListener('DOMContentLoaded', () => {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const form = document.getElementById('reliefForm');
    const notification = document.getElementById('notification');

    // Populate districts when province changes
    provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;
        const districts = districtsByProvince[selectedProvince] || [];
        
        // Clear current options
        districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
        
        // Add new options
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Send form through EmailJS
            emailjs.sendForm('service_8qs03ph', 'template_ewgebbp', form)
                .then(() => {
                    showNotification();
                    form.reset();
                    // Reset districts list
                    districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, (error) => {
                    console.error('FAILED...', error);
                    alert('Failed to send message. Please try again later.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                });
        }
    });

    function validateForm() {
        const nic = document.getElementById('nic').value;
        const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        
        if (!nicRegex.test(nic)) {
            alert('Please enter a valid Sri Lankan NIC number (e.g., 123456789V or 199012345678)');
            return false;
        }
        
        return true;
    }

    function showNotification() {
        notification.classList.remove('hidden');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
});

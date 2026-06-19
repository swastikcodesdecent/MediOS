// MediOS - Common UI Utilities and Helper Functions

/**
 * Displays a non-blocking toast notification in the top-right corner.
 * @param {string} message - Message to display.
 * @param {'success' | 'error' | 'warning' | 'info'} type - Type of alert.
 */
export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = '<i class="fas fa-check-circle"></i>';
  if (type === "error") icon = '<i class="fas fa-exclamation-circle"></i>';
  if (type === "warning") icon = '<i class="fas fa-exclamation-triangle"></i>';
  if (type === "info") icon = '<i class="fas fa-info-circle"></i>';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close-btn">&times;</button>
  `;
  
  container.appendChild(toast);
  
  // Close toast on button click
  toast.querySelector(".toast-close-btn").addEventListener("click", () => {
    toast.classList.add("toast-fade-out");
    setTimeout(() => toast.remove(), 300);
  });
  
  // Automatically remove toast after 4.5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}

/**
 * Generates a simple math captcha challenge to protect forms.
 * @returns {object} Object with the question string and stringified answer.
 */
export function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const answer = num1 + num2;
  return {
    question: `What is ${num1} + ${num2}?`,
    answer: answer.toString()
  };
}

/**
 * Calculates estimated waiting time based on active pending queue count.
 * Assumes approximately 15 minutes per consultation.
 * @param {number} pendingCount - Number of pending patients in the doctor's queue.
 * @returns {string} Estimated wait time text.
 */
export function calculateEstimatedWaitTime(pendingCount) {
  if (!pendingCount || pendingCount <= 0) {
    return "Immediate Consultation (No current queue)";
  }
  
  const totalMinutes = pendingCount * 15;
  if (totalMinutes < 60) {
    return `~${totalMinutes} mins (${pendingCount} patient${pendingCount > 1 ? "s" : ""} ahead)`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `~${hours} hr ${mins > 0 ? mins + ' mins' : ''} (${pendingCount} patient${pendingCount > 1 ? "s" : ""} ahead)`;
  }
}

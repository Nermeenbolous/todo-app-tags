form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    const tag = tagInput.value;

    // 1. Validation Logic
    if (taskText === "") {
        // Show the error by removing the 'hidden' class
        errorMsg.classList.remove('hidden');
        
        // Focus back on the input for the user
        taskInput.focus();
        
        // Optional: Auto-hide error message after 3 seconds
        setTimeout(() => {
            errorMsg.classList.add('hidden');
        }, 3000);
        
        return; // Stop the function here
    }

    // 2. Success Logic (if text is not empty)
    errorMsg.classList.add('hidden'); // Hide error message
    
    const newTask = { 
        id: Date.now(), 
        text: taskText, 
        tag: tag, 
        done: false 
    };
    
    tasks.push(newTask);
    
    // 3. Clear inputs and refresh list
    taskInput.value = ''; 
    tagInput.value = '';
    saveAndRender();
});

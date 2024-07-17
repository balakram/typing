document.addEventListener('DOMContentLoaded', function() {
    const examData = JSON.parse(localStorage.getItem('examData'));
    const originalText = examData.text.trim().split(/\s+/); // Split original text into words
    let backspaceCount = 0; // To count backspace usage
    let startTime = new Date().getTime(); // Start time in milliseconds
    let interval; // Interval variable for the timer
    let timer; // Timer variable
    let wordLimit = examData.wordLimit || 35; // Default word limit is 35 if not set

    document.getElementById('userName').innerText = examData.name;
    document.getElementById('timer').innerText = `${examData.testTime < 10 ? '0' : ''}${examData.testTime}:00`;
    document.getElementById('paragraph').innerText = examData.text;
    document.getElementById('wordLimitValue').value = wordLimit;

    const typingArea = document.getElementById('typingArea');
    const resultsSection = document.getElementById('results');
    const realTimeStats = document.getElementById('realTimeStats');
    const showRealTimeStats = document.getElementById('showRealTimeStats');
    const decreaseFontSizeButton = document.getElementById('decreaseFontSize');
    const increaseFontSizeButton = document.getElementById('increaseFontSize');
    const saveFileButton = document.getElementById('saveFile');
    const restartButton = document.getElementById('restart');
    const submitButton = document.getElementById('submit');
    const paragraphContainer = document.getElementById('paragraph');

    // Function to start the timer
    function startTimer() {
        timer = examData.testTime * 60;
        interval = setInterval(() => {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            document.getElementById('timer').innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (timer <= 0) {
                clearInterval(interval);
                calculateResults();
            }
        }, 1000);
    }

    // Function to calculate results
    function calculateResults() {
        const typedText = typingArea.value.trim();
        const typedCharacters = typedText.length;
        const typedWords = typedText.split(/\s+/).filter(word => word !== ''); // Split typed text into words

        // Calculate total typed words and errors
        const typedWordCount = typedWords.length;
        const errorCount = calculateErrors(typedWords, originalText);

        // Calculate gross speed (GWPM), net speed (WPM), and character speed (CPM)
        const totalTimeInMinutes = (examData.testTime * 60 - timer) / 60;
        const gwpm = (typedCharacters / 5) / totalTimeInMinutes;
        const nwpm = ((typedCharacters / 5 - errorCount) / totalTimeInMinutes);
        const cpm = (typedCharacters / totalTimeInMinutes);

        // Calculate accuracy and error rate
        const accuracy = ((typedWordCount - errorCount) / typedWordCount) * 100;
        const errorRate = (errorCount / typedWordCount) * 100;

        // Calculate test duration in minutes and seconds
        const testMinutes = Math.floor((examData.testTime * 60 - timer) / 60);
        const testSeconds = (examData.testTime * 60 - timer) % 60;

        // Display results
        document.getElementById('gwpm').textContent = gwpm.toFixed(2);
        document.getElementById('wpm').textContent = nwpm.toFixed(2);
        document.getElementById('cpm').textContent = cpm.toFixed();
        document.getElementById('totalWords').textContent = typedWordCount;
        document.getElementById('totalErrors').textContent = errorCount;
        document.getElementById('errorRate').textContent = errorRate.toFixed(2) + '%';
        document.getElementById('backspaceCount').textContent = backspaceCount + ' Times'; // Update backspace count
        document.getElementById('testDuration').textContent = `${testMinutes} minutes ${testSeconds} seconds`;
        document.getElementById('accuracy').textContent = accuracy.toFixed(2) + '%';

        resultsSection.style.display = 'block';
    }

    // Function to calculate real-time results
    function calculateRealTimeResults() {
        const typedText = typingArea.value.trim();
        const typedCharacters = typedText.length;
        const typedWords = typedText.split(/\s+/).filter(word => word !== '');

        const totalTimeInMinutes = (examData.testTime * 60 - timer) / 60;
        const gwpm = (typedCharacters / 5) / totalTimeInMinutes;
        const errorCount = calculateErrors(typedWords, originalText);
        const nwpm = ((typedCharacters / 5 - errorCount) / totalTimeInMinutes);

        const accuracy = ((typedWords.length - errorCount) / typedWords.length) * 100;

        document.getElementById('realTimeGwpm').textContent = gwpm.toFixed(2);
        document.getElementById('realTimeWpm').textContent = nwpm.toFixed(2);
        document.getElementById('realTimeAccuracy').textContent = accuracy.toFixed(2) + '%';
        document.getElementById('realTimeErrors').textContent = errorCount;

        const wordCount = typedWords.length;
        const wordLimitDisplay = document.getElementById('wordLimitDisplay');
        wordLimitDisplay.innerText = `${wordCount} / ${wordLimit}`;
        if (wordCount >= wordLimit) {
            typingArea.disabled = true;
            clearInterval(interval);
            calculateResults();
        }
    }

    // Function to calculate errors
    function calculateErrors(typedWords, originalWords) {
        let errorCount = 0;
        typedWords.forEach((word, index) => {
            if (originalWords[index] && word !== originalWords[index]) {
                errorCount++;
            }
        });
        return errorCount;
    }

    // Request full-screen mode
    function requestFullscreen() {
        const container = document.documentElement;
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.mozRequestFullScreen) { // Firefox
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) { // Chrome, Safari and Opera
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) { // IE/Edge
            container.msRequestFullscreen();
        }
    }

    // Handle F11 key for full-screen mode
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F11') {
            requestFullscreen();
        }
    });

    // Start in full-screen mode
    requestFullscreen();

    // Handle decrease font size button click for typing area
    decreaseFontSizeButton.addEventListener('click', function() {
        const currentFontSize = window.getComputedStyle(typingArea).fontSize;
        const currentFontSizeNum = parseFloat(currentFontSize);
        typingArea.style.fontSize = `${currentFontSizeNum - 1}px`;
    });

    // Handle increase font size button click for typing area
    increaseFontSizeButton.addEventListener('click', function() {
        const currentFontSize = window.getComputedStyle(typingArea).fontSize;
        const currentFontSizeNum = parseFloat(currentFontSize);
        typingArea.style.fontSize = `${currentFontSizeNum + 1}px`;
    });

    // Handle decrease font size button click for paragraph container
    decreaseFontSizeButton.addEventListener('click', function() {
        const currentFontSize = window.getComputedStyle(paragraphContainer).fontSize;
        const currentFontSizeNum = parseFloat(currentFontSize);
        paragraphContainer.style.fontSize = `${currentFontSizeNum - 1}px`;
    });

    // Handle increase font size button click for paragraph container
    increaseFontSizeButton.addEventListener('click', function() {
        const currentFontSize = window.getComputedStyle(paragraphContainer).fontSize;
        const currentFontSizeNum = parseFloat(currentFontSize);
        paragraphContainer.style.fontSize = `${currentFontSizeNum + 1}px`;
    });

    // Handle save file button click
    saveFileButton.addEventListener('click', function() {
        const textToSave = `Original Passage:\n${examData.text}\n\nWritten Passage:\n${typingArea.value}\n\nResults:\n` +
                           `Gross Speed (GWPM): ${document.getElementById('gwpm').textContent}\n` +
                           `Net Speed (WPM): ${document.getElementById('wpm').textContent}\n` +
                           `Character Speed (CPM): ${document.getElementById('cpm').textContent}\n` +
                           `Total Words Typed: ${document.getElementById('totalWords').textContent}\n` +
                           `Total Errors: ${document.getElementById('totalErrors').textContent}\n` +
                           `Error Rate: ${document.getElementById('errorRate').textContent}\n` +
                           `Backspace Count: ${document.getElementById('backspaceCount').textContent}\n` +
                           `Test Duration: ${document.getElementById('testDuration').textContent}\n` +
                           `Accuracy: ${document.getElementById('accuracy').textContent}`;
        saveFile(textToSave, `TypingTestResults_${examData.name}.txt`);
    });

    // Start the timer when the typing area is focused
    typingArea.addEventListener('focus', startTimer, { once: true });

    // Handle restart button click
    restartButton.addEventListener('click', function() {
        restartExam();
    });

    // Function to restart the exam
    function restartExam() {
        clearInterval(interval); // Stop the current timer
        timer = examData.testTime * 60; // Reset time left
        typingArea.value = ''; // Clear typing area
        typingArea.disabled = false; // Enable typing area
        resultsSection.style.display = 'none'; // Hide results
        realTimeStats.style.display = 'none'; // Hide real-time stats
        backspaceCount = 0; // Reset backspace count
        startTime = new Date().getTime(); // Reset start time
        document.getElementById('timer').innerText = `${examData.testTime < 10 ? '0' : ''}${examData.testTime}:00`; // Reset timer display
        startTimer(); // Start the timer
    }

    // Handle submit button click
    submitButton.addEventListener('click', function() {
        clearInterval(interval);
        calculateResults();
    });

    // Handle backspace key press for backspace count
    typingArea.addEventListener('keydown', function(event) {
        if (event.key === 'Backspace') {
            backspaceCount++;
        }
    });

    // Handle word limit change
    document.getElementById('wordLimitValue').addEventListener('input', function(event) {
        wordLimit = parseInt(event.target.value) || 35;
        examData.wordLimit = wordLimit;
        localStorage.setItem('examData', JSON.stringify(examData)); // Save updated word limit to localStorage
    });

    // Calculate word count in the typing area
    typingArea.addEventListener('input', function() {
        if (showRealTimeStats.checked) {
            calculateRealTimeResults(); // Update real-time results if the checkbox is checked
        }
    });

    // Handle show real-time stats checkbox change
    showRealTimeStats.addEventListener('change', function() {
        if (showRealTimeStats.checked) {
            realTimeStats.style.display = 'block';
        } else {
            realTimeStats.style.display = 'none';
        }
    });

    // Save file function
    function saveFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    // Update real-time stats periodically even if no key press
    setInterval(function() {
        if (showRealTimeStats.checked) {
            calculateRealTimeResults();
        }
    }, 1000);
    //
    //

      // Function to highlight text dynamically
function highlightText(typed, original) {
    let currentText = typed.trim().split(/\s+/); // Split typed text into words
    let originalText = original.trim().split(/\s+/); // Split original text into words

    // Compare each word for highlighting
    let highlightedText = currentText.map((word, index) => {
        if (word === originalText[index]) {
            return `<span class="word correct">${word}</span>`;
        } else {
            return `<span class="word incorrect">${word}</span>`;
        }
    });

    // Join back into a single string with spaces
    return highlightedText.join(' ');
}

/*/ Function to update displayed paragraph with highlighted text over original
function updateDisplayedText() {
    const typedText = typingArea.value;
    const originalText = examData.text;
    const highlighted = highlightText(typedText, originalText);

    // Display original text and overlay highlighted text in the same row
    paragraphContainer.innerHTML = `
        <div class="text-row">
            <div class="original-text">${originalText}</div>
            <div class="highlighted-text">${highlighted}</div>
        </div>
    `;
}

// Call updateDisplayedText initially and on input change
typingArea.addEventListener('input', updateDisplayedText);*/


});
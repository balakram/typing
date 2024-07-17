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
    const enableBackspaceCheckbox = document.getElementById('enableBackspace');
    const enableHighlightCheckbox = document.getElementById('enableHighlight');

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
        document.getElementById('totalWords').textContent = typedWordCount;
        document.getElementById('cpm').textContent = cpm.toFixed(2);
        document.getElementById('totalErrors').textContent = errorCount;
        document.getElementById('errorRate').textContent = errorRate.toFixed(2) + '%';
        document.getElementById('backspaceCount').textContent = backspaceCount;
        document.getElementById('testDuration').textContent = `${testMinutes}m ${testSeconds}s`;
        document.getElementById('accuracy').textContent = accuracy.toFixed(2) + '%';

        resultsSection.style.display = 'block';
        clearInterval(interval);
        typingArea.disabled = true;
    }

    // Function to calculate errors
    function calculateErrors(typedWords, originalWords) {
        let errors = 0;
        for (let i = 0; i < typedWords.length; i++) {
            if (typedWords[i] !== originalWords[i]) {
                errors++;
            }
        }
        return errors-1;//error number adjust here
    }

    // Function to update real-time statistics
    function updateRealTimeStats() {
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

        // Calculate accuracy and error rate
        const accuracy = ((typedWordCount - errorCount) / typedWordCount) * 100;

        // Update real-time statistics elements
        document.getElementById('realTimeGwpm').textContent = gwpm.toFixed(2);
        document.getElementById('realTimeWpm').textContent = nwpm.toFixed(2);
        document.getElementById('realTimeErrors').textContent = errorCount;
        document.getElementById('realTimeAccuracy').textContent = accuracy.toFixed(2) + '%';
    }

    /*// Function to enable or disable highlighting & autoscroll
    function handleHighlightAndAutoscroll() {
        const enableHighlight = enableHighlightCheckbox.checked;
        const typedText = typingArea.value;
        const typedWords = typedText.trim().split(/\s+/);
        const currentWordIndex = typedWords.length - 1;

        if (enableHighlight) {
            const words = paragraphContainer.innerText.split(' ');
            paragraphContainer.innerHTML = words.map((word, index) => {
                if (index === currentWordIndex) {
                    return `<span class="highlight">${word}</span>`;
                } else if (index < currentWordIndex) {
                    return `<span class="typed">${word}</span>`;
                } else {
                    return word;
                }
            }).join(' ');

            const highlightedWord = document.querySelector('.highlight');
            if (highlightedWord) {
                highlightedWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            paragraphContainer.innerHTML = paragraphContainer.innerText;
        }
    }*/
        function handleHighlightAndAutoscroll() {
            const enableHighlight = enableHighlightCheckbox.checked;
            const typedText = typingArea.value;
            const typedWords = typedText.trim().split(/\s+/);
            const currentWordIndex = typedWords.length - 1;
        
            if (enableHighlight) {
                const words = paragraphContainer.innerText.split(' ');
                paragraphContainer.innerHTML = words.map((word, index) => {
                    if (index === currentWordIndex) {
                        return `<span class="highlight">${word}</span>`;
                    } else if (index < typedWords.length) {
                        if (typedWords[index] === originalText[index]) {
                            return `<span class="typed">${word}</span>`;
                        } else {
                            return `<span class="incorrect">${word}</span>`;
                        }
                    } else {
                        return word;
                    }
                }).join(' ');
        
                const highlightedWord = paragraphContainer.querySelector('.highlight');
                if (highlightedWord) {
                    highlightedWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // If highlighting is disabled, reset paragraphContainer to its original text
                paragraphContainer.innerHTML = originalText.map(word => `<span>${word}</span>`).join(' ');
            }
        }
        
        

    // Event listener to handle keydown events
    typingArea.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            if (!enableBackspaceCheckbox.checked) {
                event.preventDefault(); // Disable backspace
            } else {
                backspaceCount++; // Count backspace usage
            }
        }
    });

    // Event listener to handle input events
    typingArea.addEventListener('input', () => {
        if (showRealTimeStats.checked) {
            updateRealTimeStats();
        }
        handleHighlightAndAutoscroll();
    });

    // Event listener to start the exam
    typingArea.addEventListener('focus', () => {
        if (!interval) {
            startTimer();
        }
    });

    // Event listener for the show real-time statistics checkbox
    showRealTimeStats.addEventListener('change', () => {
        realTimeStats.style.display = showRealTimeStats.checked ? 'block' : 'none';
    });

    // Event listener for the decrease font size button
    decreaseFontSizeButton.addEventListener('click', () => {
        const currentFontSize = parseFloat(window.getComputedStyle(paragraphContainer).fontSize);
        paragraphContainer.style.fontSize = (currentFontSize - 1) + 'px';
    });

    // Event listener for the increase font size button
    increaseFontSizeButton.addEventListener('click', () => {
        const currentFontSize = parseFloat(window.getComputedStyle(paragraphContainer).fontSize);
        paragraphContainer.style.fontSize = (currentFontSize + 1) + 'px';
    });

    // Event listener for the save file button
    /*saveFileButton.addEventListener('click', () => {
        const resultData = {
            gwpm: document.getElementById('gwpm').textContent,
            wpm: document.getElementById('wpm').textContent,
            totalErrors: document.getElementById('totalErrors').textContent,
            errorRate: document.getElementById('errorRate').textContent,
            backspaceCount: document.getElementById('backspaceCount').textContent,
            testDuration: document.getElementById('testDuration').textContent,
            accuracy: document.getElementById('accuracy').textContent
        };

        const blob = new Blob([JSON.stringify(resultData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'results.json';
        a.click();
        URL.revokeObjectURL(url);
    });*/
        // Handle save file button click
        saveFileButton.addEventListener('click', function() {
            const textToSave = `Original Passage:\n${examData.text}\n\nWritten Passage:\n${typingArea.value}\n\n${examData.name}'s Detailed Typing Result:\n` +
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

    // Event listener for the restart button
    restartButton.addEventListener('click', () => {
        location.reload();
    });

    // Event listener for the submit button
    submitButton.addEventListener('click', () => {
        calculateResults();
    });
});

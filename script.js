document.getElementById('setWordLimit').addEventListener('change', function() {
    document.getElementById('wordLimit').disabled = !this.checked;
});

document.querySelector('input[name="paragraphType"][value="default"]').addEventListener('change', function() {
    document.getElementById('defaultParagraphList').style.display = 'block';
    document.getElementById('customParagraphList').style.display = 'none';
});

document.querySelector('input[name="paragraphType"][value="custom"]').addEventListener('change', function() {
    document.getElementById('defaultParagraphList').style.display = 'none';
    document.getElementById('customParagraphList').style.display = 'block';
});

document.getElementById('startExam').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const testTime = document.getElementById('testTime').value;
    const paragraphType = document.querySelector('input[name="paragraphType"]:checked').value;
    const setWordLimit = document.getElementById('setWordLimit').checked;
    const wordLimit = document.getElementById('wordLimit').value;
    const backspace = document.getElementById('backspace').checked;
    const highlightAutoScroll = document.getElementById('highlightAutoScroll').checked;

    if (paragraphType === 'custom') {
        const selectedParagraphIndex = document.getElementById('customParagraphList').value;
        const customParagraphs = JSON.parse(localStorage.getItem('customParagraphs')) || [];
        if (customParagraphs.length === 0) {
            alert('No custom paragraphs found. Please upload a custom paragraph first.');
            return;
        }
        const text = customParagraphs[selectedParagraphIndex].content;
        startExam(text);
    } else if (paragraphType === 'default') {
        const selectedFileName = document.getElementById('defaultParagraphList').value;
        fetch(`defaultParagraphs/${selectedFileName}`)
            .then(response => response.text())
            .then(data => {
                startExam(data);
            })
            .catch(error => {
                console.error('Error loading default paragraph:', error);
            });
    }
    
    function startExam(text) {
        const examData = {
            name,
            testTime,
            text,
            setWordLimit,
            wordLimit,
            backspace,
            highlightAutoScroll
        };

        localStorage.setItem('examData', JSON.stringify(examData));
        window.location.href = 'exam.html';
    }
});

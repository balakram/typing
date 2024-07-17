document.addEventListener('DOMContentLoaded', function() {
    const customParagraphList = document.getElementById('customParagraphList');
    const defaultParagraphList = document.getElementById('defaultParagraphList');
    const customParagraphRadio = document.getElementById('customParagraph');
    const defaultParagraphRadio = document.getElementById('defaultParagraph');
    const enableWordLimitCheckbox = document.getElementById('setWordLimit');
    const wordLimitInput = document.getElementById('wordLimit');
    const startExamModeButton = document.getElementById('startExam');

    customParagraphRadio.addEventListener('change', function() {
        customParagraphList.style.display = 'inline';
        defaultParagraphList.style.display = 'none';
        loadCustomParagraphs();
    });

    defaultParagraphRadio.addEventListener('change', function() {
        defaultParagraphList.style.display = 'inline';
        customParagraphList.style.display = 'none';
        loadDefaultParagraphs();
    });

    enableWordLimitCheckbox.addEventListener('change', function() {
        wordLimitInput.disabled = !this.checked;
    });

    function loadDefaultParagraphs() {
        // Hardcoded list of default paragraph files. Adjust according to your project structure.
        const defaultParagraphFiles = [
            'paragraph (1).txt',
            'paragraph (2).txt',
            'paragraph (3).txt',
            'paragraph (4).txt',
            'paragraph (5).txt',
            'paragraph (6).txt',
            'paragraph (7).txt',
            'paragraph (8).txt',
            'paragraph (9).txt',
            'paragraph (10).txt'


        ];
        
        defaultParagraphList.innerHTML = '<option value="random">Random</option>';
        defaultParagraphFiles.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            defaultParagraphList.appendChild(option);
        });
    }

    function loadCustomParagraphs() {
        const customParagraphs = JSON.parse(localStorage.getItem('customParagraphs')) || [];
        customParagraphList.innerHTML = '';

        if (customParagraphs.length === 0) {
            alert('No custom paragraphs found. Please upload a custom paragraph bellow.');
            defaultParagraphRadio.checked = true;
            customParagraphList.style.display = 'none';
        } else {
            customParagraphs.forEach((paragraph, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${paragraph.heading} (Word Count: ${paragraph.wordCount})`;
                customParagraphList.appendChild(option);
            });
        }
    }

    loadCustomParagraphs();
    loadDefaultParagraphs();
});

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
    const enableBackspace = document.getElementById('enableBackspace').checked;
    const highlightAutoScroll = document.getElementById('highlightAutoScroll').checked;

    if (paragraphType === 'custom') {
        const selectedParagraphIndex = document.getElementById('customParagraphList').value;
        const customParagraphs = JSON.parse(localStorage.getItem('customParagraphs')) || [];
        if (customParagraphs.length === 0) {
            alert('No custom paragraphs found. Please upload a custom paragraph .');
            return;
        }
        const text = customParagraphs[selectedParagraphIndex].content;
        startExam(text);
    } else if (paragraphType === 'default') {
        const selectedFileName = document.getElementById('defaultParagraphList').value;
        if (selectedFileName === 'random') {
            const defaultParagraphFiles = [
                'paragraph (1).txt',
                'paragraph (2).txt',
                'paragraph (3).txt',
                'paragraph (4).txt',
                'paragraph (5).txt',
                'paragraph (6).txt',
                'paragraph (7).txt',
                'paragraph (8).txt',
                'paragraph (9).txt',
                'paragraph (10).txt',
                'paragraph (11).txt',
                'paragraph (12).txt',
                'paragraph (13).txt',
                'paragraph (14).txt',
                'paragraph (15).txt',
                'paragraph (16).txt',
                'paragraph (17).txt',
                'paragraph (18).txt',
                'paragraph (19).txt',
                'paragraph (20).txt',
                'paragraph (21).txt',
                'paragraph (22).txt',
                'paragraph (23).txt',
                'paragraph (24).txt',
                'paragraph (25).txt',
                'paragraph (26).txt',
                'paragraph (27).txt',
                'paragraph (28).txt',
                'paragraph (29).txt',
                'paragraph (30).txt',
                'paragraph (31).txt',
                'paragraph (32).txt',
                'paragraph (33).txt',
                'paragraph (34).txt',
                'paragraph (35).txt',
                'paragraph (36).txt',
                'paragraph (37).txt',
                'paragraph (38).txt',
                'paragraph (39).txt',
                'paragraph (40).txt',
                'paragraph (41).txt',
                'paragraph (42).txt',
                'paragraph (43).txt',
                'paragraph (44).txt',
                'paragraph (45).txt',
                'paragraph (46).txt',
                'paragraph (47).txt',
                'paragraph (48).txt',
                'paragraph (49).txt',
                'paragraph (50).txt',
                'paragraph (51).txt',
                'paragraph (52).txt',
                'paragraph (53).txt',
                'paragraph (54).txt',
                'paragraph (55).txt',
                'paragraph (56).txt',
                'paragraph (57).txt',
                'paragraph (58).txt',
                'paragraph (59).txt',
                'paragraph (60).txt'
                

                
            ];
            const randomFile = defaultParagraphFiles[Math.floor(Math.random() * defaultParagraphFiles.length)];
            fetch(`defaultParagraphs/${randomFile}`)
                .then(response => response.text())
                .then(data => {
                    startExam(data);
                })
                .catch(error => {
                    console.error('Error loading default paragraph:', error);
                });
        } else {
            fetch(`defaultParagraphs/${selectedFileName}`)
                .then(response => response.text())
                .then(data => {
                    startExam(data);
                })
                .catch(error => {
                    console.error('Error loading default paragraph:', error);
                });
        }
    }
    
    function startExam(text) {
        const examData = {
            name,
            testTime,
            text,
            setWordLimit,
            wordLimit,
            enableBackspace,
            highlightAutoScroll
        };

        localStorage.setItem('examData', JSON.stringify(examData));
        window.location.href = 'exam.html';
    }


    
});

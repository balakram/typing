document.addEventListener('DOMContentLoaded', function() {
    const customParagraphList = document.getElementById('customParagraphList');
    const defaultParagraphList = document.getElementById('defaultParagraphList');
    const customParagraphRadio = document.getElementById('customParagraph');
    const defaultParagraphRadio = document.getElementById('defaultParagraph');
    const enableWordLimitCheckbox = document.getElementById('setWordLimit');
    const wordLimitInput = document.getElementById('wordLimit');
    const startExamModeButton = document.getElementById('startExam');
    const uploadButton = document.getElementById('uploadButton');
    const uploadFileInput = document.getElementById('uploadFile');
    const wordCountDiv = document.getElementById('wordCount');

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
        
        defaultParagraphList.innerHTML = '';
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
            alert('No custom paragraphs found. Please upload a custom paragraph first.');
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
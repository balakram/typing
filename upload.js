document.getElementById('uploadButton').addEventListener('click', function() {
    const heading = document.getElementById('heading').value;
    const content = document.getElementById('content').value;

    if (!heading || !content) {
        alert('Both fields are required.');
        return;
    }

    let customParagraphs = JSON.parse(localStorage.getItem('customParagraphs')) || [];

    if (customParagraphs.length >= 30) {
        alert('You have reached the maximum number of custom paragraphs.');
        return;
    }

    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

    customParagraphs.push({ heading, content, wordCount });
    localStorage.setItem('customParagraphs', JSON.stringify(customParagraphs));

    document.getElementById('heading').value = '';
    document.getElementById('content').value = '';
    document.getElementById('wordCount').innerText = 'Word Count: 0';

    document.getElementById('paragraphCount').innerText = `[Max 30] (${customParagraphs.length} saved)`;
    renderParagraphList();
    alert('Custom paragraph uploaded successfully.');
});

function renderParagraphList() {
    const customParagraphs = JSON.parse(localStorage.getItem('customParagraphs')) || [];
    const paragraphList = document.getElementById('paragraphList');
    paragraphList.innerHTML = '';
    customParagraphs.forEach((paragraph, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${paragraph.heading}</strong>
            <p>${paragraph.content}</p>
            <p>Word Count: ${paragraph.wordCount}</p>
            <button onclick="deleteParagraph(${index})">Delete</button>
        `;
        paragraphList.appendChild(listItem);
    });
}

function deleteParagraph(index) {
    let customParagraphs = JSON.parse(localStorage.getItem('customParagraphs')) || [];
    customParagraphs.splice(index, 1);
    localStorage.setItem('customParagraphs', JSON.stringify(customParagraphs));
    document.getElementById('paragraphCount').innerText = `[Max 30] (${customParagraphs.length} saved)`;
    renderParagraphList();
}

document.getElementById('content').addEventListener('input', function() {
    const content = document.getElementById('content').value;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('wordCount').innerText = `Word Count: ${wordCount}`;
});

document.addEventListener('DOMContentLoaded', function() {
    renderParagraphList();
    const customParagraphs = JSON.parse(localStorage.getItem('customParagraphs')) || [];
    document.getElementById('paragraphCount').innerText = `[Max 30] (${customParagraphs.length} saved)`;
});

document.addEventListener('DOMContentLoaded', function() {
    const examData = JSON.parse(localStorage.getItem('examData'));
    document.getElementById('userName').innerText = examData.name;
    document.getElementById('timer').innerText = `${examData.testTime < 10 ? '0' : ''}${examData.testTime}:00`;
    document.getElementById('paragraph').innerText = examData.text;

    let timer = examData.testTime * 60;
    const interval = setInterval(() => {
        timer--;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        document.getElementById('timer').innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timer <= 0) {
            clearInterval(interval);
            calculateResults();
        }
    }, 1000);

    document.getElementById('submit').addEventListener('click', function() {
        clearInterval(interval);
        calculateResults();
    });

    function calculateResults() {
        const typedText = document.getElementById('typingArea').value;
        const originalText = examData.text;
        const typedWords = typedText.split(' ').filter(word => word !== '');
        const originalWords = originalText.split(' ').filter(word => word !== '');

        const gwpm = typedWords.length / (examData.testTime / 60);
        const errors = originalWords.filter((word, index) => typedWords[index] !== word).length;
        const nwpm = (typedWords.length - errors) / (examData.testTime / 60);
        const errorRate = errors / (examData.testTime / 60);
        const accuracy = ((typedWords.length - errors) / typedWords.length) * 100;

        document.getElementById('gwpm').innerText = gwpm.toFixed(2);
        document.getElementById('wpm').innerText = nwpm.toFixed(2);
        document.getElementById('errorRate').innerText = errorRate.toFixed(2);
        document.getElementById('accuracy').innerText = accuracy.toFixed(2) + '%';

        document.getElementById('results').style.display = 'block';
    }
});

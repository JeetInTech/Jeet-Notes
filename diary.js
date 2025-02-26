// Save and close diary entry
document.getElementById('save-diary').addEventListener('click', () => {
    let title = document.getElementById('diary-title').value;
    let content = document.getElementById('diary-content').value;
    let date = document.getElementById('diary-date').value;
    if (title && content) {
        window.opener.saveDiaryEntry(title, content, date);
    }
    window.close();
});
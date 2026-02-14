document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const response = await fetch('http://localhost:3000/files', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.ok) {
        const files = await response.json();
        if (Array.isArray(files)) {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';

            files.forEach(file => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `http://localhost:3000/uploads/${file.filename}`;
                a.textContent = file.originalname;
                a.download = file.originalname;
                li.appendChild(a);
                fileList.appendChild(li);
            });
        } else {
            console.error('Expected an array but received:', files);
        }
    } else {
        console.error('Failed to fetch files');
    }
});

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);

    const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (response.ok) {
        window.location.reload();
    } else {
        console.error('Upload failed');
    }
});

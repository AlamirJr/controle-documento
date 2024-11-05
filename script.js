document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('documentForm');
    const docTable = document.querySelector('#docTable tbody');
    const searchInput = document.getElementById('search');
    const saveJsonBtn = document.getElementById('saveJson');
    const loadJsonInput = document.getElementById('loadJson');
    const loadBtn = document.getElementById('loadBtn');
    let documents = [];
    let editIndex = -1; // Indica se estamos editando um documento

    // Adiciona documento à lista
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const docNumber = document.getElementById('docNumber').value;
        const docType = document.getElementById('docType').value;
        const docSender = document.getElementById('docSender').value;
        const docDate = document.getElementById('docDate').value;

        if (editIndex === -1) {
            const documentData = {
                number: docNumber,
                type: docType,
                sender: docSender,
                date: docDate
            };

            documents.push(documentData);
        } else {
            // Edita documento existente
            documents[editIndex] = {
                number: docNumber,
                type: docType,
                sender: docSender,
                date: docDate
            };
            editIndex = -1; // Reseta o índice de edição
        }

        updateTable();
        form.reset();
    });

    // Atualiza a tabela com os documentos
    function updateTable() {
        docTable.innerHTML = '';

        documents.forEach((doc, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.number}</td>
                <td>${doc.type}</td>
                <td>${doc.sender}</td>
                <td>${doc.date}</td>
                <td>
                    <button class="editBtn">Editar</button>
                    <button class="deleteBtn">Excluir</button>
                </td>
            `;
            docTable.appendChild(row);
        });

        // Adiciona eventos aos botões de editar e excluir
        document.querySelectorAll('.editBtn').forEach((button, index) => {
            button.addEventListener('click', () => editDocument(index));
        });

        document.querySelectorAll('.deleteBtn').forEach((button, index) => {
            button.addEventListener('click', () => deleteDocument(index));
        });
    }

    // Edita o documento
    function editDocument(index) {
        const doc = documents[index];
        document.getElementById('docNumber').value = doc.number;
        document.getElementById('docType').value = doc.type;
        document.getElementById('docSender').value = doc.sender;
        document.getElementById('docDate').value = doc.date;
        editIndex = index; // Armazena o índice do documento sendo editado
    }

    // Exclui o documento
    function deleteDocument(index) {
        if (confirm('Você tem certeza que deseja excluir este documento?')) {
            documents.splice(index, 1); // Remove o documento do array
            updateTable(); // Atualiza a tabela
        }
    }

    // Filtra os documentos com base na busca
    searchInput.addEventListener('input', function () {
        const filter = searchInput.value.toLowerCase();
        const filteredDocuments = documents.filter(doc => doc.type.toLowerCase().includes(filter));
        displayFilteredDocuments(filteredDocuments);
    });

    function displayFilteredDocuments(filteredDocuments) {
        docTable.innerHTML = '';

        filteredDocuments.forEach(doc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.number}</td>
                <td>${doc.type}</td>
                <td>${doc.sender}</td>
                <td>${doc.date}</td>
                <td>
                    <button class="editBtn">Editar</button>
                    <button class="deleteBtn">Excluir</button>
                </td>
            `;
            docTable.appendChild(row);
        });

        // Adiciona eventos aos botões de editar e excluir
        document.querySelectorAll('.editBtn').forEach((button, index) => {
            button.addEventListener('click', () => editDocument(index));
        });

        document.querySelectorAll('.deleteBtn').forEach((button, index) => {
            button.addEventListener('click', () => deleteDocument(index));
        });
    }

    // Função para salvar os dados em um arquivo JSON
    saveJsonBtn.addEventListener('click', function () {
        const dataStr = JSON.stringify(documents, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documentos.json';
        a.click();
    });

    // Função para carregar dados de um arquivo JSON
    loadBtn.addEventListener('click', function () {
        const file = loadJsonInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                documents = JSON.parse(content);
                updateTable();
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecione um arquivo JSON.');
        }
    });
});

let peopleData = [];

const formPeopleData =  document.getElementById("form-people-data");
formPeopleData.addEventListener('submit', function(event) {
    event.preventDefault();// evita que la página recargue

    const formData  = new FormData(formPeopleData);
    // const firstName = formData.get('first-name'); // Usa el 'name' del input
    // const lastName  = formData.get('last-name'); 
    // const phone     = formData.get('phone'); 
    // const country   = formData.get('country'); 
    // const state     = formData.get('state'); 
    // const zipCode   = formData.get('zip-code');
    
    //Convierte los dato que vienen del formulario en un objeto (Objeto iterable).
    const objectData = Object.fromEntries(formData.entries());
    peopleData.push(objectData);

    renderContactsTable();
    //console.log(peopleData);
});

function renderContactsTable(){
    const tableBody = document.getElementById('body-table-personal-information');
    tableBody.innerHTML = peopleData.map(person =>`
        <tr>
            <td>${person['first-name']}</td>
            <td>${person['last-name']}</td>
            <td>${person['phone']}</td>
            <td>${person['country']}</td>
            <td>${person['state']}</td>
            <td>${person['zip-code']}</td>
            <td>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-primary btn-sm" title="Editar contacto" data-bs-toggle="tooltip" data-bs-placement="top">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button type="button" class="btn btn-success btn-sm" title="Actualizar contacto" data-bs-toggle="tooltip" data-bs-placement="top">
                    <i class="bi bi-arrow-repeat"></i>
                  </button>
                  <button type="button" class="btn btn-danger btn-sm" title="Eliminar contacto" data-bs-toggle="tooltip" data-bs-placement="top">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
            </td>
        </tr>
    `).join('');
    clearFormPeopleData();
}

function clearFormPeopleData(){
    const clearForm = document.getElementById('form-people-data');
    
    // 1. Resetear valores
    clearForm.reset();

    // 2. Quitar la clase general de Bootstrap
    clearForm.classList.remove('was-validated');

    // 3. Limpiar estilos de validación en cada input/select/textarea
    const inputs = clearForm.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
}
//*******************************//
// PeopleController.js          *//
// Create by Maikol Jiménez M.  *//
// Date: 7 Oct 2025.            *//
//*******************************//
'use strict';
const peopleData     = []; // array que guarda los contactos.
let formElement      = null;
let positionToUpdate = 0;

//activar evento de alertas de los campos del formulario en caso de que queden vacios.
document.addEventListener('DOMContentLoaded', () => {
  formElement = document.getElementById('form-people-data');
  if (!formElement) {
    console.warn('PeopleController: form #form-people-data no encontrado.');
    return;
  }
  formElement.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
  event.preventDefault();
  // Si el formulario NO es válido: mostrar validación y salir (no guardar).
  if (!formElement.checkValidity()) {
    formElement.classList.add('was-validated');
    return;
  }
  // Formulario válido -> evitar que otros submit-listeners (p. ej. el listener global de Bootstrap)
  // se ejecuten después y re-activen la validación/alertas.
  event.stopImmediatePropagation();
  // Obtener datos y guardarlos (recoge todos los pares nombre-valor de los inputs (name="...").
  //convierte esos pares en un objeto plano: {campo1: "valor1", campo2: "valor2", ...}).
  const dataObject = Object.fromEntries(new FormData(formElement).entries());
  peopleData.push(dataObject);
  // Actualizar la tabla.
  renderContactsTable();
  // Limpiar formulario y quitar cualquier rastro de validación.
  clearFormAndValidation(formElement);
  // Opcional: enfocar el primer campo para mejor UX.
  const firstField = formElement.querySelector('input, select, textarea');
  if (firstField) firstField.focus();
}

function renderContactsTable() {
  const tableBody = document.getElementById('body-table-personal-information');
  tableBody.innerHTML = peopleData.map((person, index) =>{
    return `
      <tr>
        <td>${escapeHtml(person['firstname'] || '')}</td>
        <td>${escapeHtml(person['lastname'] || '')}</td>
        <td>${escapeHtml(person['phone'] || '')}</td>
        <td>${escapeHtml(person['country'] || '')}</td>
        <td>${escapeHtml(person['state'] || '')}</td>
        <td>${escapeHtml(person['zipcode'] || '')}</td>
        <td>
          <div class="btn-group" role="group">
            <button type="button"
                    class="btn btn-primary btn-sm btn-edit"
                    data-action="edit"
                    data-index="${index}"
                    title="Edit contact"
                    data-bs-toggle="tooltip" data-bs-placement="top">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button type="button"
                    class="btn btn-danger btn-sm btn-delete"
                    data-action="delete"
                    data-index="${index}"
                    title="Delete contact"
                    data-bs-toggle="tooltip" data-bs-placement="top">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');
  // Inicializa tooltips para los nuevos botones si Bootstrap está disponible.
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const newTooltipTriggers = tableBody.querySelectorAll('[data-bs-toggle="tooltip"]');
    Array.from(newTooltipTriggers).forEach(el => new bootstrap.Tooltip(el));
  }
}

function clearFormAndValidation(form) {
  // 1) Reset de valores.
  form.reset();
  // 2) Quitar la clase global de validación.
  form.classList.remove('was-validated');
  // 3) Quitar clases individuales de cada control.
  const controls = form.querySelectorAll('.form-control, .form-select, input, select, textarea');
  controls.forEach(control => {
    control.classList.remove('is-valid', 'is-invalid');
    control.removeAttribute('aria-invalid'); // opcional, limpia atributos.
  });
}

// Pequeña utilidad para escapar texto entre el código y evitar inyección cuando rellenamos la tabla
// https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;') //Representación del caracter amperson(y) en un código que representará un texto dentro de la app, 
    .replace(/</g, '&lt;')  //Representación del caracter menor (<).
    .replace(/>/g, '&gt;')  //Representación del caracter mayor (>).
    .replace(/"/g, '&quot;')//Representación del caracter comilla doble (").
    .replace(/'/g, '&#39;');//Representación del caracter comilla simple (').
}

const deleteContact = (index, btn) =>{
  // Oculta el tooltip del botón que clickeaste (si está visible)
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
      const inst = bootstrap.Tooltip.getInstance(btn);
      inst?.hide();
    }
    //Confirmar y eliminar
    if (confirm('¿En verdad desea ELIMINAR ❌ este contacto?')) {
      peopleData.splice(index, 1);
      renderContactsTable(); // refrescar la tabla
    }
};

const updateFormPeopleData =  document.getElementById("update-form-people-data");
updateFormPeopleData.addEventListener('submit', function(event) {
  event.preventDefault(); // evita recarga

  peopleData[positionToUpdate].firstname = document.getElementById('update-form-firstname').value;
  peopleData[positionToUpdate].lastname  = document.getElementById('update-form-lastname').value;
  peopleData[positionToUpdate].phone     = document.getElementById('update-form-phone').value;
  peopleData[positionToUpdate].country   = document.getElementById('update-form-contry').value;
  peopleData[positionToUpdate].state     = document.getElementById('update-form-state').value;
  peopleData[positionToUpdate].zipcode   = document.getElementById('update-form-zipcode').value;
  
  // Cierra el modal (seguro y directo)
  const modalToUpdate = document.getElementById('edit-contact-info-modal');
  bootstrap.Modal.getOrCreateInstance(modalToUpdate).hide();
  
  renderContactsTable(); // refrescar la tabla
  positionToUpdate = 0;
  
});

const editContact = (index) => {
  document.getElementById('update-form-firstname').value = peopleData[index].firstname;
  document.getElementById('update-form-lastname').value  = peopleData[index].lastname;
  document.getElementById('update-form-phone').value     = peopleData[index].phone;
  document.getElementById('update-form-contry').value    = peopleData[index].country;
  document.getElementById('update-form-state').value     = peopleData[index].state;
  document.getElementById('update-form-zipcode').value   = peopleData[index].zipcode;
  
  const modal = new bootstrap.Modal(document.getElementById('edit-contact-info-modal'));
  modal.show();
  positionToUpdate = index;
};

// Acá con el "tableBodyDataPeople.addEventListener" se determina que boton de la tabla y perteneciente 
// a que registro exactamente se le dio click para proceder a eliminar o editar dicho registro del arreglo peopleData
const tableBodyDataPeople = document.getElementById('body-table-personal-information');
tableBodyDataPeople.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action][data-index]');
  
  const action = btn.dataset.action;// determina si fue al boton de "edit" o "delete" al que se de dio click
  const index  = Number(btn.dataset.index);
  
  if (action === 'edit') {
    editContact(index);
    
  }
  if (action === 'delete') {
    deleteContact(index, btn);
  }
});

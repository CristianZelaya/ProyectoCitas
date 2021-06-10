// Seleccion de formularios
const formulario       = document.querySelector('#nueva-cita');

// Selectores y variables de los input
const mascotaInput     = document.querySelector('#mascota'),
      propietarioInput = document.querySelector('#propietario'),
      telefonoInput    = document.querySelector('#telefono'),
      fechaInput       = document.querySelector('#fecha'),
      horaInput        = document.querySelector('#hora'),
      sintomasInput    = document.querySelector('#sintomas');

const contenedorCitas = document.querySelector('#citas');
let edicion;
let citas = [];

// Registrar eventos
const eventListeners = () => {

    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);

    document.addEventListener('DOMContentLoaded', () => {

        citas = JSON.parse(localStorage.getItem('cita')) || [];
        ui.imprimirCita({citas});
        administrarCita.cargarCita(citas);
    
    });

}

// Clases
// Crea una nueva cita
class Cita {

    constructor() {

        this.citas = [];

    }

    cargarCita( citas ) {

        this.citas = citas;

    }

    sincronizarCita() {

        localStorage.setItem('cita', JSON.stringify(this.citas));
    
    }

    agregarCita( citaObj ) {

        this.citas = [...this.citas, citaObj];
        this.sincronizarCita();

    }

    eliminarCita( id ) {

        this.citas = this.citas.filter(cita => cita.id !== id );
        this.sincronizarCita();

    }

    editarCita( citaActualizada ) {

        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
        this.sincronizarCita();

    }

}

// Interfaz de Usuario UI
class UI {

    imprimirAlerta( mensaje, tipo ) {

        // Crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase
        if ( tipo === 'error') {

            divMensaje.classList.add('alert-danger');

        } else {

            divMensaje.classList.add('alert-success');

        }

        // Insertar mensaje
        divMensaje.innerHTML = mensaje;

        // Mostrar el mensaje en el html
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta
        setTimeout(() => {

            divMensaje.remove();
            
        }, 3000);

    }

    imprimirCita( {citas} ) {

        limpiarHtml();
        
        citas.forEach( cita => {

            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elemntos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.innerHTML = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `;

            // Crear btnElimina
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            btnEliminar.onclick = () => eliminarCita(id);

            // Boton para editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>';
            btnEditar.onclick = () => cargarEdicion( cita );

            // Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar el divCita al contendedor de cita
            contenedorCitas.appendChild(divCita);
        });
        
    }

}

const ui = new UI();
const administrarCita = new Cita();

// Objeto de citas
const citaObj = {

    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''

}

// Llena el objeto de cita
const datosCita = (e) => {

    citaObj[e.target.name] = e.target.value;

}

const nuevaCita = (e) => {

    e.preventDefault();

    // Extraer la informacion del objeto de cita

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if ( edicion ) {

        ui.imprimirAlerta('Editado Correctamente');

        // Pasar cita editada
        administrarCita.editarCita({...citaObj});

        // Cambiar texto de boton
        formulario.querySelector('button[type="submit"]').innerHTML = 'Crear Cita';
        
        edicion = false;


    } else {

        // Generar id
        citaObj.id = Date.now();

        ui.imprimirAlerta('Se registro la cita correctamente');

        // Agrega la cita al array
        administrarCita.agregarCita({...citaObj});
        
    }

    // Reinicio el formulario
    formulario.reset();

    // Reiniciar Objeto
    reiniciarObj();

    console.log(administrarCita);

    // Mostrar citas html
    ui.imprimirCita(administrarCita);

}

const reiniciarObj = () => {

    citaObj.mascota = '',
    citaObj.propietario = '',
    citaObj.telefono = '',
    citaObj.fecha = '',
    citaObj.hora = '',
    citaObj.sintomas = ''

}

const limpiarHtml = () => {

    while (contenedorCitas.firstChild) {

        contenedorCitas.removeChild(contenedorCitas.firstChild);
        
    }

}

const eliminarCita = ( id ) => {

    // Eliminar cita
    administrarCita.eliminarCita(id);

    // Muestra un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    // Refrescar el html
    ui.imprimirCita(administrarCita);


}

// Carga los datos y el modo edicion
const cargarEdicion = ( cita ) => {

    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // LLenar los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar texto de boton
    formulario.querySelector('button[type="submit"]').innerHTML = 'Guardar Cambios';

    edicion = true;

}

eventListeners();
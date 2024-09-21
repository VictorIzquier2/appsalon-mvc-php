let paso = 1;

const cita = {
  id: '',
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}

document.addEventListener('DOMContentLoaded', ()=> {
  iniciarApp();
});

const iniciarApp = ()=>{
  tabs(); // Cambia la sección cuando se presionan los tabs 
  mostrarSeccion(); // Muestra y oculta la secciones
  paginador(); // Agrega o quita los botones del paginador 
  paginaSiguiente();
  paginaAnterior();

  consultarAPI(); // Consulta la API en el backend de PHP 

  idCliente(); // Añade el id del cliente al objeto de cita
  nombreCliente(); // Añade el nombre del cliente al objeto de cita
  seleccionarFecha(); // Añade la fecha de la cita en el objeto de cita
  seleccionarHora(); // Añade la hora de la cita en el objeto de cita

  mostrarResumen(); // Muestra el resumen de la cita 
}

const mostrarSeccion = ()=> {
  const botones = document.querySelectorAll('.tabs button');
  const secciones = document.querySelectorAll('.seccion');
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  
  // Ocultar la secciones que tengan la clase mostrar
  secciones.forEach(seccion =>{
    seccion.classList.remove('mostrar');
  });
  // Seleccionar la sección con el paso
  seccion.classList.add('mostrar');

  // Resaltar el tab actual
  botones.forEach(boton=>{
    boton.classList.remove('actual');
  })
  tab.classList.add('actual');
}

const tabs = ()=>{
  const botones = document.querySelectorAll('.tabs button');
  
  botones.forEach(boton => {
    boton.addEventListener('click', (e)=> {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      paginador();
    })
  })
}

const paginador = ()=>{
  const anterior = document.querySelector('#anterior');
  const siguiente = document.querySelector('#siguiente');

  switch (paso) {
    case 1:
      anterior.classList.add('ocultar');
      siguiente.classList.remove('ocultar');
      break;
    case 2:
      anterior.classList.remove('ocultar');
      siguiente.classList.remove('ocultar');
      break;
    case 3:
      anterior.classList.remove('ocultar');
      siguiente.classList.add('ocultar');
      mostrarResumen();
      break;
    default:
      anterior.classList.add('ocultar');
      siguiente.classList.remove('ocultar');
      break;
  }
  mostrarSeccion();
}

const paginaAnterior = ()=> {
  const anterior = document.querySelector('#anterior');
  anterior.addEventListener('click', ()=>{
    if(paso > 0){ paso--; }
    paginador();
  });
}

const paginaSiguiente = ()=> {
  const siguiente = document.querySelector('#siguiente');
  siguiente.addEventListener('click', ()=>{
    if(paso < 3){ paso++; }
    paginador();
  });

}

const consultarAPI = async ()=> {
  try{
    const url = `${location.origin}/api/servicios`;
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
    
  } catch(error){
    console.log(error);
  }
}

const mostrarServicios = (servicios)=>{
  servicios.forEach(servicio=>{
    const {id, nombre, precio} = servicio;
    const nombreServicio = document.createElement('p');
    const precioServicio = document.createElement('p');
    const servicioDiv = document.createElement('div');
    const servicios = document.querySelector('#servicios');

    nombreServicio.classList.add('nombre-servicio');
    nombreServicio.textContent = nombre;

    precioServicio.classList.add('precio-servicio');
    precioServicio.textContent = "$" + precio;

    servicioDiv.classList.add('servicio');
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = ()=>{
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    servicios.appendChild(servicioDiv);
  });
}

const seleccionarServicio = (servicio)=> {
  const { id } = servicio;
  const {servicios } = cita;
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  // Comprobar si un servicio ya fue agregado 
  if(servicios.some(agregado => agregado.id === id)) {
    // Eliminarlo
    cita.servicios = servicios.filter(agregado=> agregado.id !== id);
    divServicio.classList.remove('seleccionado');
  } else {
    // Agregarlo
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add('seleccionado');
  }
}

const idCliente = ()=> {

  const id = document.querySelector('#id').value;
  cita.id = id;
} 

const nombreCliente = ()=> {

  const nombre = document.querySelector('#nombre').value;
  cita.nombre = nombre;
}

const seleccionarFecha = ()=> {
  const inputFecha = document.querySelector('#fecha');
  let dia;

  inputFecha.addEventListener('input', (e)=> {
    dia = new Date(e.target.value).getUTCDay();
    if([6, 0].includes(dia)){
      e.target.value = '';
      mostrarAlerta('error', '.formulario', 'Sábados y Domingos no abrimos');
    } else{
      cita.fecha = e.target.value;
    }
  });
}

const seleccionarHora = ()=> {
  const inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', (e)=> {
    const reloj = e.target.value;
    const hora = reloj.split(":")[0];
    if(hora < 10 || hora > 18){
      e.target.value = '';
      mostrarAlerta('error', '.formulario', 'Hora no válida')
    }else{
      cita.hora = reloj;
    }
  });  
}

const mostrarAlerta = (tipo, elemento, mensaje, desaparece = true )=> {
  const alerta = document.createElement('div');
  const previa = document.querySelector('.alerta');
  const elementoHTML = document.querySelector(elemento);

  if(previa) previa.remove();
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  alerta.classList.add(tipo);
  elementoHTML.appendChild(alerta);

  if(desaparece){
    setTimeout(()=> {
      alerta.remove();
    }, 3000);
  }
}

const mostrarResumen = ()=> {
  const resumen = document.querySelector('.contenido-resumen');

  // Limpiar el Contenido de Resumen 
  while(resumen.firstChild){
    resumen.removeChild(resumen.firstChild);
  }

  if(Object.values(cita).includes('') || cita.servicios.length === 0){
    mostrarAlerta('error', '.contenido-resumen', 'Hacen falta datos o Servicios', false);
    return;
  } 

  // Formatear el div de Resumen 
  const {nombre, fecha, hora, servicios} = cita;
  const nombreCliente = document.createElement('p');
  const fechaCita = document.createElement('p');
  const horaCita = document.createElement('p');
    
  // Heading para servicios en Resumen 
  const headingServicios = document.createElement('h3');
  headingServicios.textContent = 'Resumen de Servicios';
  resumen.appendChild(headingServicios);

  servicios.forEach(servicio => {
    const {id, precio, nombre} = servicio;
    const contenedorServicio = document.createElement('div');
    const textoServicio = document.createElement('p');
    const precioServicio = document.createElement('p');

    contenedorServicio.classList.add('contenedor-servicio');
    textoServicio.textContent = nombre;
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  // Heading para cita en Resumen 
  const headingCita = document.createElement('h3');
  headingCita.textContent = 'Resumen de Cita';
  resumen.appendChild(headingCita);

  // Formatear la fecha en español 
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.getMonth();
  const anho = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(anho, mes, dia));
  const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  const fechaFormato = fechaUTC.toLocaleDateString('es-ES', opciones);

  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormato}`;
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

  // Boton para Crear una cita 
  const botonReservar = document.createElement('button');
  botonReservar.classList.add('boton');
  botonReservar.textContent = 'Reservar Cita';
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(botonReservar);
}

const reservarCita = async ()=> {
  const {fecha, hora, servicios, id} = cita;
  const idServicios = servicios.map(servicio => servicio.id)
  
  const datos = new FormData();
  datos.append('fecha', fecha);
  datos.append('hora', hora);
  datos.append('servicios', idServicios);
  datos.append('usuario_id', id);

  try {
    // Peticion hacia la API 
    const url = `${location.origin}/api/citas`;
    const respuesta = await fetch(url, {
      method: 'POST',
      body: datos  
    });
  
    const resultado = await respuesta.json();
    
    if(resultado.resultado){
      Swal.fire({
        icon: 'success',
        title: 'Cita Creada',
        text: 'Tu cita fue creada correctamente',
        button: 'Ok'
      }).then(()=> {
        window.location.reload();
      })
    }
  } catch (error) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar la cita',
        button: 'Ok'
      })
  }
}
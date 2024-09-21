document.addEventListener('DOMContentLoaded', ()=> {
  iniciarApp();
});

const iniciarApp = ()=> {
  buscarFecha();
}

const buscarFecha = ()=> {
  const fechaInput = document.querySelector('#fecha');

  fechaInput.addEventListener('input', (e)=> {
    const fechaSelecionada = e.target.value;
    window.location = `?fecha=${fechaSelecionada}`;
  })
}
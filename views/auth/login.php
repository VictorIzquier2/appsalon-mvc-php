<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Inicia sesión con tus datos</p>

<?php
  include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="formulario" method="POST" action="/">

  <div class="campo">
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email"
      placeholder="Tu Email"
      name="email"
      value="<?php echo sanitizar($auth->email); ?>"
    />
  </div>

  <div class="campo">
    <label for="password">Password</label>
    <input 
      type="password"
      id="password"
      placeholder="Tu Password"
      name="password"
      value="<?php echo sanitizar($auth->password); ?>"
    />
  </div>

  <input type="submit" value="Iniciar Sesión" class="boton" />

</form>

<div class="acciones">
  <a href="/crear-cuenta">¿Aún no tienes una cuenta? Obtener una</a>
  <a href="/olvide">¿Olvidaste tu password?</a>
</div>


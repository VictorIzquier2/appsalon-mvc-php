<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function sanitizar($html) : string {
    $sanitizado = htmlspecialchars($html);
    return $sanitizado;
}

// Funciones que revisa que el usuario esté autentificado 
function isAuth() {
    
    if(!isset($_SESSION['login'])){
        header('Location: /');
    }

}

function isAdmin(): void{
    if(!isset($_SESSION['admin'])){
        header('Location: /');
    }
}

function esUltimo(string $actual, string $proximo): bool {
    if($actual !== $proximo){
        return true;
    }else{
        return false;
    }
}
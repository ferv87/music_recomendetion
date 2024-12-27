let agregarCancionButton = document.getElementById("agregarCancion");

let obtenerCancionButton = document.getElementById("cancionAleatoria");


agregarCancionButton.addEventListener('click', async () => {
    let nombre = document.getElementById("nombre_cancion").value;
    let artista = document.getElementById("artista_cancion").value;
    let url = document.getElementById("url_cancion").value;

    const validacionNombre = validarNombreCancion(nombre);
    const validacionArtista = validarNombreArtista(artista);
    const validacionURL = validarURL(url);

    if (!validacionNombre.valido) {
        mostrarError('nombre_cancion', validacionNombre.mensaje);
        return;
    }

    if (!validacionArtista.valido) {
        mostrarError('artista_cancion', validacionArtista.mensaje);
        return;
    }

    if (!validacionURL.valido) {
        mostrarError('url_cancion', validacionURL.mensaje);
        return;
    }

    try {
        const body = JSON.stringify({ 
            nombre: validacionNombre.valor, 
            artista: validacionArtista.valor, 
            url_video: url, 
            votes: 0 
        });

        const response = await fetch('http://localhost:3000/canciones', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        if (response.status === 201) {
            alert('Canción agregada exitosamente');
            limpiarFormulario();
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Error al guardar la canción");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Error al procesar la solicitud");
    }
})

obtenerCancionButton.addEventListener('click', async () => {
    let response = await fetch('http://localhost:3000/canciones', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    let cancion = await response.json();

    templateCancionAleatoria(cancion)
})

function templateCancionAleatoria(data) {
    let template = document.querySelector('.random-template');
    let card = document.getElementById('recomendacionAleatoria');

    let clonedTemplate = template.content.cloneNode(true);

    let id = clonedTemplate.querySelector('.random-id');
    let titulo = clonedTemplate.querySelector('.random-name');
    let subtitulo = clonedTemplate.querySelector('.random-artist');
    let texto = clonedTemplate.querySelector('.random-url');
    let vote = clonedTemplate.querySelector('.random-vote');

    id.style.display = 'none';

    id.textContent = data._id;
    titulo.textContent = data.nombre;
    subtitulo.textContent = data.artista;
    texto.href = data.url_video;

    card.appendChild(clonedTemplate);

    vote.addEventListener('click', async (req, res) => {

        let voteId = id.textContent;

        let voteCount = 1;

        let response = await fetch('http://localhost:3000/canciones/', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ _id: voteId, votes: voteCount })
        });

        const responseData = await response.json();
        console.log('Response data:', responseData);

        let status = await response.status;

        if (response.status == 200) {
            vote.setAttribute('disabled', '');
            alert(status);
        } else {
            alert("Response no ok");
        }
    })
}

function validarURL(url){
    try {
        const urlObj = new URL(url);
        
        const patterns = [
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/,
            /^(https?:\/\/)?(www\.)?youtu\.be\/[a-zA-Z0-9_-]{11}$/
        ];

        const esValida = patterns.some(pattern => pattern.test(url));

        if (!esValida) {
            return {
                valido: false,
                mensaje: "La URL debe ser un enlace válido de YouTube"
            };
        }

        let videoId;
        if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        } else if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.slice(1);
        }

        return {
            valido: true,
            valor: url,
            videoId: videoId,
            mensaje: "URL válida"
        };

    } catch (error) {
        return {
            valido: false,
            mensaje: "URL mal formada"
        };
    }
}

function validarNombreCancion(nombre) {
    nombre = nombre.trim();
    
    if (nombre.length < 1 || nombre.length > 100) {
        return {
            valido: false,
            mensaje: "Ingrese un nombre válido"
        };
    }

    if (!/[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/.test(nombre)) {
        return {
            valido: false,
            mensaje: "Ingrese un nombre válido"
        };
    }

    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-&()'".]+$/.test(nombre)) {
        return {
            valido: false,
            mensaje: "Ingrese un nombre válido"
        };
    }

    return {
        valido: true,
        valor: nombre,
        mensaje: ""
    };
}

function validarNombreArtista(artista) {

    artista = artista.trim();
    
    if (artista.length < 1 || artista.length > 50) {
        return {
            valido: false,
            mensaje: "Ingrese un artista"
        };
    }

    if (!/[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/.test(artista)) {
        return {
            valido: false,
            mensaje: "Ingrese un artista"
        };
    }

    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-&]+$/.test(artista)) {
        return {
            valido: false,
            mensaje: "Ingrese un artista"
        };
    }

    return {
        valido: true,
        valor: artista,
        mensaje: ""
    };
}

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    input.classList.add('is-invalid');
    
    let feedbackDiv = input.nextElementSibling;
    if (!feedbackDiv || !feedbackDiv.classList.contains('invalid-feedback')) {
        feedbackDiv = document.createElement('span');
        feedbackDiv.className = 'invalid-feedback';
        input.parentNode.insertBefore(feedbackDiv, input.nextSibling);
    }
    feedbackDiv.textContent = mensaje;
}

function limpiarMensajesError() {
    const inputs = ['nombre_cancion', 'artista_cancion', 'url_cancion'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.classList.remove('is-invalid');
        const feedbackDiv = input.nextElementSibling;
        if (feedbackDiv && feedbackDiv.classList.contains('invalid-feedback')) {
            feedbackDiv.remove();
        }
    });
}

function limpiarFormulario() {
    document.getElementById("nombre_cancion").value = '';
    document.getElementById("artista_cancion").value = '';
    document.getElementById("url_cancion").value = '';
    limpiarMensajesError();
}
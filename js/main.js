window.addEventListener('load', function () {
    /* ------------------------------ GET API--------------------------------------- */
    obtenerDatos();
    /* ---------------------Declaración de Variables ------------------------------ */
    const form = document.forms[0];
    let now = new Date();
    let fecha = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
    let minutos = now.getMinutes()
    if(minutos<10) minutos="0"+minutos;
    let hora = now.getHours() + ':' + minutos;
    let fechayHora = fecha + ' ' + hora;
    const url = 'https://prod-23.brazilsouth.logic.azure.com:443/workflows/173e479768634895b9603f0acaa8927f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9z6PMT_1dXq1JSpLLW3S1bRKjCrPq-B4Sy84LsvaLzc&pais=mexico';
    var data = {};
    /*-------------------------------------------------------------------------------------------- */
    /*                                  Configurar la Petición                                     */
    /*-------------------------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
          event.preventDefault();
          console.log(validaciones());
          if (!validaciones()) return false;
          if(c_requerimiento.value == "Reclamo - Producto No Conforme"){
            data = {
              fecha: fechayHora,
              nombre: nombre.value,
              correo: correo.value,
              estado: estado.value,
              municipio: municipio.value,
              direccion: direccion.value,
              c_requerimiento: c_requerimiento.value,
              equipos: equipos.value,
              serial: serial.value,
              detalle: detalle_requerimiento.value,
              tipo_cliente: tipo_cliente.value,
              fecha_compra: fecha_compra.value,
              telefono: telefono.value,
              politica: politica.checked,
              archivo: archivo,
              archivoFactura: archivoFactura,
              linea: "RoyalCondor"
            }
          }else{
            data = {
              fecha: fechayHora,
              nombre: nombre.value,
              correo: correo.value,
              estado: estado.value,
              municipio: municipio.value,
              direccion: direccion.value,
              c_requerimiento: c_requerimiento.value,
              equipos: "",
              fecha_compra: "",
              serial: "",
              detalle: detalle_requerimiento.value,
              telefono: telefono.value,
              tipo_cliente: tipo_cliente.value,
              politica: politica.checked,
              archivo: "",
              archivoFactura: "",
              linea: "RoyalCondor"
            }
          }
        
        const settings = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(data);
        cargando();
        enviarPeticion(settings);
    })

    /*-------------------------------------------------------------------------------------------- */
    /*                                       Enviar Peticion                                       */
    /*-------------------------------------------------------------------------------------------- */

    function enviarPeticion(settings) {
        fetch(url, settings)
        .then(response => {
            console.log(response);
            document.getElementById("headermensaje").style.background = '#6EF05F';
            document.getElementById('titulomensaje').innerHTML='Realizado';
            document.getElementById('mensaje').innerHTML='Se realizó correctamente su registro.';  
            document.getElementById("formulario").reset();
            $(".custom-file-label").addClass("selected").html("Choose File");
            archivo = [];
            return response.json
            
        })
        .catch(err => {
            console.log("Promesa Rechazada");
            console.log(err);
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Algo salio mal.... Recargue la pagina e intete nuevamente<br>' + err;
        })
    }

    /*-------------------------------------------------------------------------------------------- */
    /*                             Obtener Datos de la Base de datos                               */
    /*-------------------------------------------------------------------------------------------- */

    function obtenerDatos() {
      var url = "https://prod-28.brazilsouth.logic.azure.com:443/workflows/be2d5679275e4f098a00f40ec0f04a29/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=P66ODxcUOPOzaI2KUyOHPF0AYDrTRl1nHU-XhAAI94o&pais=mexico";
      fetch(url)
      .then(response => {
        return response.json();
      })
      .then(function (data) {

        var listDep = "<option disabled selected>Selecciona una opción</option>";
        var listCat = "<option disabled selected>Selecciona una opción</option>";
        var listEquipo = "<option disabled selected>Selecciona una opción</option>";
        var listCliente = "<option disabled selected>Selecciona una opción</option>";

        for (var i = 0; i < data.value.length; i++) {
          if (data.value[i].Estados != '') {
            listDep += "<option value='" + data.value[i].Estados + "'>" + data.value[i].Estados + "</option>";
          }            
        }
        for (var i = 0; i < data.value.length; i++) {
          if (data.value[i].Requerimiento != '') {
            listCat += "<option value='" + data.value[i].Requerimiento + "'>" + data.value[i].Requerimiento + "</option>";
          } 
        }
        for (var i = 0; i < data.value.length; i++) {
          if (data.value[i].Equipos != '') {
            listEquipo += "<option value='" + data.value[i].Equipos + "'>" + data.value[i].Equipos + "</option>";
          }            
        }
        for (var i = 0; i < data.value.length; i++) {
          if (data.value[i].Tipo_cliente != '') {
            listCliente += "<option value='" + data.value[i].Tipo_cliente + "'>" + data.value[i].Tipo_cliente + "</option>";
          }            
        }
        document.querySelector("#estado").innerHTML = listDep;
        document.querySelector("#categoria_requerimiento").innerHTML = listCat;
        document.querySelector("#Equipos").innerHTML = listEquipo;
        document.querySelector("#t_cliente").innerHTML = listCliente;
        console.log(data);
      })
      .catch(function (errors) {
        console.error(errors);
      })
    }
})

    /*-------------------------------------------------------------------------------------------- */
    /*                                  Funciones Adicionales                                      */
    /*-------------------------------------------------------------------------------------------- */

    /*--------------------------------  Guardar Archivo en Array  ---------------------------------*/
    function saveFile(f) {
      const file = f.files[0];
      console.log(file.stream());
      const fr = new FileReader();
      fr.addEventListener("load", function () {
        let contenido = fr.result.split(",");
        const obj = {
          filename: file.name,
          mimeType: file.type,
          contenido: {
            "$content-type" : file.type,
            "$content" : contenido[1]
          }
        };
        archivo.push(obj);
        
      }, false);

      if (file) {
        fr.readAsDataURL(file);
      }
      console.log(archivo)
    }

    /*--------------------------------  Guardar Archivo de Factura  ---------------------------------*/
    function saveFileFactura(f) {
      const file = f.files[0];
      console.log(file.stream());
      const fr = new FileReader();
      fr.addEventListener("load", function () {
        let contenido = fr.result.split(",");
        const obj = {
          filename: file.name,
          mimeType: file.type,
          contenido: {
            "$content-type" : file.type,
            "$content" : contenido[1]
          }
        };
        archivo.push(obj);
        
      }, false);

      if (file) {
        fr.readAsDataURL(file);
      }
      console.log(archivo)
    }

      // Nombre del archivo al seleccionarlo
      $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
      });

jQuery(function () {
    //Registrar los botones para responder al evento click
    LlenarComboXServicios("http://localhost:55644/api/TipoDocumento/LlenarComboTipoDocumento", "#cboTipoDocumento");
    LlenarTabla()
});

async function Consultar() {
    let Documento = $("#txtDocumento").val();
    try {
        //Vamos a invocar el servicio con fetch (Por definición es asíncrono, pero se debe ejecutar con await para volverlo síncrono)
        const Resultado = await fetch("http://localhost:55644/api/Cliente/ConsultarXDocumento?Documento=" + Documento,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Se captura la respuesta que está en formato json y se convierto en un objeto de javascript
        const Respuesta = await Resultado.json();

        $("#txtNombre").val(Respuesta.nombre);
        $("#cboTipoDocumento").val(Respuesta.id_tipo_documento);
        $("#txtDocumento").val(Respuesta.nro_documento);
        $("#cboEstado").val(Respuesta.activo);

        console.log(Respuesta);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}
function Insertar() {
    EjecutarComando("POST", "Insertar");
}
function Actualizar() {
    EjecutarComando("PUT", "Actualizar");
}
function Eliminar() {
    EjecutarComando("DELETE", "Eliminar");
}

function LlenarTabla()
{
    LlenarTablaXServicios('http://localhost:55644/api/Cliente/ListarConTipoDocumento', "#tblClientes")
}

async function EjecutarComando(Metodo, Funcion) {
    const cliente = new Cliente($("#txtNombre").val(), $("#cboTipoDocumento").val(), $("#txtDocumento").val(), $("#cboEstado").val());
    try {
        const Resultado = await fetch("http://localhost:55644/api/Cliente/" + Funcion,
            {
                method: Metodo,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente)
            });
        //Se captura la respuesta que está en formato json y se convierto en un objeto de javascript
        const Respuesta = await Resultado.json();
        console.log(cliente);
        LlenarTabla();
        $("#dvMensaje").html(Respuesta);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}

async function EjecutarServicio(Metodo, URL, datosIN) {
    try {
        const Resultado = await fetch(URL,
            {
                method: Metodo,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosIN)
            });
        //Se captura la respuesta que está en formato json y se convierto en un objeto de javascript
        const Respuesta = await Resultado.json();
        $("#dvMensaje").html(Respuesta);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}
async function ConsultarServicio(URL) {
    try {
        //Vamos a invocar el servicio con fetch (Por definición es asíncrono, pero se debe ejecutar con await para volverlo síncrono)
        const Resultado = await fetch(URL,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Se captura la respuesta que está en formato json y se convierto en un objeto de javascript
        const Respuesta = await Resultado.json();
        return Respuesta;
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}

async function LlenarComboXServicios(URLServicio, ComboLlenar) {
    try {
        const Respuesta = await fetch(URLServicio,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Rpta = await Respuesta.json();
        //Se debe limpiar el combo
        $(ComboLlenar).empty();
        //Se recorre en un ciclo para llenar el select con la información
        for (i = 0; i < Rpta.length; i++) {
            $(ComboLlenar).append('<option value=' + Rpta[i].id + '>' + Rpta[i].Nombre + '</option>');
        }
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}

async function LlenarTablaXServicios(URLServicio, TablaLlenar) {
    //Invocamos el servicio a través del fetch, usando el método fetch de javascript
    try {
        const Respuesta = await fetch(URLServicio,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Rpta = await Respuesta.json();
        //Se recorre en un ciclo para llenar la tabla, con encabezados y los campos
        //Llena el encabezado
        var Columnas = [];
        NombreColumnas = Object.keys(Rpta[0]);
        for (var i in NombreColumnas) {
            Columnas.push({
                data: NombreColumnas[i],
                title: NombreColumnas[i]
            });
        }
        //Llena los datos
        $(TablaLlenar).DataTable({
            data: Rpta,
            columns: Columnas,
            destroy: true
        });
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}


class Cliente {
    constructor(nombre, id_tipo_Documento, nro_documento, activo) {
        this.nombre = nombre;
        this.id_tipo_documento = id_tipo_Documento;
        this.nro_documento = nro_documento;
        this.activo = activo; 
    }
}
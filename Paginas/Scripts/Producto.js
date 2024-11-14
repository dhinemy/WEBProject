jQuery(function () {
    //Registrar los botones para responder al evento click
    LlenarComboTipoProducto("http://localhost:55644/api/TipoProducto/Listar", "#cboTipoProducto");
    LlenarComboProveedor("http://localhost:55644/api/Proveedores/LlenarComboProveedor", "#cboProveedor")
    LlenarTabla()
});

async function Consultar() {
    let Codigo = $("#txtCodigo").val();
    try {
        //Vamos a invocar el servicio con fetch (Por definición es asíncrono, pero se debe ejecutar con await para volverlo síncrono)
        const Resultado = await fetch("http://localhost:55644/api/Producto/ConsultarXCodigo?Codigo=" + Codigo,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Se captura la respuesta que está en formato json y se convierto en un objeto de javascript
        const Respuesta = await Resultado.json();

        $("#txtNombre").val(Respuesta.nombre);
        $("#txtCodigo").val(Respuesta.codigo);
        $("#txtValorUnitario").val(Respuesta.valor_unitario);
        $("#cboProveedor").val(Respuesta.id_proveedor);
        $("#cboTipoProducto").val(Respuesta.id_tipo_producto);
        $("#txtTiempoGarantia").val(Respuesta.tiempo_garantia);
        $("#txtDescuento").val(Respuesta.descuento);
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

function LlenarTabla() {
    LlenarTablaXServicios('http://localhost:55644/api/Producto/ListarConTipoDocumento', "#tblProducto")
}

async function EjecutarComando(Metodo, Funcion) {
    const producto = new Producto($("#txtNombre").val(),
    $("#txtCodigo").val(),
    $("#txtValorUnitario").val(),
    $("#cboProveedor").val(),
    $("#cboTipoProducto").val(),
    $("#txtTiempoGarantia").val(),
    $("#txtDescuento").val());
    try {
        const Resultado = await fetch("http://localhost:55644//api/Producto/" + Funcion,
            {
                method: Metodo,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(producto)
            });
        //Se captura la respuesta que está en formato json y se convierto en un objeto de javascript
        const Respuesta = await Resultado.json();
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

async function LlenarComboProveedor(URLServicio, ComboLlenar) {
    //Debe ir a la base de datos y llenar la información del combo de tipo producto
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
        //Se debe limpiar el combo
        $(ComboLlenar).empty();
        //Se recorre en un ciclo para llenar el select con la información
        for (i = 0; i < Rpta.length; i++) {
            $(ComboLlenar).append('<option value=' + Rpta[i].id + '>' + Rpta[i].razon_social + '</option>');
        }
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}

async function LlenarComboTipoProducto(URLServicio, ComboLlenar) {
    
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

class Producto {
    constructor(Nombre, Codigo, ValorUnitario, IdProveedor, IdTipoProducto, TiempoGarantia, Descuento) {
        this.nombre = Nombre;
        this.codigo = Codigo;
        this.valor_unitario = ValorUnitario;
        this.id_proveedor = IdProveedor;
        this.id_tipo_producto = IdTipoProducto;
        this.tiempo_garantia = TiempoGarantia;
        this.descuento = Descuento;
    }
}
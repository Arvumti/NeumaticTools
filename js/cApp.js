/*
 * 0.-Variables
 * 1.-Modelos
 * 2.-Colecciones
 * 3.-Vistas
 * 4.-Rutas
 * 5.-Load
 * 6.-Funciones Sockets
 * 7.-Funciones
 * 8.-Templates
 * 9.-Pruebas
 */

 /* ----------------------------------------- 0.-Variables ----------------------------------------- */
var app = {},
	tempo = 0,
    repos = '';

/* ----------------------------------------- 1.-Modelos ----------------------------------------- */
app.MoCliente = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
        var ruta = 'SaveCliente' + (this.id ? '/' + this.id : '');
        return ruta;
    },
    defaults: {
        visible: 1,
        activo: 1
    }
});
app.MoEquipo = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
        var ruta = 'SaveEquipo' + (this.id ? '/' + this.id : '');
        return ruta;
    },
    defaults: {
        visible: 1,
        activo: 1
    }
});
/* ----------------------------------------- 2.-Colecciones ----------------------------------------- */
window.CoClientesList = Backbone.Collection.extend({
    model: app.MoCliente,
    url: 'GetClientes'
});
window.CoEquiposList = Backbone.Collection.extend({
    model: app.MoEquipo,
    url: 'GetEquipos'
});

app.CoClientes = new window.CoClientesList();
app.CoEquipos = new window.CoEquiposList();
/* ----------------------------------------- 3.-Vistas ----------------------------------------- */
app.vwMain = Backbone.View.extend({
    el: 'body',
    events: {
        'click nav section > ul > li': 'navigate'
    },
    initialize: function() {
        this.nav =this.$el.children('header').children('nav');
        this.main = this.$el.children('main');
    },
    /* ---------------------------------------- eventos ---------------------------------------- */
    navigate: function(e) {
        app.vi.Main.nav.find('section > ul > li').removeClass('active');
        $(e.currentTarget).addClass('active');
        //e.preventDefault();
        //e.stopPropagation();
        
        //Backbone.history.navigate('/captura', {trigger:true});
    }
});

app.ViCliente = Backbone.View.extend({
    el: '#pnlCliente',
    events: {
        'click #btnCancelar'    : 'click_btnCancelar',
        'click #btnGuardar'     : 'click_btnGuardar',
        'click #btnLimpiar'     : 'click_btnLimpiar'
    },
    initialize: function() {
        var that = this;
        this.crud = 1;
        this.form = this.$el.children('form');
        
        this.hTitulo = this.$el.find('h3');
        this.txtNombre = this.form.find('#txtNombre');
        this.txtAPaterno = this.form.find('#txtAPaterno');
        this.txtAMaterno = this.form.find('#txtAMaterno');
        this.txtCalle = this.form.find('#txtCalle');        
        this.txtNumero = this.form.find('#txtNumero');
        this.txtColonia = this.form.find('#txtColonia');
        this.txtMunicipio = this.form.find('#txtMunicipio');
        this.txtRFC = this.form.find('#txtRFC');
        this.txtTelefono = this.form.find('#txtTelefono');
        this.txtIdentificacion = this.form.find('#txtIdentificacion');
        
        this.form.on('valid', function (e) {
			e.preventDefault();
			that.save();
		}).on('submit', function (e) {
			e.preventDefault();
		});
    },
    clear: function() {
        app.vi.Cliente.form[0].reset();
    },
    hide: function() {
        this.fakeModel = null;
        this.crud = 1;
        this.$el.foundation('reveal', 'close');
    },
    render: function() {
        this.clear();
        this.crud = 1;
        this.hTitulo.text('Nuevo Cliente');
        this.$el.css({visibility:'visible'}).removeClass('isHidden reveal-modal').addClass('active-view').fadeIn();
        this.txtNombre.focus();
    },
    save: function() {
        var json = this.getData();
        
        switch(this.crud) {
            case 1:
                app.CoClientes.create(json, {error:error, wait:true});
                this.clear();
                break;
            case 2:
                this.fakeModel.save(json);
                this.hide();
                break;
        }
        
        function error(data, xrh) {
            console.log(data);
            console.log(xrh);
            
            alert(xrh.status + ' - ' + xrh.statusText + ' : ' + xrh.responseText);
        }
    },
    show: function(jData) {
        this.clear();
        this.crud = 2;
        this.fakeModel = jData.model;
        this.hTitulo.text(jData.title);
        this.setData(this.fakeModel.toJSON());
        this.$el.addClass('reveal-modal').foundation('reveal', 'open');
    },
    /* ---------------------------------------- eventos ---------------------------------------- */
    click_btnCancelar: function() {
        switch(this.crud) {
            case 1:
                Backbone.history.navigate('/', {trigger:true});
                break;
            default:
                this.hide();
                break;
        }
    },
    click_btnGuardar: function() {
        this.form.submit();
    },
    click_btnLimpiar: function() {
        this.clear();
    },
    getData: function() {
        var json = {
            nombre: {
                nombre: this.txtNombre.val(),
                apaterno: this.txtAPaterno.val(),
                amaterno: this.txtAMaterno.val()
            },
            direccion: {
                calle: this.txtCalle.val(),
                numero: this.txtNumero.val(),
                colonia: this.txtColonia.val(),
                municipio: this.txtMunicipio.val()
            },
            rfc: this.txtRFC.val(),
            telefono: this.txtTelefono.val(),
            identificacion: this.txtIdentificacion.val()
        };
        return json;
    },
    setData: function(json) {        
        this.txtNombre.val(json.nombre.nombre);
        this.txtAPaterno.val(json.nombre.apaterno);
        this.txtAMaterno.val(json.nombre.amaterno);
        this.txtCalle.val(json.direccion.calle);
        this.txtNumero.val(json.direccion.numero);
        this.txtColonia.val(json.direccion.colonia);
        this.txtMunicipio.val(json.direccion.municipio);
        this.txtRFC.val(json.rfc);
        this.txtTelefono.val(json.telefono);
        this.txtIdentificacion.val(json.identificacion);
    }
});
app.ViClientes = Backbone.View.extend({
    el: '#pnlClienteConsulta',
    events: {},
    initialize: function() {
        this.gvClientes = this.$el.find('table#gvClientes');        
        this.listenTo(app.CoClientes, 'add', this.addTR);
    },
    /*-------------------------- Base --------------------------*/
    render: function(){
        this.$el.css({visibility:'visible'}).removeClass('isHidden reveal-modal').addClass('active-view').fadeIn();  
    },
    addTR: function(model) {        
        var per = new app.ViClienteTR({model:model}).render();        
        this.gvClientes.children('tbody').prepend(per.$el);
    }
});
app.ViClienteTR = Backbone.View.extend({
    tagName: 'tr',
    events: {
        'click i.fa-repeat'  : 'click_isEdit',
        'click i.fa-trash-o' : 'click_isDelete'
    },
    initialize: function() {        
        this.listenTo(this.model, 'change', this.change_model);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    change_model: function() {
        this.$el.html(app.templates.tr_cliente(this.model.toJSON()));
    },
    click_isEdit: function() {
        app.vi.Cliente.show({title:'Modificar Cliente', model:this.model});
    },    
    click_isDelete: function() {
        app.ut.confirm({header:'Eliminar Equipo', body: '¿Desea eliminar el cliente?', fnA: removeTR});
        
        var model = this.model;        
        function removeTR() {
            model.destroy({ wait:true, success:done, error:error});
        
            function done(model, response) {
                console.log('ok');
                console.log(model);
                console.log(response);
            }
            function error(model, response, b) {
                console.log('error');
                console.log(model);
                console.log(response);
                console.log(b);
            }
        }
    },
    /*-------------------------- Base --------------------------*/
    render: function(){
        var jData = this.model.toJSON();
        //this.$el.attr('id', this.model.cid);
        
        this.$el.html(app.templates.tr_cliente(jData));
        this.model.view = this;
        
        return this;
    }
});

app.ViEquipo = Backbone.View.extend({
    el: '#pnlEquipo',
    events: {
        'click #btnCancelar'    : 'click_btnCancelar',
        'click #btnGuardar'     : 'click_btnGuardar',
        'click #btnLimpiar'     : 'click_btnLimpiar'
    },
    initialize: function() {
        var that = this;        
        this.crud = 1;
        this.form = this.$el.children('form');
        
        this.hTitulo = this.$el.find('h3');
        this.txtNE = this.form.find('#txtNE');
        this.tyaFamilias = this.form.find('#tyaFamilias');
        this.txtNombre = this.form.find('#txtNombre');
        this.txtMarca = this.form.find('#txtMarca');
        this.txaDescripcion = this.form.find('#txaDescripcion');        
        this.txtDiasTrabajo = this.form.find('#txtDiasTrabajo');
        this.txtPrecioDia = this.form.find('#txtPrecioDia');
        this.txtCantidad = this.form.find('#txtCantidad');
        
        app.ut.getJson({url:'GetFamilias', done:done});
        
        function done(data) {
            app.cbos.familias = data;                            
            app.ut.tyAhead(that.tyaFamilias, '/GetFamilias');
        }
        
        this.form.on('valid', function (e) {
			e.preventDefault();
			that.save();
		}).on('submit', function (e) {
			e.preventDefault();
		});
    },
    clear: function() {
        app.vi.Equipo.form[0].reset();
    },
    hide: function() {
        this.fakeModel = null;
        this.crud = 1;
        this.$el.foundation('reveal', 'close');
    },
    render: function() {
        this.clear();
        this.crud = 1;
        this.hTitulo.text('Nuevo Equipo');
        this.$el.css({visibility:'visible'}).removeClass('isHidden reveal-modal').addClass('active-view').fadeIn();
        
        this.tyaFamilias.focus();
    },
    save: function() {
        var json = this.getData();
        
        switch(this.crud) {
            case 1:
                app.CoEquipos.create(json, {error:error, wait:true});
                this.clear();
                break;
            case 2:
                this.fakeModel.save(json);
                this.hide();
                break;
        }
        
        function error(data, xrh) {
            console.log(data);
            console.log(xrh);
            
            alert(xrh.status + ' - ' + xrh.statusText + ' : ' + xrh.responseText);
        }
    },
    show: function(jData) {
        this.clear();
        this.crud = 2;
        this.fakeModel = jData.model;
        this.hTitulo.text(jData.title);
        this.setData(this.fakeModel.toJSON());
        this.$el.addClass('reveal-modal').foundation('reveal', 'open');
    },
    /* ---------------------------------------- eventos ---------------------------------------- */
    click_btnCancelar: function() {
        switch(this.crud) {
            case 1:
                Backbone.history.navigate('/', {trigger:true});
                break;
            default:
                this.hide();
                break;
        }
    },
    click_btnGuardar: function() {
        this.form.submit();
    },
    click_btnLimpiar: function() {
        this.clear();
    },
    getData: function() {
        var json = {
            sku             : this.txtNE.val(),
            idFamilia       : this.tyaFamilias.data('current'),
            nombre          : this.txtNombre.val(),
            marca           : this.txtMarca.val(),
            descripcion     : this.txaDescripcion.val(),
            diasTrabajados  : this.txtDiasTrabajo.val(),
            precioDia       : this.txtPrecioDia.val(),
            cantidad        : this.txtCantidad.val()
        };
        
        return json;
    },
    setData: function(json) {
        json.idFamilia.nombreC = json.idFamilia.nombre;
        
        this.txtNE.val(json.sku);
        this.tyaFamilias.data('current', json.idFamilia).val(json.idFamilia.nombreC);
        this.txtNombre.val(json.nombre);
        this.txtMarca.val(json.marca);
        this.txaDescripcion.val(json.descripcion);
        this.txtDiasTrabajo.val(json.diasTrabajados);
        this.txtPrecioDia.val(json.precioDia);
        this.txtCantidad.val(json.cantidad);
    }
});
app.ViEquipos = Backbone.View.extend({
    el: '#pnlEquipoConsulta',
    events: {},
    initialize: function() {
        this.gvEquipos = this.$el.find('table#gvEquipos');        
        this.listenTo(app.CoEquipos, 'add', this.addTR);
    },
    /*-------------------------- Base --------------------------*/
    render: function(){
        this.$el.css({visibility:'visible'}).removeClass('isHidden reveal-modal').addClass('active-view').fadeIn();  
    },
    addTR: function(model) {        
        var per = new app.ViEquipoTR({model:model}).render();        
        this.gvEquipos.children('tbody').prepend(per.$el);
    }
});
app.ViEquipoTR = Backbone.View.extend({
    tagName: 'tr',
    events: {
        'click i.fa-repeat'  : 'click_isEdit',
        'click i.fa-trash-o' : 'click_isDelete'
    },
    initialize: function() {        
        this.listenTo(this.model, 'change', this.change_model);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    change_model: function() {
        this.$el.html(app.templates.tr_equipo(this.model.toJSON()));
    },
    click_isEdit: function() {
        app.vi.Equipo.show({title:'Modificar Equipo', model:this.model});
    },    
    click_isDelete: function() {
        app.ut.confirm({header:'Eliminar Equipo', body: '¿Desea eliminar el equipo?', fnA: removeTR});
        
        var model = this.model;        
        function removeTR() {
            model.destroy({ wait:true, success:done, error:error});
        
            function done(model, response) {
                console.log('ok');
                console.log(model);
                console.log(response);
            }
            function error(model, response, b) {
                console.log('error');
                console.log(model);
                console.log(response);
                console.log(b);
            }
        }
    },
    /*-------------------------- Base --------------------------*/
    render: function(){
        var jData = this.model.toJSON();
        //this.$el.attr('id', this.model.cid);
        
        this.$el.html(app.templates.tr_equipo(jData));
        this.model.view = this;
        
        return this;
    }
});
/* ----------------------------------------- 4.-Rutas ----------------------------------------- */
app.router = Backbone.Router.extend({
    routes: {
        ''                  : 'index',        
        'cliente/:estado'   : 'cliente',
        'equipo/:estado'    : 'equipo',
    },
    index: function() {
        app.vi.Main.nav.find('section > ul > li').removeClass('active');
        $('.active-view').addClass('isHidden').hide();
    },
    cliente: function(estado) {
        app.vi.Main.nav.find('a[href^="#cliente"]').parents('li').addClass('active');
        $('.active-view').addClass('isHidden').hide();
        switch(estado) {        
            case 'alta':
                app.vi.Cliente.render();
                break;
            case 'consulta':
                app.vi.Clientes.render();
                break;
        }
    },
    equipo: function(estado) {
        app.vi.Main.nav.find('a[href^="#equipo"]').parents('li').addClass('active');
        $('.active-view').addClass('isHidden').hide();
        switch(estado) {        
            case 'alta':
                app.vi.Equipo.render();
                break;
            case 'consulta':
                app.vi.Equipos.render();
                break;
        }
    }
});
/* ----------------------------------------- 5.-Load ----------------------------------------- */
$(document).on('ready', inicio);
function inicio(){
    $.ajaxSetup({ cache: false });
    $("html").niceScroll({hidecursordelay:600, cursorwidth:'6px', railpadding:{right:2} });
	Bases();
	$(document).foundation().foundation('abide', {
		patterns: {
			numero: /[0-9]+/,
			fecha: /[0-9]{4}\-[0-9]{2}\-[0-9]{2}/
		}
	});
    
    new app.router;
	app.ut = new utilerias();
    app.templates = new templates();
    
    app.cbos = {};
    app.vi = {
        Main: new app.vwMain(),
        Cliente: new app.ViCliente(),
        Clientes: new app.ViClientes(),
        Equipo: new app.ViEquipo(),
        Equipos: new app.ViEquipos()
	};
    
	/*app.keytrap = new keytrap();
	app.ns = new nombreSockets();
	app.pag = new paginacion();
	app.templates = new templates();
	app.socket = io.connect('http://localhost:3000');
	app.socket.on(app.ns.agSearchDatos, agSearchDatos);
	app.socket.on(app.ns.cvSave, saveVenta);
	app.socket.on(app.ns.GetArticulo, addArticulo);*/
    
    app.CoEquipos.fetch();
    app.CoClientes.fetch();
    Backbone.history.start({
        root: '/'
    });
}

/* ----------------------------------------- 6.-Funciones Sockets ----------------------------------------- */
/* ----------------------------------------- 7.-Funciones ----------------------------------------- */
function keytrap(){
	var once = false;

	return {
		bsBusqueda	: bsBusqueda,
		pvCierre	: pvCierre,
		pvMain		: pvMain,
		reset 		: reset
	};

	function bsBusqueda() {
		reset();

		/* 
		 * down		: 
		 * esc 		: Cierra todos los Helpers activos y establece el foco en la caja de captura de codigo de barras
		 * up 		: 
		 */
		Mousetrap.bind({
			'esc': function(){
				app.helper.busqueda.close();

				switch(app.conf.bTipo) {
					case 1:
						$('#txtCodigoBarrasPV').val('').focus();
						pvMain();
						break;
					case 2:
						$('#txtRecibidoCV').focus();
						pvCierre();
						break;
				}
			}
		});
	}

	function pvCierre() {
		reset();

		/* 
		 * esc 		: Cierra todos los Helpers activos y establece el foco en la caja de captura de codigo de barras
		 * f1 		: Abre la ventana de busqueda de clientes
		 * -		: Activa/Desactiva el cambio de moneda
		 * +		: Activa/Desactiva la facturacion
		 * * 		: Remueve el cliente
		 */
		Mousetrap.bind({
			'enter': function() {
				app.helper.cierre.save();
			},
			'esc': function(){
				app.helper.cierre.close();
				$('#txtCodigoBarrasPV').val('').focus();
				pvMain();
			},
			'f1': function(e) {
				stop(e);
				app.helper.busqueda.show(2);
				bsBusqueda();
			},
			'-': function(e) {
				stop(e);
				app.helper.cierre.$swtMoneda.find('input').not(':checked').click();
				app.helper.cierre.swtMoneda_Click();
			},
			'+': function(e) {
				stop(e);
				app.helper.cierre.$swtFactura.find('input').not(':checked').click();
				app.helper.cierre.swtFactura_Click();
			},
			'*': function(e) {
				stop(e);
				$('#pnlClienteCV').addClass('isHidden').find('#txtClienteCV').removeData().val('');
			}
		});
	}

	function pvMain(){
		reset();
		
		/* 
		 * del 		: Elimina un articulo seleccionado del grid de venta,
		 * down		: Navegacion en el grid de venta
		 * esc 		: Cierra todos los Helpers activos y establece el foco en la caja de captura de codigo de barras
		 * f1 		: Abre la ventana de busqueda de articulos
		 * f4 		: Elimina todos los articulos del grid de venta
		 * left 	: Quita el importe de un articulo seleccionado del grid de venta
		 * right 	: Agrega el importe de un articulo seleccionado del grid de venta
		 * tab 		: Agrega el ultimo articulo al grid de venta
		 * up 		: Navegacion en el grid de venta
         * +        : Ejecuta el proceso de busqueda de ofertas
		 */
		Mousetrap.bind({
			'del': function(){
				var delRow = $('#venta_articulos table tbody tr.isSelected');
                if(app.CoArticulos.length > 0 && delRow.html() !== undefined) {
                    var articulo = app.CoArticulos.get(delRow.attr('id'));
                                        
                    if(app.CoArticulos.length-1 == 0)
                        $('#txtCodigoBarrasPV').focus();
                    else if(delRow.next().html() !== undefined)
                        delRow.next().addClass('isSelected');
                    else if(delRow.prev().html() !== undefined)
                    	delRow.prev().addClass('isSelected');
                    else
                    	$('#pnlArticulos tbody tr:first-child').addClass('isSelected');

                    app.CoArticulos.remove(articulo);
                }
			},
			'down': function(e){
				if(app.CoArticulos.length == 0)
					return;

				var nextRow = $('#gvArticulosVM tbody tr.isSelected').next().html();

				$('#txtCodigoBarrasPV').blur();
				if(nextRow === undefined) {
					$('#gvArticulosVM tbody tr.isSelected').removeClass('isSelected');
		            $('#gvArticulosVM tbody tr:first-child').addClass('isSelected');
				}
				else
		            $('#gvArticulosVM tbody tr.isSelected').removeClass('isSelected').next().addClass('isSelected');
			},
			'esc': function(){
				app.helper.busqueda.close();
				$('#txtCodigoBarrasPV').val('').focus();			
			},
			'f1': function(e){
				stop(e);
				app.helper.busqueda.show(1);
				bsBusqueda();
			},
			'f4': function(e){
				stop(e);
				app.CoArticulos.reset();
			},
			'left': function(){
				var row = $('#venta_articulos .isSelected');
				if(row.html() !== undefined) {
					var articulo = app.CoArticulos.get(row.attr('id'));
					if(articulo.get('EspImporte') == 0)
						return;

					var total = parseFloat($('#venta_articulos .total').text()) - articulo.get('Importe');
					$('#venta_articulos .total').text(total);

					articulo.set({EspImporte:0, Total:articulo.get('Total') - articulo.get('Importe')});
				}
			},
			'right': function(){
				var row = $('#venta_articulos .isSelected');
				if(row.html() !== undefined) {
					var articulo = app.CoArticulos.get(row.attr('id'));
					if(articulo.get('EspImporte') > 0)
						return;

					var total = parseFloat($('#venta_articulos .total').text()) + articulo.get('Importe');
					$('#venta_articulos .total').text(total);

					articulo.set({EspImporte:articulo.get('Importe'), Total:articulo.get('Total') + articulo.get('Importe')});
				}
			},
			'tab': function(e){
				stop(e);
				var id = $($('#gvArticulosVM tbody tr')[0]);
				if(id.attr('id')) {
					var articulo = app.CoArticulos.get(id.attr('id'));
					articulo = articulo.toJSON();
					delete articulo.cid;

					app.CoArticulos.add(articulo);
				}
			},
			'up': function(){
				if(app.CoArticulos.length == 0)
					return;

				var nextRow = $('#gvArticulosVM tbody tr.isSelected').prev().html();

				$('#txtCodigoBarrasPV').blur();
				if(nextRow === undefined) {
					$('#gvArticulosVM tbody tr.isSelected').removeClass('isSelected');
		            $('#gvArticulosVM tbody tr:last-child').addClass('isSelected');
				}
				else
		            $('#gvArticulosVM tbody tr.isSelected').removeClass('isSelected').prev().addClass('isSelected');
			}
		});
	}

	function reset(){
		Mousetrap.reset();
	}

	function stop(e){
		if (e.preventDefault)
			e.preventDefault();
		else
	        e.returnValue = false;// internet explorer
	}
}

function nombreSockets(){
	var nombresFunctiones = {
								agSearchDatos	: 'agSearchDatos',
								cvSave 			: 'cvSave',
								GetArticulo 	: 'GetArticulo'
							};

	return nombresFunctiones;
}

function utilerias() {
    var __loading = $('.loading'),
        __isLoading = false,
        __petXHR = 0;
    
	return {
        confirm : Confirm,
        get     : Get,
        getJson : GetJson,
		hide 	: Hide,
        message : Message,
		show    : Show,
        tyAhead : Typeahead
	};
    
    // { header, body, dataID, fnA, fnC }
	function Confirm (p_valores) {
		var modal = p_valores.el || $('#popMessage'),
			validacion = false,
			valores = p_valores || {},
			header = valores.header || 'Modal',
			body = valores.body || '/',
			dataID = valores.dataID || 0;

		modal.find('.modal-title').text(header);
		modal.find('.modal-body').html(body);

		modal.find('#btnAceptar').removeData().data('idKey', dataID).off('click').on('click', fnDone);
		modal.find('#btnCancelar').off('click').on('click', fnHide);
        modal.off('close').on('close', fnHide);

		modal.foundation('reveal', 'open');

		function fnDone() {
            modal.off('close');
            if(valores.fnA && typeof valores.fnA === "function")
                valores.fnA();
			modal.foundation('reveal', 'close');
		}

		function fnHide(e) {            
            if(valores.fnC && typeof valores.fnC === "function") {
                valores.fnC();
                modal.off('close');
            }
            if(e.type != 'close')
                modal.foundation('reveal', 'close');
		}
	}
    
    /*
	 * p_url		: url a la cual se va a hacer la peticion
	 * p_data		: objeto tipo JSON que contiene la informacion a mandas
	 * p_done		: funcion que se ejecutara si todo sale bien
	 * p_err		: funcion que se ejecutara si ocurrio algun error
	 * p_type		: tipo de dato que se espera recibir [json, html, text]
	 * p_loading	: true/false para activar o no el loading panel
	 */
	function Get(p_params) {
		var url = p_params.url || '/PVenta',
			done = p_params.done || fnDone,
			err = p_params.err || fnErr,
			type = p_params.type || 'text',
			data = p_params.data || {},
			loading = p_params.loading === undefined ? true : p_params.loading;

		if (loading)
			show();
		$.get(url, data, type).done(fnNext).fail(err);

		function fnNext(data){
			done(data, hide);
		}

		function fnDone(data, fnHide){
			console.log(data);
			fnHide();
		}

		function fnErr(xhr, err, x){
			console.log(xhr);
			if (loading)
				hide();
		}
	}
    
    function GetJson(json) {
        __petXHR++;        
        if(!__isLoading)
            Show();
        
        var _Done = json.done || __Fake,
            _Fail = json.fail || __Fake;
        
        function _WrapDone(data) {
            _Done(data);
            _WatchLoad();
        }
        
        function _WrapFail(xrh, err) {
            _Fail(xrh, err);
            _WatchLoad();
        }
        
        function _WatchLoad() {
            __petXHR--;
            if(__petXHR == 0)
                Hide();
        }
        
        var xrh = $.getJSON(json.url);
        xrh.done(_WrapDone)
        .fail(_WrapFail);
        
        return xrh;
    }
    
	function Hide(fn, p_arrs) {
        __isLoading = false;
		__loading.fadeOut();
	}

    function Message(p_message, p_time) {
		var message = p_message || '',
			time = p_time || 5000,
			alerta = $(app.templates.mAlert({message:message}));

		$('#pnlAlert').prepend(alerta);

		setTimeout(function(){
			alerta.find('.close').click();
		}, time);
	}
    
	function Show() {
        var h1 = $(document).height();
        var h2 = $('body').height();
        var h3 = $('html').height();
        var max = 0;
        
        if(h1 > h2 && h1 > h3)
            max = h1;
        else if (h2 > h3)
            max = h2;
        else
            max = h3;
        
        console.log($(document).height());
        console.log($('body').height());
        console.log($('html').height());
        console.log(max);
        var top = $(document).scrollTop() + 250;
        
        __isLoading = true;
		__loading.css({height:max + 'px'}).fadeIn().children('#topLoader').css({top:top + 'px'});
	}
        
    function Typeahead(elem, dir) {
        var arr = [];
        for(var i = 0; i < app.cbos.familias.length; i++) {
            var familia = app.cbos.familias[i];
            arr.push({_id:familia._id, nombre:familia.nombre, nombreC:familia.nombre});
        }
        
        var nombres = new Bloodhound({
          datumTokenizer: function(datum) {
              return Bloodhound.tokenizers.whitespace(datum.nombreC); 
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: arr
        });
        
        nombres.initialize();
        
        elem.typeahead(null, {
            name: 'familias',
            displayKey: 'nombreC',
            source: nombres.ttAdapter()/*function(query, process) {
                console.log(query)
                $.getJSON(dir, {query:query}).done(done).fail(fail);
                
                function done(data) {
                    process(data);
                }
                function fail(data) {
                    process({nombre:'no hay ningun dato capturado'});
                }
            }*/,
            templates: {
                suggestion: Handlebars.compile('{{nombreC}}')
            }
        })
        .on('typeahead:selected typeahead:autocompleted', function(e, datum) {
            $(e.currentTarget).data('current', datum).val(datum.nombreC);
            console.log(datum)
        })
        .on('blur', function(e) {
            var elem = $(e.currentTarget);
            if(elem.data('current')) {
                if(elem.data('current').nombre != elem.val()) {
                    var datum = elem.data('current');
                    elem.val(datum.nombreC);
                }
            }
        });
    }
    
    function __Fake(xhr) {
        console.log(xhr);
    }
}

function templates(){
	Handlebars.registerHelper('GetTipo', function(){
		return this.tipo == 1;
	});
    
    Handlebars.registerHelper('parseDate', function(fecha){
        if(fecha)
            return fecha.toString().toShortDate();
        else
            return '';
	});
    
	var alertas = Handlebars.compile("<div data-alert class='alert-box alert radius'><label>{{message}}</label><a href='#' class='close'><i class='fa fa-times fa-inverse'></i></a></div>"),
        cbo = Handlebars.compile('{{#data}} <option value="{{id}}">{{nombre}}</option> {{/data}}'),
        cbo_familias = Handlebars.compile($('#tmp_cbo_familias').html()),
        tr_cliente = Handlebars.compile($('#tmp_tr_cliente').html()),
        tr_equipo = Handlebars.compile($('#tmp_tr_equipo').html())
        ;

	return {
        alertas: alertas,
        cbo: cbo,
        tr_cliente: tr_cliente,
        tr_equipo: tr_equipo
	}
}
/* ----------------------------------------- 8.-Templates ----------------------------------------- */
/* ----------------------------------------- 9.-Pruebas ----------------------------------------- */
/* ----------------------------------------- 0.-Prototype ----------------------------------------- */
function Bases(){
    if (typeof Number.prototype.getDecimals != 'function') {
		// see below for better implementation!
		Number.prototype.round = function (value){
			var num = this || 0,
                decimales = value || 0;
        
            var tmp = this.toString().split('.');
            var p1 = tmp[0],
                p2 = '';
            if(tmp[1] && decimales > 0)
                p2 = '.' + tmp[1].substr(0, decimales);
        
            return parseFloat(p1 + p2);
		};
	}
    
    if (typeof String.prototype.startsWith != 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }
    
    if (typeof Number.prototype.round != 'function') {
		// see below for better implementation!
		Number.prototype.round = function (value){
			var num = this || 0,
                decimales = '1',
                tope = value || 0;
            for (var i = 0; i < tope; i++)
                decimales += '0';
            decimales = parseInt(decimales);
        
            return Math.round(parseFloat(num) * decimales) / decimales;
		};
	}
    
    if (typeof String.prototype.toInt != 'function') {
		// see below for better implementation!
		String.prototype.toInt = function (value){
			var val = parseInt(this);
			return val || 0;
		};
	}
    
    if (typeof String.prototype.toShortDate != 'function') {
        // see below for better implementation!
        String.prototype.toShortDate = function (){
            var fecha = new Date(this.toString()),
                anio = fecha.getFullYear(),
                mes = fecha.getMonth()+1,
                dia = fecha.getDate();        
            dia = dia.toString().length == 1 ? '0' + dia : dia;
            mes = mes.toString().length == 1 ? '0' + mes : mes;
            
            return anio + '-' + mes + '-' + dia;
        };
    }
}
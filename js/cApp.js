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

/* ----------------------------------------- 2.-Colecciones ----------------------------------------- */

/* ----------------------------------------- 3.-Vistas ----------------------------------------- */
app.vwMain = Backbone.View.extend({
    el: 'body',
    events: {},
    initialize:function(){
        
    }
});
/* ----------------------------------------- 4.-Rutas ----------------------------------------- */
app.router = Backbone.Router.extend({
    routes: {
        ''          : 'index'
    },
    index: function() {
        
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
    
	app.ut = new utilerias();
    app.templates = new templates();
    
    app.vw = {
        Main: new app.vwMain()
	};
    
	/*app.keytrap = new keytrap();
	app.ns = new nombreSockets();
	app.pag = new paginacion();
	app.templates = new templates();
	app.socket = io.connect('http://localhost:3000');
	app.socket.on(app.ns.agSearchDatos, agSearchDatos);
	app.socket.on(app.ns.cvSave, saveVenta);
	app.socket.on(app.ns.GetArticulo, addArticulo);*/    
    
    new app.router;
    Backbone.history.start();
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
        app.CoPersonas.each(function(elem) {
            var nombreC = elem.get('nombre').apaterno + ' ' + elem.get('nombre').amaterno + ' ' + elem.get('nombre').nombre;
            
            arr.push({_id:elem.get('_id'), nombre:elem.get('nombre'), nombreC:nombreC}) ;
        });
        
        var nombres = new Bloodhound({
          datumTokenizer: function(datum) {
              return Bloodhound.tokenizers.whitespace(datum.nombreC); 
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: arr
        });
        
        nombres.initialize();
        
        elem.typeahead(null, {
            name: 'personas',
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
	Handlebars.registerHelper('maskSQ', function(sq){
		return sq ? 'S' : 'Q';
	});
    
    Handlebars.registerHelper('parseDate', function(fecha){
        if(fecha)
            return fecha.toString().toShortDate();
        else
            return '';
	});
    
	var alertas = Handlebars.compile("<div data-alert class='alert-box alert radius'><label>{{message}}</label><a href='#' class='close'><i class='fa fa-times fa-inverse'></i></a></div>"),
        tr_diezmo = Handlebars.compile($('#tmp_tr_diezmo').html()),
        tr_persona = Handlebars.compile($('#tmp_tr_persona').html())
        ;

	return {
        tr_diezmo: tr_diezmo,
		tr_persona: tr_persona
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
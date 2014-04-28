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
    /*url: function() {
        var ruta = 'SaveCliente' + (this.id ? '/' + this.id : '');
        return ruta;
    },*/
    defaults: {
        visible: true,
        activo: true
    },
    urlRoot: 'cliente',
    noIoBind: false,
    socket: app.socket,
    initialize: function () {
        _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
        
        if (!this.noIoBind) {
            this.ioBind('update', this.serverChange, this);
            this.ioBind('delete', this.serverDelete, this);
        }
    },
    serverChange: function (data) {
        data.fromServer = true;
        this.set(data);
    },
    serverDelete: function (data) {
        if (this.collection) {
            this.collection.remove(this);
        } 
        else {
            this.trigger('remove', this);
        }
        this.modelCleanup();
    },
    modelCleanup: function () {
        this.ioUnbindAll();
        return this;
    }
});
app.MoContrato = Backbone.Model.extend({
    idAttribute: '_id',
    /*constructor: function() {        
        Backbone.Model.apply(this, arguments);        
        if(this.get('feEntrega') != null)
            this.set('visible', false);
    },
    url: function() {
        var ruta = 'SaveContrato' + (this.id ? '/' + this.id : '');
        return ruta;
    },*/
    defaults: {
        visible: true,
        activo: true,
        feEntrega: null,
        diasRenta: 0
    },
    urlRoot: 'contrato',
    noIoBind: false,
    socket: app.socket,
    initialize: function () {
        _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
        
        if (!this.noIoBind) {
            this.ioBind('update', this.serverChange, this);
            this.ioBind('delete', this.serverDelete, this);
        }
    },
    serverChange: function (data) {
        data.fromServer = true;
        this.set(data);
    },
    serverDelete: function (data) {
        if (this.collection) {
            this.collection.remove(this);
        } 
        else {
            this.trigger('remove', this);
        }
        this.modelCleanup();
    },
    modelCleanup: function () {
        this.ioUnbindAll();
        return this;
    }
});
app.MoEquipo = Backbone.Model.extend({
    idAttribute: '_id',
    /*url: function() {
        var ruta = 'SaveEquipo' + (this.id ? '/' + this.id : '');
        return ruta;
    },*/
    defaults: {
        visible: true,
        rentado: false,
        activo: true
    },
    urlRoot: 'equipo',
    noIoBind: false,
    socket: app.socket,
    initialize: function () {
        _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
        
        if (!this.noIoBind) {
            this.ioBind('update', this.serverChange, this);
            this.ioBind('delete', this.serverDelete, this);
        }
    },
    serverChange: function (data) {
        data.fromServer = true;
        this.set(data);
    },
    serverDelete: function (data) {
        if (this.collection) {
            this.collection.remove(this);
        } 
        else {
            this.trigger('remove', this);
        }
        this.modelCleanup();
    },
    modelCleanup: function () {
        this.ioUnbindAll();
        return this;
    }
});
/* ----------------------------------------- 2.-Colecciones ----------------------------------------- */
window.CoClientesList = Backbone.Collection.extend({
    model: app.MoCliente,
    url: 'clientes',
    socket: app.socket,
    initialize: function () {
        _.bindAll(this, 'serverCreate', 'collectionCleanup');
        this.ioBind('create', this.serverCreate, this);
    },
    serverCreate: function (data) {
        // make sure no duplicates, just in case
        var exists = this.get(data.id);
        if (!exists) {
            this.add(data);
        } 
        else {
            data.fromServer = true;
            exists.set(data);
        }
    },
    collectionCleanup: function (callback) {
        this.ioUnbindAll();
        this.each(function (model) {
            model.modelCleanup();
        });
        return this;
    }
});
window.CoContratosList = Backbone.Collection.extend({
    model: app.MoContrato,
    url: 'contratos',
    socket: app.socket,
    initialize: function () {
        _.bindAll(this, 'serverCreate', 'collectionCleanup');
        this.ioBind('create', this.serverCreate, this);
    },
    serverCreate: function (data) {
        debugger;
        // make sure no duplicates, just in case
        var exists = this.get(data.id);
        if (!exists) {
            this.add(data);
        } 
        else {
            data.fromServer = true;
            exists.set(data);
        }
    },
    collectionCleanup: function (callback) {
        this.ioUnbindAll();
        this.each(function (model) {
            model.modelCleanup();
        });
        return this;
    },
    /* -------------------- OVERRIDE ---------------- */
    fetch: function(options) {        
        return Backbone.Collection.prototype.fetch.call(this, this.search);
    }
});
window.CoContratosHistList = Backbone.Collection.extend({
    model: app.MoContrato,
    url: 'contratosHist',
    socket: app.socket,
    initialize: function () {
        _.bindAll(this, 'serverCreate', 'collectionCleanup');
        this.ioBind('create', this.serverCreate, this);
    },
    serverCreate: function (data) {
        // make sure no duplicates, just in case
        var exists = this.get(data.id);
        if (!exists) {
            this.add(data);
        } 
        else {
            data.fromServer = true;
            exists.set(data);
        }
    },
    collectionCleanup: function (callback) {
        this.ioUnbindAll();
        this.each(function (model) {
            model.modelCleanup();
        });
        return this;
    }
});
window.CoEquiposList = Backbone.Collection.extend({
    model: app.MoEquipo,
    url: 'equipos',
    socket: app.socket,
    initialize: function () {
        _.bindAll(this, 'serverCreate', 'collectionCleanup');
        this.ioBind('create', this.serverCreate, this);
    },
    serverCreate: function (data) {
        // make sure no duplicates, just in case
        var exists = this.get(data.id);
        if (!exists) {
            this.add(data);
        } 
        else {
            data.fromServer = true;
            exists.set(data);
        }
    },
    collectionCleanup: function (callback) {
        this.ioUnbindAll();
        this.each(function (model) {
            model.modelCleanup();
        });
        return this;
    }
});
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
        this.form[0].reset();
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
        this.txtNombre.doFocus();
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

app.ViContrato = Backbone.View.extend({
    el: '#pnlContrato',
    events: {
        'click #btnGuardar'     : 'click_btnGuardar',
        'click #btnVisualizar'  : 'click_btnVisualizar',
        'keyup #tyaCliente'     : 'keyup_tyaCliente',
        'keyup #tyaEquipo'      : 'keyup_tyaEquipo'
    },
    initialize: function() {
        var that = this;        
        this.form = this.$el.children('form');
        
        this.tyaCliente = this.form.find('#tyaCliente');
        this.tyaEquipo = this.form.find('#tyaEquipo');
        this.txaAccesorios = this.form.find('#txaAccesorios');
        this.rpContrato = this.$el.find('.rp-contrato');
        this.txtDeposito = this.$el.find('#txtDeposito');
        this.txtInteres = this.$el.find('#txtInteres');
        this.txtRecibio = this.$el.find('#txtRecibio');
        
        this.tyaCliente.busqueda = app.ut.tyAhead({elem:this.tyaCliente, url:'/GetClientesBySearch', done:doneCl});
        this.tyaEquipo.busqueda = app.ut.tyAhead({elem:this.tyaEquipo, url:'/GetEquiposBySearch', done:doneEq, tmp:app.templates.tyaBase});
        
        function doneEq(data, process) {
            for(var i = 0; i < data.length; i++)
                data[i].dKey = 'NT-' + data[i].sku + ' - ' + data[i].nombre;
            process(data);
        }
        
        function doneCl(data, process) {
            for(var i = 0; i < data.length; i++)
                data[i].dKey = data[i].nombre.nombre + ' ' + data[i].nombre.apaterno + ' ' + data[i].nombre.amaterno;
            process(data);
        }
        
        this.form.on('valid', function (e) {
			e.preventDefault();
			that.save();
		}).on('submit', function (e) {
			e.preventDefault();
		});
    },
    render: function() {
        this.rpContrato.html(app.templates.rp_contratos(this.getData()));
        this.$el.css({visibility:'visible'}).removeClass('isHidden reveal-modal').addClass('active-view').fadeIn();
    },
    renderContrato: function() {
        this.rpContrato.html(app.templates.rp_contratos(this.getData()));
    },
    clear: function() {
        this.form[0].reset();
        this.tyaCliente.removeData('current');
        this.tyaEquipo.removeData('current');
    },
    getData: function() {
        var feIni = new Date(),
            feFin = new Date(),
            hora = (feIni.getHours() % 12).toString(),
            minutos = feIni.getMinutes().toString(),
            fullHora = (hora.length == 1 ? '0' + hora : hora) + ':' + (minutos.length == 1 ? '0' + minutos : minutos);
        
        feFin.setMonth(feFin.getMonth() + 1);
        
        var json = {
            folio: 'xxx-xxx',
            feIni: feIni,
            feFin: feFin,
            hora: fullHora,
            deposito: 0,
            interes: '_____',
            recibio: '_____',
            
            cliente: {
                _id: null,
                telefono: '_____',
                identificacion: '_____',
                nombre: {
                    nombre: '_____',
                    apaterno: '_____',
                    amaterno: '_____'
                },
                direccion: {
                    calle: '_____',
                    municipio: '_____',
                    colonia: '_____',
                    numero: '_____'
                }
            },
            equipo: {
                _id: null,
                nombre: '_____',
                descripcion: '_____',
                sku :'_____',
                accesorios: '_____',
                precioDia: '_____'
            }
        };
        
        var dataCli = this.tyaCliente.data('current'),
            dataEqu = this.tyaEquipo.data('current');
        
        json.deposito = this.txtDeposito.val();
        json.interes = this.txtInteres.val();
        json.recibio = this.txtRecibio.val();
        
        if(dataCli)
            json.cliente = dataCli;
        
        if(dataEqu) {
            dataEqu.accesorios = this.txaAccesorios.val();            
            json.equipo = dataEqu;
        }
        
        return json;
    },
    save: function() {
        var json = new app.MoContrato(this.getData()).toJSON();
        
        app.CoContratos.create(json, {error:error, success:done, wait:true});
        this.clear();
        
        function done(model) {
            var template = app.templates.rp_contratos(model.toJSON());
            app.ut.print({body:template, class:'rp-contrato'});
        }
        
        function error(data, xrh) {
            console.log(data);
            console.log(xrh);
            
            alert(xrh.status + ' - ' + xrh.statusText + ' : ' + xrh.responseText);
        }
    },
    /* ---------------------------------------- eventos ---------------------------------------- */
    click_btnGuardar: function() {
        this.form.submit();
    },
    click_btnVisualizar: function() {
        app.vi.Contrato.renderContrato();
    },
    keyup_tyaCliente: function(e) {
        if(e.keyCode == 13 && e.currentTarget.value.length > 0)
            app.vi.Contrato.tyaCliente.busqueda.execQuery();
    },
    keyup_tyaEquipo: function(e) {
        if(e.keyCode == 13 && e.currentTarget.value.length > 0)
            app.vi.Contrato.tyaEquipo.busqueda.execQuery();
    }
});
app.ViContratos = Backbone.View.extend({
    el: '#pnlContratosConsulta',
    events: {
        'click .pagination a': 'change_page'
    },
    initialize: function() {
        var that = this;
        
        this.txtBusqueda = this.$el.find('#txtBusqueda');
        this.pagination =this.$el.find('.pagination');
        
        this.gvContratos = this.$el.find('table#gvContratos');        
        this.listenTo(app.CoContratos, 'add', this.addTR);
        
        this.call = null;
        
        app.ut.search({elem:this.txtBusqueda, done: this.keyup_txtBusqueda});
    },
    render: function(){
        this.$el.css({visibility:'visible'}).removeClass('isHidden reveal-modal').addClass('active-view').fadeIn();  
    },
    addTR: function(model) {
        var per = new app.ViContratoTR({model:model}).render();        
        this.gvContratos.children('tbody').prepend(per.$el);
    },
    /*-------------------------- Eventos --------------------------*/
    keyup_txtBusqueda: function(search) {
        console.log('search: ' + search);
        
        app.CoContratos.each(function(model) {
            var cliente = model.get('cliente').nombre,
                nombre = cliente.nombre + ' ' + cliente.apaterno + ' ' + cliente.amaterno;
            
            var regex = new RegExp(search);
            if(nombre.search(regex) >= 0) {
                model.set('visible', true);
                if(model.view == null)
                    app.vi.Contratos.addTR(model);
            }
            else
                model.set('visible', false);
        });
    }
});
app.ViContratoEntrega = Backbone.View.extend({
    el: '#popContratoEntrega',
    events: {
        'click #btnAceptar': 'click_btnAceptar',
        'click #btnCancelar': 'click_btnCancelar'
    },
    initialize: function() {
        this.form = this.$el.find('form');
        
        this.gvDatos = this.form.find('#gvDatos');
        this.txtComprobante = this.form.find('#txtComprobante');
        
        this.modelFake = null;
        this.data = null;
    },
    render: function(model){
        this.clear();
        this.modelFake = model;
        
        var cliente = model.get('cliente').nombre,
            nombre = cliente.nombre + ' ' + cliente.apaterno + ' ' + cliente.amaterno,
            precioDia = model.get('equipo').precioDia,
            feIni = new Date(model.get('feIni')),
            
            feEntrega = new Date(),
            count = 0;
        
        do {
            feIni.setDate(feIni.getDate() + 1);
            if(feIni.getDay() > 0)
                count++;
        } while(feIni.toString().toShortDate() < feEntrega.toString().toShortDate());
        
        this.data = {
            cliente: nombre,
            inicio: model.get('feIni'),
            final: feEntrega,
            dias: count,
            precioDias: precioDia,
            total: count * precioDia
        };
        
        this.gvDatos.children('tbody').html(app.templates.tr_contrato_entrega(this.data));        
        this.$el.foundation('reveal', 'open');
        
        this.txtComprobante.doFocus();
    },
    clear: function() {
        this.form[0].reset();
        this.modelFake = null;
        this.data = {};
    },
    hide: function() {
        this.$el.foundation('reveal', 'close');
    },
    /*-------------------------- Eventos --------------------------*/
    click_btnAceptar: function() {
        this.modelFake.save({feEntrega:this.data.final, diasRenta:this.data.dias});
        this.modelFake.view.remove();
        app.CoContratosHist.add(this.modelFake);
        app.CoContratos.remove(this.modelFake);
        
        this.hide();
    },
    click_btnCancelar: function() {
        this.hide();
    }
});
app.ViContratosHistorial = Backbone.View.extend({
    el: '#pnlContratosHist',
    events: {},
    initialize: function() {
        this.txtBusqueda = this.$el.find('#txtBusqueda');
        
        this.gvContratos = this.$el.find('table#gvContratos');        
        this.listenTo(app.CoContratosHist, 'add', this.addTR);
        
        this.call = null;
        
        app.ut.search({elem:this.txtBusqueda, done: this.keyup_txtBusqueda});
    },
    render: function(){
        this.$el.css({visibility:'visible'}).removeClass('isHidden reveal-modal').addClass('active-view').fadeIn();  
    },
    addTR: function(model) {
        var per = new app.ViContratoTR({model:model}).render();        
        this.gvContratos.children('tbody').prepend(per.$el);
    },
    /*-------------------------- Eventos --------------------------*/
    keyup_txtBusqueda: function(search) {
        console.log('search: ' + search);
        
        app.CoContratosHist.each(function(model) {
            var cliente = model.get('cliente').nombre,
                nombre = cliente.nombre + ' ' + cliente.apaterno + ' ' + cliente.amaterno;
            
            var regex = new RegExp(search);
            if(nombre.search(regex) >= 0) {
                model.set('visible', true);
                if(model.view == null)
                    app.vi.ContratosHistorial.addTR(model);
            }
            else
                model.set('visible', false);
        });
    }
});
app.ViContratoTR = Backbone.View.extend({
    tagName: 'tr',
    events: {
        'click .fa-bolt'        : 'click_visualizar',
        'click .fa-download'    : 'click_entrega'
    },
    initialize: function() {
        this.listenTo(this.model, 'change:visible', this.check_Visible);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function(){
        var jData = this.model.toJSON();        
        this.$el.html(app.templates.tr_contrato(jData));
        this.model.view = this;    
        
        return this;
    },
    /*-------------------------- Eventos --------------------------*/
    check_Visible: function() {
        if(this.model.get('visible') == false) {
            this.model.view = null;
            this.remove();
        }
    },
    click_visualizar: function() {
        console.log(this.model);
        
        var template = app.templates.rp_contratos(this.model.toJSON());
        app.ut.print({body:template, class:'rp-contrato'});
    },
    click_entrega: function() {
        app.vi.ContratoEntrega.render(this.model);
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
        
        app.ut.getJson({url:'GetFamilias', done:done});
        
        function done(data) {
            app.cbos.familias = data;
            
            var arr = [];
            for(var i = 0; i < app.cbos.familias.length; i++) {
                var familia = app.cbos.familias[i];
                arr.push({_id:familia._id, nombre:familia.nombre, dKey:familia.nombre});
            }
            
            app.ut.tyAhead({elem:that.tyaFamilias, arr:arr});
        }
        
        this.form.on('valid', function (e) {
			e.preventDefault();
			that.save();
		}).on('submit', function (e) {
			e.preventDefault();
		});
    },
    clear: function() {
        this.form[0].reset();
        this.tyaFamilias.removeData('current');
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
        
        this.tyaFamilias.doFocus();
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
            precioDia       : this.txtPrecioDia.val()
        };
        
        return json;
    },
    setData: function(json) {
        json.idFamilia.dKey = json.idFamilia.nombre;
        
        this.txtNE.val(json.sku);
        this.tyaFamilias.data('current', json.idFamilia).val(json.idFamilia.dKey);
        this.txtNombre.val(json.nombre);
        this.txtMarca.val(json.marca);
        this.txaDescripcion.val(json.descripcion);
        this.txtDiasTrabajo.val(json.diasTrabajados);
        this.txtPrecioDia.val(json.precioDia);
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
        'contrato/:estado'  : 'contrato',
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
    contrato: function(estado) {
        app.vi.Main.nav.find('a[href^="#contrato"]').parents('li').addClass('active');
        $('.active-view').addClass('isHidden').hide();
        switch(estado) {
            case 'alta':
                app.vi.Contrato.render();
                break;
            case 'consulta':
                app.vi.Contratos.render();
                break;
            case 'historial':
                app.vi.ContratosHistorial.render();
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
    
    window.socket = io.connect('http://localhost:3000');
    app.socket = window.socket;
    
    app.CoClientes = new window.CoClientesList();
    app.CoContratos = new window.CoContratosList();
    app.CoContratosHist = new window.CoContratosHistList();
    app.CoEquipos = new window.CoEquiposList();
    
    new app.router;
	app.ut = new utilerias();
    app.templates = new templates();
    
    app.cbos = {};
    app.vi = {
        Main: new app.vwMain(),
        Cliente: new app.ViCliente(),
        Clientes: new app.ViClientes(),
        Contrato: new app.ViContrato(),
        Contratos: new app.ViContratos(),
        ContratoEntrega: new app.ViContratoEntrega(),
        ContratosHistorial: new app.ViContratosHistorial(),
        Equipo: new app.ViEquipo(),
        Equipos: new app.ViEquipos()
	};
    
	/*app.keytrap = new keytrap();*/
    app.CoEquipos.fetch();
    app.CoClientes.fetch();
    app.CoContratos.fetch();
    app.CoContratosHist.fetch();
    Backbone.history.start({
        root: '/'
    });
    //window.print();
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
        meses   : GetMeses(),
        message : Message,
        print   : Print,
        search  : Search,
		show    : Show,
        toWords : ToWords,
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
    
    function GetMeses() {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses;
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
    
    function Print(json) {
        var modal = json.el || $('#popImprimir'),
			body = json.body || '/',
            clase = json.class || '';
        
        $('#print-area').removeClass().addClass(clase).html(body);
		modal.find('#modal-body').removeClass().addClass(clase).html(body);

		modal.find('#btnImprimir').off('click').on('click', fnDone);
		modal.find('#btnCancelar').off('click').on('click', fnHide);
        modal.off('close').on('close', fnHide);

		modal.foundation('reveal', 'open');

		function fnDone() {
            modal.off('close');
            window.print();
			modal.foundation('reveal', 'close');
		}

		function fnHide(e) {
            modal.off('close');
            if(e.type != 'close')
                modal.foundation('reveal', 'close');
		}
    }
    
    function Search(json) {
        var elem = json.elem,
            _done = json.done,
            _timeout = json.timeout || 1000,
            search = '',
            currSearch = '',
            callback = null;
        
        elem.on('keyup', keyup_search);
        function keyup_search(e) {
            search = e.currentTarget.value;
            
            if(currSearch == search) {
                clearTimeout(callback);
            }
            else if(e.keyCode == 13) {
                clearTimeout(callback);
                ExecSearch();
                return;
            }
            else {            
                if(callback != null)
                    clearTimeout(callback);
                
                callback = setTimeout(ExecSearch, _timeout);
            }
        }
        
        function ExecSearch() {
            currSearch = search;
            _done(search);
            callback = null;
        }
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
    
    function ToWords(value) {
        
        function Unidades(num) {
            switch(num)
            {
                case 1: return 'UN';
                case 2: return 'DOS';
                case 3: return 'TRES';
                case 4: return 'CUATRO';
                case 5: return 'CINCO';
                case 6: return 'SEIS';
                case 7: return 'SIETE';
                case 8: return 'OCHO';
                case 9: return 'NUEVE';
            }    
            return '';
        }
        
        function Decenas(num) {
            decena = Math.floor(num/10);
            unidad = num - (decena * 10);
        
            switch(decena)
            {
                case 1:   
                    switch(unidad)
                    {
                        case 0: return 'DIEZ';
                        case 1: return 'ONCE';
                        case 2: return 'DOCE';
                        case 3: return 'TRECE';
                        case 4: return 'CATORCE';
                        case 5: return 'QUINCE';
                        default: return 'DIECI' + Unidades(unidad);
                    }
                case 2:
                    switch(unidad)
                    {
                        case 0: return 'VEINTE';
                        default: return 'VEINTI' + Unidades(unidad);
                    }
                case 3: return DecenasY('TREINTA', unidad);
                case 4: return DecenasY('CUARENTA', unidad);
                case 5: return DecenasY('CINCUENTA', unidad);
                case 6: return DecenasY('SESENTA', unidad);
                case 7: return DecenasY('SETENTA', unidad);
                case 8: return DecenasY('OCHENTA', unidad);
                case 9: return DecenasY('NOVENTA', unidad);
                case 0: return Unidades(unidad);
            }
        }//Unidades()
        
        function DecenasY(strSin, numUnidades) {
            if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)
            
            return strSin;
        }//DecenasY()
        
        function Centenas(num) {
            centenas = Math.floor(num / 100);
            decenas = num - (centenas * 100);
            
            switch(centenas)
            {
                case 1:
                    if (decenas > 0)
                        return 'CIENTO ' + Decenas(decenas);
                    return 'CIEN';
                case 2: return 'DOSCIENTOS ' + Decenas(decenas);
                case 3: return 'TRESCIENTOS ' + Decenas(decenas);
                case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
                case 5: return 'QUINIENTOS ' + Decenas(decenas);
                case 6: return 'SEISCIENTOS ' + Decenas(decenas);
                case 7: return 'SETECIENTOS ' + Decenas(decenas);
                case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
                case 9: return 'NOVECIENTOS ' + Decenas(decenas);
            }
            
            return Decenas(decenas);
        }//Centenas()
        
        function Seccion(num, divisor, strSingular, strPlural) {
            cientos = Math.floor(num / divisor)
            resto = num - (cientos * divisor)
            
            letras = '';
            
            if (cientos > 0)
                if (cientos > 1)
                    letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;
            
            if (resto > 0)
                letras += '';
            
            return letras;
        }//Seccion()
        
        function Miles(num) {
            divisor = 1000;
            cientos = Math.floor(num / divisor)
            resto = num - (cientos * divisor)
            
            strMiles = Seccion(num, divisor, 'MIL', 'MIL');
            strCentenas = Centenas(resto);
            
            if(strMiles == '')
                return strCentenas;
            
            return strMiles + ' ' + strCentenas;
            
            //return Seccion(num, divisor, 'UN MIL', 'MIL') + ' ' + Centenas(resto);
        }//Miles()
        
        function Millones(num) {
            divisor = 1000000;
            cientos = Math.floor(num / divisor)
            resto = num - (cientos * divisor)
            
            strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES');
            strMiles = Miles(resto);
            
            if(strMillones == '')
                return strMiles;
            
            return strMillones + ' ' + strMiles;
            
            //return Seccion(num, divisor, 'UN MILLON', 'MILLONES') + ' ' + Miles(resto);
        }//Millones()
        
        function NumeroALetras(num) {
            var data = {
                numero: num,
                enteros: Math.floor(num),
                centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
                letrasCentavos: '',
                letrasMonedaPlural: 'PESOS',
                letrasMonedaSingular: 'PESO'
            };
        
            if (data.centavos > 0)
                data.letrasCentavos = 'CON ' + data.centavos + '/100 M.N.';
            else
                data.letrasCentavos = 'CON 00/100 M.N.';
                
        
            if(data.enteros == 0)
                return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
            if (data.enteros == 1)
                return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
            else
                return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        }
        
        return NumeroALetras(value);
    }
    
    function Typeahead(json) {
        var arr = json.arr || [],
            elem = json.elem,
            url = json.url || '',
            displayKey = json.dKey || 'dKey',
            template = json.tmp || app.templates.tyaTmp,
            fail = json.fail || __Fake,
            done = json.done || _FakeAhead,
            _callSearch = null,
            _query = null,
            _process = null,
            _timeout = 1000,
            _metodo = url.length > 0 ? searchQuery : prepareCollection();
        
        elem.typeahead(null, {
            name: 'familias',
            displayKey: displayKey,
            source: _metodo,
            templates: {
                suggestion: template
            }
        })
        .data('dKey', displayKey)
        .on('typeahead:selected typeahead:autocompleted', function(e, datum) {
            var curElem = $(e.currentTarget);
            curElem.data('current', datum).val(datum[curElem.data('dKey')]);
            console.log(datum)
        })
        .on('blur', function(e) {
            var elem = $(e.currentTarget);
            if(elem.data('current')) {
                if(elem.data('current').nombre != elem.val()) {
                    var datum = elem.data('current');
                    elem.val(datum.dKey);
                }
            }
            else
                elem.val('');
        });
        
        function execQuery() {
            if(_callSearch)
                clearTimeout(_callSearch);
            
            fSeacrh();
        }
        
        function fSeacrh() {
            $.getJSON(url, {query:_query}).done(wrapDone).fail(wrapFail).always(always);
            
            function always() {
                _query = null;
                _callSearch = null;
            }
            function wrapFail(xhr, err) {
                fail(xhr, err);
            }
            function wrapDone(data) {
                done(data, _process);
            }
        }
        
        function prepareCollection() {
            var nombres = new Bloodhound({
              datumTokenizer: function(datum) {
                  return Bloodhound.tokenizers.whitespace(datum.dKey); 
              },
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              local: arr
            });
            
            nombres.initialize();
            
            return nombres.ttAdapter();
        }
        
        function searchQuery(query, process) {
            _query = query;
            _process = process;
            
            console.log(query);
            if(_callSearch)
                clearTimeout(_callSearch);
            
            _callSearch = setTimeout(fSeacrh, _timeout);
        }
        
        function selectSource() {
            return url.length > 0 ? searchQuery : prepareCollection();
        }
        
        function _FakeAhead(data, process) {
            process(data);
        }
        
        return {
            execQuery: execQuery
        };
    }
    
    function __Fake(xhr) {
        console.log(xhr);
    }
}

function templates(){
    Handlebars.registerHelper('SetIconEntrega', function(feEntrega){
        if(feEntrega == null)
		  return new Handlebars.SafeString('<span> |</span> <i class="fa fa-download"></i>');
        
        return '';
	});
    
    Handlebars.registerHelper('GetLocalDate', function(fecha){
		return fecha == null ? '' : fecha.toString().toShortDate();
	});
    
	Handlebars.registerHelper('GetFullDate', function(fecha){
        var newDate = new Date(fecha);
        
        var dia = newDate.getDate(),
            mes = newDate.getMonth(),
            año = newDate.getFullYear();
        
		return dia + ' de ' + app.ut.meses[mes] + ' del ' + año;
	});
    
    Handlebars.registerHelper('GetWord', function(value){
        return app.ut.toWords(value);
	});    
    
	var alertas = Handlebars.compile("<div data-alert class='alert-box alert radius'><label>{{message}}</label><a href='#' class='close'><i class='fa fa-times fa-inverse'></i></a></div>"),
        cbo = Handlebars.compile('{{#data}} <option value="{{id}}">{{nombre}}</option> {{/data}}'),
        cbo_familias = Handlebars.compile($('#tmp_cbo_familias').html()),
        
        rp_contratos = Handlebars.compile($('#tmp_rp_contratos').html()),
        
        tr_cliente = Handlebars.compile($('#tmp_tr_cliente').html()),
        tr_contrato = Handlebars.compile($('#tmp_tr_contrato').html()),
        tr_contrato_entrega = Handlebars.compile($('#tmp_tr_contrato_entrega').html()),
        tr_equipo = Handlebars.compile($('#tmp_tr_equipo').html()),
        
        tyaBase = Handlebars.compile('NT-{{sku}} - {{nombre}}'),
        tyaTmp = Handlebars.compile('{{dKey}}')        
        ;

	return {
        alertas: alertas,
        cbo: cbo,
        
        rp_contratos: rp_contratos,
        
        tr_cliente: tr_cliente,
        tr_contrato: tr_contrato,
        tr_contrato_entrega: tr_contrato_entrega,
        tr_equipo: tr_equipo,
        
        tyaBase: tyaBase,
        tyaTmp: tyaTmp
	}
}
/* ----------------------------------------- 8.-Templates ----------------------------------------- */
/* ----------------------------------------- 9.-Pruebas ----------------------------------------- */
/* ----------------------------------------- 0.-Prototype ----------------------------------------- */
function Bases(){
    jQuery.fn.extend({
        doFocus: function() {
            var that = this;
            setTimeout(function() { 
                that.focus();
            }, 1000);
        }
    });
    
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
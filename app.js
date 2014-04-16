/*
 * 1.-Variables, set y use
 * 2.-Rutas
 * 3.-MongoDB
 * 4.-SockeIO
 * 5.-Passport
 * 6.-Funciones
*/
/* ------------------------------- 1.-Variables, set y use ------------------------------- */
var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
	_ = require('lodash');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(stylus.middleware({src:__dirname, compile: compile}));
app.use(express.static(__dirname));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

var server = require('http').Server(app)//,
	//io = require('socket.io').listen(server);
server.listen(process.env.PORT || 3000);

/* ------------------------------- 2.-Rutas ------------------------------- */
app.get('/', function (req, res){
    if (req.isAuthenticated())
        res.redirect('/main');
    
    res.render('bsLogin', {title:'Control de visitas'});
});
app.post('/', function(req, res) {
    function next() {
        console.log('=================================================== inner ===================================================');
    }
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          req.session.messages =  [info.message];
          res.render('bsLogin', {title:'Control de visitas', message:info.message});
        }
        
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/main');
        });
    })(req, res, next);
});

app.get('/main', /*ensureAuthenticated,*/ function (req, res){
    res.render('bsMenu', {title:'Control de visitas', usuario:'tempo'});//, usuario:req.user.Usuario});
});

app.get('/GetFamilias', function(req, res) {
    
    mongo.familias.find({}, function (err, documents) {
        console.log('----------------------------fetch familias mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(documents);
            res.json(documents);
        }
    });
    
});

app.get('/GetEquiposBySearch', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch equipos');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    console.log(req.query);
    var search = req.query.query,
        limit = 10;
    
    mongo.equipos.find({ 
        activo:true, 
        $or: [
            { 'nombre':{ '$regex':search } },
            { sku:{ '$regex':search } }
        ] }, { nombre:1, marca:1, precioDia:1, sku:1 }).limit(limit).exec(function (err, documents) {
        console.log('----------------------------fetch equipos mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});
app.get('/GetEquipos', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch equipos');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    
    mongo.equipos.find({ activo:true }).populate('idFamilia', {nombre:1}).exec(function (err, documents) {
        console.log('----------------------------fetch equipos mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});
app.post('/SaveEquipo', /*ensureAuthenticated,*/ function(req, res) {
    console.log('save equipo');
    console.log(req.body);
    
    if(req.body.idFamilia)
        req.body.idFamilia = req.body.idFamilia._id;
    
    var equipo = new mongo.equipos(req.body);
    equipo.save(function (err, document){
        console.log('----------------------------save equipo mongo----------------------------------');
        
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(document);
            res.json({_id:document._id});
        }
    });
});
app.put('/SaveEquipo/:id', /*ensureAuthenticated,*/ function(req, res) {
    console.log('update equipo');
    console.log(req.body);
    
    var id = req.body._id.toString();    
    json = req.body;
    delete json._id;
    
    json.idFamilia = json.idFamilia._id; 
    
    console.log(id);
    mongo.equipos.update({_id:id}, json, {multi:false}, function(err) {
        console.log('----------------------------update equipo mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else
            res.send();
    });
});
app.delete('/SaveEquipo/:id', /*ensureAuthenticated,*/ function(req, res) {
    console.log('delete equipo');
    console.log(req.params.id);
    
    mongo.equipos.findByIdAndRemove(req.params.id, function(err, document) {
        console.log('----------------------------delete equipo mongo----------------------------------');
        console.log(document);
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else
            res.json({ok:1});
    });
});

app.get('/GetClientesBySearch', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch clientes');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    console.log(req.query);
    var search = req.query.query,
        limit = 10;
    
    mongo.clientes.find({ 
        activo:true, 
        $or: [
            { 'nombre.nombre':{ '$regex':search } },
            { 'nombre.apaterno':{ '$regex':search } },
            { 'nombre.amaterno':{ '$regex':search } }
        ] }, { nombre:1, direccion:1, identificacion:1, telefono:1 }).limit(limit).exec(function (err, documents) {
        console.log('----------------------------fetch clientes mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});
app.get('/GetClientes', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch clientes');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    
    mongo.clientes.find({ activo:true }, function (err, documents) {
        console.log('----------------------------fetch clientes mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});
app.post('/SaveCliente', /*ensureAuthenticated,*/ function(req, res) {
    console.log('save cliente');
    console.log(req.body);
        
    var cliente = new mongo.clientes(req.body);
    cliente.save(function (err, document){
        console.log('----------------------------save cliente mongo----------------------------------');
        
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(document);
            res.json({_id:document._id});
        }
    });
});
app.put('/SaveCliente/:id', /*ensureAuthenticated,*/ function(req, res) {
    console.log('update eqclienteuipo');
    console.log(req.body);
    
    var id = req.body._id.toString();    
    json = req.body;
    delete json._id;
    
    console.log(id);
    mongo.clientes.update({_id:id}, json, {multi:false}, function(err) {
        console.log('----------------------------update cliente mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else
            res.send();
    });
});
app.delete('/SaveCliente/:id', /*ensureAuthenticated,*/ function(req, res) {
    console.log('delete cliente');
    console.log(req.params.id);
    
    mongo.clientes.findByIdAndRemove(req.params.id, function(err, document) {
        console.log('----------------------------delete cliente mongo----------------------------------');
        console.log(document);
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else
            res.json({ok:1});
    });
});

app.get('/GetContratos', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch contratos');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    
    mongo.contratos
            .find({ activo:true, feEntrega:null })
            .populate('cliente', { nombre:1, direccion:1, identificacion:1, telefono:1 })
            .populate('equipo', { nombre:1, marca:1, precioDia:1, sku:1 })
            .exec(function (err, documents) {
                console.log('----------------------------fetch contratos mongo----------------------------------');
                if(err) {
                    console.log('Error:'+err);
                    res.send('Error:'+err, 410);
                }
                else {
                    console.log(documents);
                    res.json(documents);
                }
            });
});
app.get('/GetContratosHist', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch contratos');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    
    mongo.contratos
            .find({ activo:true, feEntrega:{$ne:null} })
            .populate('cliente', { nombre:1, direccion:1, identificacion:1, telefono:1 })
            .populate('equipo', { nombre:1, marca:1, precioDia:1, sku:1 })
            .exec(function (err, documents) {
                console.log('----------------------------fetch contratos mongo----------------------------------');
                if(err) {
                    console.log('Error:'+err);
                    res.send('Error:'+err, 410);
                }
                else {
                    console.log(documents);
                    res.json(documents);
                }
            });
});
app.post('/SaveContrato', /*ensureAuthenticated,*/ function(req, res) {
    console.log('save contratos');
    console.log(req.body);
    var json = req.body;
    
    json.folio = 0;
    if(json.cliente)
        json.cliente = json.cliente._id;
    if(json.equipo)
        json.equipo = json.equipo._id;
    
    delete json.folio;
    var contrato = new mongo.contratos(json);
    contrato.save(function (err, document){
        console.log('----------------------------save contratos mongo----------------------------------');
        
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else {
            console.log(document);
            res.json({_id:document._id, folio:document.folio});            
        }
    });
});
/* ------------------------------- 3.-MongoDB ------------------------------- */
mongoose.connect('mongodb://localhost/neumatics');
var db = mongoose.connection,
	mongo = {};

autoIncrement.initialize(db);
db.on('error', console.error.bind(console, 'conection error:'));
db.once('open', function callback(){    
	var ScUsuarios = mongoose.Schema({
			usuario 	: String,
			password	: String
		}, {versionKey: false}),
		ScClientes = mongoose.Schema({
			nombre          : {
                                nombre 		: String,
                                apaterno 	: String,
                                amaterno 	: String
                            },
            direccion       : {
                                calle 		: String,
                                numero      : String,
                                colonia 	: String,
                                municipio 	: String
                            },
            rfc             : String,
            telefono        : String,
            identificacion  : String,
            activo          : Boolean
		}, {versionKey: false}),
        ScEquipos = mongoose.Schema({
            sku             : {
                                type    : String,
                                unique  : true
                            },
            nombre          : String,
            descripcion     : String,
            descBaja        : String,
            marca           : String,
            precioDia       : Number,
            diasTrabajados  : Number,
            activo          : Boolean,
            idFamilia       : {
                                type    : mongoose.Schema.Types.ObjectId, 
                                ref     : 'familias'
                            }
		}, {versionKey: false}),
        ScFamilias = mongoose.Schema({
            sku     : String,
            nombre  : String,
            tipo    : Number,
            activo  : Boolean
		}, {versionKey: false}),
        ScContratos = mongoose.Schema({
            deposito: Number,
            folio       : Number,
            feIni       : Date,
            feFin       : Date,
            feEntrega   : Date,
            hora        : String,            
            interes     : Number,
            recibio     : String,
            activo      : Boolean,
            
            cliente     : {
                type    : mongoose.Schema.Types.ObjectId, 
                ref     : 'clientes'
            },
            equipo      : {
                type    : mongoose.Schema.Types.ObjectId, 
                ref     : 'equipos'
            }
		}, {versionKey: false});

    ScContratos.plugin(autoIncrement.plugin, { model: 'contratos', field: 'folio', startAt: 1, incrementBy: 1 });
    
	mongo.usuarios = mongoose.model('usuarios', ScUsuarios);
	mongo.clientes = mongoose.model('clientes', ScClientes);
    mongo.equipos = mongoose.model('equipos', ScEquipos);
    mongo.familias = mongoose.model('familias', ScFamilias);
	mongo.contratos = mongoose.model('contratos', ScContratos);
});

/* ------------------------------- 4.-SockeIO ------------------------------- */


/* ------------------------------- 5.-Passport ------------------------------- */
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    mongo.usuarios.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
    mongo.usuarios.findOne({usuario:username, password:password}, function(err, usuario){
        if (err) return done(err);
        
        if (!usuario)
            return done(null, false, { message: 'El usuario y/o la constraseña son incorrectos. Intente de nuevo.' });
        else
            return done(null, usuario)
    });       
}));

/* ------------------------------- 6.-Funciones ------------------------------- */
function compile(str, path){
	return stylus(str)
			.set('filename', path)
			.use(nib());
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
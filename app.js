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
app.get('/jData', /*ensureAuthenticated,*/ function (req, res){
    console.log('jData');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    
    console.log(req.query.query);
    var query = req.query.query,
        json = {
            $or: [ 
                    {'nombre.nombre': {$regex:'.*'+query+'.*'}}, 
                    {'nombre.apaterno': {$regex:'.*'+query+'.*'}}, 
                    {'nombre.amaterno': {$regex:'.*'+query+'.*'}}
            ]
        };
    mongo.personas.find(json, {nombre:1}, function(err, documents) {
        console.log('----------------------------fetch persona mongo----------------------------------');
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

app.get('/GetPersonas/All', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch personas');
    //res.writeHead(200, { 'Content-Type': 'application/json'});
    
    mongo.personas.find({}).populate('invitado', {'nombre':1}).exec(function (err, documents) {
        console.log('----------------------------fetch persona mongo----------------------------------');
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
app.post('/SavePersona', /*ensureAuthenticated,*/ function(req, res) {
    console.log('save persona');
    console.log(req.body);
    
    if(req.body.invitado)
        req.body.invitado = req.body.invitado._id;    
    var persona = new mongo.personas(req.body);
    persona.save(function (err, document){
        console.log('----------------------------save persona mongo----------------------------------');
        
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
app.put('/SavePersona/:id', /*ensureAuthenticated,*/ function(req, res) {
    console.log('update persona');
    console.log(req.body);
    
    var id = req.body._id.toString();    
    json = req.body;
    delete json._id;
    
    if(json.invitado)
        json.invitado = json.invitado._id; 
    
    console.log(id);
    mongo.personas.update({_id:id}, json, {multi:false}, function(err) {
        console.log('----------------------------update persona mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else
            res.send();
    });
});
app.delete('/SavePersona/:id', /*ensureAuthenticated,*/ function(req, res) {
    console.log('delete persona');
    console.log(req.params.id);
    
    mongo.personas.findByIdAndRemove(req.params.id, function(err, document) {
        console.log('----------------------------delete persona mongo----------------------------------');
        console.log(document);
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else
            res.json({ok:1});
    });
});

app.get('/GetDiezmos/All', /*ensureAuthenticated,*/ function (req, res){
    console.log('fetch diezmos');
    
    mongo.diezmos.find({}).populate('idPersona', {'nombre':1}).exec(function(err, documents) {
        console.log('----------------------------fetch diezmos mongo----------------------------------');
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
app.post('/SaveDiezmo', /*ensureAuthenticated,*/ function(req, res) {
    console.log('save diezmo');
    console.log(req.body);
    
    var json = req.body;
    json.idPersona = json.idPersona._id;
    
    var diezmo = new mongo.diezmos(json);
    diezmo.save(function(err, document) {
        console.log('----------------------------save diezmo mongo----------------------------------');
        
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
app.put('/SaveDiezmo/:id', /*ensureAuthenticated,*/ function(req, res) {
    console.log('update diezmo');
    console.log(req.body);
    
    var id = req.body._id.toString(),
        json = req.body;
    
    json.idPersona = json.idPersona._id;
    delete json._id;
    
    mongo.diezmos.update({_id:id}, json, {multi:false}, function(err) {
        console.log('----------------------------update persona mongo----------------------------------');
        if(err) {
            console.log('Error:'+err);
            res.send('Error:'+err, 410);
        }
        else
            res.send();
    });
});
/* ------------------------------- 3.-MongoDB ------------------------------- */
mongoose.connect('mongodb://localhost/neumatics');
var db = mongoose.connection,
	mongo = {};
db.on('error', console.error.bind(console, 'conection error:'));
db.once('open', function callback(){    
	var ScUsuarios = mongoose.Schema({
			usuario 	: String,
			password	: String,
		}, {versionKey: false}),
		ScLogs = mongoose.Schema({
			evento       : String,
			tipo         : Number,
			idUsuario    : mongoose.Schema.Types.ObjectId
		}, {versionKey: false}),
		ScPersonas = mongoose.Schema({
			nombre      : {
                            nombre 		: String,
                            apaterno 	: String,
                            amaterno 	: String
                        },
			direccion 	: {
                            calle 		: String,
                            numero      : String,
                            colonia 	: String,
                            municipio 	: String
                        },
            facebook    : String,
            telefono    : String,
            cumpleanios : Date,
			feIngreso   : Date,
            tipo        : Number,
            invitado    : {
                            type    : mongoose.Schema.Types.ObjectId, 
                            ref     : 'personas'
                        }
		}, {versionKey: false}),
        ScDiezmos = mongoose.Schema({
			idPersona      : {
                                type    : mongoose.Schema.Types.ObjectId,
                                ref     : 'personas'
                         },
			cantidad     : Number,
			isSemana     : Boolean,
            fecha        : Date,
			comentario   : String
		}, {versionKey: false});

	mongo.usuarios = mongoose.model('usuarios', ScUsuarios);
	mongo.logs = mongoose.model('logs', ScLogs);
    mongo.personas = mongoose.model('personas', ScPersonas);
	mongo.diezmos = mongoose.model('diezmos', ScDiezmos);
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
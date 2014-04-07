var usuario = {
        usuario : 'admin',
        password: '1',
        mac     : ['04-7D-7B-3B-56-56', 'E0-69-95-C3-A8-E0']
    };
db.usuarios.insert(usuario);
db.usuarios.find();
    
var log = {
    evento      : 'inicio de sesion',
    tipo        : 1,
    mac         : 'E0-69-95-C3-A8-E0',
    idUsuario   : ObjectId("52eaea289c8caba5aaf775ba")
};
db.logs.insert(log);
    
var persona = {
        nombre          : {
                            nombre      : 'Eloy',
                            apaterno    : 'Urbina',
                            amaterno    : 'Mendez'
                        },
        direccion       : {
                            calle       : 'Calle',
                            numero      : 'Numero',
                            colonia     : 'Colonia',
                            municipio   : 'Durango'
                        },
        facebook        : 'x face',
        telefono        : '8-25-69-48',
        cumpleanios     : new Date(),
        feIngreso       : new Date(),
        tipo            : 1, //1.-Consolidado - 2.-Visita,
        invitado        : ObjectId("5310aa825bd15c205739d2fe")
};
db.personas.insert(persona);
    
var diezmo = {
        persona       : ObjectId("52eaea3b9c8caba5aaf775bc"),
        cantidad        : 250,
        isSemana        : true,
        fecha           : new Date(),     
        comentario      : 'Bendiciones'
    };
db.diezmos.insert(diezmo);


db.usuarios.find();
db.logs.find();
db.personas.find();
db.diezmos.find();
    
db.usuarios.remove();
db.logs.remove();
db.personas.remove();
db.diezmos.remove();

db.personas.find();
db.personas.remove({_id:ObjectId("5310aaa05bd15c205739d2ff")});
    
var query = 'alm';
db.personas.find({ $or: [ {'nombre.nombre': {$regex:'.*'+query+'.*'}}, {'nombre.apaterno': {$regex:'.*'+query+'.*'}} ] }, {nombre:1});
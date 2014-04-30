db.contratos.find();
/*
    db.contratos.remove();
    db.clientes.remove();
    db.equipos.remove();
*/

db.almacenes.find();
db.familias.find();
db.equipos.find();

var x = db.equipos.findOne();
x.rentado = false;
db.equipos.update({_id:x._id}, x);

var x = db.contratos.findOne();
x.status = 1;
db.contratos.update({_id:x._id}, x);









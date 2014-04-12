var search = 'Messi';
db.clientes.find({ 
     activo:true, 
     $or: [
        { 'nombre.nombre':{ '$regex':search } },
        { 'nombre.apaterno':{ '$regex':search } },
        { 'nombre.amaterno':{ '$regex':search } } 
     ]
});













db.contratos.find();

for(var i=103; i<203; i++) {
    db.contratos.insert({
        "folio" : i,
        "feIni" : ISODate("2014-04-15T17:49:51.463Z"),
        "feFin" : ISODate("2014-05-15T17:49:51.463Z"),
        "hora" : "00:49",
        "deposito" : 12345,
        "interes" : 8,
        "recibio" : "Gama G.",
        "cliente" : ObjectId("5345cb0dc9397ab829000001"),
        "equipo" : ObjectId("5345ad870f12aabc2b000003"),
        "activo" : true,
        "feEntrega" : null
    });
}

for(var i=11; i<102; i++) {
    db.contratos.insert({
        "folio" : i,
        "feIni" : ISODate("2014-04-15T17:49:51.463Z"),
        "feFin" : ISODate("2014-05-15T17:49:51.463Z"),
        "hora" : "00:49",
        "deposito" : 12345,
        "interes" : 8,
        "recibio" : "Gama G.",
        "cliente" : ObjectId("5345cb0dc9397ab829000001"),
        "equipo" : ObjectId("5345ad870f12aabc2b000003"),
        "activo" : true,
        "feEntrega" : ISODate("2014-04-15T17:49:51.463Z")
    });
}


















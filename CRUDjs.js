/*Plugin tabla CRUD en ECMASCRIPT */
class tablaCrud{
	constructor(contenedor = null){
		if(contenedor==null){
			console.log("Debes instanciar la clase : " + '\n var contenedor = document.getElementById("contenedor"); \n var tabla = new tablaCrud(contenedor);');
		}
		this.contenedor = contenedor;
		this.columnas = new Array();
		this.classTable = null;
		this.classThead = null;
		this.classTheadTh = null;
		this.registrosBD = new Array();
		this.tituloTabla = "";
		this.botonesmenuSuperior = new Array();
		this.paginaActual = 1;
		this.urlCargarDatos = null;
		this.jtStartIndex = 0;
		this.jtPageSize = 10;
		this.jtSorting = "";
		this.cantidadRegistrosPorPagina = 10;
		this.datoRegistro = "";
		this.contenedores = new Array();
		this.combobox = new Array();
		this.quitarBotonAgregar = false;
                this.quitarBotonEliminar = false;
                this.quitarBotonEditar = false;
		this.coockies = new Array();
		if(this.obtenerCookie("configTablaCrud")!=""){
			this.coockies = JSON.parse(this.obtenerCookie("configTablaCrud"));
		}
                this.parametrosBusquedas = new Array();
	}
        
        cargarRegistrosConFiltro(){
            this.paginaActual = 1;
            this.jtStartIndex = 0;
            this.jtPageSize = this.obtenerBotonCantidadRegistrosPorPagina().value;
            if(this.paginaActual==1){
                    this.jtStartIndex = 0;
            }else{
                    this.jtStartIndex = (this.obtenerBotonCantidadRegistrosPorPagina().value * this.paginaActual)-this.obtenerBotonCantidadRegistrosPorPagina().value;
            }

            //instanciaActual.jtSorting = "";
            this.ajaxCargarDatosTabla();
        }
        
        agregarParametroBusqueda(valor){
            this.parametrosBusquedas = valor;
        }
	obtenerTodosLosCombobox(){
            return this.combobox;
        }
        
        completarComboboxExterno(elemento,nombreCombobox){
            elemento.inneHTML = "";
            var select = "";
            var combobox = this.combobox;
            var instanciaActual = this;
            if(combobox.length==0){
                setTimeout(function(){ 
                    instanciaActual.completarComboboxExterno(elemento,nombreCombobox);
                }, 500);
            }
            for(var key in combobox){
                if(combobox[key].accion==nombreCombobox){
                    select = document.createElement("option");
                    this.agregarAtributo(select,"value","");
                    this.agregarTextoTagHtml(select,"Seleccione");
                    elemento.appendChild(select);
                    for(var key2 in combobox[key].registros){
                        var dato = combobox[key].registros;
                        select = document.createElement("option");
                        this.agregarAtributo(select,"value",dato[key2].Value);
                        this.agregarTextoTagHtml(select,dato[key2].DisplayText);
                        elemento.appendChild(select);
                    }
                }
            }
        }
        quitarEliminar(value){
            this.quitarBotonEliminar = value
        }
        
        quitarEditar(valor){
            this.quitarBotonEditar = valor;
        }
	agregarCoockieSinRepetir(campo,valor){
		//console.log(this.coockies);
		for(var key in this.coockies){
			if(this.coockies[key].numeroCabecera==campo){//Si esta repetido se modifica
				this.coockies[key].visible = valor;
				return true;
			}
		}
		this.coockies.push({numeroCabecera : campo, visible : valor});
	}
	
	agregarBoton(json){
		this.botonesmenuSuperior.push(json);
	}
	
	setCombobox(url,accion){
		this.combobox.push({url : url, accion : accion});
	}
	
	setContenedor(valor){
		this.contenedores.push(valor);
	}
	
	ordenacionPorDefecto(valor){
		this.jtSorting = valor;
	}
	
	obtenerBotonAgregarRegistros(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("div")[0].getElementsByTagName("button");
	}	
		
	obtenerSelectPaginaActual(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tfoot")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[2].getElementsByTagName("select")[0];
	}
	
	obtenerBotonInicio(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tfoot")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getElementsByTagName("span")[0];
	}
	
	obtenerBotonAtras(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tfoot")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[1].getElementsByTagName("span")[0];
	}
	
	obtenerBotonSiguiente(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tfoot")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[3].getElementsByTagName("span")[0];
	}
	
	obtenerBotonPaginaFinal(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tfoot")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[4].getElementsByTagName("span")[0];
	}
	
	obtenerBotonCantidadRegistrosPorPagina(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tfoot")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[5].getElementsByTagName("select")[0];
	}
	
	obtenerCabecerasTabla(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[1].getElementsByTagName("th");
	}
	
	obtenerFilasCuerpoTabla(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
	}
	
	obtenerCuerpoTabla(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
	}
	
	obtenerBotonOcultarColumnas(){
		return this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].getElementsByTagName("div")[0].getElementsByTagName("div")[0].getElementsByTagName("div")[0];
	}
	
	setUrlCargarDatos(url){
		this.urlCargarDatos = url;
	}
	
	crearCoockiePreferenciaColumnas(){
		document.cookie = "configTablaCrud="+JSON.stringify(this.coockies)+"; path="+window.location+"; expires=Fri, 31 Dec 9999 23:59:59 GMT";
		//var cookie = ["preferenciasTablaCRUD", '=', JSON.stringify(this.coockies), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
		//document.cookie = cookie;
	}
	
	obtenerEstadoColumnaTablaCoockie(numeroCabecera){
		for(var key in this.coockies){
			if(this.coockies[key].numeroCabecera == numeroCabecera){
				return this.coockies[key].visible;
			}
		}
		return null;
	}
	
	obtenerCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
		  c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		  return c.substring(name.length, c.length);
		}
	  }
	  return "";
	}
	
	
	redimensionarTabla(){
		var thElm;
		var startOffset;

		Array.prototype.forEach.call(
		  document.querySelectorAll("table th"),
		  function (th) {
			th.style.position = 'relative';

			var grip = document.createElement('div');
			grip.innerHTML = "&nbsp;";
			grip.style.top = 0;
			grip.style.right = '-5px';
			grip.style.bottom = 0;
			grip.style.width = '10px';
			grip.style.position = 'absolute';
			grip.style.cursor = 'col-resize';
			grip.addEventListener('mousedown', function (e) {
				thElm = th;
				startOffset = th.offsetWidth - e.pageX;
			});

			th.appendChild(grip);
		  });

		document.addEventListener('mousemove', function (e) {
		  if (thElm) {
			thElm.style.width = startOffset + e.pageX + 'px';
		  }
		});

		document.addEventListener('mouseup', function () {
			thElm = undefined;
		});
	}
	
	agregarColumnas(columnas = null){
		if(columnas == null){
			console.log("Debes agregar columnas : " + '\n var columnas = new Array(); \n columnas.push({nombre : "Id", campoBd : "ID_USUARIO"}); \n tabla.agregarColumnas(columnas);');
		}
		this.columnas = columnas;
	}
	
	mostrarEsconderColumna(numeroColumna, mostrar) {
		//mostrar = true mostrar / mostrar = false esconder
		//columna es la columna como objeto
		//this.obtenerCabecerasTabla()[numeroColumna].style.display = mostrar ? 'block' : 'none';
		if(mostrar==false){
			this.obtenerCabecerasTabla()[numeroColumna].setAttribute("class","d-none");
		}else{
			this.obtenerCabecerasTabla()[numeroColumna].setAttribute("class","");
		}
		
		//console.log(this.obtenerFilasCuerpoTabla()[numeroColumna]);
		var cantidad_registros = this.obtenerFilasCuerpoTabla().length-1;
		var fila = this.obtenerFilasCuerpoTabla();
		for(var keyFila in fila){//d-none
			//console.log(fila[keyFila]);
			//if(fila[keyFila].getElementsByTagName("td")[numeroColumna].style.display !=undefined && (keyFila+1)<cantidad_registros){
				//console.log(fila[keyFila].childNodes);
				//console.log(fila[keyFila].length);
				//console.log(fila[keyFila].getElementsByTagName("*").length);
				//if(fila.length > keyFila+1){
					if(mostrar==false){
						//console.log(fila[keyFila]);
						if(!isNaN(keyFila)){
							//console.log("No es numerico");
							fila[keyFila].getElementsByTagName("td")[numeroColumna].setAttribute("class","d-none");
						}
						//console.log("Columna numero "+numeroColumna+" fila numero "+keyFila);
					}else{
						//fila[keyFila].getElementsByTagName("td")[numeroColumna].setAttribute("class","");
						/*if(fila[keyFila].getElementsByTagName("td")[numeroColumna].setAttribute("class","")==undefined){
							//console.log("No esta definido");
						}else{
							fila[keyFila].getElementsByTagName("td")[numeroColumna].setAttribute("class","");
						}*/
						if(!isNaN(keyFila)){
							//console.log("No es numerico");
							fila[keyFila].getElementsByTagName("td")[numeroColumna].setAttribute("class","");
						}
					}
				/*}else{
					//console.log(fila[keyFila].childNodes);
					//console.log(fila[keyFila].childNodes.length);
				}*/
				//fila[keyFila].getElementsByTagName("td")[numeroColumna].style.display = mostrar ? 'block' : 'none';
			//}
			
		}
		
	}
	
	quitarAgregar(valor){
		this.quitarBotonAgregar = valor;
	}
	
	crearTabla(){
		if(this.quitarBotonAgregar==false){
			this.botonesmenuSuperior.push({ nombreBoton : " agregar", funcionEspecial : "agregar", icono : "plus"});
		}
		
		this.contenedor.innerHTML = "";//Limpiamos el div de cualquier objeto
		var tabla = document.createElement("table");
		if(this.classTable!=null){
			//tabla.classList.add(this.classTable);
			var estiloTabla = document.createAttribute("class");
			estiloTabla.value = this.classTable;// Establecer la clase
			tabla.setAttributeNode(estiloTabla);//Agregar el atributo class a t
		}
		
		//Creacion de columnas
		var tblHead = document.createElement("thead");
		var fila = document.createElement("tr");
		var columna = document.createElement("th");
		var colspan = document.createAttribute("colspan");// Crear atributo colspan
                var cantidadColumnas = this.columnas.length;
                if(this.quitarBotonEliminar==false){
                    cantidadColumnas++;
                }
                if(this.quitarBotonEditar==false){
                    cantidadColumnas++;
                }
		colspan.value = cantidadColumnas;// Establecer el valor de colspan
		columna.setAttributeNode(colspan);//Agregar el atributo colspan a th
		this.agregarAtributo(fila,"class","table-thead-tabla");
		
		var h6 = document.createElement("h6");
		var nombreColumna = document.createTextNode(this.tituloTabla);
		h6.appendChild(nombreColumna);
		this.agregarAtributo(h6,"style","position:absolute;");
		columna.appendChild(h6);
		
		//Agregar botones a cabecera tabla
		var divBotonSuperior = document.createElement("div");
		this.agregarAtributo(divBotonSuperior,"class","btn-group btn-group-sm");
		this.agregarAtributo(divBotonSuperior,"style","float: right;");
		this.agregarAtributo(divBotonSuperior,"role","group");
		this.agregarAtributo(divBotonSuperior,"aria-label","Button group with nested dropdown");
		
		
		//this.agregarAtributo(botonColumnas,"class","btn btn-secondary");
		//this.agregarTextoTagHtml(botonSuperior, this.botonesmenuSuperior[x].nombreBoton);
		
		for(var x=0;x<this.botonesmenuSuperior.length;x++){
			var botonSuperior = document.createElement("button");
			this.agregarAtributo(botonSuperior,"type","button");
			if(this.botonesmenuSuperior[x].Class!=null){ //Si se le quiere agregar una clase adicional
				this.agregarAtributo(botonSuperior,"class",this.botonesmenuSuperior[x].Class);
			}else{
				this.agregarAtributo(botonSuperior,"class","btn btn-secondary");
			}
			
			if(this.botonesmenuSuperior[x].funcionEspecial!=null){ //Si se le quiere agregar una clase adicional
				this.agregarAtributo(botonSuperior,"funcion-especial",this.botonesmenuSuperior[x].funcionEspecial);
			}
                        
                        if(this.botonesmenuSuperior[x].icono!=null){ //Si se le quiere agregar una clase adicional
                                var path = document.createElement("i");
				this.agregarAtributo(path,"class","fa fa-"+this.botonesmenuSuperior[x].icono);
				
				botonSuperior.appendChild(path);
				
			}
			if(this.botonesmenuSuperior[x].onClick!=null) this.agregarAtributo(botonSuperior,"onclick",this.botonesmenuSuperior[x].onClick);//sirve para llamar a una funcion
			this.agregarTextoTagHtml(botonSuperior, this.botonesmenuSuperior[x].nombreBoton);
			divBotonSuperior.appendChild(botonSuperior);
			
		}
		columna.appendChild(divBotonSuperior);
		
		
		//Boton para mostrar u ocultar columnas
		var contenedorBotonMostrarColumnas = document.createElement("div");
		this.agregarAtributo(contenedorBotonMostrarColumnas,"class","btn-group");
		this.agregarAtributo(contenedorBotonMostrarColumnas,"role","group");
		var botonMostrarColumnas = document.createElement("button");
		this.agregarAtributo(botonMostrarColumnas,"class","btn btn-secondary dropdown-toggle");
		this.agregarAtributo(botonMostrarColumnas,"type","button");
		this.agregarAtributo(botonMostrarColumnas,"role","button");
		this.agregarAtributo(botonMostrarColumnas,"data-toggle","dropdown");
		this.agregarAtributo(botonMostrarColumnas,"aria-haspopup","true");
		this.agregarAtributo(botonMostrarColumnas,"aria-expanded","false");
		/*var iconoListado = document.createElement("span");
		this.agregarAtributo(iconoListado,"align","true");
		this.agregarAtributo(iconoListado,"focusable","right");
		var path = document.createElement("i");
		this.agregarAtributo(path,"class","fa fa-columns");
		
		iconoListado.appendChild(path);
		botonMostrarColumnas.appendChild(iconoListado);*/
		contenedorBotonMostrarColumnas.appendChild(botonMostrarColumnas);
		
		var listadoBotonMostrarColumnas = document.createElement("div");
		this.agregarAtributo(listadoBotonMostrarColumnas,"class","dropdown-menu");
		this.agregarAtributo(listadoBotonMostrarColumnas,"aria-labelledby","btnGroupDrop1");
		var indiceTablaColumna = 0;
		for(var x=0; x<this.columnas.length;x++){
			if(this.columnas[x].listar==true){
				var datoSelectColumna = document.createElement("a");
				this.agregarAtributo(datoSelectColumna,"class","dropdown-item");
				this.agregarAtributo(datoSelectColumna,"href","#");
				var contenedorCheckbox = document.createElement("div");
				this.agregarAtributo(contenedorCheckbox,"class","form-check");
				
				var checkBoxBoton = document.createElement("input");
				this.agregarAtributo(checkBoxBoton,"type","checkbox");
				this.agregarAtributo(checkBoxBoton,"class","form-check-input");
				if(this.obtenerEstadoColumnaTablaCoockie(indiceTablaColumna)!="false") this.agregarAtributo(checkBoxBoton,"checked","");
				this.agregarAtributo(checkBoxBoton,"numero",indiceTablaColumna);
				var labelCheck = document.createElement("label");
				this.agregarAtributo(labelCheck,"class","form-check-label");
				this.agregarAtributo(labelCheck,"for","exampleCheck1");
				this.agregarTextoTagHtml(labelCheck, this.columnas[x].nombre+" ");
				contenedorCheckbox.appendChild(checkBoxBoton);
				contenedorCheckbox.appendChild(labelCheck);
				
				
				indiceTablaColumna++;
				datoSelectColumna.appendChild(contenedorCheckbox);
				listadoBotonMostrarColumnas.appendChild(datoSelectColumna);
			}
		}
		contenedorBotonMostrarColumnas.appendChild(listadoBotonMostrarColumnas);
		divBotonSuperior.appendChild(contenedorBotonMostrarColumnas);
		//--Fin boton columna
		
		//--Fin agregar botones a cabecera tabla
		
		fila.appendChild(columna);
		tblHead.appendChild(fila);


		if(this.classThead!=null) tblHead.classList.add(this.classThead);
		fila = document.createElement("tr");
		this.agregarAtributo(fila,"class","tablaCabeceras");
		columna;
		nombreColumna;
		var indiceColumna = 0;
		for(var x=0; x<this.columnas.length;x++){
			if(this.columnas[x].listar==true){
				//console.log("Agregando "+indiceColumna);
				this.columnas[x].indice = indiceColumna;
				columna = document.createElement("th");
                                
				if(this.classTheadTh!=null) columna.classList.add(this.classTheadTh);
				
				nombreColumna = document.createTextNode(this.columnas[x].nombre+" ");
                                
				var iconoSorting = document.createElement("span");
				this.agregarAtributo(iconoSorting,"align","true");
				this.agregarAtributo(iconoSorting,"focusable","right");
				var path = document.createElement("i");
				this.agregarAtributo(path,"class","fa fa-sort");
				
				iconoSorting.appendChild(path);
				columna.appendChild(nombreColumna);
				columna.appendChild(iconoSorting);
				//console.log(this.columnas[x].nombre+" "+this.obtenerEstadoColumnaTablaCoockie(indiceColumna));
				if(this.obtenerEstadoColumnaTablaCoockie(indiceColumna)=="false"){ 
					//console.log(this.obtenerEstadoColumnaTablaCoockie(indiceTablaColumna));
					this.agregarAtributo(columna,"class","d-none"); 
				}
				fila.appendChild(columna);
				indiceColumna++;
			}
		}
		
		//Columna editar
		//this.columnas[x].indice = indiceColumna;
                if(this.quitarBotonEditar==false){
                     columna = document.createElement("th");
                    if(this.classTheadTh!=null) columna.classList.add(this.classTheadTh);
                    fila.appendChild(columna);
                    indiceColumna++;
                }
		if(this.quitarBotonEliminar==false){
                    columna = document.createElement("th");
                    if(this.classTheadTh!=null) columna.classList.add(this.classTheadTh);
                    fila.appendChild(columna);
                    indiceColumna++;
                }
               
		//fin columna editar
		
		//Columna eliminar
		//this.columnas[x].indice = indiceColumna;
		
		//fin columna eliminar
		
		tblHead.appendChild(fila);
		//Creacion de espacio para los registros
		var tblBody = document.createElement("tbody");
		tabla.appendChild(tblHead);
		tabla.appendChild(tblBody);
		//Imprimimos la tabla
		this.contenedor.appendChild(tabla);//Imprimir tabla
		
		//Eventos escucha
		this.redimensionarTabla();
		var instanciaActual = this;
		String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };//Eliminar espacios en blanco
		//Cabeceras Tabla
		
		var indiceTablaColumna = 0;
		for(var x=0; x<this.columnas.length;x++){
			
			
			if(this.columnas[x].listar==true){
				
				var tablaActual = this.obtenerCabecerasTabla()[indiceTablaColumna].getElementsByTagName("span")[0].getElementsByTagName("i");
				this.obtenerCabecerasTabla()[indiceTablaColumna].addEventListener("click", function(){
					
					//console.log("hola");
					//console.log(tablaActual);
					var atributo = this.getElementsByTagName("span")[0].getElementsByTagName("i")[0].getAttribute("class");
					var contenidoTexto = this.textContent;
					//console.log(atributo);
					//console.log(contenidoTexto);
					
					var columnas = instanciaActual.columnas;
					//console.log(columnas);
					if(atributo=="fa fa-sort"){
						this.getElementsByTagName("span")[0].getElementsByTagName("i")[0].setAttribute("class","fa fa-sort-up");
						for(var keyColumna in columnas){
							if(columnas[keyColumna].nombre.trim()==contenidoTexto.trim()){
								instanciaActual.jtSorting = columnas[keyColumna].nombreCampoOriginal.trim()+" ASC";
								instanciaActual.cargarDatos();
								//instanciaActual.mostrarEsconderColumna(this, false);
							}else if(columnas[keyColumna].indice!=null){
								instanciaActual.obtenerCabecerasTabla()[columnas[keyColumna].indice].getElementsByTagName("span")[0].getElementsByTagName("i")[0].setAttribute("class","fa fa-sort");
							}
						}
					}else if(atributo=="fa fa-sort-up"){
						this.getElementsByTagName("span")[0].getElementsByTagName("i")[0].setAttribute("class","fa fa-sort-down");
						for(var keyColumna in columnas){
							if(columnas[keyColumna].nombre.trim()==contenidoTexto.trim()){
								instanciaActual.jtSorting = columnas[keyColumna].nombreCampoOriginal.trim()+" DESC";
								instanciaActual.cargarDatos();
							}else if(columnas[keyColumna].indice!=null){
								instanciaActual.obtenerCabecerasTabla()[columnas[keyColumna].indice].getElementsByTagName("span")[0].getElementsByTagName("i")[0].setAttribute("class","fa fa-sort");
							}
						}
					}else if(atributo=="fa fa-sort-down"){
						this.getElementsByTagName("span")[0].getElementsByTagName("i")[0].setAttribute("class","fa fa-sort-up");
						for(var keyColumna in columnas){
							if(columnas[keyColumna].nombre.trim()==contenidoTexto.trim()){
								instanciaActual.jtSorting = columnas[keyColumna].nombreCampoOriginal.trim()+" ASC";
								instanciaActual.cargarDatos();
							}else if(columnas[keyColumna].indice!=null){
								instanciaActual.obtenerCabecerasTabla()[columnas[keyColumna].indice].getElementsByTagName("span")[0].getElementsByTagName("i")[0].setAttribute("class","fa fa-sort");
							}
						}
					}
					
				});
				indiceTablaColumna++;
			}else{
				
				//console.log(this.columnas[x].listar);
			}
			
		}
		//Boton cabecera 
		var checkbox = this.obtenerBotonOcultarColumnas().getElementsByTagName("a");
		//console.log(checkbox);
		var nombreColumna = null;
		for(var x = 0; x<checkbox.length;x++){
			var seleccionado = checkbox[x].getElementsByTagName("div")[0].getElementsByTagName("input")[0];
			nombreColumna = checkbox[x].getElementsByTagName("div")[0].getElementsByTagName("label")[0].textContent;
			//nombreColumna = nombreColumna.replace(/\s/g,"_");
			
			seleccionado.addEventListener("click", function(){	
				if(this.checked==true){
					//console.log("Esta checkeado "+this.getAttribute("numero"));
					//numero
					instanciaActual.mostrarEsconderColumna(this.getAttribute("numero"), true);
					instanciaActual.agregarCoockieSinRepetir(this.getAttribute("numero"),"true");
					//instanciaActual.crearCoockiePreferenciaColumnas(nombreColumna,true);
				}else{
					instanciaActual.mostrarEsconderColumna(this.getAttribute("numero"), false);
					
					instanciaActual.agregarCoockieSinRepetir(this.getAttribute("numero"),"false");
					//instanciaActual.crearCoockiePreferenciaColumnas(nombreColumna,false);
				}
				instanciaActual.crearCoockiePreferenciaColumnas();
			});
			
		}
		
		
		for(var x=0;x<this.botonesmenuSuperior.length;x++){
			instanciaActual.obtenerBotonAgregarRegistros()[x].addEventListener("click", function(){
				if(this.getAttribute("funcion-especial")!=null){
					if(this.getAttribute("funcion-especial")=="agregar"){
						instanciaActual.popup(instanciaActual.formulario_ingresar(),"crear",null);
					}
				}
			});
		}
		this.agregarFooter();
	}

	setClassTable(classTable){
		this.classTable = classTable;
	}
	setClassThead(classThead){
		this.classThead = classThead;
	}
	setClassTableTh(classTheadTh){
		this.classTheadTh = classTheadTh;
	}

	setTituloTabla(tituloTabla){
		this.tituloTabla = tituloTabla;
	}
	
	cargarDatos(){
		this.ajaxCargarDatosTabla();
		
	}
	
	getRegistro(){
		return this.datoRegistro;
	}
	
	crearCombobox(){
		//setUrlCombobox
		//ajaxCombobox
		this.ajaxCombobox();
	}
	agregarRegistrosBD(registrosBD){
		this.registrosBD = registrosBD;
		var tbody = this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
		tbody.innerHTML = "";//Limpiar
		//Ordenar los datos por columna
		//console.log(this.registrosBD.Registros);
		//console.log(this.registrosBD.Registros.length);
		var datosRecorrer = (this.registrosBD.Registros);
		var datosPk = this.columnas;
		var columnas = this.columnas;
		for(var keyDato in datosRecorrer){
			//console.log(datosRecorrer[keyDato].idDenuncio);
			var dato = datosRecorrer[keyDato];
						
			var fila = document.createElement("tr");
			//console.log(dato);
			var indiceTablaColumna = 0;
			for(var keyColumna in columnas){
				var datoColumna = columnas[keyColumna];
				var nombreCampoBd = datoColumna.aliasJson;
                                if(dato[nombreCampoBd]==undefined){//Si no se hace esto, en caso que no venga el parametro se imprimira mal
                                    this.datoRegistro = "";
                                }else{
                                    this.datoRegistro = dato[nombreCampoBd];
                                }
				
				//console.log("mostrar "+dato);
				//console.log("key "+nombreCampoBd);
				//console.log("Mostrando");
                                //console.log(datoColumna);
				if(this.datoRegistro != undefined && datoColumna.listar == true){
						var columna = document.createElement("td");
                                                
						if(this.columnas[keyColumna].atributoHtml!=null) this.agregarAtributo(columna,this.columnas[keyColumna].atributoHtml.propiedad,this.columnas[keyColumna].atributoHtml.valor);
                                                
						var checkbox = this.obtenerBotonOcultarColumnas().getElementsByTagName("a")[indiceTablaColumna].getElementsByTagName("div")[0].getElementsByTagName("input")[0].checked;
						if(checkbox==true){
							//console.log("Fila numero "+keyColumna+" visible");
							this.agregarAtributo(columna,"class","");
						}else{
							//console.log("Fila numero "+keyColumna+" invisible");
							this.agregarAtributo(columna,"class","d-none");
						}
						
						var nombreCampoBd = datoColumna.aliasJson;
						//console.log(nombreCampoBd);
						
						
						if(this.columnas[keyColumna].mostrar!=undefined){
							columna.innerHTML = this.columnas[keyColumna].mostrar(dato);
						}else if(this.columnas[keyColumna].combobox!=undefined){
							var nombreCombobox = this.columnas[keyColumna].combobox;
							for(var keyCombo in this.combobox){
								//console.log(this.combobox[keyCombo].registros);
								if(this.combobox[keyCombo].accion == this.columnas[keyColumna].combobox){
									for(var keyRegistros in this.combobox[keyCombo].registros){
										
										if(this.combobox[keyCombo].registros[keyRegistros].Value==this.datoRegistro){
											var nombreColumna = document.createTextNode(this.combobox[keyCombo].registros[keyRegistros].DisplayText);//Le agregamos el nombre de la columna como key a los registros para mostrarlos
											columna.appendChild(nombreColumna)
										}
									}
								}
							}
						}else{
							var nombreColumna = document.createTextNode(this.datoRegistro);//Le agregamos el nombre de la columna como key a los registros para mostrarlos
							columna.appendChild(nombreColumna);
						}
						
						indiceTablaColumna++;
						fila.appendChild(columna);
				}else{
					
				}
						
			}
			
			var pk = null;
			//console.log(datosPk);
			//console.log(datosRecorrer);
			for(var keyPk in datosPk){
				if(datosPk[keyPk].pk!=null){
					if(datosPk[keyPk].pk==true){
						pk = datosRecorrer[keyDato][datosPk[keyPk].aliasJson];
					}
				}
			}
                        //console.log("this.quitarBotonEditar = "+this.quitarBotonEditar);
                        if(this.quitarBotonEditar==false){
                            //console.log("Agregando boton editar");
                            //Agregar filas modificar
                            columna = document.createElement("td");
                            this.agregarAtributo(columna,"class","anchoEditar");
                            var iconoSorting = document.createElement("span");
                            this.agregarAtributo(iconoSorting,"align","true");
                            this.agregarAtributo(iconoSorting,"focusable","right");
                            this.agregarAtributo(iconoSorting,"style","cursor:pointer;");
                            this.agregarAtributo(iconoSorting,"pk",pk);
                            var path = document.createElement("i");
                            //this.agregarAtributo(path,"class","");
                            this.agregarAtributo(path,"class","fa fa-edit fa-lg editarEliminarIcono");

                            iconoSorting.appendChild(path);
                            columna.appendChild(iconoSorting);
                            fila.appendChild(columna);
                        }
			//console.log("this.quitarBotonEliminar = "+this.quitarBotonEliminar);
                        if(this.quitarBotonEliminar==false){
                            //console.log("Agregando boton eliminar");
                            //Agregar filas eliminar
                            columna = document.createElement("td");
                            this.agregarAtributo(columna,"class","anchoEliminar");
                            var iconoSorting = document.createElement("span");
                            this.agregarAtributo(iconoSorting,"align","true");
                            this.agregarAtributo(iconoSorting,"focusable","right");
                            this.agregarAtributo(iconoSorting,"style","cursor:pointer;");
                            this.agregarAtributo(iconoSorting,"pk",pk);
                            var path = document.createElement("i");
                            //this.agregarAtributo(path,"class","");
                            this.agregarAtributo(path,"class","fa fa-trash fa-lg editarEliminarIcono");

                            iconoSorting.appendChild(path);
                            columna.appendChild(iconoSorting);
                            fila.appendChild(columna);
                        }
			
			
			
			
			tbody.appendChild(fila);
		}
		//console.log(datosRecorrer.length);
		/*for(var x=0; x<datosRecorrer.length; x++){//Recorremos los registros
			//console.log(this.registrosBD.Registros[0].articuloLey);
			var fila = document.createElement("tr");
			var registros = datosRecorrer[x];
			
			for(var i=0; i<this.columnas.length;i++){//Recorremos los nombres de las columnas
				var columna = document.createElement("td");
				var nombreColumna = document.createTextNode(registros[this.columnas[i].aliasJson]);//Le agregamos el nombre de la columna como key a los registros para mostrarlos
				columna.appendChild(nombreColumna);
				fila.appendChild(columna);
			}
			tbody.appendChild(fila);
		}*/
		var cantidadRegistrosPorPagina = this.cantidadRegistrosPorPagina;
		var totalRegistros = parseInt(registrosBD.TotalRegistros);
		var totalPaginas = parseInt(this.roundUp(totalRegistros/cantidadRegistrosPorPagina,0));
		this.agregarPaginacion(this.paginaActual,totalPaginas,cantidadRegistrosPorPagina,totalRegistros);//
	}
	
	roundUp(num, precision) {
	  precision = Math.pow(10, precision)
	  return Math.ceil(num * precision) / precision
	}

	agregarFooter(){
		var tabla = this.contenedor.getElementsByTagName("table")[0];
		var tfoot = document.createElement("tfoot");
		var fila = document.createElement("tr");
		var columna = document.createElement("th");
		//Dar al footer el ancho de las columnas
		var colspan = document.createAttribute("colspan");// Crear atributo colspan
		colspan.value = this.columnas.length+2;// Establecer el valor de colspan
		columna.setAttributeNode(colspan);//Agregar el atributo colspan a th


		//var nombreColumna = document.createTextNode("asd");
		//columna.appendChild(nombreColumna);
		fila.appendChild(columna);
		tfoot.appendChild(fila);
		tabla.appendChild(tfoot);
		
	}

	agregarPaginacion(paginaActual,totalPaginas,cantidadRegistrosPorPagina, totalDeRegistros){
		var footer = this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tfoot")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[0];
		var contenedorNav = document.createElement("nav");
		var contenedorListado = document.createElement("ul");
		this.agregarAtributo(contenedorListado,"class","pagination pagination-sm");
		this.agregarAtributo(contenedorListado,"style","height:15px");
		
		//Botón página inicial
		var item = document.createElement("li");
		if(paginaActual==1){//
			this.agregarAtributo(item,"class","page-item disabled");
		}else{
			this.agregarAtributo(item,"class","page-item");
		}
		
		var botonAnterior = document.createElement("span");
		this.agregarAtributo(botonAnterior,"class","page-link");
		//this.agregarAtributo(botonAnterior,"href","#");
		this.agregarAtributo(botonAnterior,"aria-label","Previous");
		var contenidoBotonAtras_1 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_1,"aria-hidden","true");
		this.agregarTextoTagHtml(contenidoBotonAtras_1, "<<");
		var contenidoBotonAtras_2 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_2,"class","sr-only");
		//this.agregarTextoTagHtml(contenidoBotonAtras_1, "Previous"); //Corresponde al texto del boton atrás

		botonAnterior.appendChild(contenidoBotonAtras_1);
		botonAnterior.appendChild(contenidoBotonAtras_2);
		item.appendChild(botonAnterior);
		contenedorListado.appendChild(item);

		//Botón pagina anterior

		item = document.createElement("li");
		if(paginaActual==1){//
			this.agregarAtributo(item,"class","page-item disabled");
		}else{
			this.agregarAtributo(item,"class","page-item");
		}
		
		botonAnterior = document.createElement("span");
		this.agregarAtributo(botonAnterior,"class","page-link");
		//this.agregarAtributo(botonAnterior,"href","#");
		this.agregarAtributo(botonAnterior,"aria-label","Previous");
		contenidoBotonAtras_1 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_1,"aria-hidden","true");
		this.agregarTextoTagHtml(contenidoBotonAtras_1, "<");
		contenidoBotonAtras_2 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_2,"class","sr-only");
		//this.agregarTextoTagHtml(contenidoBotonAtras_1, "Previous"); //Corresponde al texto del boton atrás

		botonAnterior.appendChild(contenidoBotonAtras_1);
		botonAnterior.appendChild(contenidoBotonAtras_2);
		item.appendChild(botonAnterior);
		contenedorListado.appendChild(item);

		//---Combobox
		item = document.createElement("li");
		this.agregarAtributo(item,"class","page-item");
		var bombobox = document.createElement("select");
		this.agregarAtributo(bombobox,"class","form-control form-control-sm");
		var datoscombobox;
		for(var x=0;x<totalPaginas;x++){
			datoscombobox = document.createElement("option");
			this.agregarAtributo(datoscombobox,"value",x+1);
			if((x+1)==paginaActual){
				this.agregarAtributo(datoscombobox,"selected","");
			}
			this.agregarTextoTagHtml(datoscombobox, x+1);
			bombobox.appendChild(datoscombobox);
		}
		item.appendChild(bombobox);
		contenedorListado.appendChild(item);

		//Fin combobox


		//numero de paginas totales
		/*item = document.createElement("li");
		this.agregarAtributo(item,"class","page-item");
		this.agregarTextoTagHtml(item, " de "+totalPaginas+" ");
		contenedorListado.appendChild(item);*/
		//--Fin numero apginas totales--


		//Boton siguiente paginaActual
		item = document.createElement("li");
		if(paginaActual==totalPaginas){//
			this.agregarAtributo(item,"class","page-item disabled");
		}else{
			this.agregarAtributo(item,"class","page-item");
		}
		botonAnterior = document.createElement("span");
		this.agregarAtributo(botonAnterior,"class","page-link");
		//this.agregarAtributo(botonAnterior,"href","#");
		this.agregarAtributo(botonAnterior,"aria-label","Next");
		contenidoBotonAtras_1 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_1,"aria-hidden","true");
		this.agregarTextoTagHtml(contenidoBotonAtras_1, ">");
		contenidoBotonAtras_2 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_2,"class","sr-only");
		botonAnterior.appendChild(contenidoBotonAtras_1);
		botonAnterior.appendChild(contenidoBotonAtras_2);
		item.appendChild(botonAnterior);
		contenedorListado.appendChild(item);

		//Boton ir al final
		item = document.createElement("li");
		if(paginaActual==totalPaginas){//
			this.agregarAtributo(item,"class","page-item disabled");
		}else{
			this.agregarAtributo(item,"class","page-item");
		}
		botonAnterior = document.createElement("span");
		this.agregarAtributo(botonAnterior,"class","page-link");
		//this.agregarAtributo(botonAnterior,"href","#");
		this.agregarAtributo(botonAnterior,"aria-label","Next");
		contenidoBotonAtras_1 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_1,"aria-hidden","true");
		this.agregarTextoTagHtml(contenidoBotonAtras_1, ">>");
		contenidoBotonAtras_2 = document.createElement("span");
		this.agregarAtributo(contenidoBotonAtras_2,"class","sr-only");
		//this.agregarTextoTagHtml(contenidoBotonAtras_1, "Previous"); //Corresponde al texto del boton atrás

		botonAnterior.appendChild(contenidoBotonAtras_1);
		botonAnterior.appendChild(contenidoBotonAtras_2);
		item.appendChild(botonAnterior);
		contenedorListado.appendChild(item);
		//--fin ir al final
		
		//ComboboxCantidad de registros por pagina
		item = document.createElement("li");
		this.agregarAtributo(item,"class","col-sm");
		this.agregarAtributo(item,"style","text-align: right;");
		var div = document.createElement("div");
		this.agregarTextoTagHtml(div, "Registros por página: ");
		this.agregarAtributo(div,"style","margin-left: 5%; float: left;");
		contenedorListado.appendChild(div);
		
		var bombobox = document.createElement("select");
		this.agregarAtributo(bombobox,"class","form-control form-control-sm");
		this.agregarAtributo(bombobox,"style","width: 70px; float: left;");
		var datoscombobox;
		for(var x=5;x<3000;x = x * 2){
			datoscombobox = document.createElement("option");
			this.agregarAtributo(datoscombobox,"value",x);
			if((x)==this.jtPageSize){
				this.agregarAtributo(datoscombobox,"selected","");
			}
			this.agregarTextoTagHtml(datoscombobox, x);
			bombobox.appendChild(datoscombobox);
		}
		item.appendChild(bombobox);
		//contenedorListado.appendChild(item);
		//---Fina combobox cantidad de registros por pagina
		
		
		//Texto informativo
		//item = document.createElement("li");
		//this.agregarAtributo(item,"class","col-sm");
		//this.agregarAtributo(item,"style","text-align: right;");
		var cantidadDeRegistrosActuales = ((paginaActual*cantidadRegistrosPorPagina)-cantidadRegistrosPorPagina)+1;
		var cantidadMaximaDatosVistos = (parseInt(paginaActual*cantidadRegistrosPorPagina));
		if(cantidadMaximaDatosVistos>(totalDeRegistros)){
			cantidadMaximaDatosVistos = totalDeRegistros;
		}
		this.agregarTextoTagHtml(item, "Mostrando registros "+ cantidadDeRegistrosActuales + " a " + cantidadMaximaDatosVistos + " de " + (totalDeRegistros));
		contenedorListado.appendChild(item);
		//fin texto informativo


		contenedorNav.appendChild(contenedorListado);
		
		
		
		var instanciaActual = this;
		footer.innerHTML = "";
		footer.appendChild(contenedorListado);
		//Métodos de escucha para el formulario de la tabla
		//Select de paginas
		this.obtenerSelectPaginaActual().addEventListener("change", function(){
			
			instanciaActual.paginaActual = parseInt(this.value);
			instanciaActual.jtStartIndex = 0;
			instanciaActual.jtPageSize = instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			if(instanciaActual.paginaActual==1){
				instanciaActual.jtStartIndex = 0;
			}else{
				instanciaActual.jtStartIndex = (instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value * instanciaActual.paginaActual)-instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			}
			
			//instanciaActual.jtSorting = "";
			instanciaActual.ajaxCargarDatosTabla();
			
			
		});
		//boton Inicio
		this.obtenerBotonInicio().addEventListener("click", function(){
			instanciaActual.paginaActual = 1;
			instanciaActual.jtStartIndex = 0;
			instanciaActual.jtPageSize = instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			if(instanciaActual.paginaActual==1){
				instanciaActual.jtStartIndex = 0;
			}else{
				instanciaActual.jtStartIndex = (instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value * instanciaActual.paginaActual)-instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			}
			
			//instanciaActual.jtSorting = "";
			instanciaActual.ajaxCargarDatosTabla();
		});
		//boton atras
		this.obtenerBotonAtras().addEventListener("click", function(){
			instanciaActual.paginaActual = parseInt(instanciaActual.obtenerSelectPaginaActual().value)-1;
			instanciaActual.jtStartIndex = 0;
			instanciaActual.jtPageSize = instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			if(instanciaActual.paginaActual==1){
				instanciaActual.jtStartIndex = 0;
			}else{
				instanciaActual.jtStartIndex = (instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value * instanciaActual.paginaActual)-instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			}
			
			//instanciaActual.jtSorting = "";
			instanciaActual.ajaxCargarDatosTabla();
		});
		//boton siguiente
		this.obtenerBotonSiguiente().addEventListener("click", function(){
			instanciaActual.paginaActual = parseInt(instanciaActual.obtenerSelectPaginaActual().value)+1;
			instanciaActual.jtStartIndex = 0;
			instanciaActual.jtPageSize = instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			if(instanciaActual.paginaActual==1){
				instanciaActual.jtStartIndex = 0;
			}else{
				instanciaActual.jtStartIndex = (instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value * instanciaActual.paginaActual)-instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			}
			
			//instanciaActual.jtSorting = "";
			instanciaActual.ajaxCargarDatosTabla();
		});
		//boton pagina final
		this.obtenerBotonPaginaFinal().addEventListener("click", function(){
			instanciaActual.paginaActual = totalPaginas;
			instanciaActual.jtStartIndex = 0;
			instanciaActual.jtPageSize = instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			if(instanciaActual.paginaActual==1){
				instanciaActual.jtStartIndex = 0;
			}else{
				instanciaActual.jtStartIndex = (instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value * instanciaActual.paginaActual)-instanciaActual.obtenerBotonCantidadRegistrosPorPagina().value;
			}
			
			//instanciaActual.jtSorting = "";
			instanciaActual.ajaxCargarDatosTabla();
		});
		
		//Select cantidad de paginas
		this.obtenerBotonCantidadRegistrosPorPagina().addEventListener("change", function(){
			
			instanciaActual.paginaActual = 1;
			instanciaActual.jtStartIndex = 0;
			instanciaActual.jtPageSize = this.value;
			if(instanciaActual.paginaActual==1){
				instanciaActual.jtStartIndex = 0;
			}else{
				instanciaActual.jtStartIndex = this.value * instanciaActual.paginaActual;
			}
			
			instanciaActual.cantidadRegistrosPorPagina = this.value;
			instanciaActual.ajaxCargarDatosTabla();
		});
		
		//Boton editar
		
		
		var filas = this.obtenerCuerpoTabla().getElementsByTagName("tr");
		//console.log(filas);
		for(var keyFila in filas){
			//console.log(this.columnas);
			var tr = filas[keyFila];
			//console.log(keyFila);
			if(keyFila<filas.length){
				if(tr.getElementsByTagName("td")!=undefined){
                                    var cantidadTd = tr.getElementsByTagName("td").length;
                                    var td = tr.getElementsByTagName("td");
                                       
                                    //console.log("cantidad de td "+cantidadTd);
                                    //console.log(tr);
                                   
                                    for(var keyB in td){
                                        var boton = td[keyB].className;
                                        if(boton=="anchoEditar"){
                                            td[keyB].getElementsByTagName("span")[0].addEventListener("click", function(){
                                                    var id = this.getAttribute("pk");
                                                    //console.log("Modificar "+id);
                                                    //console.log(instanciaActual.formulario_modificar(id));
                                                    instanciaActual.popup(instanciaActual.formulario_modificar(id),"modificar",id);
                                            });
                                        }
                                        if(boton=="anchoEliminar"){
                                            td[keyB].getElementsByTagName("span")[0].addEventListener("click", function(){
                                                    var id = this.getAttribute("pk");
                                                    //console.log("Eliminar "+id);
                                                    bootbox.confirm("¿Estas seguro(a) que desea eliminar el siguiente registro? "+id, function(result){
                                                            if(result==true){
                                                                    var datosFormulario = new FormData();
                                                                    datosFormulario.append("accion", "eliminar");
                                                                    datosFormulario.append("pk", id);
                                                                    instanciaActual.ajaxGuardarModificar(datosFormulario,"eliminar",id);
                                                            }
                                                    });
                                            });
                                        }
                                    }
                                    /*//Boton editar
                                    if(this.quitarBotonEditar==false){
                                        if(td[cantidadTd-2].getElementsByTagName("span")[0]!=undefined){
                                            td[cantidadTd-2].getElementsByTagName("span")[0].addEventListener("click", function(){
                                                    var id = this.getAttribute("pk");
                                                    //console.log("Modificar "+id);
                                                    //console.log(instanciaActual.formulario_modificar(id));
                                                    instanciaActual.popup(instanciaActual.formulario_modificar(id),"modificar",id);
                                            });
                                        }
                                        
                                    }
                                    //Boton eliminar
                                    if(this.quitarBotonEliminar==false){
                                        if(td[cantidadTd-1].getElementsByTagName("span")[0]!=undefined){
                                            td[cantidadTd-1].getElementsByTagName("span")[0].addEventListener("click", function(){
                                                    var id = this.getAttribute("pk");
                                                    console.log("Eliminar "+id);
                                                    bootbox.confirm("¿Estas seguro(a) que desea eliminar el siguiente registro? "+id, function(result){
                                                            if(result==true){
                                                                    var datosFormulario = new FormData();
                                                                    datosFormulario.append("accion", "eliminar");
                                                                    datosFormulario.append("pk", id);
                                                                    instanciaActual.ajaxGuardarModificar(datosFormulario,"eliminar",id);
                                                            }
                                                    });
                                            });
                                        }
                                        
                                    }*/
				}
			}
		}
		
		
		
	}

	agregarAtributo(tagHtml,atributo,valor){
		//Dar al footer el ancho de las columnas
		var nuevoAtributo = document.createAttribute(atributo);// Crear atributo colspan
		nuevoAtributo.value = valor;// Establecer el valor de colspan
		tagHtml.setAttributeNode(nuevoAtributo);//Agregar el atributo colspan a th
	}

	agregarTextoTagHtml(tagHtml, texto){
		var tag = document.createTextNode(texto);
		tagHtml.appendChild(tag);
	}
	
	ajaxCargarDatosTabla(){
		var url = this.urlCargarDatos;
		var data = {username: 'example'};
		var tbody = this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
		tbody.innerHTML = "";
		//Dibujar progress bar
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		var colspan = document.createAttribute("colspan");// Crear atributo colspan
		colspan.value = this.columnas.length;// Establecer el valor de colspan
		td.setAttributeNode(colspan);//Agregar el atributo colspan a th
		var contenedorBarra = document.createElement("div");
		this.agregarAtributo(contenedorBarra,"class","progress");
		
		
		var barra = document.createElement("div");
		this.agregarAtributo(barra,"class","progress-bar");
		this.agregarAtributo(barra,"role","progressbar");
		this.agregarAtributo(barra,"style","width: 0%;");
		this.agregarAtributo(barra,"aria-valuenow","0");
		this.agregarAtributo(barra,"aria-valuemin","0");
		this.agregarAtributo(barra,"aria-valuemax","100");
		this.agregarTextoTagHtml(barra, "Cargando 0%");
		
		contenedorBarra.appendChild(barra);
		td.appendChild(contenedorBarra);
		tr.appendChild(td);
		tbody.appendChild(tr);
		/*	
		fetch(url, {
		  method: 'POST', // or 'PUT'
		  body: JSON.stringify(data), // data can be `string` or {object}!
		  headers:{
			'Content-Type': 'application/json'
		  }
		}).then(res => res.json())
		.then(response => console.log('Success:', JSON.stringify(response)))
		.catch(error => console.error('Error:', error));*/
		var instanciaActual = this;
		var cliente = new XMLHttpRequest();
		cliente.open("POST", url, true);
		//cliente.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		//cliente.setRequestHeader("Content-Type", "multipart/form-data");
		
		
		cliente.upload.addEventListener('progress', function(e){//Esto es al subir un archivo
			//console.log(e);
			//console.log("cambiando "+e.loaded+"/"+e.total);
			//console.log( Math.ceil(e.loaded/e.total) * 100 + '%');
			instanciaActual.barraProgreso(e,"subiendo");
		}, false);
		cliente.onprogress = function(pe) {//Esto es al descargar un archivo
			 instanciaActual.barraProgreso(pe, "descargando");
		}
		cliente.onerror = function () {
			var progressBar = instanciaActual.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("div")[0].getElementsByTagName("div")[0];
			progressBar.setAttribute("class","progress-bar bg-danger");
			progressBar.innerHTML = "Error : "+this.status+", al cargar, intentelo nuevamente ";
		};
		cliente.onloadend = function(pe) {
			//progressBar.value = pe.loaded
			//console.log(pe);
		}
		cliente.onreadystatechange = function() {
			var progressBar = instanciaActual.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("div")[0].getElementsByTagName("div")[0];
			//console.log(this);
			//var datosJson = JSON.parse(this.response);
			try {
                            var datosJson = JSON.parse(this.response);
                            
                            //console.log(this.readyState+' === '+4+' && '+this.status+' === '+200);
                            if (this.readyState === 4 && this.status === 200) {
                                    //console.log("Entro");
                                    if(datosJson.Resultado=="OK"){
                                            //this.registrosBD[0].Registros = datosJson.Registros;
                                            instanciaActual.agregarRegistrosBD(datosJson);
                                    }else if(datosJson.Resultado=="ERROR"){
                                            //console.log(datosJson.Message);
                                            progressBar.setAttribute("class","progress-bar bg-danger");
                                            progressBar.innerHTML = instanciaActual.utf8_encode("Error : "+datosJson.Message+"");
                                    }
                            }else if(this.status === 400){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": La solicitud no se puede cumplir debido a una mala sintaxis, intentelo nuevamente ");
                            }else if(this.status === 401){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder. Para usar cuando la autenticación es posible pero ha fallado o aún no se ha proporcionado, intentelo nuevamente ");
                            }else if(this.status === 402){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": reservado para uso futuro, intentelo nuevamente ");
                            }else if(this.status === 403){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder, intentelo nuevamente ");
                            }else if(this.status === 404){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": página no encontrada, intentelo nuevamente ");
                            }else if(this.status === 405){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": Se realizó una solicitud de una página utilizando un método de solicitud no admitido por esa página, intentelo nuevamente ");
                            }else if(this.status === 406){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El servidor solo puede generar una respuesta que no es aceptada por el cliente, intentelo nuevamente ");
                            }else if(this.status === 407){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El cliente primero debe autenticarse con el proxy, intentelo nuevamente ");
                            }else if(this.status === 408){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El servidor agotó el tiempo de espera para la solicitud, intentelo nuevamente ");
                            }else if(this.status === 409){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": La solicitud no se pudo completar debido a un conflicto en la solicitud, intentelo nuevamente ");
                            }else if(this.status === 410){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": La página solicitada ya no está disponible., intentelo nuevamente ");
                            }else if(this.status === 411){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El 'Contenido-Longitud' no está definido. El servidor no aceptará la solicitud sin él., intentelo nuevamente ");
                            }else if(this.status === 412){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": La condición previa dada en la solicitud evaluada en falso por el servidor, intentelo nuevamente ");
                            }else if(this.status === 413){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El servidor no aceptará la solicitud porque la entidad de solicitud es demasiado grande, intentelo nuevamente ");
                            }else if(this.status === 414){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El servidor no aceptará la solicitud, porque la URL es demasiado larga. Ocurre cuando convierte una solicitud POST a una solicitud GET con una información de consulta larga, intentelo nuevamente ");
                            }else if(this.status === 415){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El servidor no aceptará la solicitud, porque el tipo de medio no es compatible, intentelo nuevamente ");
                            }else if(this.status === 416){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El cliente ha solicitado una parte del archivo, pero el servidor no puede suministrar esa parte, intentelo nuevamente ");
                            }else if(this.status === 417){
                                    progressBar.setAttribute("class","progress-bar bg-danger");
                                    progressBar.innerHTML = instanciaActual.utf8_encode("Error "+this.status+": El servidor no puede cumplir los requisitos del campo Esperar encabezado de solicitud, intentelo nuevamente ");
                            }
                        } catch (e){
                           
                            progressBar.setAttribute("class","progress-bar bg-danger");
                            progressBar.innerHTML = instanciaActual.utf8_encode("Error : "+this.responseText+"");
                        }
		}
		var datosFormulario = new FormData();
                datosFormulario.append("accion","listar");
                datosFormulario.append("jtStartIndex", instanciaActual.jtStartIndex);
                datosFormulario.append("jtPageSize", instanciaActual.jtPageSize);
                datosFormulario.append("jtSorting", instanciaActual.jtSorting);
                
                for(var key in instanciaActual.parametrosBusquedas){
                    datosFormulario.append(key, instanciaActual.parametrosBusquedas[key]);
                }
		//cliente.send("accion=listar&jtStartIndex="+instanciaActual.jtStartIndex+"&jtPageSize="+instanciaActual.jtPageSize+"&jtSorting="+instanciaActual.jtSorting);
                cliente.send(datosFormulario);
        }
	utf8_encode(s) {
	  return s;
	}
	
	ajaxCombobox(url,accion){
		var instanciaActual = this;
		var cliente = new XMLHttpRequest();
		cliente.open("POST", url, true);
		//cliente.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                //cliente.setRequestHeader("Content-Type", "multipart/form-data");
		
		cliente.onerror = function () {
			bootbox.alert("Error : "+this.status+", al cargar, intentelo nuevamente ");
		};
		var instanciaActual = this;
		cliente.onreadystatechange = function(datos) {
			
			//var datosJson = JSON.parse(this.response);
			try {
                var datosJson = JSON.parse(this.response);
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					instanciaActual.combobox.push({
							registros : datosJson.Registros,
							accion : accion
						});
				}else if(this.status === 400){
					bootbox.alert("Error "+this.status+": La solicitud no se puede cumplir debido a una mala sintaxis, intentelo nuevamente ");
				}else if(this.status === 401){
					bootbox.alert("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder. Para usar cuando la autenticación es posible pero ha fallado o aún no se ha proporcionado, intentelo nuevamente ");
				}else if(this.status === 402){
					bootbox.alert("Error "+this.status+": reservado para uso futuro, intentelo nuevamente ");
				}else if(this.status === 403){
					bootbox.alert("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder, intentelo nuevamente ");
				}else if(this.status === 404){
					bootbox.alert("Error "+this.status+": página no encontrada, intentelo nuevamente ");
				}else if(this.status === 405){
					bootbox.alert("Error "+this.status+": Se realizó una solicitud de una página utilizando un método de solicitud no admitido por esa página, intentelo nuevamente ");
				}else if(this.status === 406){
					bootbox.alert("Error "+this.status+": El servidor solo puede generar una respuesta que no es aceptada por el cliente, intentelo nuevamente ");
				}else if(this.status === 407){
					bootbox.alert("Error "+this.status+": El cliente primero debe autenticarse con el proxy, intentelo nuevamente ");
				}else if(this.status === 408){
					bootbox.alert("Error "+this.status+": El servidor agotó el tiempo de espera para la solicitud, intentelo nuevamente ");
				}else if(this.status === 409){
					bootbox.alert("Error "+this.status+": La solicitud no se pudo completar debido a un conflicto en la solicitud, intentelo nuevamente ");
				}else if(this.status === 410){
					bootbox.alert("Error "+this.status+": La página solicitada ya no está disponible., intentelo nuevamente ");
				}else if(this.status === 411){
					bootbox.alert("Error "+this.status+": El 'Contenido-Longitud' no está definido. El servidor no aceptará la solicitud sin él., intentelo nuevamente ");
				}else if(this.status === 412){
					bootbox.alert("Error "+this.status+": La condición previa dada en la solicitud evaluada en falso por el servidor, intentelo nuevamente ");
				}else if(this.status === 413){
					bootbox.alert("Error "+this.status+": El servidor no aceptará la solicitud porque la entidad de solicitud es demasiado grande, intentelo nuevamente ");
				}else if(this.status === 414){
					bootbox.alert("Error "+this.status+": El servidor no aceptará la solicitud, porque la URL es demasiado larga. Ocurre cuando convierte una solicitud POST a una solicitud GET con una información de consulta larga, intentelo nuevamente ");
				}else if(this.status === 415){
					bootbox.alert("Error "+this.status+": El servidor no aceptará la solicitud, porque el tipo de medio no es compatible, intentelo nuevamente ");
				}else if(this.status === 416){
					bootbox.alert("Error "+this.status+": El cliente ha solicitado una parte del archivo, pero el servidor no puede suministrar esa parte, intentelo nuevamente ");
				}else if(this.status === 417){
					bootbox.alert("Error "+this.status+": El servidor no puede cumplir los requisitos del campo Esperar encabezado de solicitud, intentelo nuevamente ");
				}
            } catch (e){
                var resp = {
                    status: 'error',
                    data: 'Unknown error occurred: [' + this.responseText + ']'
                };
            }
			//console.log(JSON.stringify(datosJson));
			
		}
		var datosFormulario = new FormData();
                datosFormulario.append("accion",accion);
		//cliente.send("accion="+accion);
                cliente.send(datosFormulario);
	}
	barraProgreso(pe, mensaje){
		//console.log(pe);
		var contentLength;
		if (pe.lengthComputable) {
			contentLength = pe.total;
		} else {
			contentLength = parseInt(pe.target.getResponseHeader('x-decompressed-content-length'), 10);
		}
		
		//console.log("largo del contenido = "+contentLength);
		var progressIndicator = parseInt(Math.round((parseInt(pe.loaded)*100) / parseInt(contentLength)));
		//console.log(pe.loaded);
		//console.log(pe.lengthComputable);
		//if(pe.lengthComputable) {
		  //progressBar.max = pe.total
		  //progressBar.value = pe.loaded
		  //console.log(pe);
		  //console.log(pe);
		  //console.log("Cargado "+pe.loaded);
		  //console.log("Total "+pe.total);
		  //console.log("avance"+progressIndicator);
		  var progressBar = this.contenedor.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("div")[0].getElementsByTagName("div")[0];
		  //var porcentajeActual = (parseInt(pe.loaded)*100)/parseInt(pe.total);
		  //progressBar.setAttribute("aria-valuemax",pe.total);
		  //progressBar.setAttribute("aria-valuemin",0);
		  //console.log("style : width: "+progressIndicator+"%;");
		  progressBar.removeAttribute("style");
		  progressBar.setAttribute("style","width: "+progressIndicator*2+"%;");
		  progressBar.removeAttribute("aria-valuenow");
		  progressBar.setAttribute("aria-valuenow",progressIndicator);
		  //progressBar.setAttribute("class","progress-bar w-"+parseInt(progressIndicator));
		  //console.log("aria-valuenow "+progressIndicator);
		  //console.log("aria-valuemax"+progressBar.getAttribute("aria-valuemax"));
		  progressBar.innerHTML = mensaje+" "+progressIndicator+"%";
		  //console.log(mensaje+" "+progressIndicator+"%");
		//}
	}
	agregarNumeroFilaSinRepetir(vector,valor){
		var repetido = false;
		for(var key in vector){
			if(vector[key]==valor){
				repetido = true;
			}
		}
		if(repetido==false){
			vector.push(valor);
		}
		return vector;
	}
	obtenerNumeroDe(vector,campo){
		var numeroFilas = new Array();
		for(var key in vector){
			this.agregarNumeroFilaSinRepetir(numeroFilas,vector[key][campo]);
		}
		
		numeroFilas = numeroFilas.sort(function(a, b){return a-b});
		
		return numeroFilas = numeroFilas[numeroFilas.length-1];
	}
	
	buscarIndiceDeDatos(pk){
		var aliasJson = null;
		for(var key in this.columnas){
			if(this.columnas[key].pk!=null && this.columnas[key].pk==true){
				aliasJson = this.columnas[key].aliasJson;
			}
		}
		//console.log(aliasJson);
		for(var key in this.registrosBD.Registros){
			//console.log(this.registrosBD.Registros[key][aliasJson]);
			if(this.registrosBD.Registros[key][aliasJson]==pk){
				return key;
			}
		}
	}
	
	formulario_modificar(pk){
		var indice = this.buscarIndiceDeDatos(pk);
		var datos = this.registrosBD.Registros[indice];
		
		var numeroFilas = this.obtenerNumeroDe(this.columnas,"numeroFila");
		var numeroContenedores = this.obtenerNumeroDe(this.columnas,"contenedor");
		
		var html = "";
		html += '<form id="frm-modificar" action="'+this.urlCargarDatos+'" enctype="multipart/form-data">';
		for(var i=1;i<=numeroContenedores;i++){
			html += '<div class="card">';
			if(this.contenedores.length>0){
				html += '	<div class="card-header">'+this.contenedores[i-1]+'</div>';
			}
			html += '		<div class="card-body">';
			html += '			<blockquote class="blockquote mb-0">';
			
			for(var x=1; x<=numeroFilas; x++){
					var filaAgregada = false;
					for(var keyColumna in this.columnas){
						if(this.columnas[keyColumna].contenedor==i){
							if(filaAgregada==false){
								filaAgregada = true;
								html += '<div class="form-row">';
							}
							if(this.columnas[keyColumna].numeroFila == x && this.columnas[keyColumna].modificar == true){
								html += '<div class="col-md-4 mb-3">';
								html += '	<label for="validationServer01">'+this.columnas[keyColumna].nombre+'</label>';
								if(this.columnas[keyColumna].combobox!=null){
									html += '	<select class="form-control form-control-sm" id="'+this.columnas[keyColumna].nombre+'" name="'+this.columnas[keyColumna].nombre+'">';
									
									for(var keyCombo in this.combobox){
										if(this.combobox[keyCombo].accion == this.columnas[keyColumna].combobox){//Identificamos el combobox correspondiente al registro
											html += '<option value="">Seleccione</option>';
											for(var keyRegistros in this.combobox[keyCombo].registros){
												//Acá estan los registros del combobox
												//console.log(this.combobox[keyCombo].registros[keyRegistros].Value+'=='+datos[this.columnas[keyColumna].aliasJson]);
                                                                                                var valorSelect = datos[this.columnas[keyColumna].aliasJson];
                                                                                                if(valorSelect==undefined || valorSelect==null){
                                                                                                    valorSelect = "";
                                                                                                }    
												if(this.combobox[keyCombo].registros[keyRegistros].Value==valorSelect){
													html += '<option value="'+this.combobox[keyCombo].registros[keyRegistros].Value+'" selected>'+this.combobox[keyCombo].registros[keyRegistros].DisplayText+'</option>';
												}else{
													html += '<option value="'+this.combobox[keyCombo].registros[keyRegistros].Value+'">'+this.combobox[keyCombo].registros[keyRegistros].DisplayText+'</option>';
												}
											}
										}
									}
									
									html += '	</select>';
								} else if(this.columnas[keyColumna].inputPersonalizadoIngresar!=null){
									html += '	'+this.columnas[keyColumna].inputPersonalizadoIngresar(this.columnas[keyColumna].nombre,datos);
								} else if(this.columnas[keyColumna].archivo!=null && this.columnas[keyColumna].archivo == true){
									if(this.columnas[keyColumna].vistaPreviaModificar!=null){
										html += this.columnas[keyColumna].vistaPreviaModificar(datos);
									}
									html += '	<input type="file" class="form-control form-control-sm" id="'+this.columnas[keyColumna].nombre+'" name="'+this.columnas[keyColumna].nombre+'" placeholder="'+this.columnas[keyColumna].nombre+'" accept="image/*">';
								}else{
                                                                        var valorDato = datos[this.columnas[keyColumna].aliasJson];
                                                                        if(valorDato==undefined || valorDato==null){
                                                                            valorDato = "";
                                                                        }
									html += '	<input type="text" class="form-control form-control-sm" id="'+this.columnas[keyColumna].nombre+'" name="'+this.columnas[keyColumna].nombre+'" placeholder="'+this.columnas[keyColumna].nombre+'" value="'+valorDato+'" required>';
								}
								
								html += '	<div class="valid-feedback" id="frm-validacion-'+this.columnas[keyColumna].nombre+'"></div>';
								html += '</div>';
							}
						}
					}
					html += '</div>';
				
			}
			html += '			</blockquote>';
			html += '		</div>';
			html += '</div><br>';
		}
		html += '<div id="contenedor-frm-barra-progreso"></div>';
		return html += '</form>';
	}
	
	formulario_ingresar(){
		var numeroFilas = this.obtenerNumeroDe(this.columnas,"numeroFila");
		var numeroContenedores = this.obtenerNumeroDe(this.columnas,"contenedor");
		
		var html = "";
		html += '<form id="frm-crear" action="'+this.urlCargarDatos+'" enctype="multipart/form-data">';
		for(var i=1;i<=numeroContenedores;i++){
			html += '<div class="card">';
			if(this.contenedores.length>0){
				html += '	<div class="card-header">'+this.contenedores[i-1]+'</div>';
			}
			html += '		<div class="card-body">';
			html += '			<blockquote class="blockquote mb-0">';
			
			for(var x=1; x<=numeroFilas; x++){
					var filaAgregada = false;
					for(var keyColumna in this.columnas){
						if(this.columnas[keyColumna].contenedor==i){
							if(filaAgregada==false){
								filaAgregada = true;
								html += '<div class="form-row">';
							}
							if(this.columnas[keyColumna].numeroFila == x && this.columnas[keyColumna].modificar == true){
								html += '<div class="col-md-4 mb-3">';
								html += '	<label for="validationServer01">'+this.columnas[keyColumna].nombre+'</label>';
								if(this.columnas[keyColumna].combobox!=null){
									html += '	<select class="form-control form-control-sm" id="'+this.columnas[keyColumna].nombre+'" name="'+this.columnas[keyColumna].nombre+'">';
									
									for(var keyCombo in this.combobox){
										if(this.combobox[keyCombo].accion == this.columnas[keyColumna].combobox){//Identificamos el combobox correspondiente al registro
											html += '<option value="">Seleccione</option>';
											for(var keyRegistros in this.combobox[keyCombo].registros){
												//Acá estan los registros del combobox
												html += '<option value="'+this.combobox[keyCombo].registros[keyRegistros].Value+'">'+this.combobox[keyCombo].registros[keyRegistros].DisplayText+'</option>';
											}
										}
									}
									
									html += '	</select>';
								} else if(this.columnas[keyColumna].inputPersonalizadoIngresar!=null){
									html += '	'+this.columnas[keyColumna].inputPersonalizadoIngresar(this.columnas[keyColumna].nombre);
								} else if(this.columnas[keyColumna].archivo!=null && this.columnas[keyColumna].archivo == true){
									html += '	<input type="file" class="form-control form-control-sm" id="'+this.columnas[keyColumna].nombre+'" name="'+this.columnas[keyColumna].nombre+'" placeholder="'+this.columnas[keyColumna].nombre+'" accept="image/*">';
								}else{
									html += '	<input type="text" class="form-control form-control-sm" id="'+this.columnas[keyColumna].nombre+'" name="'+this.columnas[keyColumna].nombre+'" placeholder="'+this.columnas[keyColumna].nombre+'" required>';
								}
								
								html += '	<div class="valid-feedback" id="frm-validacion-'+this.columnas[keyColumna].nombre+'"></div>';
								html += '</div>';
							}
						}
					}
					html += '</div>';
				
			}
			html += '			</blockquote>';
			html += '		</div>';
			html += '</div><br>';
		}
		html += '<div id="contenedor-frm-barra-progreso"></div>';
		return html += '</form>';
	}
	
	buscarDatosIgualesEntreFormularioColumna(nombreColumna,formulariop){
		for(var i=0;i<formulariop.elements.length;i++){
			if(formulariop.elements[i].name==nombreColumna){
				return i;
			}
		}
		console.log("Campo no encontrado "+nombreColumna);
		return null;
	}
	
	popup(html,motivo,pk){
		var botonCargando = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
		botonCargando += ' Guardando ...';
		
		var barraProgreso = '<div class="progress">'
							+'<div id="frm-barra-progreso" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>'
							+'</div>';
		var instanciaActual = this;
		//Establecer el numero de filas
		var dialog = new Array();
		if(motivo=='modificar'){
			dialog = bootbox.dialog({
				title: 'Modificar registro',
				message: html,
				size: 'large',
				buttons: {
					cancelar: {
						label: "Cancelar",
						className: 'btn-secondary cancelar-frm',
						callback: function(){
							
						}
					},
					guardar: {
						label: "Guardar",
						className: 'btn-primary guardar-frm',
						callback: function(){
							var form = $("#frm-modificar");
							var formData = new FormData(form);
							var campos_sin_completar = new Array();
							var fields = form.serializeArray();
							var datosFormulario = new FormData();
							datosFormulario.append("accion", "modificar");
							datosFormulario.append("pk", pk);
							//Campos obligatorios
							var formulariop = document.getElementById("frm-modificar");
							for(var keyColumna in instanciaActual.columnas){
								var i = instanciaActual.buscarDatosIgualesEntreFormularioColumna(instanciaActual.columnas[keyColumna].nombre,formulariop);
								var campo = null;
								var nombreCampo = null;
								var valorCampo = null;
								if(i!=null){
									campo = formulariop.elements[i];
									nombreCampo = campo.name;
									valorCampo = campo.value;
								}
								if(instanciaActual.columnas[keyColumna].campoObligatorio==true && instanciaActual.columnas[keyColumna].archivo==null){
									if(nombreCampo==instanciaActual.columnas[keyColumna].nombre){
										//Validacion por AJAX
										if(instanciaActual.columnas[keyColumna].validacionAjax!=null){
											var claseCampo = campo.getAttribute("class");
											
											if(claseCampo=="form-control form-control-sm is-invalid"){//Si el dato no es valido
												campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : dato inválido."
													});
												campo.focus();
											}else if(claseCampo=="form-control form-control-sm is-valid"){//Si el dato es valido
												//No se hace nada
											}else if(claseCampo=="form-control form-control-sm" && valorCampo.length==0){//Si no ha sido completado
												
												campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin completar."
													});
												campo.focus();
											}else{//Este ultimo se refiere a la posibilidad en que el campo venga sin validar pero con contenido al interior
												campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin validar."
													});
												campo.focus();
											}
										}
										//Fin validacion por AJAX
										//Validacion campos obligatorios
										if(valorCampo.length==0){
											campo.setAttribute("class", "form-control form-control-sm is-invalid");
											document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
											if(instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio!=null){
												campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : "+instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio
												});
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio;
											}else{
												campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin completar."
												});
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "Ingrese el campo";
											}
										}else{
											campo.setAttribute("class", "form-control form-control-sm is-valid");
											document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
											document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
										}
										//Fin validacion campos obligatorios
										
										//Validacion adicional
										
										if(instanciaActual.columnas[keyColumna].validacionExtra!=null){
											var validacion = null;
												
											validacion = instanciaActual.columnas[keyColumna].validacionExtra(formulariop.elements);
											
											
											if(validacion==true){
												campo.setAttribute("class", "form-control form-control-sm is-valid");
												document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
											}else if(validacion==false && instanciaActual.columnas[keyColumna].archivo==null){
									
												campo.setAttribute("class", "form-control form-control-sm is-invalid");
												document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
												if(instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio!=null){
													campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : "+instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio
													});
													document.getElementById("frm-validacion-"+nombreCampo).innerHTML = instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio;
												}else{
													campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+""
													});
													document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "Error";
												}
											}	
											
										}
										//Fin validacion adicional
										
										
									}
								}else{
									if(instanciaActual.columnas[keyColumna].archivo!=null && instanciaActual.columnas[keyColumna].archivo==true){
										//Validacion extra para archivos
										var validacion = null;
										if(instanciaActual.columnas[keyColumna].archivo!=null && instanciaActual.columnas[keyColumna].archivo==true){
											if(campo.files.length > 0){
												var validado = false;
												if(instanciaActual.columnas[keyColumna].tipoArchivos!=null){
													if(instanciaActual.columnas[keyColumna].tipoArchivos.indexOf(campo.files[0].type) == -1) {
														validacion = false;
														campos_sin_completar.push({
															error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : El archivo subido es incorrecto"
														});
														campo.setAttribute("class", "form-control form-control-sm is-invalid");
														document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
														document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "El archivo subido es incorrecto";
													}else{
														campo.setAttribute("class", "form-control form-control-sm is-valid");
														document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
														document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
														//console.log(instanciaActual.columnas[keyColumna].tipoArchivos.indexOf(campo.files[0].type));
													}
													validado = true;
												}
												if(instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB!=null){
													if(campo.files[0].size > instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB*1024*1024) {
														validacion = false;
														campos_sin_completar.push({
															error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : El peso maximo son "+instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB+" MB"
														});
														campo.setAttribute("class", "form-control form-control-sm is-invalid");
														document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
														document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "El peso maximo son "+instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB+" MB";
													}else{
														if(validado!=true){
															campo.setAttribute("class", "form-control form-control-sm is-valid");
															document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
															document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
														}
													}
												}
											}
										//FIN Validacion extra para archivos	
										}
										//validar que el archivo FILE no este vacio
										/*if(campo.files.length == 0){
											campo.setAttribute("class", "form-control form-control-sm is-invalid");
											document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
											if(instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio!=null){
												campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : "+instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio
												});
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio;
											}else{
												campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : Ingrese un archivo."
												});
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "Ingrese un archivo";
											}
										}else{
											campo.setAttribute("class", "form-control form-control-sm is-valid");
											document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
											document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
										}*/
										//FIN validar que el archivo FILE no este vacio
										if(validacion==true){
											campo.setAttribute("class", "form-control form-control-sm is-valid");
											document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
											document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
										}
									}
									//Validacion por AJAX
									
									if(instanciaActual.columnas[keyColumna].validacionAjax!=null){
										var claseCampo = campo.getAttribute("class");
										if(claseCampo=="form-control form-control-sm is-invalid"){//Si el dato no es valido
											campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : dato inválido."
												});
											campo.focus();
										}else if(claseCampo=="form-control form-control-sm is-valid"){//Si el dato es valido
											//No se hace nada
										}else if(claseCampo=="form-control form-control-sm" && campo.value.length==0){//Si no ha sido completado
											//Como estamos en la aprte del if donde no son obligatorios no se tomará
											/*campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin completar."
												});
											campo.focus();*/
										}else{//Este ultimo se refiere a la posibilidad en que el campo venga sin validar pero con contenido al interior
											campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin validar."
												});
											campo.focus();
										}	
									}
										
									//Fin validacion por AJAX
								}
								
							}
							
							
							if(campos_sin_completar.length>0){
								var mensajes_error = "";
								for(var key in campos_sin_completar){
									mensajes_error += campos_sin_completar[key].error+"\n";
								}
								alert(mensajes_error);
								return false;
							}
							//------Campos obligatorios
							
							//Capturar campos y formar el objeto formulario para enviar
							for(var keyColumna in instanciaActual.columnas){
								var i = instanciaActual.buscarDatosIgualesEntreFormularioColumna(instanciaActual.columnas[keyColumna].nombre,formulariop);
								if(i!=null){
									var campo = formulariop.elements[i];
									//console.log(i);
									//console.log(campo);
									//console.log(name);
									var nombreCampo = campo.name;
									var valorCampo = campo.value;
									if(instanciaActual.columnas[keyColumna].archivo!=null && instanciaActual.columnas[keyColumna].archivo==true){
										//formData.append(nombreCampo, campo.get(0).files[0]);
										datosFormulario.append(nombreCampo, campo.files[0]);
									}else{
										datosFormulario.append(nombreCampo, valorCampo);
									}
								}
							}
							//--Fin campturar campos y formar el objeto formulario para enviar

							var botonGuardar = $(".guardar-frm");
							botonGuardar.html(botonCargando);
							botonGuardar.prop('disabled', true);
							
							var botonCancelar = $(".cancelar-frm");
							botonCancelar.prop('disabled', true);

							var contenedorBarraProgreso = $("#contenedor-frm-barra-progreso");
							contenedorBarraProgreso.html(barraProgreso);
							instanciaActual.ajaxGuardarModificar(datosFormulario,"modificar",pk);
							return false;
						}
					}
				}
			});
			dialog.init(function(){
				// Cuando se abra el popup se activaran los siguientes eventos para validar el formulario
				var formulariop = document.getElementById("frm-modificar");
				for(var keyColumna in instanciaActual.columnas){
					var i = instanciaActual.buscarDatosIgualesEntreFormularioColumna(instanciaActual.columnas[keyColumna].nombre,formulariop);
					if(i!=null){
						var campo = formulariop.elements[i];
						var nombreCampo = campo.name;
						var valorCampo = campo.value;
                                                if(instanciaActual.columnas[keyColumna].elementoALaEscuchaFormulario!=null){
                                                    instanciaActual.columnas[keyColumna].elementoALaEscuchaFormulario();
                                                }
                                                
						//No repetir datos ajax
						if(instanciaActual.columnas[keyColumna].validacionAjax!=null){
							//instanciaActual.ajaxDatosSinRepetir(instanciaActual.columnas[keyColumna].validacionAjax,pk);
							var validacion = instanciaActual.columnas[keyColumna].validacionAjax;
							var indiceValidacion = keyColumna;
                                                        
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",indiceValidacion);
							campo.addEventListener("blur", function(){
								if(this.value.length==0){//Si el campo esta en vacio no se validara y el estilo quedara normal
									this.setAttribute("class", "form-control form-control-sm");
									document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
								}else{
									instanciaActual.ajaxDatosSinRepetir(this.getAttribute("indice-validacion"),instanciaActual.columnas[this.getAttribute("indice-validacion")].validacionAjax,this,pk,formulariop);
								}	
							});
						}
						if(instanciaActual.columnas[keyColumna].onblur!=null){
							var funcion = instanciaActual.columnas[keyColumna].onblur;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("blur", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].onblur(this);
							});
						}
						if(instanciaActual.columnas[keyColumna].keyPress!=null){
							var funcion = instanciaActual.columnas[keyColumna].keyPress;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("keypress", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].keyPress(this);
							});
						} 
						
						if(instanciaActual.columnas[keyColumna].keyUp!=null){
							var funcion = instanciaActual.columnas[keyColumna].keyUp;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("keyup", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].keyUp(this);
							});
						}
						
						if(instanciaActual.columnas[keyColumna].keyDown!=null){
							var funcion = instanciaActual.columnas[keyColumna].keyDown;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("keydown", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].keyDown(this);
							});
						}
						//Fin no repetir datos ajax
					}
				}
			});
		}else if(motivo=='crear'){
			dialog = bootbox.dialog({
				title: 'Agregar nuevo registro',
				message: html,
				size: 'large',
				
				buttons: {
					cancelar: {
						label: "Cancelar",
						className: 'btn-secondary cancelar-frm',
						callback: function(){
							
						}
					},
					guardar: {
						label: "Guardar",
						className: 'btn-primary guardar-frm',
						callback: function(){
							var form = $("#frm-crear");
							var formData = new FormData(form);
							var campos_sin_completar = new Array();
							var fields = form.serializeArray();
							var datosFormulario = new FormData();
							datosFormulario.append("accion", "crear");
							
							//Campos obligatorios
							var formulariop = document.getElementById("frm-crear");
							for(var keyColumna in instanciaActual.columnas){
								var i = instanciaActual.buscarDatosIgualesEntreFormularioColumna(instanciaActual.columnas[keyColumna].nombre,formulariop);
								var campo = null;
								var nombreCampo = null;
								var valorCampo = null;
								if(i!=null){
									campo = formulariop.elements[i];
									nombreCampo = campo.name;
									valorCampo = campo.value;
								}
								if(instanciaActual.columnas[keyColumna].campoObligatorio==true){
									if(nombreCampo==instanciaActual.columnas[keyColumna].nombre){
										//Validacion por AJAX
										if(instanciaActual.columnas[keyColumna].validacionAjax!=null){
											var claseCampo = campo.getAttribute("class");
											
											if(claseCampo=="form-control form-control-sm is-invalid"){//Si el dato no es valido
												campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : dato inválido."
													});
												campo.focus();
											}else if(claseCampo=="form-control form-control-sm is-valid"){//Si el dato es valido
												//No se hace nada
											}else if(claseCampo=="form-control form-control-sm" && valorCampo.length==0){//Si no ha sido completado
												
												campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin completar."
													});
												campo.focus();
											}else{//Este ultimo se refiere a la posibilidad en que el campo venga sin validar pero con contenido al interior
												campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin validar."
													});
												campo.focus();
											}
										}
										//Fin validacion por AJAX
										//Validacion campos obligatorios
										if(instanciaActual.columnas[keyColumna].archivo!=null && instanciaActual.columnas[keyColumna].archivo==true){
											//validar que el archivo FILE no este vacio
											if(campo.files.length == 0){
												campo.setAttribute("class", "form-control form-control-sm is-invalid");
												document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
												if(instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio!=null){
													campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : "+instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio
													});
													document.getElementById("frm-validacion-"+nombreCampo).innerHTML = instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio;
												}else{
													campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : Ingrese un archivo."
													});
													document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "Ingrese un archivo";
												}
											}else{
												campo.setAttribute("class", "form-control form-control-sm is-valid");
												document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
											}
											//FIN validar que el archivo FILE no este vacio
										}else if(valorCampo.length==0){
											campo.setAttribute("class", "form-control form-control-sm is-invalid");
											document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
											if(instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio!=null){
												campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : "+instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio
												});
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio;
											}else{
												campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin completar."
												});
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "Ingrese el campo";
											}
										}else{
											campo.setAttribute("class", "form-control form-control-sm is-valid");
											document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
											document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
										}
										//Fin validacion campos obligatorios
										
										//Validacion adicional
										
										if(instanciaActual.columnas[keyColumna].validacionExtra!=null){
											var validacion = null;
											//Validacion extra para archivos
											if(instanciaActual.columnas[keyColumna].archivo!=null && instanciaActual.columnas[keyColumna].archivo==true){
												if(campo.files.length > 0){
													var validado = false;
													if(instanciaActual.columnas[keyColumna].tipoArchivos!=null){
														if(instanciaActual.columnas[keyColumna].tipoArchivos.indexOf(campo.files[0].type) == -1) {
															validacion = false;
															campos_sin_completar.push({
																error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : El archivo subido es incorrecto"
															});
															campo.setAttribute("class", "form-control form-control-sm is-invalid");
															document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
															document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "El archivo subido es incorrecto";
														}else{
															campo.setAttribute("class", "form-control form-control-sm is-valid");
															document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
															document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
															//console.log(instanciaActual.columnas[keyColumna].tipoArchivos.indexOf(campo.files[0].type));
														}
														validado = true;
													}
													if(instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB!=null){
														if(campo.files[0].size > instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB*1024*1024) {
															validacion = false;
															campos_sin_completar.push({
																error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : El peso maximo son "+instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB+" MB"
															});
															campo.setAttribute("class", "form-control form-control-sm is-invalid");
															document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
															document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "El peso maximo son "+instanciaActual.columnas[keyColumna].tamanoMaximoArchivoMB+" MB";
														}else{
															if(validado!=true){
																campo.setAttribute("class", "form-control form-control-sm is-valid");
																document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
																document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
															}
														}
													}
												}
											//FIN Validacion extra para archivos	
											}else{	
												validacion = instanciaActual.columnas[keyColumna].validacionExtra(formulariop.elements);
											}
											
											if(validacion==true){
												campo.setAttribute("class", "form-control form-control-sm is-valid");
												document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
												document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "";
											}else if(validacion==false && instanciaActual.columnas[keyColumna].archivo==null){
									
												campo.setAttribute("class", "form-control form-control-sm is-invalid");
												document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","invalid-feedback");
												if(instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio!=null){
													campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : "+instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio
													});
													document.getElementById("frm-validacion-"+nombreCampo).innerHTML = instanciaActual.columnas[keyColumna].mensajeErrorCampoObligatorio;
												}else{
													campos_sin_completar.push({
														error : "Error en "+instanciaActual.columnas[keyColumna].nombre+""
													});
													document.getElementById("frm-validacion-"+nombreCampo).innerHTML = "Error";
												}
											}	
											
										}
										//Fin validacion adicional
										
										
									}
								}else{
									//Validacion por AJAX
									
									if(instanciaActual.columnas[keyColumna].validacionAjax!=null){
										var claseCampo = campo.getAttribute("class");
										if(claseCampo=="form-control form-control-sm is-invalid"){//Si el dato no es valido
											campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : dato inválido."
												});
											campo.focus();
										}else if(claseCampo=="form-control form-control-sm is-valid"){//Si el dato es valido
											//No se hace nada
										}else if(claseCampo=="form-control form-control-sm" && campo.value.length==0){//Si no ha sido completado
											//Como estamos en la aprte del if donde no son obligatorios no se tomará
											/*campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin completar."
												});
											campo.focus();*/
										}else{//Este ultimo se refiere a la posibilidad en que el campo venga sin validar pero con contenido al interior
											campos_sin_completar.push({
													error : "Error en "+instanciaActual.columnas[keyColumna].nombre+" : campo sin validar."
												});
											campo.focus();
										}	
									}
										
									//Fin validacion por AJAX
								}
								
							}
							
							
							if(campos_sin_completar.length>0){
								var mensajes_error = "";
								for(var key in campos_sin_completar){
									mensajes_error += campos_sin_completar[key].error+"\n";
								}
								alert(mensajes_error);
								return false;
							}
							//------Campos obligatorios
							
							//Capturar campos y formar el objeto formulario para enviar
							for(var keyColumna in instanciaActual.columnas){
								var i = instanciaActual.buscarDatosIgualesEntreFormularioColumna(instanciaActual.columnas[keyColumna].nombre,formulariop);
								if(i!=null){
									var campo = formulariop.elements[i];
									//console.log(i);
									//console.log(campo);
									//console.log(name);
									var nombreCampo = campo.name;
									var valorCampo = campo.value;
									if(instanciaActual.columnas[keyColumna].archivo!=null && instanciaActual.columnas[keyColumna].archivo==true){
										//formData.append(nombreCampo, campo.get(0).files[0]);
										datosFormulario.append(nombreCampo, campo.files[0]);
									}else{
										datosFormulario.append(nombreCampo, valorCampo);
									}
								}
							}
							//--Fin campturar campos y formar el objeto formulario para enviar

							var botonGuardar = $(".guardar-frm");
							botonGuardar.html(botonCargando);
							botonGuardar.prop('disabled', true);
							
							var botonCancelar = $(".cancelar-frm");
							botonCancelar.prop('disabled', true);

							var contenedorBarraProgreso = $("#contenedor-frm-barra-progreso");
							contenedorBarraProgreso.html(barraProgreso);
							instanciaActual.ajaxGuardarModificar(datosFormulario,"crear",null);
							return false;
						}
					}
				}
			});
			dialog.init(function(){
				// Cuando se abra el popup se activaran los siguientes eventos para validar el formulario
				var formulariop = document.getElementById("frm-crear");
				for(var keyColumna in instanciaActual.columnas){
					var i = instanciaActual.buscarDatosIgualesEntreFormularioColumna(instanciaActual.columnas[keyColumna].nombre,formulariop);
					if(i!=null){
						var campo = formulariop.elements[i];
						var nombreCampo = campo.name;
						var valorCampo = campo.value;
                                                if(instanciaActual.columnas[keyColumna].elementoALaEscuchaFormulario!=null){
                                                    instanciaActual.columnas[keyColumna].elementoALaEscuchaFormulario();
                                                }
						//No repetir datos ajax
						if(instanciaActual.columnas[keyColumna].validacionAjax!=null){
							//instanciaActual.ajaxDatosSinRepetir(instanciaActual.columnas[keyColumna].validacionAjax,pk);
							var validacion = instanciaActual.columnas[keyColumna].validacionAjax;
							var indiceValidacion = keyColumna;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",indiceValidacion);
							campo.addEventListener("blur", function(){
								if(this.value.length==0){//Si el campo esta en vacio no se validara y el estilo quedara normal
									this.setAttribute("class", "form-control form-control-sm");
									document.getElementById("frm-validacion-"+nombreCampo).setAttribute("class","valid-feedback");
								}else{
									instanciaActual.ajaxDatosSinRepetir(this.getAttribute("indice-validacion"),instanciaActual.columnas[this.getAttribute("indice-validacion")].validacionAjax,this,null,formulariop);
								}	
							});
						}
						if(instanciaActual.columnas[keyColumna].onblur!=null){
							var funcion = instanciaActual.columnas[keyColumna].onblur;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("blur", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].onblur(this);
							});
						}
						if(instanciaActual.columnas[keyColumna].keyPress!=null){
							var funcion = instanciaActual.columnas[keyColumna].keyPress;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("keypress", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].keyPress(this);
							});
						} 
						
						if(instanciaActual.columnas[keyColumna].keyUp!=null){
							var funcion = instanciaActual.columnas[keyColumna].keyUp;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("keyup", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].keyUp(this);
							});
						}
						
						if(instanciaActual.columnas[keyColumna].keyDown!=null){
							var funcion = instanciaActual.columnas[keyColumna].keyDown;
                                                        instanciaActual.agregarAtributo(campo,"indice-validacion",keyColumna);
							campo.addEventListener("keydown", function(){
								instanciaActual.columnas[this.getAttribute("indice-validacion")].keyDown(this);
							});
						}
						//Fin no repetir datos ajax
					}
				}
			});
		}
		
	}
	
	barraprogresoGuardarModificar(pe,mensaje,idBarraProgreso){
		var contentLength;
		if (pe.lengthComputable) {
			contentLength = pe.total;
		} else {
			contentLength = parseInt(pe.target.getResponseHeader('x-decompressed-content-length'), 10);
		}
		
		
		var progressIndicator = Math.round((parseInt(pe.loaded)*100) / contentLength);
		
	  var progressBar = $("#"+idBarraProgreso);
	  var porcentajeActual = (parseInt(pe.loaded)*100)/parseInt(pe.total);
	  //console.log(progressBar);
	  progressBar.attr("style","width: "+progressIndicator+"%;");
	  progressBar.attr("aria-valuenow",progressIndicator);
	  progressBar.html(mensaje+" "+progressIndicator+"%");
	}
	
	buscarRegistros(pk){
		for(var keyColumna in this.columnas){
			if(this.columnas[keyColumna].pk==true){
				for(var key in this.registrosBD.Registros){
					var valor = this.registrosBD.Registros[key][this.columnas[keyColumna].aliasJson];
					if(valor==pk) return this.registrosBD.Registros[key];
				}
			}
		}
	}	
	ajaxDatosSinRepetir(indiceValidacion,parametosValidacion,campo, pk, formulario){//instanciaActual.columnas[keyColumna].validacionAjax,campo,pk
                
		var datosFila = this.buscarRegistros(pk);
		var instanciaActual = this;
		var cliente = new XMLHttpRequest();
		cliente.open("POST", parametosValidacion().url, true);
		//cliente.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		cliente.onerror = function () {
			bootbox.alert("Error : "+this.status+", al cargar, intentelo nuevamente ");
		};
		var instanciaActual = this;
		cliente.onreadystatechange = function(datos) {
			
			//var datosJson = JSON.parse(this.response);
			try {
				
                var datosJson = JSON.parse(this.response);
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					if(datosJson.Resultado=="OK"){
						
						var respuesta = null;
						if(pk!=null){
							respuesta = parametosValidacion().validacion(datosJson.Registros,datosFila,campo.value,formulario, pk,datosJson);
						}else{
							respuesta = parametosValidacion().validacion(datosJson.Registros,null,campo.value,formulario, null,datosJson);
						}
						
						if(respuesta.resultado == false){
							campo.setAttribute("class", "form-control form-control-sm is-invalid");
							document.getElementById("frm-validacion-"+campo.name).setAttribute("class","invalid-feedback");
							document.getElementById("frm-validacion-"+campo.name).innerHTML = respuesta.mensaje;
						}else{
							campo.setAttribute("class", "form-control form-control-sm is-valid");
							document.getElementById("frm-validacion-"+campo.name).setAttribute("class","valid-feedback");
							document.getElementById("frm-validacion-"+campo.name).innerHTML = "";
							//console.log(instanciaActual.columnas[keyColumna].tipoArchivos.indexOf(campo.files[0].type));
						}
					}
					
				
				}else if(this.status === 400){
					bootbox.alert("Error "+this.status+": La solicitud no se puede cumplir debido a una mala sintaxis, intentelo nuevamente ");
				}else if(this.status === 401){
					bootbox.alert("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder. Para usar cuando la autenticación es posible pero ha fallado o aún no se ha proporcionado, intentelo nuevamente ");
				}else if(this.status === 402){
					bootbox.alert("Error "+this.status+": reservado para uso futuro, intentelo nuevamente ");
				}else if(this.status === 403){
					bootbox.alert("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder, intentelo nuevamente ");
				}else if(this.status === 404){
					bootbox.alert("Error "+this.status+": página no encontrada, intentelo nuevamente ");
				}else if(this.status === 405){
					bootbox.alert("Error "+this.status+": Se realizó una solicitud de una página utilizando un método de solicitud no admitido por esa página, intentelo nuevamente ");
				}else if(this.status === 406){
					bootbox.alert("Error "+this.status+": El servidor solo puede generar una respuesta que no es aceptada por el cliente, intentelo nuevamente ");
				}else if(this.status === 407){
					bootbox.alert("Error "+this.status+": El cliente primero debe autenticarse con el proxy, intentelo nuevamente ");
				}else if(this.status === 408){
					bootbox.alert("Error "+this.status+": El servidor agotó el tiempo de espera para la solicitud, intentelo nuevamente ");
				}else if(this.status === 409){
					bootbox.alert("Error "+this.status+": La solicitud no se pudo completar debido a un conflicto en la solicitud, intentelo nuevamente ");
				}else if(this.status === 410){
					bootbox.alert("Error "+this.status+": La página solicitada ya no está disponible., intentelo nuevamente ");
				}else if(this.status === 411){
					bootbox.alert("Error "+this.status+": El 'Contenido-Longitud' no está definido. El servidor no aceptará la solicitud sin él., intentelo nuevamente ");
				}else if(this.status === 412){
					bootbox.alert("Error "+this.status+": La condición previa dada en la solicitud evaluada en falso por el servidor, intentelo nuevamente ");
				}else if(this.status === 413){
					bootbox.alert("Error "+this.status+": El servidor no aceptará la solicitud porque la entidad de solicitud es demasiado grande, intentelo nuevamente ");
				}else if(this.status === 414){
					bootbox.alert("Error "+this.status+": El servidor no aceptará la solicitud, porque la URL es demasiado larga. Ocurre cuando convierte una solicitud POST a una solicitud GET con una información de consulta larga, intentelo nuevamente ");
				}else if(this.status === 415){
					bootbox.alert("Error "+this.status+": El servidor no aceptará la solicitud, porque el tipo de medio no es compatible, intentelo nuevamente ");
				}else if(this.status === 416){
					bootbox.alert("Error "+this.status+": El cliente ha solicitado una parte del archivo, pero el servidor no puede suministrar esa parte, intentelo nuevamente ");
				}else if(this.status === 417){
					bootbox.alert("Error "+this.status+": El servidor no puede cumplir los requisitos del campo Esperar encabezado de solicitud, intentelo nuevamente ");
				}
            } catch (e){
                var resp = {
                    status: 'error',
                    data: 'Unknown error occurred: [' + this.responseText + ']'
                };
				//console.log(resp);
            }
			//console.log(JSON.stringify(datosJson));
			
		}
                
		var datoEnviar = null;
		if(pk!=null){
			datoEnviar = datosFila[parametosValidacion().datoEnviar];
		}else{
			datoEnviar = null;
		}
		var nombreDatoEnviar = parametosValidacion().datoEnviar;
                var datosFormulario = new FormData();
                datosFormulario.append("accion",parametosValidacion().accion);
                datosFormulario.append(nombreDatoEnviar, datoEnviar);
                datosFormulario.append(campo.name, campo.value);
                
		//cliente.send("accion="+parametosValidacion().accion+"&"+nombreDatoEnviar+"="+datoEnviar+"&valorCampo="+campo.value);
                cliente.send(datosFormulario);
	}
	
	ajaxGuardarModificar(frm,accion,pk){
		var url = this.urlCargarDatos;
		var instanciaActual = this;
		var cliente = new XMLHttpRequest();
		cliente.open("POST", url, true);
		//cliente.setRequestHeader("Content-Type", "multipart/form-data");
		cliente.upload.addEventListener('progress', function(e){//Esto es al subir un archivo
			instanciaActual.barraprogresoGuardarModificar(e,"subiendo","frm-barra-progreso");
		}, false);
		cliente.onprogress = function(pe) {//Esto es al descargar un archivo
			instanciaActual.barraprogresoGuardarModificar(pe,"descargando","frm-barra-progreso");
		}
		cliente.onerror = function () {
			var progressBar = $("#frm-barra-progreso");
			progressBar.setAttribute("class","progress-bar bg-danger");
			progressBar.innerHTML = "Error : "+this.status+", al cargar, intentelo nuevamente ";
		};
		cliente.onloadend = function(pe) {
			//progressBar.value = pe.loaded
			//console.log(pe);
		}
		cliente.onreadystatechange = function(datos) {
			var progressBar = $("#frm-barra-progreso");
			//var datosJson = JSON.parse(this.response);
			try {
                var datosJson = JSON.parse(this.response);
            } catch (e){
                var resp = {
                    status: 'error',
                    data: 'Unknown error occurred: [' + this.responseText + ']'
                };
            }
			//console.log(JSON.stringify(datosJson));
			var mensajeError = false;
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				if(datosJson.Resultado=="OK"){
					//this.registrosBD[0].Registros = datosJson.Registros;
					//console.log(datosJson);
					bootbox.hideAll();
					instanciaActual.cargarDatos();
				}else{
                                        if(accion=="eliminar"){
                                            bootbox.alert("Error : "+datosJson.Message);
                                        }else{
                                            progressBar.attr("class","progress-bar bg-danger");
                                            progressBar.html("Error : "+datosJson.Message+"");
                                            var botonGuardar = $(".guardar-frm");
                                            botonGuardar.html("Reintentar Guardar");
                                            botonGuardar.prop('disabled', false);
                                            var botonCancelar = $(".cancelar-frm");
                                            botonCancelar.prop('disabled', false);
                                        }
					//console.log(this.response.Resultado);
					
				}
			}else if(this.status === 400){
				mensajeError = instanciaActual.utf8_encode("Error "+this.status+": La solicitud no se puede cumplir debido a una mala sintaxis, intentelo nuevamente ");
			}else if(this.status === 401){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder. Para usar cuando la autenticación es posible pero ha fallado o aún no se ha proporcionado, intentelo nuevamente ");
			}else if(this.status === 402){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": reservado para uso futuro, intentelo nuevamente ");
			}else if(this.status === 403){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": La solicitud fue legal, pero el servidor se niega a responder, intentelo nuevamente ");
			}else if(this.status === 404){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": página no encontrada, intentelo nuevamente ");
			}else if(this.status === 405){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": Se realizó una solicitud de una página utilizando un método de solicitud no admitido por esa página, intentelo nuevamente ");
			}else if(this.status === 406){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El servidor solo puede generar una respuesta que no es aceptada por el cliente, intentelo nuevamente ");
			}else if(this.status === 407){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El cliente primero debe autenticarse con el proxy, intentelo nuevamente ");
			}else if(this.status === 408){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El servidor agotó el tiempo de espera para la solicitud, intentelo nuevamente ");
			}else if(this.status === 409){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": La solicitud no se pudo completar debido a un conflicto en la solicitud, intentelo nuevamente ");
			}else if(this.status === 410){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": La página solicitada ya no está disponible., intentelo nuevamente ");
			}else if(this.status === 411){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El 'Contenido-Longitud' no está definido. El servidor no aceptará la solicitud sin él., intentelo nuevamente ");
			}else if(this.status === 412){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": La condición previa dada en la solicitud evaluada en falso por el servidor, intentelo nuevamente ");
			}else if(this.status === 413){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El servidor no aceptará la solicitud porque la entidad de solicitud es demasiado grande, intentelo nuevamente ");
			}else if(this.status === 414){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El servidor no aceptará la solicitud, porque la URL es demasiado larga. Ocurre cuando convierte una solicitud POST a una solicitud GET con una información de consulta larga, intentelo nuevamente ");
			}else if(this.status === 415){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El servidor no aceptará la solicitud, porque el tipo de medio no es compatible, intentelo nuevamente ");
			}else if(this.status === 416){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El cliente ha solicitado una parte del archivo, pero el servidor no puede suministrar esa parte, intentelo nuevamente ");
			}else if(this.status === 417){
				mensajeError =  instanciaActual.utf8_encode("Error "+this.status+": El servidor no puede cumplir los requisitos del campo Esperar encabezado de solicitud, intentelo nuevamente ");
			}
			if(mensajeError!=false){
				progressBar.attr("class","progress-bar bg-danger");
				progressBar.html(mensajeError); 
			}
		}
		//Enviar ajax
		cliente.send(frm);
	}
        
        checkRut(rut) {
            // Despejar Puntos
            var valor = rut.value.replace('.','');
            // Despejar Guión
            valor = valor.replace('-','');

            // Aislar Cuerpo y Dígito Verificador
            var cuerpo = valor.slice(0,-1);
            var dv = valor.slice(-1).toUpperCase();

            // Formatear RUN
            rut.value = cuerpo + '-'+ dv

            // Si no cumple con el mínimo ej. (n.nnn.nnn)
            if(cuerpo.length < 7) { rut.setCustomValidity("RUT Incompleto"); return false;}

            // Calcular Dígito Verificador
            var suma = 0;
            var multiplo = 2;

            // Para cada dígito del Cuerpo
            for(var i=1;i<=cuerpo.length;i++) {

                // Obtener su Producto con el Múltiplo Correspondiente
                var index = multiplo * valor.charAt(cuerpo.length - i);

                // Sumar al Contador General
                suma = suma + index;

                // Consolidar Múltiplo dentro del rango [2,7]
                if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }

            }

            // Calcular Dígito Verificador en base al Módulo 11
            var dvEsperado = 11 - (suma % 11);

            // Casos Especiales (0 y K)
            dv = (dv == 'K')?10:dv;
            dv = (dv == 0)?11:dv;

            // Validar que el Cuerpo coincide con su Dígito Verificador
            if(dvEsperado != dv) { rut.setCustomValidity("RUT Inválido"); return false; }

            // Si todo sale bien, eliminar errores (decretar que es válido)
            rut.setCustomValidity('');
            return true;
        }
}
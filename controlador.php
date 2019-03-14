<?php
include_once("conexion.php");
$conexion = new Database();

if($_POST["accion"]=="listar"){
	$campos = " DENUNCIO.*,
						   TALONARIO.`NOMBRE_TALONARIO`,
						   DENUNCIO.`ID_JUZGADO` AS ID_JUZGADO,
						   SECTOR.`NOMBRE_SECTOR` AS SECTOR,
						   INFRACTOR.`NOMBRES` AS NOMBRE_INFRACTOR,
						   INFRACTOR.`RUT` AS RUT_INFRACTOR,
						   INFRACTOR.`DIRECCION` AS DIRECCION_INFRACTOR,
						   INFRACTOR.`ES_EMPRESA` AS ES_EMPRESA,
						   TIPO_VEHICULO.`NOMBRE_TIPO_VEHICULO` AS TIPO_VEHICULO,
						   MARCA.`NOMBRE_MARCA` AS NOMBRE_MARCA ";
			$tablas = " `denuncio` DENUNCIO
						LEFT JOIN `sector` SECTOR
						ON(DENUNCIO.`ID_SECTOR`=SECTOR.`ID_SECTOR`)
						LEFT JOIN `infractor` INFRACTOR
						ON(DENUNCIO.`ID_INFRACTOR`=INFRACTOR.`ID_INFRACTOR`)
						LEFT JOIN `talonario` TALONARIO
						ON(DENUNCIO.`ID_TALONARIO`=TALONARIO.`ID_TALONARIO`) 
						LEFT JOIN `tipo_vehiculo` TIPO_VEHICULO
						ON(DENUNCIO.`ID_TIPO_VEHICULO`=TIPO_VEHICULO.`ID_TIPO_VEHICULO`)
						LEFT JOIN `marca` MARCA
						ON(DENUNCIO.`ID_MARCA`=MARCA.`ID_MARCA`) ";
	$clausulaWhere = " ";

	$datos = $conexion->listarJtables($tablas,$campos,$clausulaWhere,$_POST["jtSorting"],$_POST["jtStartIndex"],$_POST["jtPageSize"]);
	$pesoBytesDatos = mb_strlen($datos);//Obtiene el peso en bytes de los datos que tendra que descargar el cliente
	


	//Generamos las cabeceras
	header('Content-Type: application/json');
	header("Content-Transfer-Encoding: gzip");
	header("Content-Length: ".$pesoBytesDatos);//Le dice al cliente cuanto pesaran los datos que va a recibir para la barra de progreso

	echo $datos;
}else if($_POST["accion"]=="comboboxInspector"){
	
	$datos = $conexion->listarJtablesSinPaginador(" `inspector` "," `ID_INSPECTOR` AS Value, `NOMBRE_INSPECTOR` AS DisplayText ", "");
	$pesoBytesDatos = mb_strlen($datos);//Obtiene el peso en bytes de los datos que tendra que descargar el cliente
	
	//Generamos las cabeceras
	header('Content-Type: application/json');
	header("Content-Transfer-Encoding: gzip");
	header("Content-Length: ".$pesoBytesDatos);//Le dice al cliente cuanto pesaran los datos que va a recibir para la barra de progreso
	
	echo $datos;	
}else if($_POST["accion"]=="comboboxInspector2"){
	
	$datos = $conexion->listarJtablesSinPaginador(" `inspector` "," `ID_INSPECTOR` AS Value, `NOMBRE_INSPECTOR` AS DisplayText ", "");
	$pesoBytesDatos = mb_strlen($datos);//Obtiene el peso en bytes de los datos que tendra que descargar el cliente
	
	//Generamos las cabeceras
	header('Content-Type: application/json');
	header("Content-Transfer-Encoding: gzip");
	header("Content-Length: ".$pesoBytesDatos);//Le dice al cliente cuanto pesaran los datos que va a recibir para la barra de progreso
	
	echo $datos;	
}else if($_POST["accion"]=="modificar"){
	
	
	$jTableResult = array();
	$jTableResult['Resultado'] = "OK";
	$jTableResult['Message'] = "Error ejemplo";
	$jTableResult = json_encode($jTableResult);
	$pesoBytesDatos = mb_strlen($jTableResult);//Obtiene el peso en bytes de los datos que tendra que descargar el cliente
	
	//Generamos las cabeceras
	header('Content-Type: application/json');
	header("Content-Transfer-Encoding: gzip");
	header("Content-Length: ".$pesoBytesDatos);//Le dice al cliente cuanto pesaran los datos que va a recibir para la barra de progreso
	
	echo $jTableResult;
}
$conexion->cerrarConexion();

?>
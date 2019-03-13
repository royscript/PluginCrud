<?php
//defined('NEOSYSTEM') OR exit('No hay acceso directo al script');

error_reporting( E_ALL );

ini_set( 'display_errors', '1' );



Class Database {



	private $servidor = '127.0.0.1';

	private $usuario = 'root';

	private $password = '164289273';

	private $base_datos = 'inspeccion_municipal';
	
	/*private $usuario = 'root';

	private $password = 'root';

	private $base_datos = 'inspeccion_municipal';*/

	private $close_bd;

	private $connection;

	private $query;



	// -------PARAMETROS DE CONEXION

	public
	function __construct() {
		$this->conectar();

	}



	/* Realiza la conexión a la base de datos. */



	private
	function conectar() {

		// -------CONEXION A UNA BASE DE DATOS

		$this->connection = new mysqli( $this->servidor, $this->usuario, $this->password, $this->base_datos );

		if ( $this->connection->connect_errno ) {

			die( "Error de Conexion: (" . $this->connection->mysqli_connect_errno()

				. ")" . $this->connection->mysqli_connect_error() );

			//header("Location: error-conexion.php');

			exit;

		} else {

			if ( !$this->connection->set_charset( "utf8" ) ) {

				printf( "Error transformando a UTF-8 : %s\n", $this->connection->error );

			} else {

				return $this->connection;

			}

		}

	}



	// -------EJECUTA UNA CONSULTA A LA BASE DE DATOS

	public
	function consulta( $consulta ) {

		$this->query = mysqli_query( $this->connection, $consulta );

		if ( !$this->query ) {

			printf( "Error: %s\n", mysqli_error( $this->connection ) );

			exit();

		}

	}



	// -------EXTRAE LOS REGISTROS DE UNA TABLA

	public
	function extraer_registro() {

		if ( $fila = mysqli_fetch_array( $this->query ) ) {



			return $fila;
			

		} else {

			return false;

		}
		mysqli_close();
	}



	// -------EXTRAE LOS Array DE UNA TABLA

	public
	function extraer_array() {

		if ( mysqli_num_rows( $this->query ) > 0 ) {

			while ( $row = mysqli_fetch_assoc( $this->query ) ) {

				$array[] = $row;

			}

		}
		
		if (empty($array)) {
			//validamos que el array este vacio
				echo '';
		}else{
		
		return $array;
		}
		
	}



	// -------EJECUTAR QUERY---

	public
	function ejecutar_query( $query ) {

		if ( $query = mysqli_query( $this->connection, $query ) ) {



			return $query;

		} else {

			return false;

		}

	}







	// -------DEVUELVE EL ULTIMO ID DESPUES DE UNA INSERCION

	public
	function ultimo_id() {

		$id = mysqli_insert_id( $this->connection );

		return $id;

	}



	// -------CANTIDAD DE REGISTROS DE UNA CONSULTA

	public
	function total() {

		$cantidad = mysqli_num_rows( $this->query );

		return $cantidad;

	}



	// -------CIERRA UNA CONEXION

	public
	function cerrarConexion() {

		$this->close_bd = mysqli_close( $this->connection );

	}



	// -------PROTECCION PARA SQL INYECCION

	public
	function limpiadorSql( $valor ) {

		$variable = mysqli_real_escape_string( $this->connection, $valor );

		return $variable;

	}


	public
	function listarTablasBd() {
		$i = 0;
		$tableList = array();
		$this->consulta( "SHOW TABLES" );
		while ( $cRow = $this->extraer_registro() ) {
			$tableList[][ $i ] = $cRow[ 0 ];
			$i++;

		}
		$this->close_bd;
		return $tableList;
	}

	public
	function listarCamposTabla( $tablaSeleccionada ) {
		$i = 0;

		$this->consulta( "DESCRIBE " . $tablaSeleccionada . "" );
		$fileList = array();
		while ( $campos = $this->extraer_registro() ) {
			$fileList[] = $campos;

		}
		$this->close_bd;
		return $fileList;

	}

	public
	function listarConPaginador( $sqlCantidad, $parametroCantidad, $sqlRegistros, $parametro, $pagina, $cantidadPorPagina = 10 ) {


		$cantidadFilas = $this->listar( $sqlCantidad );

		$cantidadFilas = $cantidadFilas[ 0 ][ 'CANTIDAD' ];

		$limites = $this->limitesPaginacion( $cantidadPorPagina, $pagina, $cantidadFilas );

		$sqlRegistros = $sqlRegistros . '  LIMIT ' . $limites[ 'Limite1' ] . ' ,' . $limites[ 'Limite2' ];

		$enlace = $this->connection;

		$sqlRegistros = mysqli_query( $enlace, $sqlRegistros );

		$array = array();

		while ( $row = mysqli_fetch_assoc( $sqlRegistros ) ) {

			$array[] = $row;

		}

		mysqli_close();

		return json_encode( array( 'Datos' => $array, 'TotalFilas' => $cantidadFilas ) );

	}



	public
	function limitesPaginacion( $cantidadRegistrosMostrar, $paginaActual, $totalRegistros, $cantidadPorPagina = 10 ) {

		$paginaActual++;

		if ( $totalRegistros <= $cantidadRegistrosMostrar ) {

			$limite2 = $cantidadRegistrosMostrar;

			$limite1 = 0;

		} else {

			$limite2 = $cantidadRegistrosMostrar;

			if ( $paginaActual <= 0 ) {

				$paginaActual = 1;

			}

			$limite1 = $cantidadRegistrosMostrar * ( $paginaActual - 1 );

		}

		return array( 'Limite1' => $limite1, 'Limite2' => $limite2 );

	}



	public
	function listar( $sql ) {

		$enlace = $this->connection;

		$query = mysqli_query( $enlace, $sql );

		$array = array();

		echo mysqli_error($enlace);

		if ( mysqli_num_rows( $query ) > 0 ) {

			while ( $row = mysqli_fetch_assoc( $query ) ) {

				$array[] = $row;

			}

		}

		return $array;

	}



	public
	function listarJtables( $nombreTabla, $campos, $clausulaWhere, $jtSorting, $jtStartIndex, $jtPageSize ) {



		$enlace = $this->connection;



		//Obtener cantidad

		$result = "SELECT COUNT(*) AS RecordCount 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . ";";



		$result = mysqli_query( $enlace, $result );



		@$row = mysqli_fetch_array( $result );

		$recordCount = $row[ 'RecordCount' ];



		//Obtener registros de la BD

		$result = "SELECT " . $campos . " 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . " 

								ORDER BY " . $jtSorting . " 

								LIMIT " . $jtStartIndex . "," . $jtPageSize . ";";



		$result = mysqli_query( $enlace, $result );

		//agregar todos los registros al array

		$rows = array();



		while ( $row = mysqli_fetch_array( $result ) ) {

			$rows[] = $row;

		}
		


		if ( mysqli_error( $enlace ) ) {

			echo "SELECT " . $campos . " 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . ";";

			echo mysqli_error( $enlace );

			$jTableResult = array();

			$jTableResult[ 'Resultado' ] = "OK";

			$jTableResult[ 'TotalRegistros' ] = $recordCount;

			$jTableResult[ 'Registros' ] = mysqli_error( $enlace );

			$jTableResult[ 'SQL' ] = "SELECT " . $campos . " 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . ";";

			return $jTableResult;

		} else {



			//Return result to jTable

			$jTableResult[ 'Resultado' ] = "OK";

			$jTableResult[ 'TotalRegistros' ] = $recordCount;

			$jTableResult[ 'Registros' ] = $rows;



			$jTableResult = json_encode( $jTableResult );

			/*switch ( json_last_error() ) {

				case JSON_ERROR_NONE:

					//echo 'Sin errores';

					break;

				case JSON_ERROR_DEPTH:

					echo '-Excedido tamaño maximo de la pila';

					break;

				case JSON_ERROR_STATE_MISMATCH:

					echo '-Desbordamiento de buffer o los modos no coinciden';

					break;

				case JSON_ERROR_CTRL_CHAR:

					echo '-Encontrado caracter de control no esperado';

					break;

				case JSON_ERROR_SYNTAX:

					echo '-Error de sintaxis, JSON mal formado';

					break;

				case JSON_ERROR_UTF8:

					echo '-Caracteres UTF-8 mal formados, posiblemente estan mal codificados.';

					break;

				default:

					echo '-Error desconocido';

					break;

			}*/

			return $jTableResult;

		}



	}
	
	
	
	
	public
	function listarJtablesCoOtroCount( $nombreTabla, $campos,$count, $clausulaWhere, $jtSorting, $jtStartIndex, $jtPageSize ) {



		$enlace = $this->connection;



		//Obtener cantidad

		$result = "SELECT ".$count." AS RecordCount 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . ";";



		$result = mysqli_query( $enlace, $result );



		@$row = mysqli_fetch_array( $result );

		$recordCount = $row[ 'RecordCount' ];



		//Obtener registros de la BD

		$result = "SELECT " . $campos . " 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . " 

								ORDER BY " . $jtSorting . " 

								LIMIT " . $jtStartIndex . "," . $jtPageSize . ";";



		$result = mysqli_query( $enlace, $result );

		//agregar todos los registros al array

		$rows = array();



		while ( $row = mysqli_fetch_array( $result ) ) {

			$rows[] = $row;

		}



		if ( mysqli_error( $enlace ) ) {

			echo "SELECT " . $campos . " 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . ";";

			echo mysqli_error( $enlace );

			$jTableResult = array();

			$jTableResult[ 'Result' ] = "OK";

			$jTableResult[ 'TotalRecordCount' ] = $recordCount;

			$jTableResult[ 'Records' ] = mysqli_error( $enlace );

			$jTableResult[ 'SQL' ] = "SELECT " . $campos . " 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . ";";

			return $jTableResult;

		} else {



			//Return result to jTable

			$jTableResult[ 'Result' ] = "OK";

			$jTableResult[ 'TotalRecordCount' ] = $recordCount;

			$jTableResult[ 'Records' ] = $rows;



			$jTableResult = json_encode( $jTableResult );

			/*switch ( json_last_error() ) {

				case JSON_ERROR_NONE:

					//echo 'Sin errores';

					break;

				case JSON_ERROR_DEPTH:

					echo '-Excedido tamaño maximo de la pila';

					break;

				case JSON_ERROR_STATE_MISMATCH:

					echo '-Desbordamiento de buffer o los modos no coinciden';

					break;

				case JSON_ERROR_CTRL_CHAR:

					echo '-Encontrado caracter de control no esperado';

					break;

				case JSON_ERROR_SYNTAX:

					echo '-Error de sintaxis, JSON mal formado';

					break;

				case JSON_ERROR_UTF8:

					echo '-Caracteres UTF-8 mal formados, posiblemente estan mal codificados.';

					break;

				default:

					echo '-Error desconocido';

					break;

			}*/

			return $jTableResult;

		}



	}



	public
	function listarJtablesSinPaginador( $nombreTabla, $campos, $clausulaWhere ) {

		$enlace = $this->connection;

		//Obtener registros de la BD

		$result = "SELECT " . $campos . " 

								FROM " . $nombreTabla . " 

								" . $clausulaWhere . ";";

		$result = mysqli_query( $enlace, $result );



		//agregar todos los registros al array

		$rows = array();

		while ( $row = mysqli_fetch_array( $result ) ) {

			$rows[] = array(

				'DisplayText' => $row[ 'DisplayText' ],

				'Value' => $row[ 'Value' ]

			);

		}



		//Return result to jTable

		$jTableResult = array();

		$jTableResult[ 'Resultado' ] = "OK";

		$jTableResult[ 'Registros' ] = $rows;

		return json_encode($jTableResult);

	}
	
	public function validarRut($rut,$consulta,$where,$rutCampoTabla, $nombreCampoTabla, $apellidoCampoTabla)
	{
		$conexion = new Database();
		$query="SELECT ".$consulta." ".$where." LIKE '".$rut."'";
		$rut = '';
		$nombreCompleto = '';
        $result = $conexion->consulta($query);
		while($row = $conexion->extraer_registro($result)){
			$rut = $row[$rutCampoTabla];
			$nombreCompleto = $row[$nombreCampoTabla].' '.$row[$apellidoCampoTabla];
		}
                $conexion->cerrarConexion();
		return array("rut"=>$rut,"nombre"=>$nombreCompleto);
                
	}

public function validarMailExiste($email,$consulta,$where,$emailCampoTabla)
	{
		$conexion = new Database();
		$query="SELECT ".$consulta." ".$where." LIKE '".$email."'";
		$email = '';
		$result = $conexion->consulta($query);
		while($row = $conexion->extraer_registro($result)){
			$email = $row[$emailCampoTabla];
			
		}
                $conexion->cerrarConexion();
		return array("email"=>$email);
                
	}
	//cierre de la clase Database

}



?>
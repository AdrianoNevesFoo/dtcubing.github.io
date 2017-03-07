<?php

$dir = "data/dblp";

// Abre um diretorio conhecido, e faz a leitura de seu conteudo

$pastas = [];
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
        	if( $file != "." && $file != ".."){
        		$pastas[] = $file;
        	}
        }
        closedir($dh);
    }
}

foreach( $pastas as $k=>$v){
	//echo "rename( \"data/".$v. "\" , \"data/". strtolower( str_replace(" ", "_",$v)). "\") <br>";
	rename( "data/dblp/".$v  , "data/dblp/". strtolower(  str_replace("-", "_",$v)) );


}

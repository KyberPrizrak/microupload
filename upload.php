<?php

  //*** settings ***//
  $extensions = array("jpg", "jpeg", "gif", "png", "bmp");
  $file_data_name = "file";
  $max_file_size = 15*1024*1024;
  $upload_folder = dirname(__FILE__)."/upload/";


  //*** code ***//
  if(isset($_FILES[$file_data_name]))
  {
    //Check if file was uploaded without errors
    if($_FILES[$file_data_name]["error"] == UPLOAD_ERR_OK) {
      $file_name = $_FILES[$file_data_name]["name"];
      $file_size = $_FILES[$file_data_name]["size"];
   
      //Verify file extension
      $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
      if(!in_array($file_ext, $extensions)) die("Error: Please select a valid file format.");
   
      //Verify file size
      if($file_size > $max_file_size) die("Error: File size is larger than the allowed limit.");
   
      $new_file_name = md5(uniqid(microtime(), true)).".".$file_ext;
   
      //Check whether file exists before uploading it
      if(move_uploaded_file($_FILES[$file_data_name]["tmp_name"], $upload_folder.$new_file_name))
      {
        die("[response]".$new_file_name."[/response]");
      }
      else
      {
        die("Error: Unknown");
      }
    } else {
      echo "Error: ".$_FILES[$file_data_name]["error"];
    }
  } else {
    echo "Error: no file";
  }

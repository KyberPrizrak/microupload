/**
 * microupload.js
 *
 * Copyright (C) 2020 Konstantin A Chugunnyj (KyberPrizrak)
 *
 * LICENSE:
 *
 * This file is part of microupload.
 *
 * microupload is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * microupload is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with microupload. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author KyberPrizrak (www.kyberprizrak.ru)
 * @version 0.1.7 - 2020.05.04 14:52:00 GMT+3
 */

(function() {

  'use strict';

  /**
   * Инициализирует microupload для элемента
   *
   * **opt**: object {optionname1:value[, optionname2:value2]}
   * ### Available options
   * | Key                    |  Type        | Default value | Description |
   * |------------------------|:------------:|:-------------:|-------------|
   * | url                    | string       | '/upload.php' | URL, на который будут отравляться файлы |
   * | data                   | object       | undefined     | Дополнительные параметры для POST-запроса |
   * | name                   | string       | 'file'        | Имя файла в POST-запросе |
   * | container              | string, Node | undefined     | Контейнер, в котором будет добавляться html-код со статусом загрузки файлов. |
   * | preview                | boolean      | undefined     | Отобразить превью файла? (использовать только для изображений!) |
   * | preview_max_width      | integer      | 100           | Максимальная ширина preview-изображения. |
   * | preview_max_height     | integer      | 100           | Максимальная высота preview-изображения. |
   * | cancelable             | boolean      | undefined     | Отобразить кнопку "отменить"? |
   * | cancel_text            | string       | '&times;'     | Текст, который будет использоваться в кнопке "отменить" |
   * | extensions             | string       | '*'           | Список расширений файлов через "," или "|". Например: 'jpeg|jpg|bmp|png|gif'. Если "*" - разрешен любой формат. |
   * | max_file_size          | integer      | 0             | Максимальный размер загружаемого файла в байтах. Если ноль - любой. |
   * | onerror                | callback     | undefined     | function(error_code, file, file_id){} - функция, которая будет вызываться при ошибке. Где error_code - string, file - object (из event.target.files), file_id - html id соответствующего элемента (container_tagname), может передаваться undefined (если элемент не был добавлен в container). Возможные коды ошибок: "extension", "maxsize", "network", "onbeforesubmit", "oncomplete", "ontrycancel". |
   * | onbeforesubmit         | callback     | undefined     | function(file, file_id){return true;} - функция, которая будет вызываться при попытке отправить файл (параметры file и file_id - аналогичны onerror). |
   * | onprogress             | callback     | undefined     | function(file, file_id, percentComplete){} - функция, которая будет вызываться при изменении прогресса отправки файла (обратите внимание, что вызов со значениями 0% и 100% не гарантируется!). Где percentComplete - число, означающее процент выполнения (от 0 до 100). (параметры file и file_id - аналогичны onerror). |
   * | oncomplete             | callback     | undefined     | function(file, file_id, responseText){return true;} - функция, которая будет вызываться после завершения отправки файла. Где responseText - результат запроса. (параметры file и file_id - аналогичны onerror). Важно: крайне желательно проверять ответ сервера! Функция возвращает true - если ответ сервера корректный. |
   * | ontrycancel            | callback     | undefined     | function(file, file_id){return true;} - функция, которая будет вызываться при попытке пользователя отменить загрузку файла. (параметры file и file_id - аналогичны onerror). Функция возвращает true - если файл разрешено удалить. |
   *
   * @param {Node|string} elm Элемент (input[type=file]), для которого инициализируем microupload
   * @param {Object|undefined} opt Параметры microupload
   * @return {undefined}
   * @access public
   **/
  function microupload(elm, opt) {
    try {
      if (typeof(elm) === 'string') {
        var elements = document.querySelectorAll(elm);
        for (var i = 0; i < elements.length; i++) {
          microupload(elements[i], opt);
        }
        return;
      }

      var options = microupload_copy_options(opt);

      elm.onchange = function(event) {
        microupload_send_files(elm.files, options);
      }
    } catch (e) {}
  }

  /**
   * Добавляет файлы, которые необходимо отправить на сервер
   * @param {Array} files Массив файлов, которые нужно отправить (по сути, мы сюда передаем значение event.dataTransfer.files или event.target.files).
   * @param {Object|undefined} opt Параметры microupload
   * @return {undefined}
   * @access public
   **/
  function microupload_addfiles(files, opt) {
    try {
      microupload_send_files(files, microupload_copy_options(opt));
    } catch (e) {}
  }

  /**
   * Копирование объекта с настройками
   * @access private
   **/
  function microupload_copy_options(opt) {
    if (typeof(opt) !== 'object') opt = {};
    var options = {
      url: opt['url'] ? opt['url'] : '/upload.php',
      data: opt['data'],
      name: opt['name'] ? opt['name'] : 'file',
      container: opt['container'],
      preview: opt['preview'],
      preview_max_width: (opt['preview_max_width'] > 0) ? opt['preview_max_width'] : 100,
      preview_max_height: (opt['preview_max_height'] > 0) ? opt['preview_max_height'] : 100,
      cancelable: opt['cancelable'],
      cancel_text: opt['cancel_text'] ? opt['cancel_text'] : '&times;',
      extensions: opt['extensions'] ? opt['extensions'] : '*',
      max_file_size: (opt['max_file_size'] >= 0) ? opt['max_file_size'] : 0,
      onerror: opt['onerror'],
      onbeforesubmit: opt['onbeforesubmit'],
      onprogress: opt['onprogress'],
      oncomplete: opt['oncomplete'],
      ontrycancel: opt['ontrycancel']
    };
    return options;
  }

  /**
   * Отправка массива файлов
   * @access private
   **/
  function microupload_send_files(files, options) {
    if (files) {
      for (var i = 0; i < files.length; i++) {
        microupload_send(files[i], options);
      }
    }
  }

  /**
   * Отправка файла
   * @access private
   **/
  function microupload_send(file, options) {
    //declare error macros
    var error_macros = function(error_code) {
      if (options.onerror) {
        options.onerror(error_code, file, file_id);
      }
      if (obj_item) {
        obj_item.className = "microupload_item microupload_item_error";
      }
    }

    //get file extension
    var file_name_pieces = file.name.split('.');
    var file_extension = (file_name_pieces[file_name_pieces.length - 1]).toLowerCase();

    //check file extension
    if (options.extensions !== '*') {
      var extensions_normalized = options.extensions.split(',').join('|').toLowerCase();
      if (('|' + extensions_normalized + '|').indexOf('|' + file_extension + '|') < 0) {
        error_macros("extension");
        return;
      }
    }

    //check file size
    if ((options.max_file_size > 0) && (file.size > options.max_file_size)) {
      error_macros("maxsize");
      return;
    }

    //generate html dom id
    if (!window['microupload_filenum']) window['microupload_filenum'] = 0;
    var file_id = 'microupload_' + (++window['microupload_filenum']) + '_' + Math.random().toString().substr(2, 6);

    //add item html-code
    if (options.container) {
      var obj_container = options.container;
      if (typeof(obj_container) === 'string') {
        obj_container = document.querySelector(obj_container);
      }

      if (obj_container) {
        var obj_item = document.createElement('div');
        obj_item.id = file_id;
        obj_item.className = "microupload_item";
        obj_container.appendChild(obj_item);

        if (options.preview) {
          var obj_image_wrapper = document.createElement('div');
          obj_image_wrapper.className = "microupload_preview microupload_preview_empty";
          if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = function(readerEvent) {
              var obj_image = new Image();
              obj_image.onload = function() {
                var original_width = obj_image.width;
                var original_height = obj_image.height;

                if ((original_width > 0) && (original_height > 0)) {
                  if ((original_width > options.preview_max_width) || (original_height > options.preview_max_height)) {
                    var dw = options.preview_max_width / original_width;
                    var dh = options.preview_max_height / original_height;
                    if (dh > dw) {
                      obj_image.width = options.preview_max_width;
                      obj_image.height = Math.ceil(original_height * dw);
                    } else if (original_height > options.preview_max_height) {
                      obj_image.width = Math.ceil(original_width * dh);
                      obj_image.height = options.preview_max_height;
                    }
                  }

                  if (obj_image_wrapper) {
                    obj_image_wrapper.className = "microupload_preview";
                    obj_image.className = "microupload_preview_img";
                    obj_image_wrapper.appendChild(obj_image);
                  }
                }
              }
              obj_image.src = readerEvent.target.result;
            }
            reader.readAsDataURL(file);
          }
          obj_item.appendChild(obj_image_wrapper);
        }

        var obj_filename = document.createElement('div');
        obj_filename.className = "microupload_filename";
        obj_filename.innerText = file.name;
        obj_item.appendChild(obj_filename);

        var obj_progress = document.createElement('div');
        obj_progress.className = "microupload_progress";
        obj_item.appendChild(obj_progress);

        var obj_progress_value = document.createElement('div');
        obj_progress_value.className = "microupload_progress_value";
        obj_progress_value.style.width = '0';
        obj_progress_value.innerText = '0%';
        obj_progress.appendChild(obj_progress_value);

        if (options.cancelable) {
          var obj_cancel = document.createElement('div');
          obj_cancel.className = "microupload_cancel";
          obj_cancel.innerHTML = options.cancel_text;
          obj_cancel.onclick = function(event) {
            if (obj_item) {
              var allow_cancel = (options.ontrycancel) ? options.ontrycancel(file, file_id) : true;
              if (allow_cancel) {
                xhr.abort();
                obj_item.parentElement.removeChild(obj_item);
              } else {
                error_macros("ontrycancel");
              }
            }
          }
          obj_cancel.onselectstart = function(event) {
            event.preventDefault();
            return false;
          }
          obj_item.appendChild(obj_cancel);
        }
      }
    }

    //call onbeforesubmit
    if (options.onbeforesubmit) {
      if (!options.onbeforesubmit(file, file_id)) {
        error_macros("onbeforesubmit");
        return;
      }
    }

    //fill FormData for request
    var fd = new FormData();
    fd.append(options.name, file);
    if (options.data) {
      for (var prop in options.data) {
        fd.append(prop, options.data[prop]);
      }
    }

    //make request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', options.url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var flg_complete_ok = (options.oncomplete) ? options.oncomplete(file, file_id, xhr.responseText) : true;
          if (flg_complete_ok) {
            if (obj_progress_value) {
              obj_progress_value.innerText = '100%';
            }
            if (obj_item) {
              obj_item.className += " microupload_item_complete";
            }
          } else {
            error_macros("oncomplete");
          }
        } else {
          error_macros("network");
        }
      }
    }
    if (xhr.upload) {
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          var percentComplete = (e.loaded / e.total) * 100;
          if (obj_progress_value) {
            obj_progress_value.style.width = Math.ceil(percentComplete) + '%';
            obj_progress_value.innerText = Math.ceil(percentComplete) + '%';
          }
          if (options.onprogress) {
            options.onprogress(file, file_id, percentComplete);
          }
        }
      }
      xhr.upload.onerror = function() {
        error_macros("network");
      }
    }
    xhr.send(fd);
  }

  window['microupload'] = microupload;
  window['microupload_addfiles'] = microupload_addfiles;

})();
# microupload
Small ajax file upload with preview. Pure JavaScript + CSS. No dependencies!

## Browser support

microupload supports all major browsers including Internet Explorer 10 and above

## Demo

* [microupload demo](http://kyberprizrak.ru/microupload/demo.html)

## Quick start

1) Copy *microupload.min.js* (4 kb) and *microupload.css* (2 kb)
2) Add to &lt;head&gt;:

```html
<head>
    ...
    <link rel="stylesheet" href="microupload.css" type="text/css">
    <script type="text/javascript" src="microupload.min.js"></script>
    ...
</head>
```
3) call microupload:
```js
<script>
    microupload("input[type=file]", {
      url: 'upload.php',
      container: '#form_attach',
      preview: true
    });
</script>
```
4) add to html:
```html
    <div id="form_attach"></div>
    <input type="file" multiple="multiple">
```

## API & Options

```js
<script>
    microupload(elm[, opt]);//add handler for input[type=file]
    microupload_addfiles(files[, opt]);//run file upload programmatically
</script>
```
**elm**:
1. DOM-element (result of document.getElementById)
2. string: CSS selector (syntax querySelectorAll)
 
**files**:
FileList (see JavaScript File API), or array of File (see JavaScript File API).

**opt**: object {optionname1:value[, optionname2:value2]}

 ### Available options
 | Key                    |  Type        | Default value | Description |
 |------------------------|:------------:|:-------------:|-------------|
 | url                    | string       | '/upload.php' | URL, на который будут отравляться файлы |
 | data                   | object       | undefined     | Дополнительные параметры для POST-запроса |
 | name                   | string       | 'file'        | Имя файла в POST-запросе |
 | container              | string, Node | undefined     | Контейнер, в котором будет добавляться html-код со статусом загрузки файлов. |
 | preview                | boolean      | undefined     | Отобразить превью файла? (использовать только для изображений!) |
 | preview_max_width      | integer      | 100           | Максимальная ширина preview-изображения. |
 | preview_max_height     | integer      | 100           | Максимальная высота preview-изображения. |
 | cancelable             | boolean      | undefined     | Отобразить кнопку "отменить"? |
 | cancel_text            | string       | '&times;'     | Текст, который будет использоваться в кнопке "отменить" |
 | extensions             | string       | '*'           | Список расширений файлов через "," или "|". Например: 'jpeg|jpg|bmp|png|gif'. Если "*" - разрешен любой формат. |
 | max_file_size          | integer      | 0             | Максимальный размер загружаемого файла в байтах. Если ноль - любой. |
 | onerror                | callback     | undefined     | function(error_code, file, file_id){} - функция, которая будет вызываться при ошибке. Где error_code - string, file - object (из event.target.files), file_id - html id соответствующего элемента (container_tagname), может передаваться undefined (если элемент не был добавлен в container). Возможные коды ошибок: "extension", "maxsize", "network", "onbeforesubmit", "oncomplete", "ontrycancel". |
 | onbeforesubmit         | callback     | undefined     | function(file, file_id){return true;} - функция, которая будет вызываться при попытке отправить файл (параметры file и file_id - аналогичны onerror). |
 | onprogress             | callback     | undefined     | function(file, file_id, percentComplete){} - функция, которая будет вызываться при изменении прогресса отправки файла (обратите внимание, что вызов со значениями 0% и 100% не гарантируется!). Где percentComplete - число, означающее процент выполнения (от 0 до 100). (параметры file и file_id - аналогичны onerror). |
 | oncomplete             | callback     | undefined     | function(file, file_id, responseText){return true;} - функция, которая будет вызываться после завершения отправки файла. Где responseText - результат запроса. (параметры file и file_id - аналогичны onerror). Важно: крайне желательно проверять ответ сервера! Функция возвращает true - если ответ сервера корректный. |
 | ontrycancel            | callback     | undefined     | function(file, file_id){return true;} - функция, которая будет вызываться при попытке пользователя отменить загрузку файла. (параметры file и file_id - аналогичны onerror). Функция возвращает true - если файл разрешено удалить. |
 
## Examples
 
```js
<script>
    microupload("#id", {url:'/upload.php', container:'#form_attach', extensions:'jpeg,jpg,bmp,png,gif', max_file_size:15*1024*1024, preview: true});
    microupload("input[type=file]", {url:'/upload.php', container:'#form_attach'});

    microupload_addfiles(event.dataTransfer.files, {url: '/upload.php'});
</script>
```

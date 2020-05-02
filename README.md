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
 | url                    | string       | '/upload.php' | URL, �� ������� ����� ����������� ����� |
 | data                   | object       | undefined     | �������������� ��������� ��� POST-������� |
 | name                   | string       | 'file'        | ��� ����� � POST-������� |
 | container              | string, Node | undefined     | ���������, � ������� ����� ����������� html-��� �� �������� �������� ������. |
 | preview                | boolean      | undefined     | ���������� ������ �����? (������������ ������ ��� �����������!) |
 | preview_max_width      | integer      | 100           | ������������ ������ preview-�����������. |
 | preview_max_height     | integer      | 100           | ������������ ������ preview-�����������. |
 | cancelable             | boolean      | undefined     | ���������� ������ "��������"? |
 | cancel_text            | string       | '&times;'     | �����, ������� ����� �������������� � ������ "��������" |
 | extensions             | string       | '*'           | ������ ���������� ������ ����� "," ��� "|". ��������: 'jpeg|jpg|bmp|png|gif'. ���� "*" - �������� ����� ������. |
 | max_file_size          | integer      | 0             | ������������ ������ ������������ ����� � ������. ���� ���� - �����. |
 | onerror                | callback     | undefined     | function(error_code, file, file_id){} - �������, ������� ����� ���������� ��� ������. ��� error_code - string, file - object (�� event.target.files), file_id - html id ���������������� �������� (container_tagname), ����� ������������ undefined (���� ������� �� ��� �������� � container). ��������� ���� ������: "extension", "maxsize", "network", "onbeforesubmit", "oncomplete", "ontrycancel". |
 | onbeforesubmit         | callback     | undefined     | function(file, file_id){return true;} - �������, ������� ����� ���������� ��� ������� ��������� ���� (��������� file � file_id - ���������� onerror). |
 | onprogress             | callback     | undefined     | function(file, file_id, percentComplete){} - �������, ������� ����� ���������� ��� ��������� ��������� �������� ����� (�������� ��������, ��� ����� �� ���������� 0% � 100% �� �������������!). ��� percentComplete - �����, ���������� ������� ���������� (�� 0 �� 100). (��������� file � file_id - ���������� onerror). |
 | oncomplete             | callback     | undefined     | function(file, file_id, responseText){return true;} - �������, ������� ����� ���������� ����� ���������� �������� �����. ��� responseText - ��������� �������. (��������� file � file_id - ���������� onerror). �����: ������ ���������� ��������� ����� �������! ������� ���������� true - ���� ����� ������� ����������. |
 | ontrycancel            | callback     | undefined     | function(file, file_id){return true;} - �������, ������� ����� ���������� ��� ������� ������������ �������� �������� �����. (��������� file � file_id - ���������� onerror). ������� ���������� true - ���� ���� ��������� �������. |
 
## Examples
 
```js
<script>
    microupload("#id", {url:'/upload.php', container:'#form_attach', extensions:'jpeg,jpg,bmp,png,gif', max_file_size:15*1024*1024, preview: true});
    microupload("input[type=file]", {url:'/upload.php', container:'#form_attach'});

    microupload_addfiles(event.dataTransfer.files, {url: '/upload.php'});
</script>
```

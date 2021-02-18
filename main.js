/*==========================================================
===== EDDY HUAYLLA QUISPE ==================================
===== https://eddyhuaylla.ml/ =============================
===========================================================
*/

function ejecutar_drop(){
    document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {

    //devuelve el elemento con clase drop-zone mas cercano
    const dropZoneElement = inputElement.closest(".drop-zone");

    //agregar evento click solo para agregar y deshabilitar para eliminar imagen
    dropZoneElement.onclick = (e)=>{
      if(!(e.target.nodeName=='SPAN'&&e.target.parentElement.nodeName=='DIV'&&e.target.parentElement.classList.contains('drop-zone__delete')||
        e.target.nodeName=='DIV'&&e.target.classList.contains('drop-zone__delete'))){
        inputElement.click();
      }
    }

    //evento de agregar al hacer click
    inputElement.addEventListener("change", async (e) => {
      if (inputElement.files.length) {
        for (var i = 0, l = inputElement.files.length; i < l; i++) {
            await updateThumbnail(dropZoneElement, inputElement.files[i], inputElement);
        }
        updateFilesInput(inputElement);
      }
    });

    //mientras se va arrastrando
    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop-zone--over");
    });

    //cuando se termina el evento de arrastre
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });

    //evento arrastrar
    //agregar imagen mediante arrastre
    dropZoneElement.addEventListener("drop", async (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        let listFiles = e.dataTransfer.files;
        for (var i = 0; i < listFiles.length; i++) {
            await updateThumbnail(dropZoneElement, listFiles[i], inputElement);
        }

        updateFilesInput(inputElement);
      }

      dropZoneElement.classList.remove("drop-zone--over");
    });
  });
}


/**
 * actualiza las nuevas imagenes del contenedor
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 * @param {HTMLElement} inputElement
 */
async function updateThumbnail(dropZoneElement, file, inputElement) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // verifica si el archivo es tipo imagen
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    // crea los elementos necesarios para mostrar la imagen
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb", "col-12", "col-md-6", "p-2");
    dropZoneElement.appendChild(thumbnailElement);

    thumbnailElementDelete = document.createElement("div");
    thumbnailElementDelete.classList.add("drop-zone__delete");
    thumbnailElementDelete.innerHTML = '<span>x</span>';
    thumbnailElement.appendChild(thumbnailElementDelete);

    //agregar el evento click para eliminarcada imagen
    thumbnailElementDelete.onclick = (e)=>{
      deleteThumbnail(e,dropZoneElement);
      updateFilesInput(inputElement)
    }

    thumbnailImagen = document.createElement("img");
    thumbnailImagen.classList.add("w-100");
    thumbnailElement.appendChild(thumbnailImagen);

    thumbnailName = document.createElement("div");
    thumbnailName.classList.add("drop-zone__name", "col-12");
    var t = document.createTextNode(file.name);  
    thumbnailName.appendChild(t);
    thumbnailElement.appendChild(thumbnailName);
    
    //cargar la imagen a la vista
    reader.onload = await loadImage(thumbnailImagen, reader, file);
  }

}


/**
* elimina la imagen del contenedor vista
*
* @param {Event} event
* @param {HTMLElement} dropZoneElement
**/
function deleteThumbnail(event,dropZoneElement){
  event.target.closest('.drop-zone__thumb').remove()
}

/**
* cargar imagen al elemento img
*
* @param {HTMLElement} ElementImage
* @param {FileReader} reader
* @param {File} file
**/
async function loadImage(ElementImage, reader,file){
  reader.readAsDataURL(file);
  const result = await new Promise((resolve, reject) => {
    reader.onload = function(event) {
      resolve(reader.result)
    }
  });
  ElementImage.src = result;
}

/**
* actualiza los imagenes al input file para cualquier uso posterior
*
* @param {HTMLElement} inputElement
**/
function updateFilesInput(inputElement){
  const dropZoneElement = inputElement.closest(".drop-zone");
  let fileList = new DataTransfer();
  for(let element of dropZoneElement.children){
    if(element.classList.contains('drop-zone__thumb')){
      let childrenThumb = element.children;
      for(let childElement of childrenThumb){
          
        if(childElement.nodeName=="IMG"){
          var bas=childElement.src;

          fileList.items.add(dataURLtoFile(childElement.currentSrc,childElement.nextSibling.innerText));
        }
      }
    }
  }

  if(fileList.files.length>0){
    inputElement.files = fileList.files;
  }
}

/**
* combierte base64 a File
*
* @param {text} dataurl => texto en base64
* @param {text} filename => nombre del archivo
**/
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}


/*===========================================================================================================*/

document.getElementById('submit').onclick = (e) => {
  if(document.getElementById('imagen').files.length>0){
    var i=1;
    for(var file of document.getElementById('imagen').files){
      alert('imagen '+i+' => name: '+file.name+', type: '+file.type+', size:'+file.size+'.');
      i++;
    }
  } else {
    alert("No hay imagen");
  }
}
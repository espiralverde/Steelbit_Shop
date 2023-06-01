const imageValidate = (images) => {
    let imagesTable = []
    if (Array.isArray(images)) {
        imagesTable = images
    }
    else{
        imagesTable.push(images)
    }
    if (imagesTable.length > 3){
        return { error: "Solo se permiten hasta 3 imágenes a la vez" }
    }
    for (let image of imagesTable) {
        if (image.size > 1048576) return {error: "El archivo es mayor a un 1 MB"}

        const filetypes = /jpg|jpeg|png/
        const mimetype = filetypes.test(image.mimetype)
        if (!mimetype) return {error: "Solo se permiten archivos jpg, jpeg o png"}
    }

    return {error: false}
}

module.exports = imageValidate
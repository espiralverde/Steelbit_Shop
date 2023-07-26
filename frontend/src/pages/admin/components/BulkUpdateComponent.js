import React, { useState } from "react";
import * as XLSX from "xlsx";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { Row, Col, Button, Container, Navbar, Nav } from "react-bootstrap";
import "../../../../src/style.css"

const BulkUpdateComponent = ({ fetchProducts, updatePrice }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedName, setSelectedName] = useState("");


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setSelectedName(selectedFile.name);
        console.log(selectedFile)
    };

    const handleFileUpload = async () => {
        try {
        setUploading(true);

        if (!file) {
            alert("Por favor seleccionar un archivo Excel válido...");
            // setUploading(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileData = e.target.result;
            const workbook = XLSX.read(fileData, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);


            for (const row of data) {
            const productId = row.id;
            const price = row.price;

            try {
                // Call the API to update the price for each product
                await updatePrice(productId, { price });
            } catch (error) {
                console.error(`Error al actualizar el precios del producto: ID ${productId}:`, error);
                // Handle the error as needed
            }
            }

            // Fetch the updated product list after the bulk update
            try {
            const updatedProducts = await fetchProducts();
            console.log("Updated products:", updatedProducts);
            alert("Actualización de Precios exitosa!");
            } catch (error) {
            console.error("Error al traer los productos:", error);
            // Handle the error as needed
            }

            setUploading(false);
        };

        reader.readAsBinaryString(file);
        } catch (error) {
        console.error("Error al procesar el archivo", error);
        // Handle the error as needed
        setUploading(false);
        }
    };

    return (

        <div>
            <Row className="m-5">
                <Col md={2}>
                    <AdminLinksComponent />
                </Col>
                <Col md={4}>
                    <h1>Actualizar Precios</h1>
                    <div className="upload-wrapper mt-5">
                        <div className="parent">
                            <div className="file-upload">
                            {/* <img src={uploadImg} alt="upload" /> */}
                            <h3>{selectedName || "Click aquí para seleccionar archivo"} </h3>
                            {/* <p>Maximun file size 10mb</p> */}
                            <input type="file" onChange={handleFileChange}/>
                            </div>
                            <Button className="btn btn-primary mt-5" onClick={handleFileUpload} disabled={uploading}>
                                    {uploading ? "Actualizando..." : "Actualizar"}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>


        // <Navbar bg="light" variant="light">
        //     <Nav className="flex-column">
        //     <p className="ml-5">Actualizar Precios</p>
        //     <label htmlFor="formFile" className="form-label form-control-xs"></label>
        //     <input className="form-control form-control-sm" type="file" id="formFile" onChange={handleFileChange}/>
        //         <Col md={4}>
        //             <Button className="btn btn-primary mt-3" onClick={handleFileUpload} disabled={uploading}>
        //                 {uploading ? "Actualizando..." : "Actualizar"}
        //             </Button>
        //         </Col>
        //     </Nav>
        // </Navbar>

    //)




        // <div>
        //     <Row className="m-5">
        //         <Col md={2}>
        //             <AdminLinksComponent />
        //         </Col>
        //         <Col md={8}>
        //             <h1>Actualizar Precios</h1>
        //             <div>
        //                 <label htmlFor="formFile" className="form-label form-control-sm"></label>
        //                 <input onChange={handleFileChange} className="form-control" type="file" id="formFile"/>
        //             </div>
        //                 <Button className="btn btn-primary mt-5" onClick={handleFileUpload} disabled={uploading}>
        //                     {uploading ? "Actualizando..." : "Actualizar"}
        //                 </Button>
                
        //         </Col>
        //     </Row>
        // </div>
    )
};

export default BulkUpdateComponent;

import React, { useState } from 'react';
import XLSX from 'xlsx';
import { MongoClient, ObjectId } from 'mongodb';


    function ExcelUpdateComponent() {
        const [excelData, setExcelData] = useState(null);
    
        const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
            setExcelData(jsonData);
        };
    
        reader.readAsArrayBuffer(file);
        };
    
        const updateMongoDocuments = async () => {
        const uri = 'mongodb://localhost:27017'; // MongoDB connection URI
        const dbName = 'your_database'; // Your database name
        const collectionName = 'your_collection'; // Your collection name
    
        const client = new MongoClient(uri);
    
        try {
            await client.connect();
            console.log('Connected to MongoDB');
    
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
    
            for (const data of excelData) {
            const documentId = data[0]; // Assuming document IDs are in the first column
            const field1 = data[1]; // Assuming field1 values are in the second column
    
            const filter = { _id: ObjectId(documentId) };
            const update = { $set: { field1: field1 } };
    
            const result = await collection.updateOne(filter, update);
            console.log(`Document updated: ${result.modifiedCount}`);
            }
        } catch (error) {
            console.error('Error updating documents:', error);
        } finally {
            client.close();
            console.log('MongoDB connection closed');
        }
        };
    
        return (
        <div>
            <input type="file" accept=".xlsx" onChange={handleFileUpload} />
            <button onClick={updateMongoDocuments}>Update MongoDB Documents</button>
        </div>
        );
    }

    export default ExcelUpdateComponent
    
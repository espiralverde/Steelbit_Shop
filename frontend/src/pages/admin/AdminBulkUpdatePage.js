import BulkUpdateComponent from "./components/BulkUpdateComponent";
import axios from "axios"

const fetchProducts = async () => {
    const {data} = await axios.get("/api/products/admin", {
    })
    return data
}

const updatePrice = async (productId, data) => {
    const { data: updatedProduct } = await axios.patch(`/api/products/admin/${productId}`, data);
    return updatedProduct;
    }; 

const AdminBulkUpdatePage = () => {
    return <>
            <BulkUpdateComponent 
                fetchProducts = {fetchProducts}
                updatePrice = {updatePrice}
            />
        </>
}

export default AdminBulkUpdatePage;


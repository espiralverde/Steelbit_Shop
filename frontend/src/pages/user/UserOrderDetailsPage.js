import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent";
import { useSelector } from "react-redux"
import axios from "axios"
import { loadScript } from "@paypal/paypal-js"


const getOrder = async (orderId) => {
    const {data} = await axios.get("/api/orders/user/" + orderId)
    return data
}

const loadPayPalScript = (cartSubTotal, cartItems, orderId, updateStateAfterOrder) => {
    // scripts de PayPal
    loadScript({"client-id": "AQTJfhDoPZ3wEi0JYWy-TKtZ_Z3SaCbz98-E7mCpr9OeAEgd6tefCv4lqeG14iawVkVBgVxQmJ9-pd4G" })
    .then(paypal => {
        paypal
        .Buttons(buttons(cartSubTotal, cartItems, orderId, updateStateAfterOrder))
        .render("#paypal-container-element")
    })
    .catch(err => {console.error ("Falló la carga del script de Paypal", err)})
}

const buttons = (cartSubTotal, cartItems, orderId, updateStateAfterOrder) => {
    return{
        createOrder: function (data, actions){
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: cartSubTotal,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: cartSubTotal,
                                }
                            }
                        },
                        items: cartItems.map(product => {
                            return {
                                name: product.name,
                                unit_amount: {
                                    currency_code: "USD",
                                    value: product.price,
                                },
                                quantity: product.quantity,
                            }
                        })
                    }
                ]
            })
        },
        onCancel: onCancelHandler,
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData){
                var transaction = orderData.purchase_units[0].payments.captures[0]
                if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(cartSubTotal)) {
                    updateOrder(orderId)
                    .then(data => {
                        if (data.isPaid) {
                            updateStateAfterOrder(data.paidAt)
                        }
                    })
                    .catch((er) => console.log(er))
                }
            })
        },
        onError: onErrorHandler,
    }
}

const onCancelHandler = function () {
    console.log("cancel")
}

const onErrorHandler = function (err) {
    console.log("error")
}

const updateOrder = async (orderId) => {
    const {data} = await axios.put("/api/orders/paid/" + orderId)
    return data
}





const UserOrderDetailsPage = () => {
    const userInfo = useSelector((state) => state.userRegisterLogin.userInfo)

    const getUser = async () => {
        const {data} = await axios.get("/api/users/profile/" + userInfo._id)
        return data
    }
    
    
    
    return <UserOrderDetailsPageComponent userInfo={userInfo} getUser={getUser} getOrder={getOrder} loadPayPalScript={loadPayPalScript}/>
}

export default UserOrderDetailsPage;
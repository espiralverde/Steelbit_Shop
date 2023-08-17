import { Row, Col, Form, Button } from "react-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useEffect } from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-proyectotesis-vzogd",
    showAttribution: false
});

// const ventasMensualesChart = sdk.createChart({
//     chartId: "64908e9a-7539-4a42-894b-fc3420a70ddf",
// });


// const ventasPorProductoChart = sdk.createChart({
//     chartId: "6490918c-b257-4da3-8015-bc607136e84b"
// });

const dashboardPrincipal = sdk.createDashboard({
    dashboardId: "64908225-f297-4cd7-8180-e7c19b40f57e"
})


const AnalyticsPageComponent = () => {

    useEffect(() => {

        // ventasMensualesChart.render(document.getElementById("chart1"));
        // ventasPorProductoChart.render(document.getElementById("chart2"));
        dashboardPrincipal.render(document.getElementById("dashboard"))
        //.catch(() => window.alert("Chart failed to initialise"));
        }, []);


    return (
        <Row className="mt-5">
            <Col md={2}>
                <AdminLinksComponent />
            </Col>
            <Col md={10}>
                <h1>Panel del Admin</h1>
                <Button className="btn btn-primary mb-3" target="_blank" href="https://charts.mongodb.com/charts-proyectotesis-vzogd/public/dashboards/64908225-f297-4cd7-8180-e7c19b40f57e">
                    Buscar
                </Button>
                <div  id="dashboard" style={{height: "100vh" }}></div>
                
                {/* <div id="chart1" style={{width:640, height: 480 }}></div>
                <br />
                <div id="chart2" style={{width:640, height: 480 }}></div> */}
            </Col>
        </Row>
    );
}
export default AnalyticsPageComponent;
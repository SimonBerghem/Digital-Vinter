use std::io;
use std::fs::File;
//NYTT FOR Post Requests
use reqwest::ClientBuilder;
use reqwest::header::USER_AGENT;
use reqwest::header::CONTENT_TYPE;
use quick_xml::Reader;
use quick_xml::events::Event;

//This file holds all the communication with the rest-API DATEX II, there are functionality for https get and post requests, 

// Get the XML file from datex using basic auth
//Borde inte vara unwrap, det krachar programmet, fixa med '?' opperatorn hur den nu fungerar. TODO
pub fn fetch_xml(url: &str, user: &str, pass: &str, file_name: &str) {
   
    let client = reqwest::blocking::Client::new();
    
    let mut response = client.get(url)
        .basic_auth(user, Some(pass))
        .send()
        .expect("Connection failed to Datex");
    assert!(response.status().is_success());


    let mut file = File::create(file_name)
        .expect("Error creating file, station_data");
    io::copy(&mut response, &mut file)
        .expect("Failed to read response to file");
    
}


//Följande POST Body;s skulle kunna läggas i en egen fil för bättre läslighet, en upp till en framtida utvecklare.

//The following get functions sets the https post body and calls a generic post function.

pub fn get_situation_data(){
    let body = "<REQUEST>
        <LOGIN authenticationkey=\"d8b542b2dafe40f999f223c7aff04046\" />
        <QUERY objecttype=\"Situation\" schemaversion=\"1.2\" includedeletedobjects=\"true\">
            <FILTER>
                <EQ name=\"Deviation.MessageType\" value=\"Olycka\" />
                <EQ name=\"Deviation.IconId\" value=\"roadAccident\" />
            </FILTER>
            <INCLUDE>Deviation.Id</INCLUDE>
            <INCLUDE>Deviation.Header</INCLUDE>
            <INCLUDE>Deviation.IconId</INCLUDE>
            <INCLUDE>Deviation.Geometry.SWEREF99TM</INCLUDE>
            <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
            <INCLUDE>Deviation.SeverityCode</INCLUDE>
            <INCLUDE>Deviation.CreationTime</INCLUDE>
            <INCLUDE>Deviation.EndTime</INCLUDE>
        </QUERY>
    </REQUEST>";
    let mut file_name = "TESTFILE.xml";

    get_from_post(body, file_name);
}

pub fn get_traffic_flow_data(){

    let body = "
    <REQUEST>
    <LOGIN authenticationkey=\"d8b542b2dafe40f999f223c7aff04046\" />
    <QUERY objecttype=\"TrafficFlow\" schemaversion=\"1.4\" includedeletedobjects=\"true\">
    <INCLUDE>AverageVehicleSpeed</INCLUDE>
    <INCLUDE>CountyNo</INCLUDE>
    <INCLUDE>Geometry.SWEREF99TM</INCLUDE>
    <INCLUDE>Geometry.WGS84</INCLUDE>
    <INCLUDE>MeasurementOrCalculationPeriod</INCLUDE>
    <INCLUDE>MeasurementSide</INCLUDE>
    <INCLUDE>MeasurementTime</INCLUDE>
    <INCLUDE>ModifiedTime</INCLUDE>
    <INCLUDE>RegionId</INCLUDE>
    <INCLUDE>SiteId</INCLUDE>
    <INCLUDE>SpecificLane</INCLUDE>
    <INCLUDE>VehicleFlowRate</INCLUDE>
    <INCLUDE>VehicleType</INCLUDE>
    </QUERY>
    </REQUEST>";

    let file_name = "TrafficFlow.xml";

    get_from_post(body,file_name);


}
 pub fn get_road_condition_data(){

    let body = "
    <REQUEST>
    <LOGIN authenticationkey=\"d8b542b2dafe40f999f223c7aff04046\" />
    <QUERY objecttype=\"RoadCondition\" schemaversion=\"1.2\" includedeletedobjects=\"true\">
        <INCLUDE>Cause</INCLUDE>
        <INCLUDE>ConditionCode</INCLUDE>
        <INCLUDE>ConditionInfo</INCLUDE>
        <INCLUDE>ConditionText</INCLUDE>
        <INCLUDE>CountyNo</INCLUDE>
        <INCLUDE>Creator</INCLUDE>
        <INCLUDE>Deleted</INCLUDE>
        <INCLUDE>EndTime</INCLUDE>
        <INCLUDE>Geometry.ModifiedTime</INCLUDE>
        <INCLUDE>Geometry.SWEREF99TM</INCLUDE>
        <INCLUDE>Geometry.WGS84</INCLUDE>
        <INCLUDE>IconId</INCLUDE>
        <INCLUDE>Id</INCLUDE>
        <INCLUDE>LocationText</INCLUDE>
        <INCLUDE>Measurement</INCLUDE>
        <INCLUDE>ModifiedTime</INCLUDE>
        <INCLUDE>RoadNumber</INCLUDE>
        <INCLUDE>RoadNumberNumeric</INCLUDE>
        <INCLUDE>SafetyRelatedMessage</INCLUDE>
        <INCLUDE>StartTime</INCLUDE>
        <INCLUDE>Warning</INCLUDE>
        
    </QUERY>
    </REQUEST>";

    let file_name = "RoadCondition.xml";

    get_from_post(body,file_name);
 }
//Takes a https post body as a string and a file name. 
//A post request with the body is sent to DATEX II and creates a local XML file  with the data returned from Datex II.
pub fn get_from_post(body:&'static str, file_name:&str){
    let client = reqwest::blocking::Client::new();
  
      let mut res = client.post("https://api.trafikinfo.trafikverket.se/v2/data.xml").header(USER_AGENT,"DATAEXLTU20").header(CONTENT_TYPE,"text/xml")
      .body(body)
      .send()
      .unwrap();

      let mut file = File::create(file_name)
        .expect("Error creating file, SituationData");
    io::copy(&mut res, &mut file)
        .expect("Failed to read response to file");

}

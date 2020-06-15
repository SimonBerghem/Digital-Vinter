use std::io;
use std::fs::File;
//NYTT FOR Post Requests
use reqwest::ClientBuilder;
use reqwest::header::USER_AGENT;
use reqwest::header::CONTENT_TYPE;
use quick_xml::Reader;
use quick_xml::events::Event;

// Get the XML file from datex using basic auth
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
// Get the XML file from, DATEX II. 
// The function assumes that another part of the system will read the XML file and parse it into the SQL-Database
// Se git repo for documentation
pub fn get_situation_data(){

    //<LOGIN authenticationkey="{AUTH}" />´
      
      let client = reqwest::blocking::Client::new();
    //  .user_agent(APP_USER_AGENT)
      //.build();POST /v2/data.xml HTTP/1.1
    /*  Content-Type: text/xml
      User-Agent: TEST
      Accept: **
      Cache-Control: no-cache
      Host: api.trafikinfo.trafikverket.se
      Content-Length: 433
      Connection: keep-alive*/
      let mut res = client.post("https://api.trafikinfo.trafikverket.se/v2/data.xml").header(USER_AGENT,"DATAEXLTU20").header(CONTENT_TYPE,"text/xml")
      .body("
      <REQUEST>
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
  </REQUEST>")
      .send()
      .unwrap();
     
  println!("Status: {}",res.status());
  let mut file = File::create("TESTFILE.xml")
          .expect("Error creating file, SituationData");
  io::copy(&mut res, &mut file)
      .expect("Failed to read response to file");
  //println!("Status: {}",res.text());
  //println!("Headers:\n{}", res.headers());
  let c = reqwest::blocking::Client::new();
  let res = c.get("https://rust-lang.org").send().unwrap();
      println!("Status: {}", res.status());
  
  
      
  let cl = reqwest::blocking::Client::new();
  let res = cl.post("http://httpbin.org/post").body("the exact body that is sent").send().unwrap();
   println!("Status: {}", res.status());
  }

// Get the XML file from, DATEX II. 
// The function assumes that another part of the system will read the XML file and parse it into the SQL-Database
// See git repo for documentation
pub fn get_traffic_flow_data(){

      
      let client = reqwest::blocking::Client::new();

      let mut res = client.post("https://api.trafikinfo.trafikverket.se/v2/data.xml").header(USER_AGENT,"DATAEXLTU20").header(CONTENT_TYPE,"text/xml")
      .body("
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
</REQUEST>")
      .send()
      .unwrap();
     
  //println!("Status: {}",res.status());
  let mut file = File::create("TrafficFlow.xml")
          .expect("Error creating file, TrafficFlow.xml");
  io::copy(&mut res, &mut file)
      .expect("Failed to read response to file");
  //println!("Status: {}",res.text());
  //println!("Headers:\n{}", res.headers());
  let c = reqwest::blocking::Client::new();
  let res = c.get("https://rust-lang.org").send().unwrap();
      //println!("Status: {}", res.status());
  
  
      
  let cl = reqwest::blocking::Client::new();
  let res = cl.post("http://httpbin.org/post").body("the exact body that is sent").send().unwrap();
   //println!("Status: {}", res.status());
  }

  
  


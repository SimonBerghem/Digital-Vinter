extern crate reqwest;
extern crate quick_xml;
#[macro_use] // params! 
extern crate mysql;

use std::{thread, time::{Duration}};
use mysql::chrono::{Local};
//NYTT
use reqwest::ClientBuilder;
use reqwest::header::USER_AGENT;
use reqwest::header::CONTENT_TYPE;
use quick_xml::Reader;
use quick_xml::events::Event;

//NYTT 2020-03-03
use std::process::Command;

use std::io;
use std::fs::File;
mod auth;
mod fetch;
mod parse_xml;
mod database;

fn main() {
    
    

    //let roadAccident_data = parse_xml::parse_roadAccident("TESTFILE.xml");
    //println!("{:?}: Deviation Data", roadAccident_data);
    //testPost();
    //testParse();
    //testPost_2();
    let opts = database::get_opts(auth::USER_DB, auth::PASS_DB, auth::ADDR_DB, auth::NAME_DB);
    // // // Create new pool connections 
    let pool = mysql::Pool::new(opts).expect("Pool failed to get opts!");
    database::create_mysql_tables(pool.clone());
    let station_pool = pool.clone();
    let weather_pool = pool.clone();
    let friction_pool = pool.clone();
    let camera_pool = pool.clone();
    let road_accident_pool = pool.clone();
    let traffic_flow_pool = pool.clone();
    let update_parse_pool = pool.clone();

    //database::insert_road_accident_data(road_accident_pool.clone(), roadAccident_data);

    //fetch::fetch_xml(auth::URL_S, auth::USER_DATEX, auth::PASS_DATEX, "station_data_cache.xml");
    fetch::get_station_data();
    //println!("{:?}: First fetch, station file fetched from DATEX II", Local::now().naive_local());
    // First insert
   
    let station_data = parse_xml::parse_station2("station_data_cache.xml");
    //println!("{:?}: StationData", station_data[0]);
    
    database::insert_station_data2(station_pool.clone(), station_data);
    //Accident Data
    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
            fetch::get_situation_data();
            println!("{:?}: Situation file fetched from DATEX II",Local::now().naive_local());


        });
        fetch_thread.join().unwrap();

       
        let roadAccident_data = parse_xml::parse_roadAccident("TESTFILE.xml");
        //println!("{:?}: Deviation Data", roadAccident_data);
        database::insert_road_accident_row(road_accident_pool.clone(),roadAccident_data);
        //println!("{:?}: Situation Data Inserted ", Local::now().naive_local());
        // Sleep for 15 min
        thread::sleep(Duration::from_secs(900));


    });

    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
            fetch::get_traffic_flow_data();
            println!("{:?}: Traffic Flow file fetched from DATEX II",Local::now().naive_local());

        });
        fetch_thread.join().unwrap();
        // Fungerar fram hit
        let traffic_flow_data = parse_xml::parse_traffic_flow("TrafficFlow.xml");
        //println!("{:?}: Traffic Flow Data", traffic_flow_data[0]);
        database::insert_traffic_flow_data(traffic_flow_pool.clone(), traffic_flow_data);
        //println!("{:?}: Traffic Flow Inserted ",Local::now().naive_local());
        thread::sleep(Duration::from_secs(900));
    });

    // Camera data    
    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
		let client = reqwest::blocking::Client::new();
		let mut res = client.post("https://api.trafikinfo.trafikverket.se/v2/data.xml").header(USER_AGENT,"DATAEXLTU20").header(CONTENT_TYPE,"text/xml")
    		.body("
		<REQUEST>
    		<LOGIN authenticationkey=\"d8b542b2dafe40f999f223c7aff04046\" />
			<QUERY objecttype=\"Camera\" schemaversion=\"1\" includedeletedobjects=\"true\">
				<FILTER>
          		    	<AND>
                 			<IN name=\"CountyNo\" value=\"1,25\" />
					<EXISTS name=\"CameraGroup\" value=\"true\" />
					<IN name=\"Status\" value=\"videoOrImagesAvailable\" />
					<IN name=\"Type\" value=\"Väglagskamera\" />
             		    	</AND>
          			</FILTER>
          			<INCLUDE>CountyNo</INCLUDE>
          			<INCLUDE>Id</INCLUDE>
          			<INCLUDE>PhotoUrl</INCLUDE>
       	 			<INCLUDE>PhotoTime</INCLUDE>
        			<INCLUDE>Geometry.WGS84</INCLUDE>
				<INCLUDE>CameraGroup</INCLUDE>
      			</QUERY>
		</REQUEST>")
		.send()
		.unwrap();

	println!("Status: {}",res.status());
	let mut file = File::create("TESTFILECAM.xml")
        .expect("Error creating file, station_data");
	io::copy(&mut res, &mut file)
    	.expect("Failed to read response to file");
	//println!("Status: {}",res.text());
	//println!("Headers:\n{}", res.headers());
	let c = reqwest::blocking::Client::new();
	let res = c.get("https://rust-lang.org").send().unwrap();
    	println!("Status: {}", res.status());

        });
        // Wait for fetch to complete
        fetch_thread.join().unwrap();
    

        let camera_data = parse_xml::parse_cameras("camera_data_cache.xml");
       // database::insert_camera_data(camera_pool.clone(), camera_data);
        println!("{:?}: Camera file fetched from Trafikverket API I will now sleep for 30 min", Local::now().naive_local());
        
	// Activate bash here
	let mut pic = Command::new("camera_script.sh");
	pic.status().expect("AAAAAAAAA");
	

        println!("{:?}: Done with cam job", Local::now().naive_local());

        // Sleep for 30 min
        thread::sleep(Duration::from_secs(1800));

        println!("{:?}: 30 min done starting camera_script", Local::now().naive_local());



    });

    // Weather data fetched every 15 min from DATEX II, parsed and inserted to MYSQL
    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
            fetch::fetch_xml(auth::URL_W, auth::USER_DATEX, auth::PASS_DATEX, "weather_data_cache.xml");
            println!("{:?}: Weather file fetched from DATEX II", Local::now().naive_local());


        });
        // Wait for fetch to complete
        fetch_thread.join().unwrap();

        let weather_data = parse_xml::parse_weather("weather_data_cache.xml");
        database::insert_weather_data(weather_pool.clone(), weather_data);
    
        // Sleep for 15 min
        thread::sleep(Duration::from_secs(900));
    
    
    });
    //Friction data 
    


    loop { 
        let fetch_thread = thread::spawn(|| {
            fetch::fetch_xml(auth::URL_S, auth::USER_DATEX, auth::PASS_DATEX, "station_data_cache.xml");
            println!("{:?}: Station file fetched from DATEX II", Local::now().naive_local());
        });
        // Wait for fetch to complete
        fetch_thread.join().unwrap();
        

        let station_data = parse_xml::parse_station("station_data_cache.xml");
        database::insert_station_data(station_pool.clone(), station_data);

        thread::sleep(Duration::from_secs(86400));

    }


}



fn testPost(){


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
        .expect("Error creating file, station_data");
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

//Thread for updating timeformat for accidentdata in SQL
    
    // thread::spawn(move || loop {
    //     database::update_parse_accident(update_parse_pool.clone());
    //     println!("{:?}: Update complete",Local::now().naive_local());
    //     thread::sleep(Duration::from_secs(20));
        
    //     database::update_parse_accident_rename(update_parse_pool.clone());
    //     println!("{:?}: Rename complete",Local::now().naive_local());
    //     thread::sleep(Duration::from_secs(900));
    // });

// fn testParse(){

        
//     let xml = r#"<RESPONSE><RESULT><Situation><Deviation><Geometry><SWEREF99TM>POINT (568274.04 6366488.85)</SWEREF99TM><WGS84>POINT (16.1372547 57.43597)</WGS84></Geometry><IconId>roadAccident</IconId><Id>SE_STA_TRISSID_1_8509792</Id><SeverityCode>4</SeverityCode></Deviation></Situation></RESULT></RESPONSE>"#;
//     let mut reader = Reader::from_str(xml);
//     reader.trim_text(true);

//     let mut count = 0;
//     let mut txt = Vec::new();
//     let mut buf = Vec::new();

//     // The `Reader` does not implement `Iterator` because it outputs borrowed data (`Cow`s)
//         loop {
//             match reader.read_event(&mut buf) {
//                 Ok(Event::Start(ref e)) => {
//                     match e.name() {
//                     b"SeverityCode" => {
//                         println!("attributes values: {:?}", xml.read_text(e.name(), &mut Vec::new()).unwrap());
//                     }
//                 _ => (),
//                 }
//             },
//             Ok(Event::Text(e)) => txt.push(e.unescape_and_decode(&reader).unwrap()),
//             Ok(Event::Eof) => break, // exits the loop when reaching end of file
//             Err(e) => panic!("Error at position {}: {:?}", reader.buffer_position(), e),
//             _ => (), // There are several other `Event`s we do not consider here
//         }

//         // if we don't keep a borrow elsewhere, we can clear the buffer to keep memory usage low
//         buf.clear();
//     }
// }

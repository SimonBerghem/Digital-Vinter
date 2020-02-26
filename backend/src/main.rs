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
use std::io;
use std::fs::File;
//use reqwest::blocking;
mod auth;
mod fetch;
mod parse_xml;
mod database;



fn main() {

    testPost();
    //testPost_2();
    let opts = database::get_opts(auth::USER_DB, auth::PASS_DB, auth::ADDR_DB, auth::NAME_DB);
    // // // Create new pool connections 
    let pool = mysql::Pool::new(opts).expect("Pool failed to get opts!");
    database::create_mysql_tables(pool.clone());
    let station_pool = pool.clone();
    let weather_pool = pool.clone();
    let friction_pool = pool.clone();
    let camera_pool = pool.clone();


    fetch::fetch_xml(auth::URL_S, auth::USER_DATEX, auth::PASS_DATEX, "station_data_cache.xml");
    println!("{:?}: First fetch, station file fetched from DATEX II", Local::now().naive_local());
    // First insert
    let station_data = parse_xml::parse_station("station_data_cache.xml");
    database::insert_station_data(station_pool.clone(), station_data);


    
    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
            fetch::fetch_xml(auth::URL_C, auth::USER_DATEX, auth::PASS_DATEX, "camera_data_cache.xml");
            println!("{:?}: camera file fetched from DATEX II", Local::now().naive_local());
        });
        // Wait for fetch to complete
        fetch_thread.join().unwrap();
    

        let camera_data = parse_xml::parse_cameras("camera_data_cache.xml");
        database::insert_camera_data(camera_pool.clone(), camera_data);
        
        // Sleep for 15 min
        thread::sleep(Duration::from_secs(900));

    });
    // Weather data fetched every 15 min from DATEX II, parsed and inserted to MYSQL
    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
            fetch::fetch_xml(auth::URL_W, auth::USER_DATEX, auth::PASS_DATEX, "weather_data_cache.xml");
            println!("{:?}: weather file fetched from DATEX II", Local::now().naive_local());


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
            println!("{:?}: station file fetched from DATEX II", Local::now().naive_local());
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
        <QUERY objecttype=\"Situation\" schemaversion=\"1.2\">
            <FILTER>
                <EQ name=\"Deviation.MessageType\" value=\"Olycka\" />
            </FILTER>
            <INCLUDE>Deviation.Id</INCLUDE>
            <INCLUDE>Deviation.Header</INCLUDE>
            <INCLUDE>Deviation.IconId</INCLUDE>
            <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
        </QUERY>
    </REQUEST>")
    .send()
    .unwrap();
   
println!("Status: {}",res.status());
let mut file = File::create("TESTFILE.txt")
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

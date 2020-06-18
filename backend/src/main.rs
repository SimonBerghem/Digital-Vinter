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
    let road_condition_pool = pool.clone();


    //database::insert_road_accident_data(road_accident_pool.clone(), roadAccident_data);

    fetch::fetch_xml(auth::URL_S, auth::USER_DATEX, auth::PASS_DATEX, "station_data_cache.xml");
    //println!("{:?}: First fetch, station file fetched from DATEX II", Local::now().naive_local());
    // First insert
   
    let station_data = parse_xml::parse_station("station_data_cache.xml");
    //println!("{:?}: StationData", station_data[0]);
    
    database::insert_station_data(station_pool.clone(), station_data);


/* Hej framtida utveklare, ifall du undrar varför alla kall är trådade så
är svaret att en tidigare utvecklare resonerade: "Varför inte" den tidigare
utvecklarens struktur har bibeholts. Det finns ingen större anledning att ha så
många trådar som just nu finns mer än "det är cool". 

Designa vidare som du anser bäst.
*/


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

    thread::spawn(move || loop{
        let fetch_thread = thread::spawn(|| {
            fetch::get_road_condition_data();
            println!("{:?} Road condition file fetched from DATEX II", Local::now().naive_local());

        });
        fetch_thread.join().unwrap();

        let road_condition_data = parse_xml::parse_road_condition("RoadCondition.xml");
        //println!("Road condition data: {:?}",road_condition_data);
        database::insert_road_condition_data(road_condition_pool.clone(), road_condition_data);

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
    
    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
            fetch::fetch_xml(auth::URL_C, auth::USER_DATEX, auth::PASS_DATEX, "camera_data_cache.xml");
            println!("{:?}: Camera file fetched from DATEX II", Local::now().naive_local());
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
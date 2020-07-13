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
    println!("{:?}: MYSQL-Setup Completed",Local::now().naive_local());
    let station_pool = pool.clone();
    let weather_pool = pool.clone();
    let friction_pool = pool.clone();
    let camera_pool = pool.clone();
    let road_accident_pool = pool.clone();
    let traffic_flow_pool = pool.clone();
    let road_condition_pool = pool.clone();
    let road_geometry_pool = pool.clone();


    //database::insert_road_accident_data(road_accident_pool.clone(), roadAccident_data);

    let response = fetch::fetch_xml(auth::URL_S, auth::USER_DATEX, auth::PASS_DATEX, "station_data_cache.xml");

    let res = match response {
        Ok(res) => true,
        Err(e) => false,

    };
    
    //println!("{:?}: First fetch, station file fetched from DATEX II", Local::now().naive_local());
    // First insert
   
    if res{
       let station_data =  parse_xml::parse_station("station_data_cache.xml");
       database::insert_station_data(station_pool.clone(), station_data);
    } 
    else{
        println!("{:?}: Station Data fetched fail, Trafikverkets server prob is trash",Local::now().naive_local())
    }

    

    /* Hej framtida utveklare, ifall du undrar varför alla kall är trådade så
    är svaret att en tidigare utvecklare resonerade: "Varför inte", den tidigare
    utvecklarens struktur har bibeholts. Det finns ingen större anledning att ha så
    många trådar som just nu finns mer än "det är cool". 

    Designa vidare som du anser bäst.
    */
    let mut changeid_data
    thread::spawn(move || loop{
        let mut res = true;
        let fetch_thread = thread::spawn(move || {
            let mut result = fetch::get_road_data(changeid_data);
            let res = match result{
                OK(res) => true,
                Err(e) = false,
            }


        });
        fetch_thread.join().unwrap();
        if res {
            let changeid_data = parse_xml::parse_changeid("Road_Data.xml");
            let road_data_data = parse_xml::parse_road_data("Road_Data.xml");
            
            database::


        }
    })


    thread::spawn(move || loop{
        thread::sleep(Duration::from_secs(30));
        println!("Hearbeat");

    });

    let mut changeid_geometry = "0";
    thread::spawn(move || loop {
        let mut res = true;
        let fetch_thread = thread::spawn(move ||{
            let mut result = fetch::get_road_geometry(changeid_geometry);
            let res = match result{
                Ok(res) => true,
                Err(e) => false,
            };
        });

    //13.00, '57.5435199402273'
        fetch_thread.join().unwrap();
        println!("DATA FETCHED {:?} ", res);
        if res {
            let changeid_geometry = parse_xml::parse_changeid("Road_Geometry.xml");
            let road_geometry_data = parse_xml::parse_road_geometry("Road_Geometry.xml");
            database::insert_road_geometry(road_geometry_pool.clone(),road_geometry_data);
            println!("{:?}",changeid_geometry);
            //println!("{:?}: Road_Geometry fetched from DATEX II", Local::now().naive_local());
        }else{
            println!("{:?}: Fail to fetch Road Geometry from DATEX",Local::now().naive_local());
        }
     
    });

    //Accident Data
    thread::spawn(move || loop {
        let fetch_thread = thread::spawn(|| {
            fetch::get_situation_data();
            println!("{:?}: Situation file fetched from DATEX II",Local::now().naive_local());


        });
        fetch_thread.join().unwrap();
        
        
        let roadAccident_data = parse_xml::parse_roadAccident("TESTFILE.xml");
        //println!("{:?}: Deviation Data", roadAccident_data);
        database::insert_road_accident_data(road_accident_pool.clone(),roadAccident_data);
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
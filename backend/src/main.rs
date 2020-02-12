extern crate reqwest;
extern crate quick_xml;
#[macro_use] // params! 
extern crate mysql;



use std::{thread, time::{Duration}};
use mysql::chrono::{Local};

mod auth;
mod fetch;
mod parse_xml;
mod database;


fn main() {

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
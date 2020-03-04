/*
Parse given file, tags are static and need to modified if new unknown XML file is given.
If DATEX II XML file structure is changed parsing will most likely stop working.
*/

use quick_xml::Reader;
use quick_xml::events::Event;

#[derive(Debug)]
pub struct CameraData {

    pub id: String,
    pub time: String,
    pub latitude: String,
    pub longitude: String,
    pub name: String,
    pub station_id: String,
    pub url: String,
    pub url_thumb: String,
    _secret: (), // Disliked the use of pub, will prevent from use of struct elsewere then in this module
}

#[derive(Debug)]
pub struct StationData {
    pub id: String,
    pub name:  String,
    pub road_number: String,
    pub county_number: String,
    pub latitude: String,
    pub longitude: String,
    _secret: (), // Disliked the use of pub, will prevent from use of struct elsewere then in this module
}
#[derive(Debug)]
pub struct WeatherData {
    pub station_id: String,
    pub timestamp: String,
    pub road_temperature: String,
    pub precipitation_type: String,
    pub precipitation_millimetres: String,
    pub air_temperature: String,
    pub air_humidity: String,
    pub wind_speed: String,
    pub wind_direction: String,
    _secret: (),

}
//NYTT RoadAccident == Olyc
#[derive(Debug)]
pub struct roadAccidentData {
    pub RoadAccident_id: String,
    pub RoadAccident_icon_id: String,
    pub RoadAccident_Geometry_SWEREF99TM: String,
    pub RoadAccident_Geometry_WGS84: String,
    pub RoadAccident_SeverityCode: String,
    pub RoadAccident_EndTime: String,
    pub RoadAccident_CreationTime String,
    _secret: (),

}


//<RESPONSE><RESULT><Situation><RoadAccident><Geometry><SWEREF99TM>POINT (730069.97 7094714.13)</SWEREF99TM><WGS84>POINT (19.6907749 63.9034)</WGS84></Geometry><IconId>roadAccident</IconId><Id>SE_STA_TRISSID_1_4798382</Id><SeverityCode>4</SeverityCode></RoadAccident></Situation><Situation><RoadAccident><Geometry><SWEREF99TM>POINT (568274.04 6366488.85)</SWEREF99TM><WGS84>POINT (16.1372547 57.43597)</WGS84></Geometry><IconId>roadAccident</IconId><Id>SE_STA_TRISSID_1_8509792</Id><SeverityCode>4</SeverityCode></RoadAccident></Situation></RESULT></RESPONSE>

pub fn parse_cameras(xmlfile: &str) -> Vec<CameraData> {

    #[derive(Clone, Copy)]
    enum State {
        Root,
        Name,
        Url,
        Thumb,

    };

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open file!");
    xml.trim_text(true); //remove whitespaces

    let mut camera_data = Vec::new();
    let mut buf = Vec::new();
    let mut state = State::Root;

    loop {
        
        match xml.read_event(&mut buf) {
            Ok(Event::Start(ref e)) => match (state, e.name()) {
                (State::Root, b"cctvCameraIdentification") => {
                    let camera = CameraData {

                        id: String::new(),
                        time: String::new(),
                        latitude: String::new(),
                        longitude: String::new(),
                        name: String::new(),
                        station_id: String::new(),
                        url: String::new(),
                        url_thumb: String::new(),
                        _secret: (),

                    };
                    camera_data.push(camera);
                    let camera = camera_data.last_mut().unwrap();
                    camera.id = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read camera id");

                }
            //     _ => {}
            // }
            // Ok(Event::Start(ref e)) => {
                // match (state, e.name()) {
                    (State::Root, b"cctvCameraRecordVersionTime") => {
                        let camera = camera_data.last_mut().expect("Failed to get pointer, cctvCameraRecordVersionTime");
                        camera.time = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read cctvCameraRecordVersionTime");

                    }

                    (State::Root, b"latitude") => {
                        let camera = camera_data.last_mut().expect("Failed to get pointer, latitude");
                        camera.latitude = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read camera latitude");

                    }
                    (State::Root, b"longitude") => {
                        let camera = camera_data.last_mut().expect("Failed to get pointer, longitude");
                        camera.longitude = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read camera longitude");
                    
                    }
                    (State::Root, b"cameraBaseStationName") => state = State::Name,
                    (State::Name, b"value") => {
                    // (State::Value, b"value") => {
                        let camera = camera_data.last_mut().expect("Failed to get pointer, cctvCameraSiteLocalDescription");
                        camera.name = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read cctvCameraSiteLocalDescription");

                    }
                    (State::Root, b"cameraBaseStationIdentification") => {
                        let camera = camera_data.last_mut().expect("Failed to get pointer, cctvCameraIdentification");
                        camera.station_id = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read cctvCameraIdentification");
                    
                    } 
                    (State::Root, b"stillImageUrl") => state = State::Url,
                    (State::Url, b"urlLinkAddress") => {
                        let camera = camera_data.last_mut().expect("Failed to get pointer, stillImageUrl");
                        camera.url = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read urlLinkAddress");
                    
                    }
                    (State::Root, b"orientationImageUrl") => state = State::Thumb,
                    (State::Thumb, b"urlLinkAddress") => {
                        let camera = camera_data.last_mut().expect("Failed to get pointer, orientationImageUrl");
                        camera.url_thumb = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read urlLinkAddress thumb");
                    
                    }
                    _ => (), // There are several other `Event`s we do not consider here

                // }
            }
            Ok(Event::End(ref e)) => {
                match (state, e.name()) {
                    (State::Url, b"stillImageUrl") => state = State::Root,
                    (State::Thumb, b"orientationImageUrl") => state = State::Root,
                    (State::Name, b"cameraBaseStationName") => state = State::Root,

                    _ => {}
                }
            }
            Ok(Event::Eof) => break,  
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),

            _ => (),
        }
        buf.clear();
    }
    // Vec<CameraData>
    camera_data


}

//
pub fn parse_roadAccident(xmlfile: &str) -> Vec<roadAccidentData>{

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open file!");
    xml.trim_text(true);

    let mut RoadAccident_data = Vec::new();
    let mut buf = Vec::new();

    loop {
        match xml.read_event(&mut buf){
            Ok(Event::Start(ref e)) => match e.name() {
                b"Deviation" => {
                    let RoadAccident = roadAccidentData {
                        RoadAccident_id : String::new(),
                        RoadAccident_icon_id : String::new(),
                        RoadAccident_Geometry_SWEREF99TM : String::new(),
                        RoadAccident_Geometry_WGS84 : String::new(),
                        RoadAccident_SeverityCode : String::new(),
                        RoadAccident_EndTime : String::new(),
                        RoadAccident_CreationTime : String::new(),
                        _secret: (),


                    };
                    RoadAccident_data.push(RoadAccident);
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    
                }
                b"CreationTime" => {
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    RoadAccident.RoadAccident_CreationTime = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"EndTime" => {
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    RoadAccident.RoadAccident_EndTime = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"SWEREF99TM" => {
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    RoadAccident.RoadAccident_Geometry_SWEREF99TM = xml.read_text(e.name(), &mut Vec::new()).unwrap();
                }
                b"WGS84" => {
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    RoadAccident.RoadAccident_Geometry_WGS84 = xml.read_text(e.name(), &mut Vec::new()).unwrap();
                }
                b"IconId" => {
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    //println!("{:?}: IconID",xml.read_text(e.name(), &mut Vec::new()).unwrap());
                    RoadAccident.RoadAccident_icon_id = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"Id" => {
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    RoadAccident.RoadAccident_id = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
               
                b"SeverityCode" => {
                    let RoadAccident = RoadAccident_data.last_mut().unwrap();
                    RoadAccident.RoadAccident_SeverityCode = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                _ => (), //Resten av Cases


            }
            Ok(Event::Eof) => break,
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),_ => (),


        }
        buf.clear();

    }
    RoadAccident_data
}

// Parse xml file and return station_data vector
pub fn parse_station(xmlfile: &str) -> Vec<StationData> {

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open file!");
    xml.trim_text(true); //remove whitespaces
    
    let mut lat_stored = false;
    let mut long_stored = false;

    let mut station_data = Vec::new();
    let mut buf = Vec::new();

    loop {
        
        match xml.read_event(&mut buf) {
            Ok(Event::Start(ref e)) => match e.name() {
                    b"ns0:measurementSiteRecord" => {
                        let station = StationData {

                            id: String::new(),
                            name: String::new(),
                            road_number: String::new(),
                            county_number: String::new(),
                            latitude: String::new(),
                            longitude: String::new(),
                            _secret: (),

                        };
                        station_data.push(station);
                        let station = station_data.last_mut().unwrap();
                        // Get station id
                        station.id = e.attributes()
                                    .filter_map(|a| a.ok())
                                    .find(|a| a.key == b"id")
                                    .expect("Failed to find id!")
                                    .unescape_and_decode_value(&xml)
                                    .expect("Failed to decode id!");

                    }
                    b"ns0:value" => {
                        let station = station_data.last_mut().unwrap();
                        station.name = xml.read_text(e.name(), &mut Vec::new()).unwrap();
                    }                                     
                    b"ns0:roadNumber" => {
                        let station = station_data.last_mut().unwrap();
                        station.road_number = xml.read_text(e.name(), &mut Vec::new()).unwrap();
                    }
                    b"ns0:countyNumber" => {
                        let station = station_data.last_mut().unwrap();
                        station.county_number = xml.read_text(e.name(), &mut Vec::new()).unwrap();
                    }
                    // For some reason latitude and longitude coordinates are stored twice in the XML file
                    b"ns0:latitude" => {
                        if lat_stored {
                            lat_stored = false;
                        } else {
                            let station = station_data.last_mut().unwrap();
                            station.latitude = xml.read_text(e.name(), &mut Vec::new()).unwrap();
                            lat_stored = true;
                        }

                    }
                    b"ns0:longitude" => {
                        if long_stored {
                            long_stored = false;
                        } else {
                            let station = station_data.last_mut().unwrap();
                            station.longitude = xml.read_text(e.name(), &mut Vec::new()).unwrap();
                            long_stored = true;
                        }

                    }
                           
                    _ => (), // There are several other `Event`s we do not consider here

            }
            Ok(Event::Eof) => break,  
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),

            _ => (),
        }
        buf.clear();
    }
    // Vec<StationData>
    station_data

}


pub fn parse_weather(xmlfile: &str) -> Vec<WeatherData> {
    // Used for nested tags
     #[derive(Clone, Copy)]
    enum State {
        Root,
        Air,
        Road,
        Humidity,
        Wind,
    };

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open file!");
    xml.trim_text(true); //remove whitespaces
    
    let mut weather_data = Vec::new();
    let mut buf = Vec::new();
    let mut state = State::Root;
    loop {
        
        match xml.read_event(&mut buf) {
            Ok(Event::Empty(ref e)) => match e.name() {
                b"measurementSiteReference" => {
                    let weather = WeatherData {

                        station_id: String::new(),
                        timestamp: String::new(),
                        road_temperature: String::new(),
                        precipitation_type: String::new(),
                        precipitation_millimetres: String::new(),
                        air_temperature: String::new(),
                        air_humidity: String::new(),
                        wind_speed: String::new(),
                        wind_direction: String::new(),
                        _secret: (),

                    };
                    weather_data.push(weather);
                    let weather = weather_data.last_mut().unwrap();
                    // Get station id
                    weather.station_id = e.attributes()
                                .filter_map(|a| a.ok())
                                .find(|a| a.key == b"id")
                                .expect("Failed to find id!")
                                .unescape_and_decode_value(&xml)
                                .expect("Failed to decode id!");
                    }
                _ => {}
            }
            Ok(Event::Start(ref e)) => {
                match (state, e.name()) {
                    (State::Root, b"airTemperature") => state = State::Air,
                    (State::Air, b"temperature") => {
                            let weather = weather_data.last_mut().expect("Failed to get pointer, airTemperature");
                            weather.air_temperature = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at airTemperature");
                    }
                    (State::Root, b"measurementTimeDefault") => {
                        let weather = weather_data.last_mut().expect("Failed to get pointer, measurementTimeDefault");
                        weather.timestamp = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at measurementTimeDefault");
                    }
                    (State::Root, b"roadSurfaceTemperature") => state = State::Road,
                    (State::Road, b"temperature") => {
                        let weather = weather_data.last_mut().expect("Failed to get pointer, roadSurfaceTemperature");
                        weather.road_temperature = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at roadSurfaceTemperature");
                        
                    }
                    (State::Root, b"precipitationType") => {
                        let weather = weather_data.last_mut().expect("Failed to get pointer, precipitationType");
                        weather.precipitation_type = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at precipitationType");
                        
                    }
                    (State::Root, b"millimetresPerHourIntensity") => {
                        let weather = weather_data.last_mut().expect("Failed to get pointer, millimetresPerHourIntensity");
                        weather.precipitation_millimetres = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at millimetresPerHourIntensity");
                        
                    }                    
                    (State::Root, b"relativeHumidity") => state = State::Humidity,
                    (State::Humidity, b"percentage") => {
                        let weather = weather_data.last_mut().expect("Failt to get pointer, relativeHumidity");
                        weather.air_humidity = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at relativeHumidity");
                        
                    }                                     
                    (State::Root, b"windSpeed") => state = State::Wind,
                    (State::Wind, b"speed") => { 
                        let weather = weather_data.last_mut().expect("Failed to get pointer, windSpeed");
                        weather.wind_speed = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at windSpeed");
                        
                    }
                    (State::Root, b"directionCompass") => {
                        let weather = weather_data.last_mut().expect("Failed to get pointer, directionCompass");
                        weather.wind_direction = xml.read_text(e.name(), &mut Vec::new()).expect("Failed to read text at directionCompass");
                            
                    }
                    _ => {} // There are several other `Event`s we do not consider here
                }
            }
            
            Ok(Event::End(ref e)) => {
                match (state, e.name()) {
                    (State::Air, b"airTemperature") => state = State::Root,
                    (State::Road, b"roadSurfaceTemperature") => state = State::Root,
                    (State::Humidity, b"relativeHumidity") => state = State::Root,
                    (State::Wind, b"windSpeed") => state = State::Root,


                    _ => {}
                }
            }
            Ok(Event::Eof) => break,  
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),

            _ => (),
        }
        buf.clear();
    }

    // Vec<WeatherData>
    weather_data
    
}


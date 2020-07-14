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
//NYTT RoadAccident == Olycka
#[derive(Debug)]
pub struct roadAccidentData {
    pub RoadAccident_id: String,
    pub RoadAccident_icon_id: String,
    pub RoadAccident_Geometry_SWEREF99TM: String,
    pub RoadAccident_Geometry_WGS84: String,
    pub RoadAccident_SeverityCode: String,
    pub RoadAccident_EndTime: String,
    pub RoadAccident_CreationTime: String,
    _secret: (),

}

//Skapad för jag viste inte hur man skrev minnesäker kod.
//Rust är svårt och jag kommer inte dömma er om ni byter till python.
#[derive(Debug)]
pub struct ChangeId {
    pub change_id: String,
    _secret: (),
}
//NYTT TrafficFlow
#[derive(Debug)]
pub struct TrafficFlowData {
    pub AverageVehicleSpeed: String,
    pub CountyNo: String,
    pub Deleted: String,
    pub Geometry_SWEREF99TM: String,
    pub Geometry_WGS84: String,
    pub MeasurementOrCalculationPeriod: String,
    pub MeasurementSide: String,
    pub MeasurementTime: String,
    pub ModifiedTime: String,
    pub RegionId: String,
    pub SiteId: String,
    pub SpecificLane: String,
    pub VehicleFlowRate: String,
    pub VehicleType: String,
    _secret: (),
}

#[derive(Debug)]
pub struct RoadGeometry{
    pub county: String,
    pub deleted: String,
    pub direction_code: String,
    pub direction_value: String,
    pub SWEREF99TM3D: String,
    pub WGS843D: String,
    pub length: String,
    pub modified_time: String,
    pub road_main_number: String,
    pub road_sub_number: String,
    pub time_stamp: String,
    _secret: (),
}

pub struct RoadData{
    pub aadt: String,
    pub aadt_heavy_vehicles: String,
    pub aadt_measurement_method_code: String,
    pub aadt_measurement_method_value: String,
    pub aadt_measurement_year: String,
    pub bearing_capacity_code: String,
    pub bearing_capacity_value: String,
    pub county: String,
    pub deleted: String,
    pub direction_code: String,
    pub direction_value: String,
    pub end_continuous_length: String,
    pub lane_description: String,
    pub length: String,
    pub modified_time: String,
    pub road_category_code: String,
    pub road_category_value: String,
    pub road_main_number: String,
    pub road_sub_number: String,
    pub road_owner_code: String,
    pub road_owner_value: String,
    pub road_type_code: String,
    pub road_type_value: String,
    pub road_width: String,
    pub speed_limit: String,
    pub start_continuous_length: String,
    pub time_stamp: String,
    pub wear_layer: String,
    pub winter_2003_code: String,
    pub winter_2003_value: String,
    _secret: (),

}

//NYTT RoadCondition
pub struct RoadCondition{
    pub cause: String,
    pub condition_code: String,
    pub condition_info: String,
    pub condition_text: String,
    pub county_no: String,
    pub creator: String,
    pub deleted: String,
    pub end_time: String,
    pub geometry_modified_time: String,
    pub SWEREF99TM: String,
    pub WGS84: String,
    pub icon_id: String,
    pub id: String,
    pub location_text: String,
    pub measurement: String,
    pub modified_time: String,
    pub road_number: String,
    pub road_number_numeric: String,
    pub safety_related_message: String,
    pub start_time: String,
    pub warning: String,
    _secret: (),

}


pub fn parse_road_data(xmlfile: &str)-> Vec<RoadData>{

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open File");
    
    xml.trim_text(true);

    let mut RoadData_data = Vec::new();
    let mut buf = Vec::new();
    let mut parentTag = "";
    loop{
        match xml.read_event(&mut buf){
            Ok(Event::Start(ref e)) => match e.name(){
                b"RoadData" => {
                    
                    let Road_Data = RoadData{
                        aadt: String::new(),
                        aadt_heavy_vehicles: String::new(),
                        aadt_measurement_method_code: String::new(),
                        aadt_measurement_method_value: String::new(),
                        aadt_measurement_year: String::new(),
                        bearing_capacity_code: String::new(),
                        bearing_capacity_value: String::new(),
                        county: String::new(),
                        deleted: String::new(),
                        direction_code: String::new(),
                        direction_value: String::new(),
                        end_continuous_length: String::new(),
                        lane_description: String::new(),
                        length: String::new(),
                        modified_time: String::new(),
                        road_category_code: String::new(),
                        road_category_value: String::new(),
                        road_main_number: String::new(),
                        road_sub_number: String::new(),
                        road_owner_code: String::new(),
                        road_owner_value: String::new(),
                        road_type_code: String::new(),
                        road_type_value: String::new(),
                        road_width: String::new(),
                        speed_limit: String::new(),
                        start_continuous_length: String::new(),
                        time_stamp: String::new(),
                        wear_layer: String::new(),
                        winter_2003_code: String::new(),
                        winter_2003_value: String::new(),
                        _secret: (),
                        
                    };
                    RoadData_data.push(Road_Data);
                    
                    let Road_Data = RoadData_data.last_mut().unwrap();
                    
                }
                    b"AADT" =>{
                        println!("Parse Road Data 1.5");
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.aadt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        println!("Parse Road Data 1.5");
                    }
                    b"AADTHeavyVehicles" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.aadt_heavy_vehicles = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    
                    //Checks if ADDT measuerment methods exists, if they do the next code and value is its. 
                    b"AADTMeasurementMethod" =>{
                        println!("Parse Road Data 2");
                        let xml_txt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        let mut reader_txt = Reader::from_str(&xml_txt);
                        let mut temp_buf = Vec::new();

                        loop{
                            match reader_txt.read_event(&mut temp_buf){
                                Ok(Event::Start(ref i)) => match i.name(){
                                    b"Code" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.aadt_measurement_method_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();
                   
                                    }

                                    b"Value" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.aadt_measurement_method_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();
                                    }
                                    _ => (),
                                }
                                Ok(Event::Eof) => break,
                                Err(i) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                                _ => (),
                            }
                            temp_buf.clear();
                        }
                    }
                    b"ADDTMeasurementYear" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.aadt_measurement_year = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }

                    b"BearingCapacity" =>{
                        let xml_txt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        let mut reader_txt = Reader::from_str(&xml_txt);
                        let mut temp_buf = Vec::new();

                        loop{
                            match reader_txt.read_event(&mut temp_buf){
                                Ok(Event::Start(ref i)) => match i.name(){
                                    b"Code" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.bearing_capacity_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    b"Value" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.bearing_capacity_value = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    _ => (),
                                }
                                Ok(Event::Eof) => break,
                                Err(i) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                                _ => (),
                            }
                            temp_buf.clear();
                        }
                    }

                    b"County" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.county = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"Deleted" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        //println!("Parse Road Data 1.5{:?}", e.name());
                        Road_Data.deleted = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"Direction" =>{

                        let parentTag = "Direction";
                        /*
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        
                        let xml_txt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        println!("Parse Road Data 1.5");
                        let mut reader_txt = Reader::from_str(&xml_txt);
                        let mut temp_buf = Vec::new();

                        loop{
                            match reader_txt.read_event(&mut temp_buf){
                                Ok(Event::Start(ref i)) => match i.name(){
                                    b"Code" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.direction_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    b"Value" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.direction_value = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    _ => (),
                                }
                                Ok(Event::Eof) => break,
                                Err(i) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                                _ => (),
                            }
                            temp_buf.clear();
                        }
                        */
                    }
                    b"EndContinuousLength" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.end_continuous_length = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"LaneDescription"  =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.lane_description = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"Lenght" => {
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.length = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"ModifiedTime" => {
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.modified_time = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    
                    }
                    b"RoadCategory" =>{
                        let xml_txt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        let mut reader_txt = Reader::from_str(&xml_txt);
                        let mut temp_buf = Vec::new();

                        loop{
                            match reader_txt.read_event(&mut temp_buf){
                                Ok(Event::Start(ref i)) => match i.name(){
                                    b"Code" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.road_category_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    b"Value" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.road_category_value = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    _ => (),
                                }
                                Ok(Event::Eof) => break,
                                Err(i) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                                _ => (),
                            }
                            temp_buf.clear();
                        }
                    }

                    b"RoadMainNumber" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.road_main_number = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"RoadSubNumber" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.road_sub_number = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    
                    }
                    b"RoadOwner" =>{
                        let xml_txt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        let mut reader_txt = Reader::from_str(&xml_txt);
                        let mut temp_buf = Vec::new();

                        loop{
                            match reader_txt.read_event(&mut temp_buf){
                                Ok(Event::Start(ref i)) => match i.name(){
                                    b"Code" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.road_owner_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    b"Value" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.road_owner_value = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    _ => (),
                                }
                                Ok(Event::Eof) => break,
                                Err(i) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                                _ => (),
                            }
                            temp_buf.clear();
                        }
                    }

                    b"RoadType" =>{
                        let xml_txt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        let mut reader_txt = Reader::from_str(&xml_txt);
                        let mut temp_buf = Vec::new();

                        loop{
                            match reader_txt.read_event(&mut temp_buf){
                                Ok(Event::Start(ref i)) => match i.name(){
                                    b"Code" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.road_type_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    b"Value" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.road_type_value = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    _ => (),
                                }
                                Ok(Event::Eof) => break,
                                Err(i) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                                _ => (),
                            }
                            temp_buf.clear();
                        }
                    }
                    b"RoadWidth"=>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.road_width = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"SpeedLimit" =>{
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.speed_limit = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    
                    }
                    b"TimeStamp" => {
                        let Road_Data = RoadData_data.last_mut().unwrap();
                        Road_Data.time_stamp = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"Winter2003" =>{
                        let xml_txt = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        let mut reader_txt = Reader::from_str(&xml_txt);
                        let mut temp_buf = Vec::new();

                        loop{
                            match reader_txt.read_event(&mut temp_buf){
                                Ok(Event::Start(ref i)) => match i.name(){
                                    b"Code" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.winter_2003_code = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    b"Value" => {
                                        let Road_Data = RoadData_data.last_mut().unwrap();
                                        Road_Data.winter_2003_value = xml.read_text(i.name(),&mut Vec::new()).unwrap();

                                    }
                                    _ => (),
                                }
                                Ok(Event::Eof) => break,
                                Err(i) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                                _ => (),
                            }
                            temp_buf.clear();
                        }
                    }

                _ =>(),
            }
            Ok(Event::Eof) => break,
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
            _ => (),
        }
        buf.clear();
    }
    println!("Parse Road Data 1");
    RoadData_data

}


//parse_changeid will find the changeid of an XML-File 
//and return the text value as a string
pub fn parse_road_geometry(xmlfile: &str)-> Vec<RoadGeometry>{

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open File");
    xml.trim_text(true);

    let mut RoadGeometry_data = Vec::new();
    let mut buf = Vec::new();

    loop{
        match xml.read_event(&mut buf){
            Ok(Event::Start(ref e)) => match e.name(){
                b"RoadGeometry" => {
                    let Road_Geometry = RoadGeometry{
                        county : String::new(),
                        deleted : String::new(),
                        direction_code : String::new(),
                        direction_value : String::new(),
                        SWEREF99TM3D : String::new(),
                        WGS843D : String::new(),
                        length : String::new(),
                        modified_time : String::new(),
                        road_main_number : String::new(),
                        road_sub_number : String::new(),
                        time_stamp : String::new(),
                        _secret : (),
                    };
                    RoadGeometry_data.push(Road_Geometry);
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                }
                b"County" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.county = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }
                b"Deleted" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.deleted = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }
                b"Code" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.direction_code = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }
                
                b"Value" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.direction_value = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }

                b"Lenght" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.length = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }
                b"SWEREF99TM3D" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.SWEREF99TM3D = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }
                b"WGS843D" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.WGS843D = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }
                
                b"ModifiedTime" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.modified_time = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }

                b"RoadMainNumber" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.road_main_number = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }

                b"RoadSubNumber" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.road_sub_number = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }

                b"TimeStamp" => {
                    let Road_Geometry = RoadGeometry_data.last_mut().unwrap();
                    Road_Geometry.time_stamp = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                }
                _ => (), 
            }
            Ok(Event::Eof) => break,
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
            _ => (),
        }
        buf.clear();
    }
    RoadGeometry_data
}

pub fn parse_changeid(xmlfile: &str)-> Vec<ChangeId> {

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open file1");
    xml.trim_text(true);

    let mut ChangeId_data = Vec::new();
    let mut buf = Vec::new();

    loop {
        match xml.read_event(&mut buf){
            Ok(Event::Start(ref e)) => match e.name(){
                b"INFO" => {
                    let Change_Id = ChangeId{
                        change_id : String::new(),
                        _secret: (),

                    }; 
                    ChangeId_data.push(Change_Id);
                    let Change_Id = ChangeId_data.last_mut().unwrap();
                }

                b"LASTCHANGEID" => {
                    let Change_Id = ChangeId_data.last_mut().unwrap();
                    Change_Id.change_id = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }

                _ => (), //Else typ
            }
            Ok(Event::Eof) => break,
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
            _ => (),
        }
        buf.clear();
    }
    ChangeId_data
}
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
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
            _ => (),


        }
        buf.clear();

    }
    RoadAccident_data
}


pub fn parse_traffic_flow(xmlfile: &str) -> Vec<TrafficFlowData>{
    let mut xml = Reader::from_file(xmlfile).expect("failed to open file");

    xml.trim_text(true);// remove whitespaces

    let mut TrafficFlow_Data = Vec::new();
    let mut buf = Vec::new();

    loop {

        match xml.read_event(&mut buf){
            Ok(Event::Start(ref e)) => match e.name(){
                b"TrafficFlow" => {
                    let TrafficFlow = TrafficFlowData {
                        AverageVehicleSpeed : String::new(),
                        CountyNo : String::new(),
                        Deleted : String::new(),
                        Geometry_SWEREF99TM : String::new(),
                        Geometry_WGS84 : String::new(),
                        MeasurementOrCalculationPeriod : String::new(),
                        MeasurementSide : String::new(),
                        MeasurementTime : String::new(),
                        ModifiedTime : String::new(),
                        RegionId : String::new(),
                        SiteId: String::new(),
                        SpecificLane: String::new(),
                        VehicleFlowRate: String::new(),
                        VehicleType: String::new(),
                        _secret : (),
                    };
                    
                    TrafficFlow_Data.push(TrafficFlow);
                    let TrafficFlow = TrafficFlow_Data.last_mut();

                }    
                    b"AverageVehicleSpeed" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.AverageVehicleSpeed = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"CountyNo" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.CountyNo = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    }
                    b"SWEREF99TM" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.Geometry_SWEREF99TM = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }
                    b"WGS84" =>{
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.Geometry_WGS84 = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }
                    b"MeasurementOrCalculationPeriod" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.MeasurementOrCalculationPeriod = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }
                    b"MeasurementTime" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.MeasurementTime = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }
                    b"ModifiedTime" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.ModifiedTime = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                    

                    }
                    b"RegionId" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.RegionId = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }

                    b"SiteId" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.SiteId = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }

                    b"SpecificLane" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.SpecificLane = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }


                    b"VehicleFlowRate" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.VehicleFlowRate = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }


                    b"VehicleType" => {
                        let TrafficFlow = TrafficFlow_Data.last_mut().unwrap();
                        TrafficFlow.VehicleType = xml.read_text(e.name(),&mut Vec::new()).unwrap();
                        
                    }
                    _ => (), // Else
                }
                Ok(Event::Eof) => break,
                Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
                
                _=> (),


            }
            buf.clear();
        

    }
    TrafficFlow_Data
}


pub fn parse_road_condition(xmlfile: &str) -> Vec<RoadCondition>{

    let mut xml = Reader::from_file(xmlfile).expect("Failed to open file");
   
    xml.trim_text(true);

    let mut road_condition_data = Vec::new();
    let mut buf = Vec::new();

    loop {

        match xml.read_event(&mut buf) {
            Ok(Event::Start(ref e)) => match e.name() {
                b"RoadCondition" => {
                    let roadCondition = RoadCondition{

                        cause: String::new(),
                        condition_code: String::new(),
                        condition_info: String::new(),
                        condition_text: String::new(),
                        county_no: String::new(),
                        creator: String::new(),
                        deleted: String::new(),
                        end_time: String::new(),
                        geometry_modified_time: String::new(),
                        SWEREF99TM: String::new(),
                        WGS84: String::new(),
                        icon_id: String::new(),
                        id: String::new(),
                        location_text: String::new(),
                        measurement: String::new(),
                        modified_time: String::new(),
                        road_number: String::new(),
                        road_number_numeric: String::new(),
                        safety_related_message: String::new(),
                        start_time: String::new(),
                        warning: String::new(),
                        _secret: (),

                    };
                    road_condition_data.push(roadCondition);
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    
                }

                b"Cause" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.cause = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"ConditionCode" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.condition_code = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"ConditionText" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.condition_text = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"CountyNo" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.county_no = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"Creator" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.creator = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"Deleted" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.deleted = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"EndTime" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.end_time = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"ModifiedTime" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.geometry_modified_time = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                
                b"SWEREF99TM" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.SWEREF99TM = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"WGS84" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.WGS84 = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"IconId" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.icon_id = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }

                b"Id" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.id = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }

                b"LocationText" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.location_text = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"Measurement" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.measurement = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"ModifiedTime" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.modified_time = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }

                b"RoadNumber" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.road_number = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"RoadNumberNumeric" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.road_number_numeric = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"SafetyRelatedMessage" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.safety_related_message = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"StartTime" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.start_time = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }
                b"Warning" => {
                    let roadCondition = road_condition_data.last_mut().unwrap();
                    roadCondition.road_number_numeric = xml.read_text(e.name(), &mut Vec::new()).unwrap();

                }

                _ => (),

            }
            Ok(Event::Eof) => break,
            Err(e) => panic!("Error at pos {}: {:?}", xml.buffer_position(), e),
            
            _ => (),
        }
        buf.clear();
    }
    road_condition_data
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


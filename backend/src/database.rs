use mysql::*;
use mysql::prelude::*;
use mysql::{Pool, Opts, PooledConn};
use mysql::OptsBuilder;
use mysql::chrono::{DateTime, FixedOffset};
// use mysql::from_row;

use crate::parse_xml::{StationData, WeatherData, CameraData, roadAccidentData, TrafficFlowData, RoadCondition, RoadGeometry, RoadData};




//pub fn get_friction_data

pub fn insert_friction_data(mut conn: PooledConn, url: &str) {
    //conn.query(r"LOAD DATA LOCAL INFILE ".to_owned() + "'" + url + "'" + " INTO TABLE friction_data LINES TERMINATED BY '\r\n' IGNORE 1 LINES SET `lat`= REPLACE(`lat`, ',', '.'), `lon`=REPLACE(`lon`, ',', '.'), `MeasurementValue`=REPLACE(`MeasurementValue`, ',', '.');").unwrap();
    conn.query(r"LOAD DATA LOCAL INFILE '/Users/samuelgraden/Documents/Projectrcm-sommar-2019/backend/e6.txt' INTO TABLE friction_data LINES TERMINATED BY '\r\n' IGNORE 1 LINES (`id`, `MeasureTimeUTC`, `ReportTimeUTC`, `lat`, `lon`, `RoadCondition`, `MeasurementType`, `NumberOfMeasurements`, `MeasurementValue`, `MeasurementConfidence`, `MeasurementsVelocity`, `ReporterOrganisation`, `EquipmentType`) SET `lat`= REPLACE(`lat`, ',', '.'), `lon`=REPLACE(`lon`, ',', '.');)").unwrap();

    //LOAD DATA LOCAL INFILE '/home/aron/rcm-sommar-2019/backend/e6.txt' INTO TABLE friction_data LINES TERMINATED BY '\r\n' IGNORE 1 LINES (`id`, `MeasureTimeUTC`, `ReportTimeUTC`, `lat`, `lon`, `RoadCondition`, `MeasurementType`, `NumberOfMeasurements`, `MeasurementValue`, `MeasurementConfidence`, `MeasurementsVelocity`, `ReporterOrganisation`, `EquipmentType`) SET `lat`= REPLACE(`lat`, ',', '.'), `lon`=REPLACE(`lon`, ',', '.');
    //LOAD DATA LOCAL INFILE '/home/aron/rcm-sommar-2019/backend/e6.txt' INTO TABLE friction_data LINES TERMINATED BY '\r\n' IGNORE 1 LINES SET `lat`= REPLACE(`lat`, ',', '.'), `lon`=REPLACE(`lon`, ',', '.'), `MeasurementValue`=REPLACE(`MeasurementValue`, ',', '.');

}



pub fn insert_road_data(pool: Pool, road_data_data: Vec<RoadData>){

    let mut insert_stmt = r"INSERT IGNORE INTO `db`.`road_data` 
                (`AADDT`, `AADTHeavyVehicles`, `AADTMeasurementMethod.Code`, `AADTMeasurementMethod.Value`,
         `AADTMeasurementYear`, `BearingCapacity.Code`, `BearingCapacity.Value`, `County`, `Deleted`,
          `Direction.Code`, `Direction.Value`, `EndContinuousLength`, `LaneDescription`, `Length`,
           `ModifiedTime`, `RoadCategory.Code`, `RoadCategory.Value`, 
            `RoadMainNumber`, `RoadOwner.Code`, `RoadOwner.Value`, `RoadSubNumber`, `RoadType.Code`,
            `RoadType.Value`, `RoadWidth`, `SpeedLimit`, `StartContinuousLength`, `TimeStamp`, `WearLayer`, 
            `Winter2003.Code`, `Winter2003.Value`) 
            VALUES (:aaddt, :aadt_heavy_vehicles, :aadt_measurement_method_code, :aadt_measurement_method_value,
                :aadt_measurement_year, :bearing_capacity_code, :bearing_capacity_value, :county, :deleted,
                 :direction_code, :direction_value, :end_continuous_length, :lane_description, :length,
                  :modified_time, :road_category_code, :road_category_value,
                   :road_main_number, :road_owner_code, :road_owner_value, :road_sub_number, :road_type_code,
                   :road_type_value, :road_width, :speed_limit, :start_continuous_length, :time_stamp, :wear_layer, 
                   :winter_2003_code, :winter_2003_value);";
    let mut insert_stmt_prep = pool.prepare(insert_stmt);
    //println!("{:?}",insert_stmt_prep);
    for mut stmt in pool.prepare(insert_stmt).into_iter(){

        for i in road_data_data.iter(){
           let mut modified_time = i.modified_time.clone();
           let mut modified_time_1:Vec<&str> = modified_time.split(".").collect();
            stmt.execute(params!{
                "aaddt" => i.aadt.clone(),
                "aadt_heavy_vehicles" => i.aadt_heavy_vehicles.clone(),
                "aadt_measurement_method_code" => i.aadt_measurement_method_code.clone(),
                "aadt_measurement_method_value" => i.aadt_measurement_method_value.clone(),
                "aadt_measurement_year" => i.aadt_measurement_year.clone(),
                "bearing_capacity_code" => i.bearing_capacity_code.clone(),
                "bearing_capacity_value" => i.bearing_capacity_value.clone(),
                "county" => i.county.clone(),
                "deleted" => i.deleted.clone(),
                "direction_code" => i.direction_code.clone(),
                "direction_value" => i.direction_value.clone(),
                "end_continuous_length" => i.end_continuous_length.clone(),
                "lane_description" => i.lane_description.clone(),
                "length" => i.length.clone(),
                "modified_time" => modified_time_1[0],
                "road_category_code" => i.road_category_code.clone(),
                "road_category_value" => i.road_category_value.clone(),
                "road_main_number" => i.road_main_number.clone(),
                "road_owner_code" => i.road_owner_code.clone(),
                "road_owner_value" => i.road_owner_value.clone(),
                "road_sub_number" => i.road_sub_number.clone(),
                "road_type_code" => i.road_type_code.clone(),
                "road_type_value" => i.road_type_value.clone(),
                "road_width" => i.road_type_value.clone(),
                "speed_limit" => i.speed_limit.clone(),
                "start_continuous_length" => i.start_continuous_length.clone(),
                "time_stamp" => i.time_stamp.clone(),
                "wear_layer" => i.wear_layer.clone(),
                "winter_2003_code" => i.winter_2003_code.clone(),
                "winter_2003_value" => i.winter_2003_value.clone(),
                
            }).expect("Failed to insert Road Data");
        }
    }

}

pub fn insert_camera_data(pool: Pool, camera_data: Vec<CameraData>) {


    let insert_stmt = r"INSERT IGNORE INTO camera_data (id, time, lat, lon, name, station_id, url, url_thumb) 
                                    VALUES (:id, NULLIF(:time, ''), NULLIF(:latitude, ''), NULLIF(:longitude, ''), NULLIF(:name, ''), :station_id, 
                                    NULLIF(:url, ''), NULLIF(:url_thumb, ''))
                                    ON DUPLICATE KEY UPDATE time=:time, lat=:latitude, lon=:longitude, name=:name, url:=url, url_thumb:=url_thumb;";

    for mut stmt in pool.prepare(insert_stmt).into_iter() { 
        for i in camera_data.iter() {
            // `execute` takes ownership of `params` so we pass account name by reference.
            stmt.execute(params!{
                "id" => i.id.clone(),
                "time" => i.time.clone(),
                "latitude" => i.latitude.clone(),
                "longitude" => i.longitude.clone(),
                "name" => i.name.clone(),
                "station_id" => i.station_id.clone(),
                "url" => i.url.clone(),
                "url_thumb" => i.url_thumb.clone(),
            }).expect("Failed to execute statement when reading from camera_data");
        }
    }
}


//Skrev en egen för att något dampade med den andra, denna är nog inte SQL-injection safe, den tar inte hänsyn till om Trafikverket updaterar sin data
pub fn insert_road_accident_row(pool: Pool, accident_row: Vec<roadAccidentData>){
    println!("{:?} Warning! SQL-Injection Vurnable","§");
    for i in accident_row.iter(){
        let query = format!(r#"INSERT IGNORE INTO road_accident_data (Id, CreationTime, EndTime, IconId, SWEREF99TM, WGS84, SeverityCode) VALUES('{}', '{}', '{}', '{}', '{}', '{}', '{}')
        ON DUPLICATE KEY UPDATE CreationTime='{}', EndTime='{}',IconId='{}', SWEREF99TM='{}', WGS84='{}', SeverityCode='{}';"#,
        i.RoadAccident_id, i.RoadAccident_CreationTime, i.RoadAccident_EndTime, i.RoadAccident_icon_id,i.RoadAccident_Geometry_SWEREF99TM, i.RoadAccident_Geometry_WGS84, i.RoadAccident_SeverityCode,
        i.RoadAccident_CreationTime, i.RoadAccident_EndTime, i.RoadAccident_icon_id,i.RoadAccident_Geometry_SWEREF99TM, i.RoadAccident_Geometry_WGS84, i.RoadAccident_SeverityCode);
        
       pool.prep_exec(query,()).expect("Failed to insert Road Accident Data, Pls contact support");

    }
   
}


//pub fn insert_road_data(pool: Pool, road_data_data: Vec<RoadData>)

//Det är ett dåligt namn med det är det trafikverket kallar det så då fick det bli så, 
//men vad den gör är att mata in kordinaterna för en väg
pub fn insert_road_geometry(pool: Pool, road_geometry_data: Vec<RoadGeometry>){

    let mut insert_stmt_geometry = r"INSERT IGNORE INTO `db`.`roads_listed`
        (`road_main_number`, `road_sub_number`)
        VALUES (:road_main_number, :road_sub_number);";

    let mut insert_stmt_prep = pool.prepare(insert_stmt_geometry);
    //println!("SQL: {:?}", insert_stmt_prep);

    for mut stmt in pool.prepare(insert_stmt_geometry).into_iter(){
        for i in road_geometry_data.iter(){
            stmt.execute(params!{
                "road_main_number" => i.road_main_number.clone(),
                "road_sub_number" => i.road_sub_number.clone(),
            }).expect("Failed to insert into roads_listed");
        }
    }
    insert_stmt_geometry = r"INSERT IGNORE INTO `db`.`road_geometry` 
        (`County`, `Deleted`, `Direction.Code`, 
        `Direction.Value`, `Length`, `ModifiedTime`, `RoadMainNumber`, 
        `RoadSubNumber`, `TimeStamp`) 
        VALUES (:county, :deleted, :direction_code, :direction_value, :length, 
            :modified_time, :road_main_number, :road_sub_number, :time_stamp);";

    let mut insert_stmt_prep =  pool.prepare(insert_stmt_geometry);
    //println!("SQL: {:?} ",insert_stmt_prep);
    for mut stmt in pool.prepare(insert_stmt_geometry).into_iter(){
        for i in road_geometry_data.iter(){
            stmt.execute(params!{
                "county" => i.county.clone(),
                "deleted" => i.deleted.clone(),
                "direction_code" => i.direction_code.clone(),
                "direction_value" => i.direction_value.clone(),
                "length" => i.length.clone(),
                "modified_time" => i.modified_time.clone(),
                "road_main_number" => i.road_main_number.clone(),
                "road_sub_number" =>  i.road_sub_number.clone(),
                "time_stamp" => i.time_stamp.clone(),
            
            }).expect("Failed to insert road data geometry");
        }
    }

    insert_stmt_geometry = r"INSERT IGNORE INTO `db`.`road_geometry_geometry` 
        (`RoadMainNumber`, `RoadSubNumber`, `Longitude`, `Latitude`, `RH2000_Altitude`) 
        VALUES (:road_main_number, :road_sub_number, :long, :lat, :alt);
        ";

    let mut insert_stmt_prep =  pool.prepare(insert_stmt_geometry);
    //println!("SQL: {:?} ",insert_stmt_prep);
    for mut stmt in pool.prepare(insert_stmt_geometry).into_iter() { 

        for i in road_geometry_data.iter() {

            //String manupulation to separate the values, 
            //Anledningen till varför du inte kan kedja funktioner som ett vanligt språk, är för att det är rust.
            //Framtida utvecklare får gärna snygga till koden.
            let mut swe_ref = i.WGS843D.clone();
            let mut swe_ref_string:Vec<&str> = swe_ref.split("(").collect();
            let mut swe_ref_string_2:Vec<&str> = swe_ref_string[1].split(")").collect();
            let mut swe_ref_string_3:Vec<&str> = swe_ref_string_2[0].split(", ").collect();
            
            for e in swe_ref_string_3.into_iter(){
                let mut long_lat_alt:Vec<&str> = e.split(" ").collect();
                //println!("WG:  {:?}",e);
                //println!("id: {:?} . swe: {:?}",i.id.clone(), e.clone());
                //println!("SIZE: {:?}",long_lat_alt.capacity());
                if(long_lat_alt.capacity()==4){

                    stmt.execute(params!{
                    
                        "road_main_number" => i.road_main_number.clone(),
                        "road_sub_number" => i.road_sub_number.clone(),
                        "long" => long_lat_alt[0],
                        "lat" => long_lat_alt[1],
                        "alt" => long_lat_alt[2],
                    }).expect("Failed to execute statement when inserting Road DATA Geometry cordinates");

                }
                else{
                    stmt.execute(params!{
                        "road_main_number" => i.road_main_number.clone(),
                        "road_sub_number" => i.road_sub_number.clone(),
                        "long" => long_lat_alt[0],
                        "lat" => long_lat_alt[1],
                        "alt" => "NULL",
                    }).expect("Failed to execute statement when inserting Road DATA Geometry cordinates");
                }   
            }
        }
    } 
}
// Insert the data to MYSQL, TABLE assumed to exist
pub fn insert_station_data(pool: Pool, station_data: Vec<StationData>) {

    let insert_stmt = r"INSERT INTO station_data (id, lat, lon, name, road_number, county_number) 
                                    VALUES (:id, :latitude, :longitude, :name, :road_number, :county_number)
                                    ON DUPLICATE KEY UPDATE lat=:latitude, lon=:longitude, name=:name, road_number=:road_number,
                                    county_number=:county_number;";

    for mut stmt in pool.prepare(insert_stmt).into_iter() { 
        for i in station_data.iter() {
            
            // `execute` takes ownership of `params` so we pass account name by reference.
            stmt.execute(params!{
                "id" => i.id.clone(),
                "latitude" => i.latitude.clone(),
                "longitude" => i.longitude.clone(),
                "name" => i.name.clone(),
                "road_number" => i.road_number.clone(),
                "county_number" => i.county_number.clone(),
            }).expect("Failed to execute statement when reading from station_data");
        }
    }
}

// Insert the Road accident data to MYSQ, TABLE assumed to exist ROAD
pub fn insert_road_accident_data(pool: Pool, road_accident_data: Vec<roadAccidentData>){

    let mut insert_stmt = r"INSERT INTO `db`.`road_geometry` 
        (`County`, `Deleted`, `Direction.Code`, `Direction.Value`, `Length`, 
            `ModifiedTime`, `RoadMainNumber`, `RoadSubNumber`, `TimeStamp`) 
        VALUES (:county, :deleted, :dir_code, :dir_value, _length, 
            :modified_time, :road_main_number, :road_sub_number, :time_stamp);";


    let mut instert_stmt_prep = pool.prepare(insert_stmt);
    //println!("SQL:  {:?}" ,insert_stmt_prep);

    let mut insert_stmt = r"INSERT IGNORE INTO road_accident_data (Id, CreationTime, EndTime, IconId, SWEREF99TM, WGS84, SeverityCode)
                        VALUES(:id, :ctime, :etime, :iid, 
                        :swe, :wg, :scode);";

    let mut insert_stmt_prep = pool.prepare(insert_stmt);
    //println!("SQL:  {:?}" ,insert_stmt_prep);
    for mut stmt in insert_stmt_prep.into_iter() {
        //println!("{:?}: Lenght", road_accident_data.len());
        for i in road_accident_data.iter() {
            
            // `execute` takes ownership of `params` so we pass account name by reference.
            stmt.execute(params!{
                "id" => i.RoadAccident_id.clone(),
                "ctime" => i.RoadAccident_CreationTime.clone(),
                "etime" => i.RoadAccident_EndTime.clone(),
                "iid" => i.RoadAccident_icon_id.clone(),
                "swe" => i.RoadAccident_Geometry_SWEREF99TM.clone(),
                "wg" => i.RoadAccident_Geometry_WGS84.clone(),
                "scode" => i.RoadAccident_SeverityCode.clone(),
            }).expect("Failed to execute statement when reading from road_accident_data");
        }
    }
}

pub fn insert_road_condition_data(pool:Pool, road_condition_data: Vec<RoadCondition>){

    let mut insert_stmt = r"INSERT IGNORE INTO `db`.`road_condition_data` (`cause`, `condition_code`, 
        `condition_info`, `condition_text`, `county_no`, `creator`, `deleted`, `end_time`, 
        `geometry_modified_time`, `icon_id`, `id`, `location_text`, `measurement`, `modified_time`, 
        `road_number`, `road_number_numeric`, `safety_related_message`, `start_time`) 
        VALUES (:cause, :condition_code, :condition_info, :condition_text, :county_no, :creator, 
            :deleted, :end_time, :geometry_modified_time, :icon_id, :id, :location_text, 
            :measurement, :modified_time, :road_number, :road_number_numeric, :safety_related_message, :start_time)
            ON DUPLICATE KEY UPDATE `geometry_modified_time` = :geometry_modified_time;
    ";
   
    let mut insert_stmt_prep = pool.prepare(insert_stmt);
    //println!("SQL STATEMENT: {:?}", insert_stmt_prep);
    for mut stmt in insert_stmt_prep.into_iter(){
        //println!("SQL : {:?}","I for lop");
        for i in road_condition_data.iter(){

            stmt.execute(params!{
                "cause" => i.cause.clone(),
                "condition_code" => i.condition_code.clone(),
                "condition_info" => i.condition_info.clone(), 
                "condition_text" => i.condition_text.clone(),
                "county_no" => i.county_no.clone(),
                "creator" => i.creator.clone(),
                "deleted" => i.deleted.clone(),
                "end_time" => i.end_time.clone(),
                "geometry_modified_time" => i.geometry_modified_time.clone(),
                "icon_id" => i.icon_id.clone(),
                "id" => i.id.clone(),
                "location_text" => i.location_text.clone(),
                "measurement" => i.measurement.clone(),
                "modified_time" => i.modified_time.clone(),
                "road_number" => i.road_number.clone(),
                "road_number_numeric" => i.road_number_numeric.clone(),
                "safety_related_message" => i.safety_related_message.clone(),
                "start_time" => i.start_time.clone(),
            }).expect("Failed to execute statement when inseting Road Conditiond Data");
        }
    }

    insert_stmt = "INSERT IGNORE INTO `db`.`road_condition_geometry` 
    (`road_condition_id`, `SWEREF99TM`) 
    VALUES (:road_condition_id, :swe);";
    
    let mut insert_stmt_prep = pool.prepare(insert_stmt);

   // println!("SQL STATEMENT: {:?}", insert_stmt_prep);

    for mut stmt in insert_stmt_prep.into_iter(){

        for i in road_condition_data.iter(){

            let mut swe_ref = i.SWEREF99TM.clone();
            let mut swe_ref_string:Vec<&str> = swe_ref.split("(").collect();
            let mut swe_ref_string_2:Vec<&str> = swe_ref_string[1].split(")").collect();
            let mut swe_ref_string_3:Vec<&str> = swe_ref_string_2[0].split(", ").collect();

            for e in swe_ref_string_3.into_iter(){
                //println!("id: {:?} . swe: {:?}",i.id.clone(), e.clone());
                stmt.execute(params!{
                    "road_condition_id" => i.id.clone(),
                    "swe" => e.clone(),
                }).expect("Failed to execute statement when inserting Road Condition Geometry");
                //println!("Sweref: {:?}", e);
            }
        }
    }
}

pub fn insert_traffic_flow_data(pool:Pool, traffic_flow_data: Vec<TrafficFlowData>){
//AverageVehicleSpeed, CountyNo, Deleted, Geometry.SWEREF99TM, Geometry.WGS84, MeasurementOrCalculationPeriod, MeasurementSide, MeasurementTime, ModifiedTime, RegionId, SiteId, SpecificLane, VehicleFlowRate, VehicleType
    let insert_stmt = r"INSERT IGNORE INTO `db`.`traffic_flow` 
                        (`AverageVehicleSpeeD`, `CountyNo`, `SWEREF99TM`, `WGS84`,
                         `MeasurementOrCalculationPeriod`, `MeasurementSide`, `MeasurementTime`, 
                         `ModifiedTime`, `RegionId`, `SiteId`, `SpecificLane`, `VehicleFlowRate`, `VehicleType`)
                 VALUES (:speed, :county, :swe, :wg, 
                        :period, :mside, :mtime, 
                        :modtime, :rid, :sid, :slane, :vfr, :vt);";
    
    for mut stmt in pool.prepare(insert_stmt).into_iter() {
        //println!("{:?}:","Loop deapth: 1");
        for i in traffic_flow_data.iter(){
            //println!("{:?}:","Loop deapth: 2");
            stmt.execute(params!{
                "speed" => i.AverageVehicleSpeed.clone(),
                "county" => i.CountyNo.clone(),
                "swe" => i.Geometry_SWEREF99TM.clone(),
                "wg" => i.Geometry_WGS84.clone(),
                "period" => i.MeasurementOrCalculationPeriod.clone(),
                "mside" => i.MeasurementSide.clone(),
                "mtime" => i.MeasurementTime.clone(),
                "modtime" => i.ModifiedTime.clone(),
                "rid" => i.RegionId.clone(),
                "sid" => i.SiteId.clone(),
                "slane" => i.SpecificLane.clone(),
                "vfr" => i.VehicleFlowRate.clone(),
                "vt" => i.VehicleType.clone(),
            }).expect("Failed to execute statement when reading from traffic_flow_data");


        }

    }
    
}
// Insert the data to MYSQL, TABLE assumed to exist
pub fn insert_weather_data(pool: Pool, weather_data: Vec<WeatherData>) {
   
    let insert_stmt = r"INSERT IGNORE INTO weather_data 
                        (station_id, timestamp, air_temperature, road_temperature, precipitation_type, precipitation_millimetres, air_humidity, wind_speed, wind_direction) 
                        VALUES (:station_id, NULLIF(:timestamp, NULL), NULLIF(:air_temperature, ''), NULLIF(:road_temperature, ''),
                        NULLIF(:precipitation_type, '') ,NULLIF(:precipitation_millimetres, ''),
                        NULLIF(:air_humidity, ''), NULLIF(:wind_speed, ''), NULLIF(:wind_direction, ''));";
    
    for mut stmt in pool.prepare(insert_stmt).into_iter() { 
        for i in weather_data.iter() {
            // `execute` takes ownership of `params` so we pass account name by reference.
            stmt.execute(params!{
                "station_id" => i.station_id.clone(),
                "timestamp" => DateTime::<FixedOffset>::parse_from_rfc3339(&i.timestamp.clone()).unwrap().naive_utc(),
                "air_temperature" => i.air_temperature.clone(),
                "road_temperature" => i.road_temperature.clone(),
                "precipitation_type" => i.precipitation_type.clone(),
                "precipitation_millimetres" => i.precipitation_millimetres.clone(),
                "air_humidity" => i.air_humidity.clone(),
                "wind_speed" => i.wind_speed.clone(),
                "wind_direction" => i.wind_direction.clone(),

            }).expect("Failed to execute statement when reading from weather_data");
        }
    }

}
    
// Setup connection to mysql, IMPORTANT! mysql port default is 3306 (consider to change for security)
pub fn get_opts(user: &str, pass: &str, addr: &str, database: &str) -> Opts {
    let pass: String = ::std::env::var(pass).unwrap_or(pass.to_string());
    let port: u16 = ::std::env::var("3306").ok().map(|my_port| my_port.parse().ok().unwrap_or(3306)).unwrap_or(3306);

    let mut builder = OptsBuilder::default();
    
    builder.user(Some(user)) 
            .pass(Some(pass))
            .ip_or_hostname(Some(addr))
            .tcp_port(port)
            .db_name(Some(database));
    builder.into()
    
}

// Create the tables, only for new db!
pub fn create_mysql_tables(pool: Pool) {

    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS`db`.`road_condition_data` (
        `cause` VARCHAR(45) NULL,
        `condition_code` VARCHAR(45) NULL,
        `condition_info` VARCHAR(45) NULL,
        `condition_text` VARCHAR(45) NULL,
        `county_no` VARCHAR(45) NULL,
        `creator` VARCHAR(45) NULL,
        `deleted` VARCHAR(45) NULL,
        `end_time` VARCHAR(45) NULL,
        `geometry_modified_time` VARCHAR(45) NULL,
        `icon_id` VARCHAR(45) NULL,
        `id` VARCHAR(45) NOT NULL,
        `location_text` VARCHAR(45) NULL,
        `measurement` VARCHAR(45) NULL,
        `modified_time` VARCHAR(45) NULL,
        `road_number` VARCHAR(45) NULL,
        `road_number_numeric` VARCHAR(45) NULL,
        `safety_related_message` VARCHAR(45) NULL,
        `start_time` VARCHAR(45) NOT NULL,
        `warning` VARCHAR(45) NULL,
        PRIMARY KEY (`id`, `start_time`));
      ", ()).expect("Failed to create table: Road Condition");

    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS `db`.`road_condition_geometry` (
        `id` INT(11) NOT NULL AUTO_INCREMENT,
        `road_condition_id` VARCHAR(45) NULL,
        `SWEREF99TM` VARCHAR(45) NULL,
        `WGS84` VARCHAR(45) NULL,
        PRIMARY KEY (`id`));
      ", ()).expect("Failed to create table Road Condition Geometry");
    
    //This checks for en certain index, 1 == exists, 0 == does not exists.  
    let mut result =  pool.prep_exec(r"SELECT COUNT(1) IndexIsThere FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE table_schema=DATABASE() AND table_name='road_condition_geometry' 
        AND index_name='road_condition_id_idx';",()).unwrap();

    let val = match result.next().unwrap().unwrap()[0] {
        mysql::Value::Int(i) => i,
        _ => 0,
    };
   //If the Foreing Key exists this setup query does not run. 
   if(val == 0){
    pool.prep_exec(r#"
        SET @x := (SELECT COUNT(1) IndexIsThere FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema=DATABASE() AND table_name='road_condition_geometry' AND index_name='road_condition_id_idx');
        SET @sql := if( @x > 0, 'select ''Index exists. ''', 'ALTER TABLE `db`.`road_condition_geometry` 
        ADD INDEX `road_condition_id_idx` (`road_condition_id` ASC) VISIBLE;
        ALTER TABLE `db`.`road_condition_geometry` 
        ADD CONSTRAINT `road_condition_id`
        FOREIGN KEY (`road_condition_id`)
        REFERENCES `db`.`road_condition_data` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;'); 
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        
        "#,()).expect("Failed to create Foreign Key to Road Condition Geometry");
}
    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS station_data (
                        id VARCHAR(50) NOT NULL,
                        lat DECIMAL(10, 8) DEFAULT NULL,
                        lon DECIMAL(11, 8) DEFAULT NULL,
                        name VARCHAR(30) DEFAULT NULL,
                        road_number INT(10) DEFAULT NULL,
                        county_number INT(10) DEFAULT NULL,
                        PRIMARY KEY (id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;", ()).expect("Failed to create table: station_data");
    
    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS weather_data (
                    id INT NOT NULL AUTO_INCREMENT,
                    station_id VARCHAR(50) DEFAULT NULL,
                    timestamp TIMESTAMP NULL DEFAULT NULL,
                    road_temperature FLOAT DEFAULT NULL,
                    precipitation_type VARCHAR(10) DEFAULT NULL,
                    precipitation_millimetres FLOAT DEFAULT NULL,
                    air_temperature FLOAT DEFAULT NULL,
                    air_humidity FLOAT DEFAULT NULL,
                    wind_speed FLOAT DEFAULT NULL,
                    wind_direction VARCHAR(10) DEFAULT NULL,
                    PRIMARY KEY (id, timestamp),
                    KEY station_id (station_id),
                    FOREIGN KEY (station_id) REFERENCES station_data (id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;", ()).expect("Failed to create table: weather_data");
    
    pool.prep_exec(r"create table if not exists friction_data 
    (
        Id                   int         not null
            primary key,
        ObservationTimeUTC   timestamp   null,
        ReportTimeUTC        timestamp   null,
        Longitude            decimal(15, 13)        null,
        Latitude             decimal(15, 13)        null,
        AreaCode             int         null,
        NumberOfMeasurements int         null,
        MeasureValue         decimal(12, 10)        null,
        MeasureConfidence    int         null,
        ReporterOrganization varchar(50) null
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;", ()).expect("Failed to create table: friction_data");
    
    //Grabben är lurig fixa så den itne skapar index om det redan finns
    //let mut result =
    //pool.prep_exec("ALTER TABLE aggregated_friction_data ADD INDEX (Time, TimeAggregation, Longitude, Latitude, Radius, MeasureValueMin);",()).expect("Failed to create index: aggregated_friction_data_Time_MULTI_index ");

    pool.prep_exec(r#"CREATE TABLE IF NOT EXISTS road_accident_data (
        `Id` VARCHAR(32) NOT NULL,
        `CreationTime` VARCHAR(45) NULL,
        `EndTime` VARCHAR(45) NULL,
        `IconId` VARCHAR(45) NULL,
        `SWEREF99TM` VARCHAR(45) NULL,
        `WGS84` VARCHAR(45) NULL,
        `SeverityCode` VARCHAR(45) NULL,
        PRIMARY KEY (`Id`, `CreationTime`))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;;"#,()).expect("Failed to create table: road_accident_data");
    
        pool.prep_exec(r"create table if not exists reporter_organizations
    (
        ReporterOrganization varchar(255) not null
            primary key
    );",()).expect("Failed to create table: friction_data");

    pool.prep_exec(r"create table if not exists aggregated_friction_data
    (
        Id                      int auto_increment
            primary key,
        Time                    timestamp   not null,
        TimeAggregation         int         not null,
        Distance                  int         not null,
        ReporterOrganization    varchar(50) not null,
        Longitude               decimal(15,13) not null,
        Latitude                decimal(15, 13) not null,
        NumberOfMeasurements    int         null,
        MeasureValueMedian      float       null,
        MeasureValueMax         float       null,
        MeasureValueMin         float       null,
        MeasureConfidenceMedian float       null,
        MeasureConfidenceMax    float       null,
        MeasureConfidenceMin    float       null,
        NrOfAddedPoints         int         null
    );",()).expect("Failed to create table aggregated friction data");

    //Grabben är lurig FIXA, TODO 
    let mut result = pool.prep_exec("SELECT COUNT(1) IndexIsThere FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_schema=DATABASE() AND table_name='aggregated_friction_data' 
    AND index_name='aggregated_friction_data_Time_MULTI_index';",()).unwrap();

    let val = match result.next().unwrap().unwrap()[0] {
        mysql::Value::Int(i) => i,
        _ => 0,
    };

    if(val == 6){
        pool.prep_exec("ALTER TABLE aggregated_friction_data ADD INDEX (Time, TimeAggregation, Longitude, Latitude, Radius, MeasureValueMin);",()).expect("Failed to create index: aggregated_friction_data_Time_MULTI_index ");

    }
    //pool.prep_exec("ALTER TABLE aggregated_friction_data ADD INDEX (Time, TimeAggregation, Longitude, Latitude, Radius, MeasureValueMin);",()).expect("Failed to create index: aggregated_friction_data_Time_MULTI_index ");
    
    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS camera_data (
                    id INT(8) NOT NULL,
                    time TIMESTAMP NULL DEFAULT NULL,
                    lat DECIMAL(10, 8) DEFAULT NULL,
                    lon DECIMAL(11, 8) DEFAULT NULL,
                    name VARCHAR(30) DEFAULT NULL,
                    station_id VARCHAR(50) DEFAULT NULL,
                    url TEXT DEFAULT NULL,
                    url_thumb TEXT DEFAULT NULL,
                    PRIMARY KEY (id, time)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;", ()).expect("Failed to create table: camera_data");


    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS traffic_flow (
        `AverageVehicleSpeed` VARCHAR(45) NULL,
        `CountyNo` VARCHAR(45) NULL,
        `Deleted` VARCHAR(45) NULL,
        `Geometry.SWEREF99TM` VARCHAR(45) NULL,
        `Geometry.WGS84` VARCHAR(45) NULL,
        `MeasurementOrCalculationPeriod` VARCHAR(45) NULL,
        `MeasurementSide` VARCHAR(45) NULL,
        `MeasurementTime` VARCHAR(45) NOT NULL,
        `ModifiedTime` VARCHAR(45) NULL,
        `RegionId` VARCHAR(45) NULL,
        `SiteId` VARCHAR(45) NOT NULL,
        `SpecificLane` VARCHAR(45) NULL,
        `VehicleFlowRate` VARCHAR(45) NULL,
        `VehicleType` VARCHAR(45) NOT NULL,
        PRIMARY KEY (`MeasurementTime`, `SiteId`, `VehicleType`)
        )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;", ()).expect("Failed to create table: traffic_flow");

    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS `db`.`road_geometry` (
        `County` VARCHAR(45) NULL,
        `Deleted` VARCHAR(45) NULL,
        `Direction.Code` VARCHAR(45) NULL,
        `Direction.Value` VARCHAR(45) NULL,
        `Length` VARCHAR(45) NULL,
        `ModifiedTime` VARCHAR(45) NULL,
        `RoadMainNumber` VARCHAR(45) NULL,
        `RoadSubNumber` VARCHAR(45) NULL,
        `TimeStamp` VARCHAR(45) NULL,
        PRIMARY KEY (`RoadMainNumber`, `RoadSubNumber`));",());


    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS`db`.`road_data` (
        `road_data_id` INT NOT NULL AUTO_INCREMENT,
        `AADDT` VARCHAR(45) NULL,
        `AADTHeavyVehicles` VARCHAR(45) NULL,
        `AADTMeasurementMethod.Code` VARCHAR(45) NULL,
        `AADTMeasurementMethod.Value` VARCHAR(45) NULL,
        `AADTMeasurementYear` VARCHAR(45) NULL,
        `BearingCapacity.Code` VARCHAR(45) NULL,
        `BearingCapacity.Value` VARCHAR(45) NULL,
        `County` VARCHAR(45) NULL,
        `Deleted` VARCHAR(45) NULL,
        `Direction.Code` VARCHAR(45) NULL,
        `Direction.Value` VARCHAR(45) NULL,
        `EndContinuousLength` VARCHAR(45) NULL,
        `LaneDescription` VARCHAR(45) NULL,
        `Length` VARCHAR(45) NULL,
        `ModifiedTime` VARCHAR(45) NULL,
        `RoadCategory.Code` VARCHAR(45) NULL,
        `RoadCategory.Value` VARCHAR(45) NULL,
        `RoadConstruction2009` VARCHAR(45) NULL,
        `RoadMainNumber` VARCHAR(45) NULL,
        `RoadOwner.Code` VARCHAR(45) NULL,
        `RoadOwner.Value` VARCHAR(45) NULL,
        `RoadSubNumber` VARCHAR(45) NULL,
        `RoadType.Code` VARCHAR(45) NULL,
        `RoadType.Value` VARCHAR(45) NULL,
        `RoadWidth` VARCHAR(45) NULL,
        `SpeedLimit` VARCHAR(45) NULL,
        `StartContinuousLength` VARCHAR(45) NULL,
        `TimeStamp` VARCHAR(45) NULL,
        `WearLayer` VARCHAR(45) NULL,
        `Winter2003.Code` VARCHAR(45) NULL,
        `Winter2003.Value` VARCHAR(45) NULL,
        PRIMARY KEY (`road_data_id`));
      ",());

    pool.prep_exec(r"CREATE TABLE IF NOT EXISTS`db`.`road_geometry_geometry` (
        `Longitude` VARCHAR(45) NULL,
        `Latitude` VARCHAR(45) NULL,
        `RH2000_Altitude` VARCHAR(45) NULL,
        `WGS` VARCHAR(45) NULL,
        `RoadMainNumber` VARCHAR(45) NULL,
        `RoadSubNumber` VARCHAR(45) NULL,
        PRIMARY KEY (`RoadMainNumber`, `RoadSubNumber`));",());



    let mut result =  pool.prep_exec(r"SELECT COUNT(1) IndexIsThere FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE table_schema=DATABASE() AND table_name='road_geometry_geometry' 
        AND index_name='road_id';",()).unwrap();

    let val = match result.next().unwrap().unwrap()[0] {
        mysql::Value::Int(i) => i,
        _ => 0,
    };

    if (val == 2){
        pool.prep_exec(r"ALTER TABLE `db`.`road_geometry_geometry` 
        ADD CONSTRAINT `raod_id`
          FOREIGN KEY (`RoadMainNumber` , `RoadSubNumber`)
          REFERENCES `db`.`road_geometry` (`RoadMainNumber` , `RoadSubNumber`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION;",());
    }
   

}

    

/*
DELIMITER $$
CREATE PROCEDURE LoopDemo()
BEGIN
	DECLARE x  INT;
	DECLARE str  VARCHAR(255);
	set @diff = 0.01;
	SET x = 1;
	SET str =  '';
        
	loop_label:  LOOP
    SET x = (SELECT  COUNT(*) FROM db.friction_data WHERE(RoadSubNumber = 0 AND RoadMainNumber = 0));
		IF  x = 0 THEN 
			LEAVE  loop_label;
		END  IF;
		SET @long_f = 0;
        SET @lat_f = 0;
        SELECT Longitude, Latitude INTO @long_f, @lat_f From db.friction_data WHERE(RoadMainNumber = 0) Limit 1;
        DROP TABLE IF EXISTS small_area;
        CREATE TEMPORARY TABLE IF NOT exists small_area (SELECT * FROM db.friction_data WHERE(ABS(Longitude - @long_f) < @diff AND ABS(Latitude -@lat_f)< @diff));
        DROP TABLE IF EXISTS large_large;
        CREATE TEMPORARY TABLE large_area (SELECT * FROM db.road_geometry_geometry WHERE(ABS(Longitude - @long_f) < @diff*2 AND ABS(Latitude -@lat_f)< @diff*2));
		SET @it =0;	
        loop_2_lable: loop
			SET @long_i = 0;
			SET @lat_i = 0;
            SET @id_f = NULL;
			SELECT Longitude, Latitude,Id INTO @long_i, @Lat_i, @id_f FROM small_area LIMIT @it,1;
			DROP TABLE IF EXISTS diff_tb;
			/*ss*/
			CREATE TEMPORARY TABLE diff_tb SELECT (SQRT(POW(Latitude-@long_i,2)+ POW(Longitude-@lat_i,2)) ) as diff,RoadMainNumber as RoadMainNumber,RoadSubNumber as RoadSubNumber FROM large_area;
			CREATE TEMPORARY TABLE diff_temp_tb SELECT * FROM diff_tb;
            SELECT MIN(diff) FROM diff_tb;

            SET @RM = NULL;
            SET @RS = NULL;
            
            SELECT RoadMainNumber, RoadSubNumber INTO @RM, @RS FROM diff_temp_tb WHERE diff = (SELECT MIN(diff) FROM diff_tb) limit 1;
        
			UPDATE db.friction_data SET RoadMainNumber = @RM, RoadSubNumber=@RS where Id = @id_f;
        SET @i = i +1;
        end loop;
	
	END LOOP;
	SELECT str;
END$$

DELIMITER ;



*/

pub const URL_S: &'static str = "https://datex.trafikverket.se/D2ClientPull/MetaDataBA/2_3/WeatherMetaData";
pub const URL_W: &'static str = "https://datex.trafikverket.se/D2ClientPull/WeatherPullServerBA/2_3/Weather";
pub const URL_C: &'static str = "https://datex.trafikverket.se/D2ClientPull/MetaDataBA/2_3/RoadConditionCamera";
//Dessa URL;er är givna från trafikverket från sitt egna projekt, ifall ni ska ha annan data så frå ni gå via 
//Trafikverkets Api DATEX II, Info om hur ni gör det finns på deras hemsida. 

pub const USER_DATEX: &'static str = "LTU";
pub const PASS_DATEX: &'static str = "DatexLTU2018#";
//DatexLTU2020#
// Dessa lösen är enbart till de tre länkarna ovan, de fungera ej någon annanstans. Rekomenderat att ni gör ett eget
//Konto på Trafikverket för API;et


pub const USER_DB: &'static str = "mysql";
pub const PASS_DB: &'static str = "password";
pub const ADDR_DB: &'static str = "127.0.0.1";
pub const NAME_DB: &'static str = "db";


//pub const USER_DB: &'static str = "rcm";
//pub const PASS_DB: &'static str = "uwqodh2819";
//pub const ADDR_DB: &'static str = "rcm-db.chzfmtvm6lcl.us-east-1.rds.amazonaws.com";
//pub const NAME_DB: &'static str = "db";

/*road_geometry_geometry_id, RoadMainNumber, RoadSubNumber, WGS, Longitude, Latitude, RH2000_Altitude;*/

//id, County, Deleted, Direction.Code, Direction.Value, Length, ModifiedTime, RoadMainNumber, RoadSubNumber, TimeStamp


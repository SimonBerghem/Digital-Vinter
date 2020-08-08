CREATE PROCEDURE `new_procedure` ()
BEGIN
SET @lon = NULL;
SET @lat = NULL;
SET @Station_name = "Sandsjöbacka";
SELECT Lon, Lat into @lon, @lat FROM station_data where name = @Station_name;
DROP TABLE  IF EXISTS f_over_time; 
CREATE TEMPORARY TABLE f_over_time SELECT CAST(ObservationTimeUTC as DATE) as time_measured, MeasureValue as friction , NumberOfMeasurements FROM db.friction_data where MeasureValue is not null and SQRT(POWER((Longitude - @lon),2)+POWER((Latitude-@lat),2))<0.05 ORDER by ObservationTimeUTC ASC;
SELECT * FROM f_over_time;
END

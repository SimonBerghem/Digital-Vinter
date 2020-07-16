DELIMITER $$
CREATE PROCEDURE LoopDemo()
BEGIN
	SET @x = 1; 
	set @diff = 0.01;
	SET @x = 1;
	SET @str =  '';
        
	loop_label:  LOOP
    (SELECT  COUNT(*) INTO @x FROM db.friction_data WHERE(RoadSubNumber = 0 AND RoadMainNumber = 0));
		IF  x = 0 THEN 
			LEAVE  loop_label;
		END  IF;
		SET @long_f = 0;
        SET @lat_f = 0;
        SELECT Longitude, Latitude INTO @long_f, @lat_f From db.friction_data WHERE(RoadMainNumber = 0) Limit 1;
        DROP TABLE IF EXISTS small_area;
        CREATE TEMPORARY TABLE IF NOT exists small_area (SELECT * FROM db.friction_data WHERE(ABS(Longitude - @long_f) < @diff AND ABS(Latitude -@lat_f)< @diff));
        DROP TABLE IF EXISTS large_area;
        CREATE TEMPORARY TABLE large_area (SELECT * FROM db.road_geometry_geometry WHERE(ABS(Longitude - @long_f) < @diff*2 AND ABS(Latitude -@lat_f)< @diff*2));
        
        loop_2_lable: loop
			SET @long_i = 0;
			SET @lat_i = 0;
            SET @id_f = NULL;
			SELECT Longitude, Latitude,Id INTO @long_i, @Lat_i, @id_f FROM small_area WHERE RoadMainNumber > 0 LIMIT 1;
			DROP TABLE IF EXISTS diff_tb;
			/*ss*/
			CREATE TEMPORARY TABLE diff_tb SELECT (SQRT(POW(Latitude-@long_i,2)+ POW(Longitude-@lat_i,2)) ) as diff,RoadMainNumber as RoadMainNumber,RoadSubNumber as RoadSubNumber FROM large_area;
			DROP TABLE IF EXISTS diff_temp_tb;
            CREATE TEMPORARY TABLE diff_temp_tb SELECT * FROM diff_tb;
            SELECT MIN(diff) FROM diff_tb;

            SET @RM = NULL;
            SET @RS = NULL;
            
            SELECT RoadMainNumber, RoadSubNumber INTO @RM, @RS FROM diff_temp_tb WHERE diff = (SELECT MIN(diff) FROM diff_tb) limit 1;
        
			UPDATE db.friction_data SET RoadMainNumber = @RM, RoadSubNumber=@RS where Id = @id_f;
            SET SQL_SAFE_UPDATES = 0;
            UPDATE small_area SET RoadMainNumber = @RM, RoadSubNumber=@RS where Id = @id_f;
            SET SQL_SAFE_UPDATES = 1;
            SET @done = 1;
            SELECT COUNT(*) INTO @done FROM small_area Where RoadMainNumber > 1;
            IF @done = 0 THEN
				LEAVE loop_2_lable;
			END IF;
            
			END loop;
				
	END LOOP;
	SELECT str;
END$$

DELIMITER ;
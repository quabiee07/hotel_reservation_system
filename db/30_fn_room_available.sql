-- COMP214 — Advanced Database Concepts
-- Term Project: Hotel Reservation System
-- File: 30_fn_room_available.sql

SET SERVEROUTPUT ON;
SELECT USER AS connected_as, SYSDATE AS run_on FROM dual;

CREATE FUNCTION fn_room_available
  (p_room_id IN rooms.room_id%TYPE,
  p_in IN reservations.check_in_date%TYPE,
  p_out IN reservations.check_out_date%TYPE,
  p_exclude_id IN reservations.reservation_id%TYPE DEFAULT NULL)
  RETURN CHAR
IS 
  v_room_exists NUMBER := 0;
  v_cnt NUMBER := 0;
BEGIN
  IF p_in IS NULL OR p_out IS NULL OR p_out <= p_in THEN
    RAISE_APPLICATION_ERROR(-20002, 'Invalid date range.');
  END IF;
  
  SELECT COUNT(*) INTO v_room_exists
  FROM rooms
  WHERE room_id = p_room_id;

  IF v_room_exists = 0 THEN
    RAISE_APPLICATION_ERROR(-20001, 'Room ' || p_room_id || ' does not exist.');
  END IF;

  SELECT COUNT(*) 
  INTO v_cnt
  FROM reservations
  WHERE room_id = p_room_id
    AND status IN ('BOOKED', 'CHECKED_IN')
    AND p_in < check_out_date
    AND p_out > check_in_date
    AND (p_exclude_id IS NULL OR reservation_id <> p_exclude_id);

  IF v_cnt > 0 THEN
    RETURN 'N';
  ELSE
    RETURN 'Y';
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END fn_room_available;
/

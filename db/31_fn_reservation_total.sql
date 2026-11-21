-- COMP214 — Advanced Database Concepts
-- Term Project: Hotel Reservation System
-- File: 31_fn_reservation_total.sql

SET SERVEROUTPUT ON;
SELECT USER AS connected_as, SYSDATE AS run_on FROM dual;

CREATE FUNCTION fn_reservation_total
  (p_reservation_id IN reservations.reservation_id%TYPE)
  RETURN NUMBER
IS 
  v_room_cost NUMBER := 0;
  v_services NUMBER := 0;
BEGIN
  SELECT (TRUNC(r.check_out_date) - TRUNC(r.check_in_date)) * rt.base_rate
  INTO v_room_cost
  FROM reservations r
    JOIN rooms rm ON rm.room_id = r.room_id
    JOIN room_types rt ON rt.room_type_id = rm.room_type_id
  WHERE r.reservation_id = p_reservation_id;

  SELECT NVL(SUM(rs.price * rs.quantity), 0)
  INTO v_services
  FROM reservation_services rs
  WHERE rs.reservation_id = p_reservation_id;

  RETURN v_room_cost + v_services;

EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20003, 'Reservation ' || p_reservation_id || ' was not found.');
  WHEN OTHERS THEN
    RAISE;
END fn_reservation_total;
/
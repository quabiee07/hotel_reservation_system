-- COMP214 — Advanced Database Concepts
-- Term Project: Hotel Reservation System
-- File: 03_indexes.sql

SET SERVEROUTPUT ON;
SELECT USER AS connected_as, SYSDATE AS run_on FROM dual;

CREATE INDEX idx_res_dates
    ON reservations (check_in_date, check_out_date);

CREATE INDEX idx_res_guest
    ON reservations (guest_id);

CREATE INDEX idx_res_room_status
    ON reservations (room_id, status);





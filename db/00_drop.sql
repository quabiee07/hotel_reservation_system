-- COMP214 — Advanced Database Concepts
-- Term Project: Hotel Reservation System
-- File: 00_drop.sql


SET SERVEROUTPUT ON;
SELECT USER AS connected_as, SYSDATE AS run_on FROM dual;


-- Triggers
DROP TRIGGER trg_reservations_audit;
DROP TRIGGER trg_room_status_log;

-- Package
DROP PACKAGE pkg_hotel;

-- Standalone procedures and functions
DROP PROCEDURE sp_book_reservation;
DROP PROCEDURE sp_process_checkouts;
DROP FUNCTION  fn_room_available;
DROP FUNCTION  fn_reservation_total;

-- Child tables before parents tables
DROP TABLE audit_log            CASCADE CONSTRAINTS;
DROP TABLE housekeeping_log     CASCADE CONSTRAINTS;
DROP TABLE payments             CASCADE CONSTRAINTS;
DROP TABLE reservation_services CASCADE CONSTRAINTS;
DROP TABLE reservations         CASCADE CONSTRAINTS;
DROP TABLE services             CASCADE CONSTRAINTS;
DROP TABLE guests               CASCADE CONSTRAINTS;
DROP TABLE rooms                CASCADE CONSTRAINTS;
DROP TABLE room_types           CASCADE CONSTRAINTS;

-- Sequences
DROP SEQUENCE seq_room_type;
DROP SEQUENCE seq_room;
DROP SEQUENCE seq_guest;
DROP SEQUENCE seq_reservation;
DROP SEQUENCE seq_payment;
DROP SEQUENCE seq_res_service;
DROP SEQUENCE seq_audit;
DROP SEQUENCE seq_housekeeping;

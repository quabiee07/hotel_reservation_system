-- COMP214 — Advanced Database Concepts
-- Term Project: Hotel Reservation System
-- File: 01_tables.sql

SET SERVEROUTPUT ON;
SELECT USER AS connected_as, SYSDATE AS run_on FROM dual;

-- room_types (lookup)
CREATE TABLE room_types (
    room_type_id   NUMBER          CONSTRAINT pk_room_types PRIMARY KEY,
    type_name      VARCHAR2(50)    CONSTRAINT nn_room_types_name NOT NULL
                                   CONSTRAINT uq_room_types_name UNIQUE,
    base_rate      NUMBER(8,2)     CONSTRAINT nn_room_types_rate NOT NULL
                                   CONSTRAINT ck_room_types_rate CHECK (base_rate > 0),
    max_occupancy  NUMBER(2)       CONSTRAINT nn_room_types_occ NOT NULL
                                   CONSTRAINT ck_room_types_occ CHECK (max_occupancy BETWEEN 1 AND 6),
    description    VARCHAR2(200)
);

-- rooms
CREATE TABLE rooms (
    room_id        NUMBER          CONSTRAINT pk_rooms PRIMARY KEY,
    room_number    VARCHAR2(10)    CONSTRAINT nn_rooms_number NOT NULL
                                   CONSTRAINT uq_rooms_number UNIQUE,
    room_type_id   NUMBER          CONSTRAINT nn_rooms_type NOT NULL
                                   CONSTRAINT fk_rooms_type REFERENCES room_types (room_type_id),
    floor          NUMBER(2)       CONSTRAINT nn_rooms_floor NOT NULL
                                   CONSTRAINT ck_rooms_floor CHECK (floor BETWEEN 1 AND 20),
    status         VARCHAR2(15)    DEFAULT 'AVAILABLE'
                                   CONSTRAINT nn_rooms_status NOT NULL
                                   CONSTRAINT ck_rooms_status CHECK (status IN ('AVAILABLE','OCCUPIED','MAINTENANCE')),
    notes          VARCHAR2(200)
);

-- guests
CREATE TABLE guests (
    guest_id       NUMBER          CONSTRAINT pk_guests PRIMARY KEY,
    first_name     VARCHAR2(50)    CONSTRAINT nn_guests_first NOT NULL,
    last_name      VARCHAR2(50)    CONSTRAINT nn_guests_last NOT NULL,
    email          VARCHAR2(120)   CONSTRAINT nn_guests_email NOT NULL
                                   CONSTRAINT uq_guests_email UNIQUE,
    phone          VARCHAR2(20),
    loyalty_tier   VARCHAR2(10)    DEFAULT 'NONE'
                                   CONSTRAINT nn_guests_tier NOT NULL
                                   CONSTRAINT ck_guests_tier CHECK (loyalty_tier IN ('NONE','SILVER','GOLD')),
    created_at     DATE            DEFAULT SYSDATE
                                   CONSTRAINT nn_guests_created NOT NULL
);

-- services (lookup, add-ons with a price)
CREATE TABLE services (
    service_id     NUMBER          CONSTRAINT pk_services PRIMARY KEY,
    service_name   VARCHAR2(60)    CONSTRAINT nn_services_name NOT NULL
                                   CONSTRAINT uq_services_name UNIQUE,
    price          NUMBER(8,2)     CONSTRAINT nn_services_price NOT NULL
                                   CONSTRAINT ck_services_price CHECK (price >= 0),
    active_flag    CHAR(1)         DEFAULT 'Y'
                                   CONSTRAINT nn_services_active NOT NULL
                                   CONSTRAINT ck_services_active CHECK (active_flag IN ('Y','N'))
);

-- reservations (the main table)
CREATE TABLE reservations (
    reservation_id     NUMBER          CONSTRAINT pk_reservations PRIMARY KEY,
    confirmation_code  VARCHAR2(20)    CONSTRAINT uq_reservations_code UNIQUE,
    guest_id           NUMBER          CONSTRAINT nn_reservations_guest NOT NULL
                                       CONSTRAINT fk_reservations_guest REFERENCES guests (guest_id),
    room_id            NUMBER          CONSTRAINT nn_reservations_room NOT NULL
                                       CONSTRAINT fk_reservations_room REFERENCES rooms (room_id),
    check_in_date      DATE            CONSTRAINT nn_reservations_in NOT NULL,
    check_out_date     DATE            CONSTRAINT nn_reservations_out NOT NULL,
    adults             NUMBER(2)       DEFAULT 1
                                       CONSTRAINT nn_reservations_adults NOT NULL
                                       CONSTRAINT ck_reservations_adults CHECK (adults >= 1),
    children           NUMBER(2)       DEFAULT 0
                                       CONSTRAINT ck_reservations_children CHECK (children >= 0),
    status             VARCHAR2(15)    DEFAULT 'BOOKED'
                                       CONSTRAINT nn_reservations_status NOT NULL
                                       CONSTRAINT ck_reservations_status CHECK (status IN ('BOOKED','CHECKED_IN','CHECKED_OUT','CANCELLED')),
    total_amount       NUMBER(10,2)    DEFAULT 0
                                       CONSTRAINT nn_reservations_total NOT NULL
                                       CONSTRAINT ck_reservations_total CHECK (total_amount >= 0),
    created_at         DATE            DEFAULT SYSDATE
                                       CONSTRAINT nn_reservations_created NOT NULL,
    -- check-out has to be after check-in
    CONSTRAINT ck_reservations_dates CHECK (check_out_date > check_in_date)
);

-- reservation_services (extras added to a stay)
CREATE TABLE reservation_services (
    res_service_id  NUMBER         CONSTRAINT pk_res_services PRIMARY KEY,
    reservation_id  NUMBER         CONSTRAINT nn_res_services_res NOT NULL
                                   CONSTRAINT fk_res_services_res REFERENCES reservations (reservation_id) ON DELETE CASCADE,
    service_id      NUMBER         CONSTRAINT nn_res_services_svc NOT NULL
                                   CONSTRAINT fk_res_services_svc REFERENCES services (service_id),
    quantity        NUMBER(3)      DEFAULT 1
                                   CONSTRAINT nn_res_services_qty NOT NULL
                                   CONSTRAINT ck_res_services_qty CHECK (quantity > 0),
    service_date    DATE           CONSTRAINT nn_res_services_date NOT NULL,
    -- same service can't be billed twice on the same day
    CONSTRAINT uq_res_services_line UNIQUE (reservation_id, service_id, service_date)
);

-- payments
CREATE TABLE payments (
    payment_id      NUMBER         CONSTRAINT pk_payments PRIMARY KEY,
    reservation_id  NUMBER         CONSTRAINT nn_payments_res NOT NULL
                                   CONSTRAINT fk_payments_res REFERENCES reservations (reservation_id),
    amount          NUMBER(10,2)   CONSTRAINT nn_payments_amount NOT NULL
                                   CONSTRAINT ck_payments_amount CHECK (amount > 0),
    method          VARCHAR2(10)   CONSTRAINT nn_payments_method NOT NULL
                                   CONSTRAINT ck_payments_method CHECK (method IN ('CASH','CARD','TRANSFER')),
    paid_at         DATE           DEFAULT SYSDATE
                                   CONSTRAINT nn_payments_paid NOT NULL,
    reference_note  VARCHAR2(100)
);

-- housekeeping_log (filled by the room status trigger)
CREATE TABLE housekeeping_log (
    log_id      NUMBER          CONSTRAINT pk_hk_log PRIMARY KEY,
    room_id     NUMBER          CONSTRAINT nn_hk_log_room NOT NULL
                                CONSTRAINT fk_hk_log_room REFERENCES rooms (room_id),
    old_status  VARCHAR2(15),
    new_status  VARCHAR2(15)    CONSTRAINT nn_hk_log_new NOT NULL,
    changed_at  DATE            DEFAULT SYSDATE
                                CONSTRAINT nn_hk_log_changed NOT NULL,
    changed_by  VARCHAR2(30)    DEFAULT USER
                                CONSTRAINT nn_hk_log_by NOT NULL
);

-- audit_log (filled by the reservations audit trigger)
-- no foreign key on record_id on purpose, the log has to outlive deleted rows
CREATE TABLE audit_log (
    log_id      NUMBER          CONSTRAINT pk_audit_log PRIMARY KEY,
    table_name  VARCHAR2(30)    CONSTRAINT nn_audit_table NOT NULL,
    action      VARCHAR2(10)    CONSTRAINT nn_audit_action NOT NULL
                                CONSTRAINT ck_audit_action CHECK (action IN ('INSERT','UPDATE','DELETE')),
    record_id   NUMBER          CONSTRAINT nn_audit_record NOT NULL,
    old_value   VARCHAR2(400),
    new_value   VARCHAR2(400),
    changed_by  VARCHAR2(30)    DEFAULT USER
                                CONSTRAINT nn_audit_by NOT NULL,
    changed_at  DATE            DEFAULT SYSDATE
                                CONSTRAINT nn_audit_changed NOT NULL
);


-- COMP214 — Advanced Database Concepts
-- Term Project: Hotel Reservation System
-- File: 10_trg_audit.sql

SET SERVEROUTPUT ON;
SELECT USER AS connected_as, SYSDATE AS run_on FROM dual;


CREATE OR REPLACE TRIGGER trg_reservations_audit
AFTER INSERT OR UPDATE OR DELETE ON reservations
FOR EACH ROW
DECLARE
    v_action    VARCHAR2(10);
    v_record_id NUMBER;
    v_old       VARCHAR2(400);
    v_new       VARCHAR2(400);
BEGIN
    IF INSERTING THEN
        v_action    := 'INSERT';
        v_record_id := :NEW.reservation_id;
        v_old       := NULL;
        v_new       := 'guest='  || :NEW.guest_id  ||
                       ',room='  || :NEW.room_id   ||
                       ',in='    || TO_CHAR(:NEW.check_in_date,'YYYY-MM-DD') ||
                       ',out='   || TO_CHAR(:NEW.check_out_date,'YYYY-MM-DD') ||
                       ',status='|| :NEW.status;
    ELSIF UPDATING THEN
        v_action    := 'UPDATE';
        v_record_id := :NEW.reservation_id;
        v_old       := 'status=' || :OLD.status || ',total=' || :OLD.total_amount;
        v_new       := 'status=' || :NEW.status || ',total=' || :NEW.total_amount;
    ELSE
        v_action    := 'DELETE';
        v_record_id := :OLD.reservation_id;
        v_old       := 'guest=' || :OLD.guest_id || ',room=' || :OLD.room_id ||
                       ',status='|| :OLD.status;
        v_new       := NULL;
    END IF;

    INSERT INTO audit_log (
        log_id, table_name, action, record_id,
        old_value, new_value, changed_by, changed_at
    ) VALUES (
        seq_audit.NEXTVAL, 'RESERVATIONS', v_action, v_record_id,
        v_old, v_new, USER, SYSDATE
    );
END;
/



